import React, { createContext, useContext, useMemo, useState } from "react";
import { presentations as basePresentations, type Presentation } from "../data/presentations";

export type Presenter = {
  name: string;
  image: string;
  title: string;
};

export type PublicUser = {
  fullName: string;
  email: string;
};

type AddPresenterInput = Presenter;

type AddPresentationInput = {
  title: string;
  presenter: string;
  description: string;
  dateISO: string; // yyyy-mm-dd
  videoUrl: string;
  category: string;
  thumbnail?: string; // data URL
  referenceLinks: Array<{ label: string; url: string }>;
};

type UpdatePresenterInput = {
  name: string; // key (not editable)
  image?: string;
  title?: string;
};

type UpdatePresentationInput = {
  id: string;
  title?: string;
  duration?: string;
  presenter?: string;
  description?: string;
  dateISO?: string;
  videoUrl?: string;
  category?: string;
  thumbnail?: string; // data URL
  referenceLinks?: Array<{ label: string; url: string }>;
};

type StoreContextValue = {
  presentations: Presentation[];
  presenters: Presenter[];
  deletedPresentations: Presentation[];
  deletedPresenters: Presenter[];
  addPresenter: (input: AddPresenterInput) => void;
  addPresentation: (input: AddPresentationInput) => void;
  updatePresenter: (input: UpdatePresenterInput) => void;
  updatePresentation: (input: UpdatePresentationInput) => void;
  deletePresentation: (id: string) => void;
  deletePresenter: (name: string) => void;
  restorePresentation: (id: string) => void;
  restorePresenter: (name: string) => void;
  toggleLike: (presentationId: string, user: PublicUser) => void;
  getLikes: (presentationId: string) => { count: number; users: PublicUser[] };
  incrementShare: (presentationId: string) => void;
  getShares: (presentationId: string) => number;
};

const LS_PRESENTERS_KEY = "uiverse.presenters.added";
const LS_PRESENTATIONS_KEY = "uiverse.presentations.added";
const LS_PRESENTER_OVERRIDES_KEY = "uiverse.presenters.overrides";
const LS_PRESENTATION_OVERRIDES_KEY = "uiverse.presentations.overrides";
const LS_HIDDEN_PRESENTERS_KEY = "uiverse.presenters.hidden";
const LS_HIDDEN_PRESENTATIONS_KEY = "uiverse.presentations.hidden";
const LS_DELETED_ADDED_PRESENTERS_KEY = "uiverse.presenters.deletedAdded";
const LS_DELETED_ADDED_PRESENTATIONS_KEY = "uiverse.presentations.deletedAdded";
const LS_LIKES_KEY = "uiverse.presentations.likes";
const LS_SHARES_KEY = "uiverse.presentations.shares";
const DEFAULT_PRESENTER_IMAGE = new URL("../../imports/pplaceholder.png", import.meta.url).href;

