import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "../state/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Button } from "./ui/button";
import { usePresentationStore } from "../state/presentationStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const brandLogo = new URL("../../imports/logo.png", import.meta.url).href;
  const [greeting, setGreeting] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "Admin";
  const {
    deletedPresentations,
    deletedPresenters,
    restorePresentation,
    restorePresenter,
  } = usePresentationStore();
  const [openDeletedSheet, setOpenDeletedSheet] = useState(false);
  const [deletedSheetTab, setDeletedSheetTab] = useState<"presentations" | "presenters">(
    "presentations"
  );
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  const chipClass = (active: boolean) =>
    [
      "px-5 py-2 rounded-full transition-all",
      active
        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black border border-yellow-300/50"
        : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:border-yellow-500/30",
    ].join(" ");

  const primaryCtaClass =
    "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-300/50";
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative px-4 py-2 rounded-full text-sm transition-all duration-300",
      isActive
        ? "text-yellow-300 bg-yellow-500/20 border border-yellow-400/60 shadow-[0_0_18px_rgba(255,215,0,0.35)]"
        : "text-yellow-200/80 hover:text-yellow-400 hover:bg-yellow-500/10 border border-transparent",
    ].join(" ");

  const mobileNavItemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "w-full flex items-center justify-start px-3 py-2 rounded-xl text-sm transition-colors",
      isActive
        ? "text-yellow-300 bg-yellow-500/10"
        : "text-white/80 hover:text-white hover:bg-white/5",
    ].join(" ");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 16) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const initials = (user?.fullName ?? user?.email ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-yellow-600/20">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side: logo + greeting */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src={brandLogo}
                alt="Brand Logo"
                className="w-28 sm:w-36 h-auto"
              />
            </Link>

            <p className="hidden lg:block text-yellow-100/90 truncate">
              {greeting},{" "}
              <span className="text-yellow-200/80">{user?.fullName ?? "Guest"}</span>
            </p>
          </div>

          {/* Right side: menu items + auth/profile */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/" end className={navItemClass}>
              Home
            </NavLink>
            <NavLink to="/presentations" className={navItemClass}>
              Presentations
            </NavLink>
            <NavLink to="/presenters" className={navItemClass}>
              Presenters
            </NavLink>

            {!user ? (
              <Link
                to="/auth"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-300/50 shadow-[0_0_18px_rgba(255,215,0,0.20)] hover:scale-[1.02] transition-transform"
              >
                Login
              </Link>
            ) : (
              <DropdownMenu open={openProfileMenu} onOpenChange={setOpenProfileMenu}>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="size-10 border border-yellow-500/30 bg-white/5 hover:bg-white/10 transition-colors">
                    <AvatarFallback className="bg-yellow-500/15 text-yellow-200 font-bold">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 z-[1000] bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white"
                >
                  <DropdownMenuLabel>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{user.fullName}</p>
                        <p className="text-xs text-white/60 truncate">{user.email}</p>
                      </div>
                      {user.role === "Admin" && (
                        <span className="shrink-0 text-[11px] px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-200 border border-yellow-500/30">
                          Admin
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-white/10"
                        onSelect={(e) => {
                          e.preventDefault();
                          setOpenProfileMenu(false);
                          setOpenDeletedSheet(true);
                        }}
                      >
                        Deleted
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                    </>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-white/10"
                    onSelect={(e) => {
                      e.preventDefault();
                      setOpenProfileMenu(false);
                      setOpenLogoutConfirm(true);
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile: profile/avatar menu */}
          {user ? (
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center"
              aria-label={isMenuOpen ? "Close profile menu" : "Open profile menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              <Avatar className="size-10 border border-yellow-500/30 bg-white/5 hover:bg-white/10 transition-colors">
                <AvatarFallback className="bg-yellow-500/15 text-yellow-200 font-bold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((v) => !v)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl p-3">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3 px-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.fullName}</p>
                    <p className="text-xs text-white/60 truncate">{user.email}</p>
                  </div>
                  {user.role === "Admin" && (
                    <span className="shrink-0 text-[11px] px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-200 border border-yellow-500/30">
                      Admin
                    </span>
                  )}
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex flex-col">
                  <NavLink
                    to="/"
                    end
                    className={mobileNavItemClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/presentations"
                    className={mobileNavItemClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Presentations
                  </NavLink>
                  <NavLink
                    to="/presenters"
                    className={mobileNavItemClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Presenters
                  </NavLink>
                </div>

                <div className="h-px bg-white/10" />

                <button
                  type="button"
                  className="w-full px-3 py-2 rounded-xl text-left text-sm text-red-200 hover:bg-red-500/10 transition-colors"
                  onClick={() => {
                    setOpenLogoutConfirm(true);
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <NavLink to="/" end className={mobileNavItemClass} onClick={() => setIsMenuOpen(false)}>
                  Home
                </NavLink>
                <NavLink
                  to="/presentations"
                  className={mobileNavItemClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Presentations
                </NavLink>
                <NavLink
                  to="/presenters"
                  className={mobileNavItemClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Presenters
                </NavLink>
                <Link
                  to="/auth"
                  className="mt-1 block px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-300/50 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout confirm */}
      <Dialog open={openLogoutConfirm} onOpenChange={setOpenLogoutConfirm}>
        <DialogContent className="bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm logout?</DialogTitle>
          </DialogHeader>
          <p className="text-white/70 text-sm">Are you sure you want to logout?</p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setOpenLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
              onClick={() => {
                logout();
                setOpenLogoutConfirm(false);
                setIsMenuOpen(false);
                setOpenProfileMenu(false);
              }}
            >
              Yes, Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Admin-only floating sheet: deleted items */}
      {isAdmin && (
        <Sheet
          open={openDeletedSheet}
          onOpenChange={(open) => {
            setOpenDeletedSheet(open);
            if (open) setOpenProfileMenu(false);
          }}
        >
          <SheetContent className="w-[92vw] sm:max-w-md px-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 text-white">
            <SheetHeader>
              <SheetTitle className="text-white">Deleted</SheetTitle>
            </SheetHeader>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className={chipClass(deletedSheetTab === "presentations")}
                onClick={() => setDeletedSheetTab("presentations")}
              >
                Presentations
              </button>
              <button
                type="button"
                className={chipClass(deletedSheetTab === "presenters")}
                onClick={() => setDeletedSheetTab("presenters")}
              >
                Presenters
              </button>
            </div>

            {deletedSheetTab === "presentations" ? (
              <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {deletedPresentations.length === 0 ? (
                  <p className="text-white/60">No deleted presentations.</p>
                ) : (
                  deletedPresentations.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{p.title}</p>
                        <p className="text-xs text-white/60 truncate">
                          {p.presenter} • {p.category}
                        </p>
                      </div>
                      <Button
                        type="button"
                        className={primaryCtaClass}
                        onClick={() => restorePresentation(p.id)}
                      >
                        Restore
                      </Button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {deletedPresenters.length === 0 ? (
                  <p className="text-white/60">No deleted presenters.</p>
                ) : (
                  deletedPresenters.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{p.name}</p>
                        <p className="text-xs text-white/60 truncate">{p.title}</p>
                      </div>
                      <Button
                        type="button"
                        className={primaryCtaClass}
                        onClick={() => restorePresenter(p.name)}
                      >
                        Restore
                      </Button>
                    </div>
                  ))
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
}