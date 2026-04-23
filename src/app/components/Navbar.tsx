import { useState, useEffect } from "react";
import { Link } from "react-router";

export function Navbar() {
  const [greeting, setGreeting] = useState("");

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-yellow-600/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 flex items-center justify-center shadow-lg border-2 border-yellow-400/50">
                <span className="text-2xl">🌌</span>
              </div>
              <span className="text-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                UI-Verse
              </span>
            </Link>

            <p className="text-lg text-yellow-100/90 ml-4">
              {greeting}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-yellow-200/80 hover:text-yellow-400 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]"
            >
              Home
            </Link>

            <Link
              to="/presentations"
              className="text-sm text-yellow-200/80 hover:text-yellow-400 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]"
            >
              Presentations
            </Link>

            <Link
              to="/presenters"
              className="text-sm text-yellow-200/80 hover:text-yellow-400 transition-colors drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]"
            >
              Presenters
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}