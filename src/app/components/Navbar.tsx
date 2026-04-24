import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import brandLogo from "../../imports/logo.png"
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [greeting, setGreeting] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-yellow-600/20">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
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
              {greeting}
            </p>
          </div>

          {/* Desktop nav */}
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
          </div>
        )}
      </div>
    </nav>
  );
}