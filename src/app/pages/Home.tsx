import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lottie from "lottie-react";
import { Navbar } from "../components/Navbar";
import { PresentationCard3D } from "../components/PresentationCard3D";
import { ChevronDown } from "lucide-react";
import uiVerseAnimation from "../../imports/Ui-verse.json"
import { presentations as basePresentations } from "../data/presentations";

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const galaxyVideo = new URL("../../imports/output.mp4", import.meta.url).href;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollIconRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const focusedIndexRef = useRef(0);
  const hasRestoredScroll = useRef(false);
  // Home hero should always reflect the first 6 cards from the source file (in-file order),
  // independent of store sorting/filters.
  const homePresentations = useMemo(() => basePresentations.slice(0, 6), []);

  const cardTransforms = useMemo(() => {
    return homePresentations.map((_, i) => {
      const randX = Math.sin(i * 2.1) * 1500;
      const randY = Math.cos(i * 1.8) * 1000;
      const randRx = Math.sin(i * 1.5) * 45;
      const randRy = Math.cos(i * 1.7) * 45;
      return { x: randX, y: randY, rx: randRx, ry: randRy };
    });
  }, [homePresentations]);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("homeScrollPosition");
    if (savedScrollPosition && !hasRestoredScroll.current) {
      hasRestoredScroll.current = true;
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
      }, 100);
    }

    const handleScroll = () => {
      sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("home-hide-scrollbar");
    document.body.classList.add("home-hide-scrollbar");

    return () => {
      document.documentElement.classList.remove("home-hide-scrollbar");
      document.body.classList.remove("home-hide-scrollbar");
    };
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;
    if (!containerRef.current) return;
    const videoMaxOpacity = 0.75;
    const videoFadeInProgress = 0.18;

    if (videoRef.current) {
      gsap.set(videoRef.current, { opacity: 0 });
    }

    if (titleRef.current) {
      gsap.set(titleRef.current, {
        opacity: 1,
      });
    }

    cardsRef.current.forEach((card, index) => {
      if (!card) return;

      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: cardTransforms[index].x,
        y: cardTransforms[index].y,
        z: -5000,
        rotationX: cardTransforms[index].rx,
        rotationY: cardTransforms[index].ry,
        opacity: 0,
      });

      const inner = card.querySelector(".card-inner");
      if (inner) {
        gsap.to(inner, {
          y: "+=20",
          rotationX: "+=3",
          rotationY: "+=3",
          duration: 2.5 + (index % 2),
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      }
    });

    const setupScroll = () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalCards = homePresentations.length;

          if (
            videoRef.current &&
            videoRef.current.readyState >= 1
          ) {
            const duration = videoRef.current.duration;
            if (duration && isFinite(duration)) {
              videoRef.current.currentTime =
                progress * duration;
            }

            const fadeProgress = Math.min(progress / videoFadeInProgress, 1);
            videoRef.current.style.opacity = `${fadeProgress * videoMaxOpacity}`;
          }

          const spacingZ = 2500;
          const startZ = -2500;
          const endZ = (totalCards - 1) * spacingZ;
          const cameraZ = startZ + progress * (endZ - startZ);

          if (titleRef.current) {
            const titleOpacity = Math.max(0, 1 - progress * 15);
            gsap.to(titleRef.current, {
              opacity: titleOpacity,
              duration: 0.1,
              ease: "none",
            });
          }

          if (scrollIconRef.current) {
            const scrollIconOpacity = Math.max(0, 1 - progress * 20);
            gsap.to(scrollIconRef.current, {
              opacity: scrollIconOpacity,
              duration: 0.1,
              ease: "none",
            });
          }

          let closestIndex = focusedIndexRef.current;
          let minDistance = Infinity;

          cardsRef.current.forEach((_, index) => {
            const cardZ = index * spacingZ;
            const deltaZ = cardZ - cameraZ;
            if (Math.abs(deltaZ) < minDistance) {
              minDistance = Math.abs(deltaZ);
              closestIndex = index;
            }
          });

          cardsRef.current.forEach((card, index) => {
            if (!card) return;
            const cardZ = index * spacingZ;
            const deltaZ = cardZ - cameraZ;
            const transform = cardTransforms[index];

            let opacity = 0;
            let blur = 20;
            let x = 0,
              y = 0,
              z = 0,
              rx = 0,
              ry = 0;

            // Hide all cards when progress is very low (at the start)
            if (progress < 0.02) {
              opacity = 0;
              z = -5000;
              x = transform.x;
              y = transform.y;
              rx = transform.rx;
              ry = transform.ry;
              blur = 20;
            } else if (deltaZ > 5000) {
              opacity = 0;
              z = -5000;
              x = transform.x;
              y = transform.y;
              rx = transform.rx;
              ry = transform.ry;
              blur = 20;
            } else if (deltaZ > 0) {
              const factor = deltaZ / 5000;
              opacity = 1 - Math.pow(factor, 2);
              x = transform.x * factor;
              y = transform.y * factor;
              z = -deltaZ;
              rx = transform.rx * factor;
              ry = transform.ry * factor;
              blur = factor * 20;
            } else if (deltaZ > -2000) {
              const factor = deltaZ / -2000;
              opacity = 1 - Math.pow(factor, 1.5);
              z = -deltaZ;
              x = transform.x * factor * -0.5;
              y = transform.y * factor * -0.5;
              rx = transform.rx * factor * -0.5;
              ry = transform.ry * factor * -0.5;
              blur = factor * 25;
            } else {
              opacity = 0;
              z = 2000;
              blur = 25;
            }

            const isFocused = index === closestIndex;
            const finalBlur = isFocused
              ? Math.min(blur, 0)
              : blur + (Math.abs(deltaZ) < 2000 ? 3 : 0);
            const finalOpacity = isFocused
              ? opacity
              : opacity * 0.7;

            // Enable pointer events when card is visible
            const isVisible = finalOpacity > 0.1;
            card.style.pointerEvents = isVisible ? "auto" : "none";

            gsap.to(card, {
              x,
              y,
              z,
              rotationX: rx,
              rotationY: ry,
              opacity: finalOpacity,
              filter: `blur(${finalBlur}px)`,
              duration: 0.8,
              ease: "power2.out",
            });
          });

          if (closestIndex !== focusedIndexRef.current) {
            focusedIndexRef.current = closestIndex;
            setFocusedIndex(closestIndex);
          }
        },
      });
    };

    if (videoRef.current && videoRef.current.readyState >= 1) {
      setupScroll();
    } else {
      setupScroll();
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) =>
        trigger.kill(),
      );
    };
  }, [cardTransforms]);

  return (
    <>
      <style>{`
        html.home-hide-scrollbar,
        body.home-hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html.home-hide-scrollbar::-webkit-scrollbar,
        body.home-hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
      <section className="relative bg-[#0b0b0b] text-white">
        {/* <img
          src={heroBgImage}
          alt="UI-VERSE Background"
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-35 mix-blend-screen"
        /> */}
        <div className="sticky top-0 h-screen overflow-hidden z-0 pointer-events-none">
          <video
            ref={videoRef}
            src={galaxyVideo}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,11,11,0.65)_80%)]" />
        </div>

        <div className="relative z-10 -mt-[100vh]">
          <Navbar />

          {/* Mobile: simple list (no 3D/scroll animation) */}
          <div className="md:hidden pt-24 pb-14 px-4">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
              UI-VERSE
            </h1>
            <p className="text-white/60 mb-6">
              Explore the latest presentations
            </p>

            <div className="space-y-4">
              {homePresentations.map((p) => (
                <Link
                  key={p.id}
                  to={`/presentation/${p.id}`}
                  state={{ from: "/", autoplay: true }}
                  className="block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-colors"
                  onClick={() => {
                    sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
                  }}
                >
                  <div className="relative aspect-video bg-black">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-contain opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-[#d08700]/90 to-[#a65f00]/90 border border-[#f0b100]/50 rounded-full text-white text-xs">
                        {p.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 text-white/80 text-xs">
                      {p.duration}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-semibold text-base line-clamp-2">
                        {p.title}
                      </p>
                      <p className="text-white/60 text-sm mt-1">
                        {p.presenter} • {p.presenterRole}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/presentations"
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-2xl font-bold text-base shadow-[0_0_24px_rgba(255,215,0,0.25)] border border-yellow-300/50"
              >
                View all presentations
              </Link>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative hidden md:block"
            style={{
              height: `${homePresentations.length * 100}vh`,
            }}
          >
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
              <div
                className="fixed inset-0 flex items-center justify-center pointer-events-none"
                style={{
                  perspective: "1500px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  ref={titleRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none origin-center flex flex-col items-center"
                  style={{ willChange: "opacity" }}
                >
                  <p className="text-[1.5rem] md:text-[2rem]  font-normal tracking-[0.3em] text-white/40 -mb-12">
                    WELCOME TO
                  </p>
                  <h1 className="text-[8rem] md:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] whitespace-nowrap">
                    UI-VERSE
                  </h1>
                </div>

                {/* Scroll Indicator */}
                <div
                  ref={scrollIconRef}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-30"
                  style={{ willChange: "opacity" }}
                >
                  <div className="flex flex-col items-center gap-2 animate-bounce">
                    <p className="text-sm text-white/60 tracking-widest">SCROLL</p>
                    <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1">
                      <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
                    </div>
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  </div>
                </div>

                {homePresentations.map((presentation, index) => (
                  <div
                    key={presentation.id}
                    ref={(el) => {
                      cardsRef.current[index] = el;
                    }}
                    className="absolute top-1/2 left-1/2 origin-center"
                    style={{
                      willChange: "transform, opacity, filter",
                      transformStyle: "preserve-3d",
                      pointerEvents: "none",
                    }}
                  >
                    <div
                      className="card-inner"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <PresentationCard3D
                        {...presentation}
                        isFocused={focusedIndex === index}
                        index={index}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
      <section className="relative h-screen flex flex-col items-center justify-center bg-[#0b0b0b] z-20 overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_60%)]" />
       
        <Lottie animationData={uiVerseAnimation} loop={true} />
        <p className="text-xl text-white/60 mb-10 max-w-lg text-center relative z-10">
          Explore new things everyday
        </p>
        <Link
          to="/presentations"
          className="relative z-10 px-10 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.3)] border border-yellow-300/50"
        >
          Start Exploring
        </Link>
      </section>
    </>
  );
}