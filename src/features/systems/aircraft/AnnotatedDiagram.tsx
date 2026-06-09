import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import {
  FalconSideView,
  FalconTopView,
  SIDE_VIEW,
  TOP_VIEW,
} from "./FalconViews";

export interface Hotspot {
  id: string;
  /** Coordinates in the view's own viewBox units. */
  x: number;
  y: number;
  label: string;
  body: string;
  /** Optional Falcon-view part id to light up when selected. */
  part?: string;
}

export interface AnnotatedView {
  view: "top" | "side";
  caption: string;
  hotspots: Hotspot[];
}

const SPEECH =
  typeof window !== "undefined" && "speechSynthesis" in window;

export function AnnotatedDiagram({ data }: { data: AnnotatedView }) {
  const [sel, setSel] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [touring, setTouring] = useState(false);
  const timer = useRef<number | null>(null);

  const { viewBox } = data.view === "top" ? TOP_VIEW : SIDE_VIEW;
  const View = data.view === "top" ? FalconTopView : FalconSideView;
  const active = sel != null ? data.hotspots[sel] : null;

  const clearTimer = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const stopSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  useEffect(
    () => () => {
      clearTimer();
      window.speechSynthesis?.cancel();
    },
    [],
  );

  // Speak the active hotspot. If touring, advance when narration finishes.
  useEffect(() => {
    if (sel == null) return;
    const hs = data.hotspots[sel];
    const advance = () => {
      if (sel >= data.hotspots.length - 1) {
        setTouring(false);
        setSpeaking(false);
      } else {
        setSel(sel + 1);
      }
    };

    if (!touring) return;
    if (SPEECH) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`${hs.label}. ${hs.body}`);
      u.rate = 0.97;
      setSpeaking(true);
      u.onend = () => {
        setSpeaking(false);
        timer.current = window.setTimeout(advance, 500);
      };
      u.onerror = () => {
        setSpeaking(false);
        timer.current = window.setTimeout(advance, 2500);
      };
      window.speechSynthesis.speak(u);
    } else {
      timer.current = window.setTimeout(advance, 4200);
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, touring]);

  function selectManual(i: number | null) {
    clearTimer();
    setTouring(false);
    stopSpeech();
    setSel(i);
  }

  function speakOne() {
    if (!active || !SPEECH) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${active.label}. ${active.body}`);
    u.rate = 0.97;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function toggleTour() {
    if (touring) {
      clearTimer();
      stopSpeech();
      setTouring(false);
    } else {
      stopSpeech();
      setTouring(true);
      setSel((s) => (s == null ? 0 : s));
    }
  }

  function step(dir: 1 | -1) {
    clearTimer();
    setTouring(false);
    stopSpeech();
    setSel((s) => {
      const n = data.hotspots.length;
      if (s == null) return dir === 1 ? 0 : n - 1;
      return (s + dir + n) % n;
    });
  }

  return (
    <div className="px-1 pb-2">
      <div className="overflow-hidden rounded-lg border border-ink-800 bg-gradient-to-b from-ink-900 to-ink-950 p-2">
        <svg viewBox={viewBox} className="h-auto w-full" role="img">
          <View highlight={active?.part} />
          {data.hotspots.map((hs, i) => {
            const on = i === sel;
            return (
              <g
                key={hs.id}
                onClick={() => selectManual(on ? null : i)}
                style={{ cursor: "pointer" }}
                className={on ? "comp-sel" : ""}
              >
                {!on && (
                  <circle cx={hs.x} cy={hs.y} r="15" fill="#f59e0b" opacity="0.18">
                    <animate
                      attributeName="r"
                      values="13;18;13"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r="12"
                  fill={on ? "#f59e0b" : "#1e293b"}
                  stroke={on ? "#fde68a" : "#60a5fa"}
                  strokeWidth="2"
                />
                <text
                  x={hs.x}
                  y={hs.y + 4}
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="bold"
                  fill={on ? "#1f2937" : "#dbeafe"}
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Controls */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          onClick={toggleTour}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            touring
              ? "bg-amber-600 text-white"
              : "bg-emerald-600 text-white hover:bg-emerald-500",
          )}
        >
          {touring ? <Pause size={14} /> : <Play size={14} />}
          {touring ? "Pause tour" : "▶ Guided tour"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink-500">{data.caption}</span>
          <button
            onClick={() => step(-1)}
            className="grid size-8 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500"
            aria-label="Previous part"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => step(1)}
            className="grid size-8 place-items-center rounded-lg border border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500"
            aria-label="Next part"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {active ? (
        <div className="mt-2 rounded-lg border border-amber-700/50 bg-amber-950/30 p-3 [animation:var(--animate-fade-in)]">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-amber-600 text-xs font-bold text-white">
              {sel! + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-200">
                  {active.label}
                </span>
                <span className="text-[10px] text-ink-500">
                  {sel! + 1} / {data.hotspots.length}
                </span>
                {SPEECH && (
                  <button
                    onClick={() => (speaking ? stopSpeech() : speakOne())}
                    className="text-amber-300/80 hover:text-amber-200"
                    aria-label="Read aloud"
                  >
                    {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-200">
                {active.body}
              </p>
            </div>
            <button
              onClick={() => selectManual(null)}
              className="text-ink-400 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2 text-center text-[11px] text-ink-500">
          Press <span className="text-emerald-400">Guided tour</span> to have
          each part pointed out and explained — or tap any numbered marker
          yourself.
        </div>
      )}

      {/* Legend */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {data.hotspots.map((hs, i) => (
          <button
            key={hs.id}
            onClick={() => selectManual(i === sel ? null : i)}
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              i === sel
                ? "bg-amber-600 text-white"
                : "border border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500",
            )}
          >
            {i + 1}. {hs.label}
          </button>
        ))}
      </div>
    </div>
  );
}
