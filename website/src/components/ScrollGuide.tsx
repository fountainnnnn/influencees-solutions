import { useEffect, useRef, useState } from "react";

const MESSAGE_MAP: Record<string, string> = {
  hero: "Hey! Welcome to Influencees. Scroll on, I will show you around.",
  "ai-kyo": "This is Ai-kyo. Ask it anything about SG creators.",
  "core-features":
    "The essentials: trusted data, Trust Check, and the creator index.",
  features: "The essentials: trusted data, Trust Check, and the creator index.",
  brands: "For brands: find creators whose numbers you can trust.",
  creators: "For creators: know your worth, land better deals.",
  trust: "Trust Check flags scams and AI content before you commit.",
  "trust-check": "Trust Check flags scams and AI content before you commit.",
  pricing: "Simple pricing. Brands from $49, creators free to start.",
  directory: "Browse real Singapore creators, all verified.",
  cta: "Ready when you are. Do your homework, then reach out.",
  final: "Ready when you are. Do your homework, then reach out.",
};

const SESSION_KEY = "influencees-scroll-guide-dismissed";
const BUBBLE_DURATION = 4_500;

function getSectionMessage(section: Element) {
  const key = section.id || section.getAttribute("data-guide") || "";
  const heading = section.querySelector<HTMLElement>("h1, h2, h3");

  return (
    MESSAGE_MAP[key.toLowerCase()] ||
    heading?.textContent?.trim() ||
    MESSAGE_MAP.hero
  );
}

function wasDismissed() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export default function ScrollGuide() {
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [message, setMessage] = useState(MESSAGE_MAP.hero);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const activeSectionRef = useRef<Element | null>(null);

  const clearHideTimer = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const showTemporarily = () => {
    clearHideTimer();
    setIsBubbleVisible(true);
    hideTimerRef.current = window.setTimeout(() => {
      setIsBubbleVisible(false);
      hideTimerRef.current = null;
    }, BUBBLE_DURATION);
  };

  useEffect(() => {
    if (dismissed) return;

    const visibility = new Map<Element, number>();
    const thresholds = Array.from({ length: 11 }, (_, index) => index / 10);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(
            entry.target,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }

        let mostVisible: Element | null = null;
        let highestRatio = 0;

        for (const [section, ratio] of visibility) {
          if (ratio > highestRatio) {
            mostVisible = section;
            highestRatio = ratio;
          }
        }

        if (mostVisible && mostVisible !== activeSectionRef.current) {
          activeSectionRef.current = mostVisible;
          setMessage(getSectionMessage(mostVisible));
          showTemporarily();
        }
      },
      {
        rootMargin: "-10% 0px -20% 0px",
        threshold: thresholds,
      },
    );

    const observedSections = new Set<Element>();
    const observeSections = () => {
      const sections = document.querySelectorAll("main section, [data-guide]");

      for (const section of sections) {
        if (!observedSections.has(section)) {
          observedSections.add(section);
          visibility.set(section, 0);
          observer.observe(section);
        }
      }

      for (const section of observedSections) {
        if (!document.contains(section)) {
          observer.unobserve(section);
          observedSections.delete(section);
          visibility.delete(section);

          if (activeSectionRef.current === section) {
            activeSectionRef.current = null;
          }
        }
      }
    };

    observeSections();

    const mutationObserver = new MutationObserver(observeSections);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearHideTimer();
    };
  }, [dismissed]);

  if (dismissed) return null;

  const handleMascotClick = () => {
    if (isBubbleVisible) {
      clearHideTimer();
      setIsBubbleVisible(false);
      return;
    }

    showTemporarily();
  };

  const handleDismiss = () => {
    clearHideTimer();
    setDismissed(true);

    try {
      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // The in-memory state still dismisses the guide for this page.
    }
  };

  return (
    <>
      <style>{`
        @keyframes scroll-guide-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes scroll-guide-bubble-in {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .scroll-guide-mascot {
          animation: scroll-guide-bob 3s ease-in-out infinite;
        }

        .scroll-guide-bubble {
          animation: scroll-guide-bubble-in 200ms ease-out both;
          transform-origin: bottom right;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-guide-mascot,
          .scroll-guide-bubble {
            animation: none;
          }
        }
      `}</style>

      <div className="fixed right-5 bottom-5 z-40 flex items-end gap-3 max-[479px]:right-3 max-[479px]:bottom-3">
        {isBubbleVisible && (
          <div
            className="scroll-guide-bubble relative max-w-[240px] rounded-2xl border border-line bg-white/90 px-3.5 py-2.5 pr-8 text-[13px] leading-relaxed text-ink shadow-lg backdrop-blur-md max-[479px]:max-w-[200px]"
            role="status"
            aria-live="polite"
          >
            <span>{message}</span>
            <button
              type="button"
              className="absolute top-1.5 right-2 grid size-6 place-items-center rounded-full text-base leading-none text-ink-3 transition-colors hover:bg-black/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              aria-label="Dismiss guide"
              onClick={handleDismiss}
            >
              ×
            </button>
            <span
              className="absolute right-[-6px] bottom-4 size-3 rotate-45 border-t border-r border-line bg-white/90"
              aria-hidden="true"
            />
          </div>
        )}

        <button
          type="button"
          className="scroll-guide-mascot grid size-14 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-white/70 shadow-lg backdrop-blur-md transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-[479px]:size-11"
          aria-label="Guide"
          aria-expanded={isBubbleVisible}
          onClick={handleMascotClick}
        >
          <svg
            className="size-11 max-[479px]:size-9"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="scroll-guide-gradient"
                x1="9"
                y1="6"
                x2="39"
                y2="43"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7A5CFF" />
                <stop offset="0.55" stopColor="#9A7BFF" />
                <stop offset="1" stopColor="#E58AD8" />
              </linearGradient>
            </defs>
            <path
              d="M24 5.5C14.4 5.5 8 13.1 8 23.1v15.1c0 2.4 2.8 3.7 4.6 2.1l2.9-2.6 3.4 3c1.1 1 2.8 1 3.9 0l3.2-2.9 3.2 2.9c1.1 1 2.8 1 3.9 0l2.9-2.6c1.7 1.7 4.6.5 4.6-2V23.1C40.6 13.1 33.6 5.5 24 5.5Z"
              fill="url(#scroll-guide-gradient)"
            />
            <ellipse cx="18.5" cy="22.5" rx="2" ry="2.5" fill="white" />
            <ellipse cx="29.5" cy="22.5" rx="2" ry="2.5" fill="white" />
            <path
              d="M19.5 29.2c1.2 1.6 2.7 2.4 4.5 2.4s3.3-.8 4.5-2.4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="14.8" cy="27.3" r="1.6" fill="#FFB1D6" opacity="0.72" />
            <circle cx="33.2" cy="27.3" r="1.6" fill="#FFB1D6" opacity="0.72" />
          </svg>
        </button>
      </div>
    </>
  );
}
