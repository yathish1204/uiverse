import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "../state/auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
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
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative px-4 py-2 rounded-full text-sm transition-all duration-300",
      isActive
        ? "text-yellow-300 bg-yellow-500/20 border border-yellow-400/60 shadow-[0_0_18px_rgba(255,215,0,0.35)]"
        : "text-yellow-200/80 hover:text-yellow-400 hover:bg-yellow-500/10 border border-transparent",
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

            <p className="hidden lg:block text-lg text-yellow-100/90 truncate">
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
              <DropdownMenu>
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
                  <DropdownMenuItem
                    className="cursor-pointer focus:bg-white/10"
                    onClick={() => logout()}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl p-2">
            <NavLink
              to="/"
              end
              className={navItemClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/presentations"
              className={navItemClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Presentations
            </NavLink>
            <NavLink
              to="/presenters"
              className={navItemClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Presenters
            </NavLink>

            {!user ? (
              <Link
                to="/auth"
                className="mt-2 block px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold border border-yellow-300/50 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                type="button"
                className="mt-2 w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white/90 hover:bg-white/10 text-left"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold">{user.fullName}</p>
                  {user.role === "Admin" && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-yellow-500/15 text-yellow-200 border border-yellow-500/30">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60">{user.email}</p>
                <p className="text-sm text-yellow-300 mt-2">Logout</p>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}