import React from "react";
import { Link, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Play, Calendar, Search, Plus, X, Heart, Share2, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { usePresentationStore } from "../state/presentationStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/ui/hover-card";
import { useAuth } from "../state/auth";
import type { Presentation } from "../data/presentations";

export function Presentations() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const {
    presentations,
    presenters,
    addPresentation,
    addPresenter,
    updatePresentation,
    deletePresentation,
    toggleLike,
    getLikes,
    incrementShare,
    getShares,
  } = usePresentationStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openPresentationModal, setOpenPresentationModal] = useState(false);
  const [presentationModalMode, setPresentationModalMode] = useState<"add" | "edit">("add");
  const [openAddPresenter, setOpenAddPresenter] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Presentation | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newPresenterName, setNewPresenterName] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newCategory, setNewCategory] = useState("UI");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDateISO, setNewDateISO] = useState("");
  const [links, setLinks] = useState<Array<{ label: string; url: string }>>([{ label: "", url: "" }]);

  const [presenterName, setPresenterName] = useState("");
  const [presenterImage, setPresenterImage] = useState("");
  const [presenterTitle, setPresenterTitle] = useState("");

  const categories = ["All", ...Array.from(new Set(presentations.map((p) => p.category)))];

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const resetPresentationForm = () => {
    setNewTitle("");
    setNewPresenterName("");
    setNewVideoUrl("");
    setNewCategory("UI");
    setNewThumbnail("");
    setNewDescription("");
    setNewDateISO("");
    setLinks([{ label: "", url: "" }]);
    setEditId(null);
  };

  const openAddModal = () => {
    setPresentationModalMode("add");
    resetPresentationForm();
    setOpenPresentationModal(true);
  };

  const openEditModal = (p: Presentation) => {
    setPresentationModalMode("edit");
    setEditId(p.id);
    setNewTitle(p.title ?? "");
    setNewPresenterName(p.presenter ?? "");
    setNewVideoUrl(p.videoUrl ?? "");
    setNewCategory(p.category ?? "UI");
    setNewThumbnail(p.thumbnail ?? "");
    setNewDescription(p.description ?? "");
    setNewDateISO("");
    const mappedLinks =
      p.referenceLinks?.map((l) => ({ label: l.label ?? "", url: l.url ?? "" })) ?? [];
    setLinks(mappedLinks.length ? mappedLinks : [{ label: "", url: "" }]);
    setOpenPresentationModal(true);
  };

  const filteredPresentations = presentations.filter((presentation) => {
    const matchesCategory =
      selectedCategory === "All" || presentation.category === selectedCategory;

    if (!matchesCategory) return false;
    if (!normalizedSearch) return true;

    return (
      presentation.title.toLowerCase().includes(normalizedSearch) ||
      presentation.presenter.toLowerCase().includes(normalizedSearch) ||
      presentation.category.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-tight">
                All Presentations
              </h1>
              <div className="relative w-full md:w-[360px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search presentations..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-yellow-500/50 focus:bg-white/10"
                />
              </div>
            </div>
            <p className="text-base sm:text-lg text-white/60">
              Explore our collection of presentations and insights
            </p>
          </div>

         
          {/* Floating + CTA */}
          {isAdmin && (
            <Dialog
              open={openPresentationModal}
              onOpenChange={(open) => {
                setOpenPresentationModal(open);
                if (!open) {
                  resetPresentationForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Add presentation"
                  className="fixed bottom-8 right-8 z-50 size-14 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-[0_0_28px_rgba(255,215,0,0.25)] border border-yellow-300/50 hover:scale-105 transition-transform grid place-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    openAddModal();
                  }}
                >
                  <Plus className="w-6 h-6" />
                </button>
              </DialogTrigger>

              <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{presentationModalMode === "edit" ? "Edit Presentation" : "Add new Presentation"}</span>
                </DialogTitle>
              </DialogHeader>

              <form
                className="space-y-5 max-h-[85dvh] overflow-y-auto pr-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (presentationModalMode === "edit" && editId) {
                    updatePresentation({
                      id: editId,
                      title: newTitle.trim(),
                      presenter: newPresenterName.trim(),
                      videoUrl: newVideoUrl.trim(),
                      category: newCategory.trim(),
                      thumbnail: newThumbnail.trim(),
                      description: newDescription.trim(),
                      ...(newDateISO ? { dateISO: newDateISO } : {}),
                      referenceLinks: links.filter((l) => l.label.trim() && l.url.trim()),
                    });
                    setOpenPresentationModal(false);
                    return;
                  }

                  const safeDateISO = newDateISO || new Date().toISOString().slice(0, 10);
                  addPresentation({
                    title: newTitle,
                    presenter: newPresenterName,
                    videoUrl: newVideoUrl,
                    category: newCategory,
                    thumbnail: newThumbnail,
                    description: newDescription,
                    dateISO: safeDateISO,
                    referenceLinks: links.filter((l) => l.label.trim() && l.url.trim()),
                  });
                  setOpenPresentationModal(false);
                }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pres-title">Presentation title</Label>
                    <Input
                      id="pres-title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Title"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pres-videoUrl">Google Drive video URL</Label>
                    <Input
                      id="pres-videoUrl"
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/.../view"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <p className="text-xs text-white/50">
                      Duration is auto-detected from the video.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Presenter name</Label>
                    <Select
                      value={newPresenterName}
                      onValueChange={(v) => {
                        if (v === "__add_new_presenter__") {
                          setOpenAddPresenter(true);
                          return;
                        }
                        setNewPresenterName(v);
                      }}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select presenter" />
                      </SelectTrigger>
                      <SelectContent className="z-[2105] bg-[#0a0a0a] border border-white/10 text-white">
                        <SelectItem value="__add_new_presenter__">+ Add a new presenter</SelectItem>
                        {presenters.map((p) => (
                          <SelectItem key={p.name} value={p.name}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pres-category">Category</Label>
                    <Input
                      id="pres-category"
                      list="presentation-categories"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Select or type…"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <datalist id="presentation-categories">
                      {["AI", "UI", "Development", "API", "Backend", "Testing", "DevOps", "Security", "Data"].map(
                        (c) => (
                          <option key={c} value={c} />
                        )
                      )}
                    </datalist>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pres-date">Date</Label>
                    <Input
                      id="pres-date"
                      type="date"
                      value={newDateISO}
                      onChange={(e) => setNewDateISO(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pres-thumbnail">Video thumbnail</Label>
                    <Input
                      id="pres-thumbnail"
                      type="file"
                      accept="image/*"
                      className="bg-white/5 border-white/10 text-white file:text-white file:bg-white/10 file:border-0 file:rounded-lg file:px-3 file:py-1.5"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          setNewThumbnail("");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => setNewThumbnail(String(reader.result ?? ""));
                        reader.readAsDataURL(file);
                      }}
                    />
                    <p className="text-xs text-white/50">
                      If not uploaded, a default thumbnail is generated from the title.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pres-description">Presentation description</Label>
                  <Textarea
                    id="pres-description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Write a short description..."
                    className="min-h-24 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Attachment links</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => setLinks((prev) => [...prev, { label: "", url: "" }])}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add link
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {links.map((l, idx) => (
                      <div key={idx} className="grid sm:grid-cols-5 gap-3">
                        <div className="sm:col-span-2">
                          <Input
                            value={l.label}
                            onChange={(e) =>
                              setLinks((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, label: e.target.value } : p))
                              )
                            }
                            placeholder="Label"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div className="sm:col-span-3 flex gap-3">
                          <Input
                            value={l.url}
                            onChange={(e) =>
                              setLinks((prev) =>
                                prev.map((p, i) => (i === idx ? { ...p, url: e.target.value } : p))
                              )
                            }
                            placeholder="https://..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                            onClick={() => setLinks((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => setOpenPresentationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-300/50"
                  >
                    {presentationModalMode === "edit" ? "Save changes" : "Add presentation"}
                  </Button>
                </div>
              </form>

              <Dialog open={openAddPresenter} onOpenChange={setOpenAddPresenter}>
                <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>Add new Presenter</span>
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addPresenter({ name: presenterName, image: presenterImage, title: presenterTitle });
                      setNewPresenterName(presenterName);
                      setPresenterName("");
                      setPresenterImage("");
                      setPresenterTitle("");
                      setOpenAddPresenter(false);
                    }}
                  >
                    <div className="space-y-2">
                      <Label>Presenter name</Label>
                      <Input
                        value={presenterName}
                        onChange={(e) => setPresenterName(e.target.value)}
                        placeholder="Full name"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        className="bg-white/5 border-white/10 text-white file:text-white file:bg-white/10 file:border-0 file:rounded-lg file:px-3 file:py-1.5"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            setPresenterImage("");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => setPresenterImage(String(reader.result ?? ""));
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={presenterTitle}
                        onChange={(e) => setPresenterTitle(e.target.value)}
                        placeholder="UI/UX Expert"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => setOpenAddPresenter(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-300/50"
                      >
                        Add presenter
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </DialogContent>
            </Dialog>
          )}

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border border-yellow-300/50"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:border-yellow-500/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Presentations Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPresentations.map((presentation) => (
              <Link
                key={presentation.id}
                to={`/presentation/${presentation.id}`}
                state={{ from: `${location.pathname}${location.search}${location.hash}`, autoplay: true }}
                onClick={() => {
                  sessionStorage.removeItem("homeScrollPosition"); 
                }} title={presentation.title}  aria-label={presentation.title}
                className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer"   >
              
                <div className="relative h-40 sm:h-44 overflow-hidden bg-black">
                  {/* Background: blurred + dimmed */}
                  <img
                    src={presentation.thumbnail}
                    alt={presentation.title}
                    className="absolute inset-0 w-full h-full object-cover blur-lg brightness-50 scale-105"
                  />
                  {/* Foreground: clean */}
                  <img
                    src={presentation.thumbnail}
                    alt={presentation.title}
                    className="absolute inset-0 w-full h-full object-contain opacity-95 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="w-full absolute top-2 px-2 sm:px-3 flex justify-between items-center">
                    <div className="px-2.5 py-1 bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border border-[#f0b100]/50 rounded-full text-white text-[11px] sm:text-xs">
                      {presentation.category}
                    </div>
                    <span className="text-white/80 text-[11px] sm:text-xs text-shadow-lg">{presentation.duration}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-300/50 shadow-lg">
                      <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                    </div>
                  </div>

                 
                  <div className="absolute bottom-3 right-3 items-center gap-2 flex opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"  >
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center size-9 rounded-full bg-black/60 border border-white/10 text-white/90 hover:border-yellow-500/40 cursor-pointer"
                          aria-label="Edit presentation"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openEditModal(presentation as unknown as Presentation);
                          }}
                        >
                          <span className="text-xs font-bold"><Pencil className="w-4 h-4" /></span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center size-9 rounded-full bg-black/60 border border-white/10 text-white/90 hover:border-red-500/40 hover:text-red-200 cursor-pointer"
                          aria-label="Delete presentation"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPendingDelete(presentation as unknown as Presentation);
                            setOpenConfirmDelete(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 sm:p-3 flex-col items-start justify-between"  >
                  <h3 className="text-base sm:text-xl font-semibold text-white mb-1.5 sm:mb-2 group-hover:text-yellow-400 transition-colors line-clamp-1">
                    {presentation.title}
                  </h3>
                 
                  <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0"  >
                    <img
                      src={presentation.presenterImage}
                      alt={presentation.presenter}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border bg-gray-800 border-white/20"
                    />
                    <p className="text-sm text-white/70 truncate">{presentation.presenter}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] sm:text-sm text-white/60 shrink-0" title={"Presented on"} aria-label={presentation.date} >
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {presentation.date} {presentation.month}
                      </span>
                    </div>
                  </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          

          {filteredPresentations.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl text-white/40">
                No presentations found for your current filters
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Confirm delete */}
      <Dialog
        open={openConfirmDelete}
        onOpenChange={(open) => {
          setOpenConfirmDelete(open);
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm delete?</DialogTitle>
          </DialogHeader>
          <p className="text-white/70 text-sm">
            {pendingDelete ? (
              <>
                You’re about to delete <span className="text-white font-semibold">{pendingDelete.title}</span>{" "}
                by <span className="text-white font-semibold">{pendingDelete.presenter}</span>.
              </>
            ) : (
              "You’re about to delete this presentation."
            )}
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setOpenConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={() => {
                if (pendingDelete) deletePresentation(pendingDelete.id);
                setOpenConfirmDelete(false);
              }}
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
