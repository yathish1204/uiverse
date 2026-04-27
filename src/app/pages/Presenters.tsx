import React from "react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Plus, User, X, Trash2, Pencil } from "lucide-react";
import { usePresentationStore } from "../state/presentationStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../state/auth";

export function Presenters() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const { presentations, presenters, addPresenter, deletePresenter, updatePresenter } = usePresentationStore();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [name, setName] = React.useState("");
  const [image, setImage] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [editName, setEditName] = React.useState<string | null>(null);
  const [editImage, setEditImage] = React.useState("");
  const [editTitle, setEditTitle] = React.useState("");

  const uniquePresenters = presenters.map((p) => ({
    name: p.name,
    image: p.image,
    role: p.title,
    presentationCount: presentations.filter((pres) => pres.presenter === p.name).length,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Our Presenters
              </h1>
            </div>
            <p className="text-base sm:text-lg text-white/60">
              Meet the talented individuals sharing their knowledge and expertise
            </p>
          </div>

          {/* Floating + CTA */}
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Add presenter"
                  className="fixed bottom-8 right-8 z-50 size-14 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-[0_0_28px_rgba(255,215,0,0.25)] border border-yellow-300/50 hover:scale-105 transition-transform grid place-items-center"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </DialogTrigger>

            <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Add new Presenter</span>
                  <button
                    type="button"
                    className="text-white/60 hover:text-white"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </DialogTitle>
              </DialogHeader>

              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  addPresenter({
                    name,
                    image,
                    title,
                  });
                  setName("");
                  setImage("");
                  setTitle("");
                  setOpen(false);
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="presenter-name">Presenter name</Label>
                  <Input
                    id="presenter-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presenter-image">Image</Label>
                  <Input
                    id="presenter-image"
                    type="file"
                    accept="image/*"
                    className="bg-white/5 border-white/10 text-white file:text-white file:bg-white/10 file:border-0 file:rounded-lg file:px-3 file:py-1.5"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) {
                        setImage("");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => setImage(String(reader.result ?? ""));
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presenter-title">Title</Label>
                  <Input
                    id="presenter-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="UI/UX Expert"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => setOpen(false)}
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
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {uniquePresenters.map((presenter) => (
              <Link
                key={presenter.name}
                to={`/presenter/${encodeURIComponent(presenter.name)}`}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="relative flex flex-col items-center text-center">
                {isAdmin && (
                      <div className="absolute -top-2 -right-2 gap-2 hidden group-hover:flex">
                        <button
                          type="button"
                          aria-label="Edit presenter"
                          className="size-9 rounded-full bg-black/60 border border-white/10 text-white/90 hover:border-yellow-500/40 grid place-items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditName(presenter.name);
                            setEditImage("");
                            setEditTitle(presenter.role);
                            setOpenEdit(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete presenter"
                          className="size-9 rounded-full bg-black/60 border border-white/10 text-white/90 hover:border-red-500/40 hover:text-red-200 grid place-items-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deletePresenter(presenter.name);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  <div className="relative mb-4">
                    <img
                      src={presenter.image}
                      alt={presenter.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white/10 group-hover:border-yellow-500/50 transition-colors bg-gray-800"
                    />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>

                    
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors ">
                    {presenter.name}
                  </h3>
                  <p className="text-sm text-white/60 mb-1">{presenter.role}</p>
                  <p className="text-sm text-white/60">
                    {presenter.presentationCount} {presenter.presentationCount === 1 ? 'Presentation' : 'Presentations'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {isAdmin && (
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Edit Presenter</span>
                    
                  </DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4 max-h-[85dvh] overflow-y-auto pr-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!editName) return;
                    updatePresenter({
                      name: editName,
                      title: editTitle,
                      image: editImage || undefined,
                    });
                    setOpenEdit(false);
                  }}
                >
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={editName ?? ""}
                      disabled
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 disabled:opacity-70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image (optional)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-white/5 border-white/10 text-white file:text-white file:bg-white/10 file:border-0 file:rounded-lg file:px-3 file:py-1.5"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          setEditImage("");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => setEditImage(String(reader.result ?? ""));
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => setOpenEdit(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-300/50"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </div>
  );
}