function defaultThumbnailDataUrl(title: string) {
  const safeTitle = (title || "Untitled").trim().slice(0, 60);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <style>
      .t { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; font-weight: 800; fill: #0a0a0a; }
      .s { fill: #ffffff; }
      .b { fill: #0a0a0a; opacity: 0.06; }
    </style>
  </defs>
  <rect class="s" x="0" y="0" width="1280" height="720"/>
  <rect class="b" x="40" y="40" width="1200" height="640" rx="32"/>
  <text class="t" x="640" y="360" text-anchor="middle" dominant-baseline="middle" font-size="56">
    ${safeTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
  </text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function withThumbnailFallback(p: Presentation): Presentation {
  const thumbnail = (p.thumbnail || "").trim();
  if (thumbnail) return p;
  return { ...p, thumbnail: defaultThumbnailDataUrl(p.title) };
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function uid(prefix: string) {
  const anyCrypto = globalThis.crypto as Crypto | undefined;
  const id = anyCrypto?.randomUUID ? anyCrypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${prefix}_${id}`;
}

function monthLabelFromISO(dateISO: string) {
  const d = new Date(dateISO);
  const month = d.toLocaleString("en-US", { month: "long" });
  return month.toUpperCase();
}

function weekdayLabelFromISO(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleString("en-US", { weekday: "long" });
}

function dayOfMonthFromISO(dateISO: string) {
  const d = new Date(dateISO);
  return String(d.getDate()).padStart(2, "0");
}

function formatDurationSeconds(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")} min`;
}

function tryExtractGoogleDriveFileId(url: string) {
  const u = url.trim();
  if (!u) return null;
  // https://drive.google.com/file/d/<id>/view
  const m1 = u.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (m1?.[1]) return m1[1];
  // https://drive.google.com/open?id=<id> or ?id=<id>
  const m2 = u.match(/[?&]id=([^&]+)/i);
  if (m2?.[1]) return m2[1];
  return null;
}

function toLikelyDirectVideoUrl(url: string) {
  const id = tryExtractGoogleDriveFileId(url);
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
  return url.trim();
}

function readVideoDurationSeconds(url: string, timeoutMs = 10000): Promise<number> {
  return new Promise((resolve, reject) => {
    const directUrl = toLikelyDirectVideoUrl(url);
    if (!directUrl) {
      reject(new Error("Missing video URL"));
      return;
    }

    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.playsInline = true;
    v.crossOrigin = "anonymous";

    const cleanup = () => {
      v.removeAttribute("src");
      try {
        v.load();
      } catch {
        // ignore
      }
    };

    const t = window.setTimeout(() => {
      cleanup();
      reject(new Error("Timed out reading video metadata"));
    }, timeoutMs);

    v.addEventListener(
      "loadedmetadata",
      () => {
        window.clearTimeout(t);
        const dur = v.duration;
        cleanup();
        if (!dur || !isFinite(dur)) {
          reject(new Error("Could not determine video duration"));
          return;
        }
        resolve(dur);
      },
      { once: true }
    );

    v.addEventListener(
      "error",
      () => {
        window.clearTimeout(t);
        cleanup();
        reject(new Error("Failed to load video metadata"));
      },
      { once: true }
    );

    v.src = directUrl;
  });
}

function loadAddedPresenters(): Presenter[] {
  const parsed = safeJsonParse<Presenter[]>(localStorage.getItem(LS_PRESENTERS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveAddedPresenters(presenters: Presenter[]) {
  localStorage.setItem(LS_PRESENTERS_KEY, JSON.stringify(presenters));
}

type AddedPresentation = Presentation & { __added?: true };

function loadAddedPresentations(): AddedPresentation[] {
  const parsed = safeJsonParse<AddedPresentation[]>(localStorage.getItem(LS_PRESENTATIONS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveAddedPresentations(presentations: AddedPresentation[]) {
  localStorage.setItem(LS_PRESENTATIONS_KEY, JSON.stringify(presentations));
}

type LikesStore = Record<string, PublicUser[]>;
type SharesStore = Record<string, number>;

function loadLikes(): LikesStore {
  const parsed = safeJsonParse<LikesStore>(localStorage.getItem(LS_LIKES_KEY));
  return parsed && typeof parsed === "object" ? parsed : {};
}

function saveLikes(store: LikesStore) {
  localStorage.setItem(LS_LIKES_KEY, JSON.stringify(store));
}

function loadShares(): SharesStore {
  const parsed = safeJsonParse<SharesStore>(localStorage.getItem(LS_SHARES_KEY));
  return parsed && typeof parsed === "object" ? parsed : {};
}

function saveShares(store: SharesStore) {
  localStorage.setItem(LS_SHARES_KEY, JSON.stringify(store));
}

type PresenterOverrides = Record<string, Partial<Presenter>>; // key: lower(name)
type PresentationOverrides = Record<string, Partial<Presentation>>; // key: id

function loadPresenterOverrides(): PresenterOverrides {
  const parsed = safeJsonParse<PresenterOverrides>(localStorage.getItem(LS_PRESENTER_OVERRIDES_KEY));
  return parsed && typeof parsed === "object" ? parsed : {};
}

function savePresenterOverrides(store: PresenterOverrides) {
  localStorage.setItem(LS_PRESENTER_OVERRIDES_KEY, JSON.stringify(store));
}

function loadPresentationOverrides(): PresentationOverrides {
  const parsed = safeJsonParse<PresentationOverrides>(
    localStorage.getItem(LS_PRESENTATION_OVERRIDES_KEY)
  );
  return parsed && typeof parsed === "object" ? parsed : {};
}

function savePresentationOverrides(store: PresentationOverrides) {
  localStorage.setItem(LS_PRESENTATION_OVERRIDES_KEY, JSON.stringify(store));
}

function loadHiddenPresenters(): string[] {
  const parsed = safeJsonParse<string[]>(localStorage.getItem(LS_HIDDEN_PRESENTERS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveHiddenPresenters(names: string[]) {
  localStorage.setItem(LS_HIDDEN_PRESENTERS_KEY, JSON.stringify(names));
}

function loadHiddenPresentations(): string[] {
  const parsed = safeJsonParse<string[]>(localStorage.getItem(LS_HIDDEN_PRESENTATIONS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveHiddenPresentations(ids: string[]) {
  localStorage.setItem(LS_HIDDEN_PRESENTATIONS_KEY, JSON.stringify(ids));
}

function loadDeletedAddedPresenters(): Presenter[] {
  const parsed = safeJsonParse<Presenter[]>(localStorage.getItem(LS_DELETED_ADDED_PRESENTERS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveDeletedAddedPresenters(items: Presenter[]) {
  localStorage.setItem(LS_DELETED_ADDED_PRESENTERS_KEY, JSON.stringify(items));
}

type DeletedAddedPresentation = AddedPresentation;

function loadDeletedAddedPresentations(): DeletedAddedPresentation[] {
  const parsed = safeJsonParse<DeletedAddedPresentation[]>(
    localStorage.getItem(LS_DELETED_ADDED_PRESENTATIONS_KEY)
  );
  return Array.isArray(parsed) ? parsed : [];
}

function saveDeletedAddedPresentations(items: DeletedAddedPresentation[]) {
  localStorage.setItem(LS_DELETED_ADDED_PRESENTATIONS_KEY, JSON.stringify(items));
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function PresentationStoreProvider({ children }: { children: React.ReactNode }) {
  const [addedPresenters, setAddedPresenters] = useState<Presenter[]>(() => loadAddedPresenters());
  const [addedPresentations, setAddedPresentations] = useState<AddedPresentation[]>(() =>
    loadAddedPresentations()
  );
  const [deletedAddedPresenters, setDeletedAddedPresenters] = useState<Presenter[]>(() =>
    loadDeletedAddedPresenters()
  );
  const [deletedAddedPresentations, setDeletedAddedPresentations] = useState<DeletedAddedPresentation[]>(
    () => loadDeletedAddedPresentations()
  );
  const [presenterOverrides, setPresenterOverrides] = useState<PresenterOverrides>(() =>
    loadPresenterOverrides()
  );
  const [presentationOverrides, setPresentationOverrides] = useState<PresentationOverrides>(() =>
    loadPresentationOverrides()
  );
  const [hiddenPresenters, setHiddenPresenters] = useState<string[]>(() => loadHiddenPresenters());
  const [hiddenPresentations, setHiddenPresentations] = useState<string[]>(() =>
    loadHiddenPresentations()
  );
  const [likes, setLikes] = useState<LikesStore>(() => loadLikes());
  const [shares, setShares] = useState<SharesStore>(() => loadShares());

  const presenters = useMemo<Presenter[]>(() => {
    const fromBase: Presenter[] = Array.from(
      new Map(
        basePresentations.map((p) => [
          p.presenter.trim(),
          { name: p.presenter, image: p.presenterImage, title: p.presenterRole },
        ])
      ).values()
    );

    const map = new Map<string, Presenter>();
    [...fromBase, ...addedPresenters].forEach((p) => {
      const key = p.name.trim().toLowerCase();
      if (!key) return;
      if (!map.has(key)) map.set(key, p);
    });
    const hidden = new Set(hiddenPresenters.map((n) => n.toLowerCase()));
    return Array.from(map.values())
      .filter((p) => !hidden.has(p.name.toLowerCase()))
      .map((p) => {
        const o = presenterOverrides[p.name.toLowerCase()];
        if (!o) return p;
        return {
          ...p,
          ...o,
          image: (o.image ?? p.image) || DEFAULT_PRESENTER_IMAGE,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [addedPresenters, hiddenPresenters, presenterOverrides]);

  const presentations = useMemo<Presentation[]>(() => {
    const hidden = new Set(hiddenPresentations);
    const all = [...basePresentations, ...addedPresentations]
      .filter((p) => !hidden.has(p.id))
      .map((p) => {
        const o = presentationOverrides[p.id];
        const merged = o ? { ...p, ...o } : p;
        return withThumbnailFallback(merged);
      });
    return all.slice().sort((a, b) => Number(b.id) - Number(a.id));
  }, [addedPresentations, hiddenPresentations, presentationOverrides]);

  const deletedPresentations = useMemo<Presentation[]>(() => {
    const hidden = new Set(hiddenPresentations);
    const baseDeleted = basePresentations
      .filter((p) => hidden.has(p.id))
      .map((p) => {
        const o = presentationOverrides[p.id];
        return withThumbnailFallback(o ? { ...p, ...o } : p);
      });

    const addedDeleted = deletedAddedPresentations.map((p) => {
      const o = presentationOverrides[p.id];
      return withThumbnailFallback(o ? { ...p, ...o } : p);
    });

    return [...baseDeleted, ...addedDeleted].slice().sort((a, b) => Number(b.id) - Number(a.id));
  }, [deletedAddedPresentations, hiddenPresentations, presentationOverrides]);

  const deletedPresenters = useMemo<Presenter[]>(() => {
    const hidden = new Set(hiddenPresenters.map((n) => n.toLowerCase()));

    const fromBase: Presenter[] = Array.from(
      new Map(
        basePresentations.map((p) => [
          p.presenter.trim(),
          { name: p.presenter, image: p.presenterImage, title: p.presenterRole },
        ])
      ).values()
    );

    const baseDeleted = fromBase
      .filter((p) => hidden.has(p.name.toLowerCase()))
      .map((p) => {
        const o = presenterOverrides[p.name.toLowerCase()];
        if (!o) return p;
        return {
          ...p,
          ...o,
          image: (o.image ?? p.image) || DEFAULT_PRESENTER_IMAGE,
        };
      });

    const addedDeleted = deletedAddedPresenters.map((p) => {
      const o = presenterOverrides[p.name.toLowerCase()];
      if (!o) return p;
      return {
        ...p,
        ...o,
        image: (o.image ?? p.image) || DEFAULT_PRESENTER_IMAGE,
      };
    });

    return [...baseDeleted, ...addedDeleted].slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [deletedAddedPresenters, hiddenPresenters, presenterOverrides]);

  const value = useMemo<StoreContextValue>(() => {
    return {
      presentations,
      presenters,
      deletedPresentations,
      deletedPresenters,
      addPresenter: (input) => {
        const next: Presenter = {
          name: input.name.trim(),
          image: input.image.trim() || DEFAULT_PRESENTER_IMAGE,
          title: input.title.trim(),
        };
        if (!next.name) return;
        const merged = (() => {
          const existing = loadAddedPresenters();
          const normalized = next.name.toLowerCase();
          const filtered = existing.filter((p) => p.name.toLowerCase() !== normalized);
          return [...filtered, next];
        })();
        setAddedPresenters(merged);
        saveAddedPresenters(merged);
      },
      addPresentation: (input) => {
        const presenter = presenters.find(
          (p) => p.name.toLowerCase() === input.presenter.trim().toLowerCase()
        );

        const next: AddedPresentation = {
          id: String(Date.now()),
          title: input.title.trim(),
          presenter: input.presenter.trim(),
          presenterRole: presenter?.title ?? "Presenter",
          presenterImage:
            presenter?.image ||
            basePresentations[0]?.presenterImage ||
            DEFAULT_PRESENTER_IMAGE,
          thumbnail:
            input.thumbnail?.trim() ||
            basePresentations[0]?.thumbnail?.trim() ||
            defaultThumbnailDataUrl(input.title),
          videoUrl: input.videoUrl.trim() || "#",
          category: input.category.trim() || "UI",
          duration: "--:-- min",
          date: dayOfMonthFromISO(input.dateISO),
          month: monthLabelFromISO(input.dateISO),
          day: weekdayLabelFromISO(input.dateISO),
          description: input.description.trim(),
          attachments: [],
          referenceLinks: input.referenceLinks.map((l) => ({
            id: uid("ref"),
            label: l.label.trim(),
            url: l.url.trim(),
          })),
          __added: true,
        };

        const merged = (() => {
          const existing = loadAddedPresentations();
          return [...existing, next];
        })();
        setAddedPresentations(merged);
        saveAddedPresentations(merged);

        const maybeUrl = next.videoUrl;
        if (maybeUrl && maybeUrl !== "#") {
          void readVideoDurationSeconds(maybeUrl)
            .then((seconds) => {
              const formatted = formatDurationSeconds(seconds);
              setPresentationOverrides((prev) => {
                const nextOverrides: PresentationOverrides = {
                  ...prev,
                  [next.id]: {
                    ...prev[next.id],
                    duration: formatted,
                  },
                };
                savePresentationOverrides(nextOverrides);
                return nextOverrides;
              });
            })
            .catch(() => {
              // keep placeholder
            });
        }
      },
      updatePresenter: (input) => {
        const key = input.name.trim().toLowerCase();
        if (!key) return;
        const next = {
          ...presenterOverrides,
          [key]: {
            ...presenterOverrides[key],
            ...(input.image !== undefined ? { image: input.image || DEFAULT_PRESENTER_IMAGE } : {}),
            ...(input.title !== undefined ? { title: input.title } : {}),
          },
        };
        setPresenterOverrides(next);
        savePresenterOverrides(next);
      },
      updatePresentation: (input) => {
        const id = input.id.trim();
        if (!id) return;
        const presenter = input.presenter
          ? presenters.find((p) => p.name.toLowerCase() === input.presenter!.trim().toLowerCase())
          : undefined;

        const dateISO = input.dateISO;
        const date = dateISO ? dayOfMonthFromISO(dateISO) : undefined;
        const month = dateISO ? monthLabelFromISO(dateISO) : undefined;
        const day = dateISO ? weekdayLabelFromISO(dateISO) : undefined;

        const next: PresentationOverrides = {
          ...presentationOverrides,
          [id]: {
            ...presentationOverrides[id],
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.duration !== undefined ? { duration: input.duration } : {}),
            ...(input.presenter !== undefined ? { presenter: input.presenter } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.videoUrl !== undefined ? { videoUrl: input.videoUrl } : {}),
            ...(input.category !== undefined ? { category: input.category } : {}),
            ...(input.thumbnail !== undefined ? { thumbnail: input.thumbnail } : {}),
            ...(date ? { date } : {}),
            ...(month ? { month } : {}),
            ...(day ? { day } : {}),
            ...(presenter
              ? {
                  presenterRole: presenter.title,
                  presenterImage: presenter.image || DEFAULT_PRESENTER_IMAGE,
                }
              : {}),
            ...(input.referenceLinks
              ? {
                  referenceLinks: input.referenceLinks.map((l) => ({
                    id: uid("ref"),
                    label: l.label.trim(),
                    url: l.url.trim(),
                  })),
                }
              : {}),
          },
        };
        setPresentationOverrides(next);
        savePresentationOverrides(next);

        if (input.videoUrl) {
          void readVideoDurationSeconds(input.videoUrl)
            .then((seconds) => {
              const formatted = formatDurationSeconds(seconds);
              setPresentationOverrides((prev) => {
                const nextOverrides: PresentationOverrides = {
                  ...prev,
                  [id]: {
                    ...prev[id],
                    duration: formatted,
                  },
                };
                savePresentationOverrides(nextOverrides);
                return nextOverrides;
              });
            })
            .catch(() => {
              // keep existing
            });
        }
      },
      deletePresentation: (id) => {
        const isAdded = loadAddedPresentations().some((p) => p.id === id);
        if (isAdded) {
          const existing = loadAddedPresentations();
          const toDelete = existing.find((p) => p.id === id);
          const merged = existing.filter((p) => p.id !== id);
          setAddedPresentations(merged);
          saveAddedPresentations(merged);

          if (toDelete) {
            const deletedExisting = loadDeletedAddedPresentations();
            const nextDeleted = [...deletedExisting.filter((p) => p.id !== id), toDelete];
            setDeletedAddedPresentations(nextDeleted);
            saveDeletedAddedPresentations(nextDeleted);
          }
          return;
        }
        const next = Array.from(new Set([...hiddenPresentations, id]));
        setHiddenPresentations(next);
        saveHiddenPresentations(next);
      },
      deletePresenter: (name) => {
        const normalized = name.trim().toLowerCase();
        const isAdded = loadAddedPresenters().some((p) => p.name.toLowerCase() === normalized);
        if (isAdded) {
          const existing = loadAddedPresenters();
          const toDelete = existing.find((p) => p.name.toLowerCase() === normalized);
          const merged = existing.filter((p) => p.name.toLowerCase() !== normalized);
          setAddedPresenters(merged);
          saveAddedPresenters(merged);

          if (toDelete) {
            const deletedExisting = loadDeletedAddedPresenters();
            const nextDeleted = [
              ...deletedExisting.filter((p) => p.name.toLowerCase() !== normalized),
              toDelete,
            ];
            setDeletedAddedPresenters(nextDeleted);
            saveDeletedAddedPresenters(nextDeleted);
          }
          return;
        }
        const next = Array.from(new Set([...hiddenPresenters, normalized]));
        setHiddenPresenters(next);
        saveHiddenPresenters(next);
      },
      restorePresentation: (id) => {
        const trimmed = id.trim();
        if (!trimmed) return;

        const deletedAdded = loadDeletedAddedPresentations();
        const inDeletedAdded = deletedAdded.some((p) => p.id === trimmed);
        if (inDeletedAdded) {
          const restored = deletedAdded.find((p) => p.id === trimmed);
          const nextDeleted = deletedAdded.filter((p) => p.id !== trimmed);
          setDeletedAddedPresentations(nextDeleted);
          saveDeletedAddedPresentations(nextDeleted);

          if (restored) {
            const nextAdded = [...loadAddedPresentations(), restored];
            setAddedPresentations(nextAdded);
            saveAddedPresentations(nextAdded);
          }
          return;
        }

        const nextHidden = hiddenPresentations.filter((x) => x !== trimmed);
        setHiddenPresentations(nextHidden);
        saveHiddenPresentations(nextHidden);
      },
      restorePresenter: (name) => {
        const normalized = name.trim().toLowerCase();
        if (!normalized) return;

        const deletedAdded = loadDeletedAddedPresenters();
        const inDeletedAdded = deletedAdded.some((p) => p.name.toLowerCase() === normalized);
        if (inDeletedAdded) {
          const restored = deletedAdded.find((p) => p.name.toLowerCase() === normalized);
          const nextDeleted = deletedAdded.filter((p) => p.name.toLowerCase() !== normalized);
          setDeletedAddedPresenters(nextDeleted);
          saveDeletedAddedPresenters(nextDeleted);

          if (restored) {
            const nextAdded = [...loadAddedPresenters(), restored];
            setAddedPresenters(nextAdded);
            saveAddedPresenters(nextAdded);
          }
          return;
        }

        const nextHidden = hiddenPresenters.filter((x) => x !== normalized);
        setHiddenPresenters(nextHidden);
        saveHiddenPresenters(nextHidden);
      },
      toggleLike: (presentationId, u) => {
        const next = { ...likes };
        const curr = next[presentationId] ?? [];
        const exists = curr.some((x) => x.email.toLowerCase() === u.email.toLowerCase());
        next[presentationId] = exists
          ? curr.filter((x) => x.email.toLowerCase() !== u.email.toLowerCase())
          : [...curr, { fullName: u.fullName, email: u.email }];
        setLikes(next);
        saveLikes(next);
      },
      getLikes: (presentationId) => {
        const users = likes[presentationId] ?? [];
        return { count: users.length, users };
      },
      incrementShare: (presentationId) => {
        const next = { ...shares };
        next[presentationId] = (next[presentationId] ?? 0) + 1;
        setShares(next);
        saveShares(next);
      },
      getShares: (presentationId) => shares[presentationId] ?? 0,
    };
  }, [
    addedPresentations,
    deletedAddedPresentations,
    deletedAddedPresenters,
    hiddenPresentations,
    hiddenPresenters,
    likes,
    presenterOverrides,
    presentationOverrides,
    deletedPresentations,
    deletedPresenters,
    presentations,
    presenters,
    shares,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function usePresentationStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("usePresentationStore must be used within PresentationStoreProvider");
  return ctx;
}

