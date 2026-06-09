import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  Target,
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function AnnotatedDiagram({ data }: { data: AnnotatedView }) {
  const [sel, setSel] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [touring, setTouring] = useState(false);

  // Practice ("find the part") state.
  const [practice, setPractice] = useState<number[] | null>(null);
  const [pPos, setPPos] = useState(0);
  const [pScore, setPScore] = useState(0);
  const [pFeedback, setPFeedback] = useState<null | "ok" | "wrong">(null);

  const timer = useRef<number | null>(null);

  const { viewBox } = data.view === "top" ? TOP_VIEW : SIDE_VIEW;
  const View = data.view === "top" ? FalconTopView : FalconSideView;
  const active = sel != null ? data.hotspots[sel] : null;

  const inPractice = practice != null;
  const practiceDone = inPractice && pPos >= practice!.length;
  const target =
    inPractice && !practiceDone ? data.hotspots[practice![pPos]] : null;

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

  // Guided tour: speak the active hotspot, advance when narration finishes.
  useEffect(() => {
    if (!touring || sel == null) return;
    const hs = data.hotspots[sel];
    const advance = () => {
      if (sel >= data.hotspots.length - 1) {
        setTouring(false);
        setSpeaking(false);
      } else {
        setSel(sel + 1);
      }
    };
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

  function resetModes() {
    clearTimer();
    setTouring(false);
    setPractice(null);
    setPFeedback(null);
    stopSpeech();
  }

  function selectManual(i: number | null) {
    resetModes();
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
      setPractice(null);
      stopSpeech();
      setTouring(true);
      setSel((s) => (s == null ? 0 : s));
    }
  }

  function startPractice() {
    clearTimer();
    stopSpeech();
    setTouring(false);
    setSel(null);
    setPractice(shuffle(data.hotspots.map((_, i) => i)));
    setPPos(0);
    setPScore(0);
    setPFeedback(null);
  }

  function step(dir: 1 | -1) {
    resetModes();
    setSel((s) => {
      const n = data.hotspots.length;
      if (s == null) return dir === 1 ? 0 : n - 1;
      return (s + dir + n) % n;
    });
  }

  function onMarker(i: number) {
    if (inPractice) {
      if (practiceDone || pFeedback) return;
      const correct = i === practice![pPos];
      if (correct) {
        setPScore((s) => s + 1);
        setPFeedback("ok");
        setSel(i);
        timer.current = window.setTimeout(() => {
          setPFeedback(null);
          setSel(null);
          setPPos((p) => p + 1);
        }, 850);
      } else {
        setPFeedback("wrong");
        timer.current = window.setTimeout(() => setPFeedback(null), 750);
      }
      return;
    }
    selectManual(i === sel ? null : i);
  }

  return (
    <div className="px-1 pb-2">
      <div
        className={cn(
          "overflow-hidden rounded-lg border bg-gradient-to-b from-ink-900 to-ink-950 p-2 transition-colors",
          pFeedback === "ok"
            ? "border-emerald-500"
            : pFeedback === "wrong"
              ? "border-red-500"
              : "border-ink-800",
        )}
      >
        <svg viewBox={viewBox} className="h-auto w-full" role="img">
          <View highlight={active?.part} />
          {data.hotspots.map((hs, i) => {
            const on = i === sel;
            return (
              <g
                key={hs.id}
                onClick={() => onMarker(i)}
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

      {/* Mode buttons */}
      <div className="mt-2 flex items-center gap-2">
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
          {touring ? "Pause tour" : "Guided tour"}
        </button>
        <button
          onClick={inPractice ? resetModes : startPractice}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            inPractice
              ? "bg-sky-600 text-white"
              : "border border-sky-700 bg-ink-900 text-sky-300 hover:border-sky-500",
          )}
        >
          <Target size={14} />
          {inPractice ? "Exit practice" : "Practice"}
        </button>
        <div className="ml-auto flex items-center gap-2">
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

      {/* PRACTICE PANEL */}
      {inPractice && !practiceDone && (
        <div className="mt-2 rounded-lg border border-sky-700/50 bg-sky-950/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-sky-400">
              Find the component
            </span>
            <span className="text-[11px] text-ink-400">
              {pPos + 1} / {practice!.length} · score {pScore}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-sky-100">
            Tap: {target?.label}
          </p>
          <p
            className={cn(
              "mt-1 h-4 text-xs font-medium",
              pFeedback === "ok"
                ? "text-emerald-400"
                : pFeedback === "wrong"
                  ? "text-red-400"
                  : "text-ink-500",
            )}
          >
            {pFeedback === "ok"
              ? "Correct"
              : pFeedback === "wrong"
                ? "Not quite — try again"
                : "Tap the numbered marker on the aircraft."}
          </p>
        </div>
      )}

      {inPractice && practiceDone && (
        <div className="mt-2 rounded-lg border border-emerald-700/50 bg-emerald-950/30 p-4 text-center">
          <Check className="mx-auto mb-1 text-emerald-400" size={22} />
          <div className="text-lg font-bold text-emerald-200">
            {pScore} / {practice!.length}
          </div>
          <div className="text-xs text-ink-400">parts identified</div>
          <div className="mt-3 flex justify-center gap-2">
            <button
              onClick={startPractice}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500"
            >
              <RotateCcw size={14} /> Practice again
            </button>
            <button
              onClick={resetModes}
              className="rounded-lg border border-ink-700 bg-ink-900 px-3 py-1.5 text-xs font-semibold text-ink-300 hover:border-ink-500"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* EXPLORE PANEL (hidden during practice) */}
      {!inPractice && (
        <>
          <div className="mt-2 text-right text-[11px] text-ink-500">
            {data.caption}
          </div>
          {active ? (
            <div className="mt-1 rounded-lg border border-amber-700/50 bg-amber-950/30 p-3 [animation:var(--animate-fade-in)]">
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
                        {speaking ? (
                          <VolumeX size={15} />
                        ) : (
                          <Volume2 size={15} />
                        )}
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
            <div className="mt-1 text-center text-[11px] text-ink-500">
              Press <span className="text-emerald-400">Guided tour</span> for a
              narrated walkthrough, <span className="text-sky-400">Practice</span>{" "}
              to test yourself, or tap any marker.
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
        </>
      )}
    </div>
  );
}
