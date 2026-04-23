import { Play } from "lucide-react";
import { Link, useLocation } from "react-router";

interface PresentationCard3DProps {
  id: string;
  title: string;
  presenter: string;
  presenterImage: string;
  thumbnail: string;
  category: string;
  duration: string;
  date: string;
  month: string;
  isFocused: boolean;
  index: number;
}

export function PresentationCard3D({
  id,
  title,
  presenter,
  presenterImage,
  thumbnail,
  category,
  duration,
  date,
  month,
  isFocused,
  index,
}: PresentationCard3DProps) {
  const location = useLocation();
  const isReversed = index % 2 !== 0;

  const handleClick = () => {
    sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
  };

  return (
    <Link
      to={`/presentation/${id}`}
      state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      onClick={handleClick}
      className="block relative w-[900px] h-[380px] cursor-pointer transition-all hover:scale-[1.01] group active:scale-[0.99]"
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
    >
      {/* Date */}
      <div
        className={`absolute bottom-[30px] flex flex-col font-bold items-start leading-none text-white pointer-events-none ${
          isReversed ? "right-8" : "left-8"
        }`}
      >
        <p className="text-[53px]">{date}</p>
        <p className="text-[23px]">{month}</p>
      </div>

      {/* Video Card */}
      <div
        className={`absolute top-0 w-[500px] h-[346px] rounded-[11px] overflow-hidden border-[1.5px] border-[#d08700]/30 shadow-[0_18px_36px_-8px_rgba(0,0,0,0.25)] pointer-events-none group-hover:border-[#d08700]/60 transition-all group-hover:shadow-[0_18px_36px_-8px_rgba(208,135,0,0.4)]`}
        style={{
          background:
            "linear-gradient(145deg, rgba(115, 62, 10, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%)",
          [isReversed ? "right" : "left"]: "140px",
        }}
      >
        <div className="relative w-full h-full bg-black pointer-events-none">
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full z-5 object-contain opacity-95"
          />
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover brightness-50 blur-lg opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent via-50%" />

          {/* Tags */}
          <div className="absolute top-4 left-4">
            <div className="bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border-[0.7px] border-[#f0b100]/50 rounded-full px-3 py-1">
              <p className="text-white text-[10px] font-normal leading-none">{category}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <p className="text-white/80 text-[14px] leading-none">{duration}</p>
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent pt-[40px]">
            <p className="text-[#fefce8] text-[17px] font-semibold leading-snug">{title}</p>
          </div>

          {/* Play Overlay */}
          {isFocused && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-300/50 shadow-lg">
                <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Presenter */}
      <div
        className={`absolute bottom-[-10px] z-22 w-[320px] h-[350px] pointer-events-none select-none ${
          isReversed ? "left-0" : "right-0"
        }`}
      >
        <div className="absolute inset-0 flex items-end justify-center pb-[20px]">
          <img
            src={presenterImage}
            alt={presenter}
            className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />
        </div>
        <div className={`absolute bottom-2 flex justify-center w-full`}>
          <div
            className={`bg-[#ff0000] px-6 py-1.5 shadow-2xl ${
              isReversed ? "rotate-[4deg] skew-x-[6deg]" : "-rotate-[4deg] -skew-x-[6deg]"
            }`}
          >
            <p
              className={`text-white text-[32px] font-bold whitespace-nowrap leading-none`}
            >
              {presenter}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}