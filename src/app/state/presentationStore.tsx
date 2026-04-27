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
  duration: string;
  presenter: string;
  description: string;
  dateISO: string; // yyyy-mm-dd
  day: string;
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
  day?: string;
  referenceLinks?: Array<{ label: string; url: string }>;
};

type StoreContextValue = {
  presentations: Presentation[];
  presenters: Presenter[];
  addPresenter: (input: AddPresenterInput) => void;
  addPresentation: (input: AddPresentationInput) => void;
  updatePresenter: (input: UpdatePresenterInput) => void;
  updatePresentation: (input: UpdatePresentationInput) => void;
  deletePresentation: (id: string) => void;
  deletePresenter: (name: string) => void;
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
const LS_LIKES_KEY = "uiverse.presentations.likes";
const LS_SHARES_KEY = "uiverse.presentations.shares";
const DEFAULT_PRESENTER_IMAGE = new URL("../../imports/pplaceholder.png", import.meta.url).href;

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

function dayOfMonthFromISO(dateISO: string) {
  const d = new Date(dateISO);
  return String(d.getDate()).padStart(2, "0");
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

const StoreContext = createContext<StoreContextValue | null>(null);

export function PresentationStoreProvider({ children }: { children: React.ReactNode }) {
  const [addedPresenters, setAddedPresenters] = useState<Presenter[]>(() => loadAddedPresenters());
  const [addedPresentations, setAddedPresentations] = useState<AddedPresentation[]>(() =>
    loadAddedPresentations()
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
        if (!o) return p;
        return { ...p, ...o };
      });
    return all.slice().sort((a, b) => Number(b.id) - Number(a.id));
  }, [addedPresentations, hiddenPresentations, presentationOverrides]);

  const value = useMemo<StoreContextValue>(() => {
    return {
      presentations,
      presenters,
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
          thumbnail: basePresentations[0]?.thumbnail ?? "",
          videoUrl: "#",
          category: "UI",
          duration: input.duration.trim(),
          date: dayOfMonthFromISO(input.dateISO),
          month: monthLabelFromISO(input.dateISO),
          day: input.day.trim(),
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

        const next: PresentationOverrides = {
          ...presentationOverrides,
          [id]: {
            ...presentationOverrides[id],
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.duration !== undefined ? { duration: input.duration } : {}),
            ...(input.presenter !== undefined ? { presenter: input.presenter } : {}),
            ...(input.day !== undefined ? { day: input.day } : {}),
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(date ? { date } : {}),
            ...(month ? { month } : {}),
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
      },
      deletePresentation: (id) => {
        const isAdded = loadAddedPresentations().some((p) => p.id === id);
        if (isAdded) {
          const merged = loadAddedPresentations().filter((p) => p.id !== id);
          setAddedPresentations(merged);
          saveAddedPresentations(merged);
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
          const merged = loadAddedPresenters().filter((p) => p.name.toLowerCase() !== normalized);
          setAddedPresenters(merged);
          saveAddedPresenters(merged);
          return;
        }
        const next = Array.from(new Set([...hiddenPresenters, normalized]));
        setHiddenPresenters(next);
        saveHiddenPresenters(next);
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
    hiddenPresentations,
    hiddenPresenters,
    likes,
    presenterOverrides,
    presentationOverrides,
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

