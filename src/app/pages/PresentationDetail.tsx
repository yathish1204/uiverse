import { useParams, Link, useNavigate } from "react-router";
import { presentations } from "../data/presentations";
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  FileText,
  User,
  Play,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";

export function PresentationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const presentation = presentations.find((p) => p.id === id);
  const [isLiked, setIsLiked] = useState(false);

  const otherPresentationsByPresenter = presentation
    ? presentations.filter(
        (p) =>
          p.presenter === presentation.presenter &&
          p.id !== presentation.id,
      )
    : [];

  const otherPresenters = presentation
    ? Array.from(
        new Map(
          presentations
            .filter((p) => p.presenter !== presentation.presenter)
            .map((p) => [p.presenter, { name: p.presenter, image: p.presenterImage }])
        ).values()
      )
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleBackClick = () => {
    navigate("/");
  };

  if (!presentation) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Presentation Not Found
          </h1>
          <Link
            to="/"
            className="text-yellow-500 hover:text-yellow-400 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to UI-Verse</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isLiked
                  ? "bg-red-500/20 text-red-400 border border-red-400/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
              />
              <span>{isLiked ? "Liked" : "Like"}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white/70 hover:bg-white/10 transition-all border border-white/10">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Title Section */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {presentation.title}
          </h1>
          <div className="flex items-center gap-3 text-white/50">
            <span className="px-3 py-1 bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border border-[#f0b100]/50 rounded-full text-white text-sm">
              {presentation.category}
            </span>
            <span>•</span>
            <span>{presentation.duration}</span>
          </div>
        </div>

        {/* Video Section */}
        <div className="w-full px-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <div
              className="relative w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl"
              style={{ height: "75vh" }}
            >
              {presentation.videoUrl.includes(
                "drive.google.com",
              ) ? (
                <iframe
                  src={presentation.videoUrl.replace(
                    "/view",
                    "/preview",
                  )}
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                  title={presentation.title}
                />
              ) : (
                <video
                  src={presentation.videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={presentation.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>

        {/* Presenter & Date Info */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Presenter Info */}
            <Link
              to={`/presenter/${encodeURIComponent(presentation.presenter)}`}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer group"
            >
              <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">
                Presenter
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={presentation.presenterImage}
                  alt={presentation.presenter}
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/50 group-hover:border-yellow-400 transition-colors"
                />
                <div>
                  <p className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {presentation.presenter}
                  </p>
                  <p className="text-sm text-white/60">
                    {presentation.category} Expert
                  </p>
                </div>
              </div>
            </Link>

            {/* Date Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-sm uppercase tracking-wider text-white/50 mb-4">
                Date & Time
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold text-white">
                  {presentation.date}
                </span>
                <div>
                  <p className="text-lg font-semibold text-white">
                    {presentation.month}
                  </p>
                  <p className="text-sm text-white/60">
                    {presentation.day}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-sm uppercase tracking-wider text-white/50 mb-3">
              About this presentation
            </h3>
            <p className="text-white/80 leading-relaxed">
              {presentation.description}
            </p>
          </div>
        </div>

        {/* Attachments Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Attachments & Resources
          </h2>
          <div className="space-y-3">
            {presentation.referenceLinks &&
            presentation.referenceLinks.length > 0 ? (
              presentation.referenceLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-base group"
                >
                  <FileText className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500" />
                  <div className="flex-1 break-all">
                    <span className="font-medium text-yellow-500">
                      {link.label}
                    </span>
                    <span className="text-white/40 mx-2">
                      -
                    </span>
                    <span className="underline underline-offset-4 text-blue-400 hover:text-blue-300 transition-colors">
                      {link.url}
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-white/50">
                No reference links available
              </p>
            )}
          </div>
        </div>

        {/* Other Presentations by Presenter */}
        {otherPresentationsByPresenter.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-16">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Other Presentations by {presentation.presenter}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPresentationsByPresenter.map(
                (otherPresentation) => (
                  <Link
                    key={otherPresentation.id}
                    to={`/presentation/${otherPresentation.id}`}
                    className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={otherPresentation.thumbnail}
                        alt={otherPresentation.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border border-[#f0b100]/50 rounded-full text-white text-xs">
                          {otherPresentation.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-300/50 shadow-lg">
                          <Play
                            className="w-6 h-6 text-black ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">
                        {otherPresentation.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {otherPresentation.date}{" "}
                            {otherPresentation.month}
                          </span>
                        </div>
                        <span>•</span>
                        <span>
                          {otherPresentation.duration}
                        </span>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        )}

        {/* Other Presenters Section */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Other Presenters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Other Presenters from Data */}
            {otherPresenters.map((presenter) => (
              <Link
                key={presenter.name}
                to={`/presenter/${encodeURIComponent(presenter.name)}`}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={presenter.image}
                      alt={presenter.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-yellow-500/50 transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                      <User className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                      {presenter.name}
                    </p>
                    <p className="text-sm text-white/60">
                      Presenter
                    </p>
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