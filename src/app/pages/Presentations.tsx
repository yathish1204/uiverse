import React from "react";
import { Link, useLocation } from "react-router";
import { presentations } from "../data/presentations";
import { Navbar } from "../components/Navbar";
import { Play, Calendar, Search } from "lucide-react";
import { useState } from "react";

export function Presentations() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", ...Array.from(new Set(presentations.map((p) => p.category)))];

  const normalizedSearch = searchTerm.trim().toLowerCase();

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
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-[1]">
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
            <p className="text-xl text-white/60">
              Explore our collection of presentations and insights
            </p>
          </div>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresentations.map((presentation) => (
              <Link
                key={presentation.id}
                to={`/presentation/${presentation.id}`}
                state={{ from: `${location.pathname}${location.search}${location.hash}` }}
                onClick={() => {
                  sessionStorage.removeItem("homeScrollPosition");
                }}
                className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={presentation.thumbnail}
                    alt={presentation.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border border-[#f0b100]/50 rounded-full text-white text-xs">
                      {presentation.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-white/80 text-xs">{presentation.duration}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-300/50 shadow-lg">
                      <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-3 flex-col  items-start justify-between">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-1">
                    {presentation.title}
                  </h3>
                 
                  <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={presentation.presenterImage}
                      alt={presentation.presenter}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <p className="text-sm text-white/70">{presentation.presenter}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/60">
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
    </div>
  );
}
