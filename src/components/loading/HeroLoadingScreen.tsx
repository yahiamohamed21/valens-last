"use client";

import React, { useMemo } from "react";

interface HeroLoadingScreenProps {
  loading: boolean;
  fadeOutLoading: boolean;
  progress: number;
}

const WORD = "VALENS";
const CHAIN_LINKS = 14;

export const HeroLoadingScreen: React.FC<HeroLoadingScreenProps> = ({
  loading,
  fadeOutLoading,
  progress,
}) => {
  const clamped = Math.max(0, Math.min(100, progress));

  // Precompute per-letter reveal thresholds so letters "link" into place
  // one after another as the liquid rises, instead of all at once.
  const letterThresholds = useMemo(
    () => WORD.split("").map((_, i) => (i / WORD.length) * 85),
    []
  );

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-main-bg transition-opacity duration-700 ease-in-out ${fadeOutLoading ? "opacity-0" : "opacity-100"
        }`}
    >
      <style>{`
        @keyframes valens-wave-drift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes valens-wave-drift-rev {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes valens-link-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,138,117,0.55); }
          50%      { box-shadow: 0 0 10px 2px rgba(255,138,117,0.55); }
        }
        @keyframes valens-drop-in {
          0%   { transform: translateY(-6px); opacity: 0; }
          60%  { transform: translateY(1px); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .valens-letter-mask {
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }
      `}</style>

      <div className="flex flex-col items-center w-full max-w-md px-6">
        {/* Eyebrow */}
        <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary-coral/80 mb-8 animate-pulse">
          Initializing Experience
        </span>

        {/* ---------------------------------------------------------- */}
        {/* Liquid wordmark: VALENS fills like rising liquid, letter   */}
        {/* by letter, as `progress` climbs.                          */}
        {/* ---------------------------------------------------------- */}
        <div
          className="relative w-full select-none"
          style={{ height: "clamp(64px, 16vw, 96px)" }}
          aria-label={WORD}
          role="img"
        >
          {/* Ghost outline layer — the "empty vessel" the letters sit in */}
          <div
            className="absolute inset-0 flex items-center justify-center font-black uppercase"
            style={{
              fontSize: "clamp(40px, 11vw, 72px)",
              letterSpacing: "0.12em",
              WebkitTextStroke: "1px rgba(255,255,255,0.14)",
              color: "transparent",
            }}
          >
            {WORD}
          </div>

          {/* Per-letter liquid fill */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex font-black uppercase"
              style={{ fontSize: "clamp(40px, 11vw, 72px)", letterSpacing: "0.12em" }}
            >
              {WORD.split("").map((ch, i) => {
                const threshold = letterThresholds[i];
                const nextThreshold = letterThresholds[i + 1] ?? 100;
                const span = Math.max(nextThreshold - threshold, 1);
                const localFill = Math.max(
                  0,
                  Math.min(100, ((clamped - threshold) / span) * 100)
                );
                const revealed = clamped >= threshold;

                return (
                  <span
                    key={`${ch}-${i}`}
                    className="relative inline-block"
                    style={{
                      opacity: revealed ? 1 : 0.18,
                      animation: revealed
                        ? "valens-drop-in 380ms ease-out"
                        : "none",
                    }}
                  >
                    {/* Full letter, dim, always present so shape reads immediately */}
                    <span
                      aria-hidden
                      className="valens-letter-mask"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgba(255,138,117,0.16), rgba(255,138,117,0.16))",
                      }}
                    >
                      {ch}
                    </span>

                    {/* Liquid-filled clip, rising from the bottom of this letter */}
                    <span
                      aria-hidden
                      className="absolute inset-0 overflow-hidden"
                      style={{ height: `${localFill}%`, bottom: 0, top: "auto" }}
                    >
                      {/* wave surface */}
                      <span
                        className="absolute left-0 right-0 -top-[6px] h-[10px] opacity-90"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 6px 6px, #FF8A75 5px, transparent 6px)",
                          backgroundSize: "12px 12px",
                          animation: "valens-wave-drift 1.1s linear infinite",
                          width: "200%",
                        }}
                      />
                      <span
                        className="valens-letter-mask block"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, #FFB199 0%, #FF8A75 45%, #E85A3F 100%)",
                          filter: "drop-shadow(0 0 6px rgba(255,138,117,0.45))",
                        }}
                      >
                        {ch}
                      </span>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Percentage */}
        <div className="mt-8 text-3xl font-black text-white font-mono tracking-wider tabular-nums">
          {Math.round(clamped)}
          <span className="text-primary-coral">%</span>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* Chain-link progress: segments forge together as they load */}
        {/* ---------------------------------------------------------- */}
        <div className="mt-6 flex w-full items-center justify-center">
          {Array.from({ length: CHAIN_LINKS }).map((_, i) => {
            const linkThreshold = (i / CHAIN_LINKS) * 100;
            const lit = clamped >= linkThreshold;
            const isLast = i === CHAIN_LINKS - 1;
            return (
              <React.Fragment key={i}>
                <span
                  className="h-2.5 w-2.5 rounded-full border transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: lit ? "#FF8A75" : "transparent",
                    borderColor: lit
                      ? "#FF8A75"
                      : "rgba(255,255,255,0.14)",
                    animation: lit ? "valens-link-pulse 1.6s ease-in-out infinite" : "none",
                  }}
                />
                {!isLast && (
                  <span
                    className="h-px flex-1 transition-colors duration-300"
                    style={{
                      backgroundColor: lit
                        ? "rgba(255,138,117,0.55)"
                        : "rgba(255,255,255,0.10)",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};