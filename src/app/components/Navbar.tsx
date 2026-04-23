import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import brandLogo from "../../imports/logo.png"

export function Navbar() {
  const [greeting, setGreeting] = useState("");
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
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={brandLogo} alt="Brand Logo" className="w-38" />
            </Link>

            <p className="text-lg text-yellow-100/90 ml-4">
              {greeting}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={navItemClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/presentations"
              className={navItemClass}
            >
              Presentations
            </NavLink>

            <NavLink
              to="/presenters"
              className={navItemClass}
            >
              Presenters
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}