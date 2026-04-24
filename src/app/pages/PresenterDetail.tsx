import React from "react";
import { useParams, Link, useLocation } from "react-router";
import { presentations } from "../data/presentations";
import { Navbar } from "../components/Navbar";
import { ArrowLeft, Play, Calendar } from "lucide-react";

export function PresenterDetail() {
  const { name } = useParams<{ name: string }>();
  const location = useLocation();
  const presenterName = decodeURIComponent(name || "");

  const presenterPresentations = presentations.filter(
    (p) => p.presenter === presenterName
  );

  const presenter = presenterPresentations[0];

  if (!presenter) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Presenter Not Found</h1>
          <Link to="/presenters" className="text-yellow-500 hover:text-yellow-400 underline">
            Back to Presenters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            to="/presenters"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Presenters</span>
          </Link>

          <div className="mb-12 flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={presenter.presenterImage}
              alt={presenterName}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-yellow-500/50 bg-gray-800"
            />
            <div>
              <h1 className="text-2xl md:text-4xl  font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-tight">
                {presenterName}
              </h1>
              <p className="text-base sm:text-lg text-white/70 mb-1">
                {presenter.presenterRole}
              </p>
              <p className="text-xl text-white/60">
                {presenterPresentations.length} {presenterPresentations.length === 1 ? 'Presentation' : 'Presentations'}
              </p>
            </div>
          </div>

          <h2 className="text-lg md:text-2xl font-semibold mb-6 text-white">All Presentations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {presenterPresentations.map((presentation) => (
              <Link
                key={presentation.id}
                to={`/presentation/${presentation.id}`}
                state={{ from: `${location.pathname}${location.search}${location.hash}` }}
                className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="relative aspect-video w-full sm:h-48 overflow-hidden">
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
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border border-[#f0b100]/50 rounded-full text-white text-xs">
                      {presentation.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-300/50 shadow-lg">
                      <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {presentation.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{presentation.date} {presentation.month}</span>
                    </div>
                    <span>•</span>
                    <span>{presentation.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
