import React from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router";
import { usePresentationStore } from "../state/presentationStore";
import {
  ArrowLeft,
  Heart,
  Share2,
  FileText,
  User,
  Play,
  Calendar,
  X,
  Copy,
  Check,
  Linkedin,
  Facebook,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";

export function PresentationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { presentations } = usePresentationStore();
  const presentation = presentations.find((p) => p.id === id);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const fromPath = (location.state as { from?: string } | null)?.from;

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
            .map((p) => [
              p.presenter,
              {
                name: p.presenter,
                image: p.presenterImage,
                role: p.presenterRole,
              },
            ]),
        ).values(),
      )
    : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // YouTube-like behavior: start playback immediately on open.
  useEffect(() => {
    if (!presentation) return;
    if (presentation.videoUrl.includes("drive.google.com")) return;
    const v = videoRef.current;
    if (!v) return;
    // Attempt autoplay; browsers may block if not muted.
    v.muted = true;
    const p = v.play();
    if (p && typeof (p as Promise<unknown>).catch === "function") {
      (p as Promise<unknown>).catch(() => {
        // ignore autoplay restrictions
      });
    }
  }, [presentation?.id]);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (!isShareModalOpen) return;

    const onEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsShareModalOpen(false);
      }
    };

    window.addEventListener("keydown", onEscapeKey);
    return () => {
      window.removeEventListener("keydown", onEscapeKey);
    };
  }, [isShareModalOpen]);

  const getBackLabel = () => {
    if (fromPath?.startsWith("/presentations")) return "Back to Presentations";
    if (fromPath?.startsWith("/presenter/")) return "Back to Presenter";
    if (fromPath === "/") return "Back to Home";
    if (window.history.length > 1) return "Go Back";
    return "Back to Home";
  };

  const handleBackClick = () => {
    if (fromPath) {
      navigate(fromPath);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  const handleShare = (platform: "linkedin" | "facebook" | "x" | "email") => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(
      `${presentation?.title ?? "Presentation"} - UI-Verse`,
    );

    const shareTargets: Record<typeof platform, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    };

    window.open(shareTargets[platform], "_blank", "noopener,noreferrer");
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy URL", error);
    }
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
            <span>{getBackLabel()}</span>
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
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer bg-white/5 text-white/70 hover:bg-white/10 transition-all border border-white/10"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">

        {/* Video Section */}
        <div className="w-full px-4 sm:px-6 pt-4 sm:pt-8">
          <div className="max-w-7xl mx-auto">
            <div
              className="relative w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl aspect-video max-h-[75vh]"
            >
              {presentation.videoUrl.includes(
                "drive.google.com",
              ) ? (
                <iframe
                  src={`${presentation.videoUrl.replace("/view", "/preview")}?autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                  title={presentation.title}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={presentation.videoUrl}
                  controls
                  autoPlay
                  muted
                  className="w-full h-full object-contain"
                  poster={presentation.thumbnail}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>

        {/* Title + Meta (under video) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-5 sm:mt-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-tight sm:leading-[1.2]">
            {presentation.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/50">
            <span className="px-3 py-1 bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border border-[#f0b100]/50 rounded-full text-white text-sm">
              {presentation.category}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="text-sm sm:text-base">{presentation.duration}</span>
          </div>
        </div>

        

        {/* Presenter & Date Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
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
                  className="w-16 h-16 rounded-full object-cover  bg-gray-900 border-2 border-yellow-500/50 group-hover:border-yellow-400 transition-colors"
                />
                <div>
                  <p className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {presentation.presenter}
                  </p>
                  <p className="text-sm text-white/60">
                    {presentation.presenterRole}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <h2 className="text-lg md:text-2xl font-semibold mb-6 text-white">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
            <h2 className="text-lg md:text-2xl font-semibold mb-6 text-white">
              Other Presentations by {presentation.presenter}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPresentationsByPresenter.map(
                (otherPresentation) => (
                  <Link
                    key={otherPresentation.id}
                    to={`/presentation/${otherPresentation.id}`}
                    state={{ from: `${location.pathname}${location.search}${location.hash}` }}
                    className="group bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden bg-black">
                      {/* Background: blurred + dimmed */}
                      <img
                        src={otherPresentation.thumbnail}
                        alt={otherPresentation.title}
                        className="absolute inset-0 w-full h-full object-cover blur-lg brightness-50 scale-105"
                      />
                      {/* Foreground: clean */}
                      <img
                        src={otherPresentation.thumbnail}
                        alt={otherPresentation.title}
                        className="absolute inset-0 w-full h-full object-contain opacity-95 group-hover:scale-105 transition-transform duration-300"
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
        {otherPresenters.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
            <h2 className="text-lg md:text-2xl font-semibold mb-6 text-white">
              Other Presenters
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {otherPresenters.map((presenter) => (
                <Link
                  key={presenter.name}
                  to={`/presenter/${encodeURIComponent(presenter.name)}`}
                  state={{ from: `${location.pathname}${location.search}${location.hash}` }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={presenter.image}
                        alt={presenter.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/10 group-hover:border-yellow-500/50 transition-colors bg-gray-800"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                        <User className="w-3 h-3 text-black" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white group-hover:text-yellow-400 transition-colors truncate">
                        {presenter.name}
                      </p>
                      <p className="text-sm text-white/60">{presenter.role}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#101010] text-white shadow-2xl border border-white/10 p-6 relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              aria-label="Close share modal"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>

            <h3 className="text-2xl font-bold pr-8 mb-2">Share Presentation</h3>
            <p className="text-white/60 mb-6">
              Share this presentation with your network.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button
                onClick={() => handleShare("linkedin")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#0a66c2] flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium cursor-pointer">LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium cursor-pointer">Facebook</span>
              </button>
              <button
                onClick={() => handleShare("x")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-black" />
                </div>
                <span className="text-sm font-medium cursor-pointer">X</span>
              </button>
              <button
                onClick={() => handleShare("email")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ea4335] via-[#fbbc05] to-[#34a853] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium cursor-pointer">Email</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Copy URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-xl border border-white/15 px-3 py-2 text-sm bg-white/[0.06] text-white"
                />
                <button
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-yellow-500 text-black px-3 py-2 text-sm hover:bg-yellow-400 transition-colors font-semibold"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}