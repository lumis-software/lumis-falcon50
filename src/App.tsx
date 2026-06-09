import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AccessGate } from "@/providers/AccessGate";
import { AircraftProvider } from "@/providers/AircraftProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { HomeScreen } from "@/features/home/HomeScreen";

const LearnScreen = lazy(() =>
  import("@/features/learn/LearnScreen").then((m) => ({
    default: m.LearnScreen,
  })),
);
const LessonScreen = lazy(() =>
  import("@/features/learn/LessonScreen").then((m) => ({
    default: m.LessonScreen,
  })),
);
const QuizScreen = lazy(() =>
  import("@/features/quiz/QuizScreen").then((m) => ({ default: m.QuizScreen })),
);
const MissedScreen = lazy(() =>
  import("@/features/quiz/MissedScreen").then((m) => ({
    default: m.MissedScreen,
  })),
);
const StudyScreen = lazy(() =>
  import("@/features/study/StudyScreen").then((m) => ({
    default: m.StudyScreen,
  })),
);
const MemoryScreen = lazy(() =>
  import("@/features/memory/MemoryScreen").then((m) => ({
    default: m.MemoryScreen,
  })),
);
const LimitsScreen = lazy(() =>
  import("@/features/limits/LimitsScreen").then((m) => ({
    default: m.LimitsScreen,
  })),
);
const ProceduresScreen = lazy(() =>
  import("@/features/procedures/ProceduresScreen").then((m) => ({
    default: m.ProceduresScreen,
  })),
);
const OralScreen = lazy(() =>
  import("@/features/oral/OralScreen").then((m) => ({ default: m.OralScreen })),
);
const SystemsScreen = lazy(() =>
  import("@/features/systems/SystemsScreen").then((m) => ({
    default: m.SystemsScreen,
  })),
);
const DifferencesScreen = lazy(() =>
  import("@/features/differences/DifferencesScreen").then((m) => ({
    default: m.DifferencesScreen,
  })),
);
const PhasesScreen = lazy(() =>
  import("@/features/phases/PhasesScreen").then((m) => ({
    default: m.PhasesScreen,
  })),
);
const TrainerScreen = lazy(() =>
  import("@/features/trainer/TrainerScreen").then((m) => ({
    default: m.TrainerScreen,
  })),
);

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-ink-500">
      <div className="size-8 animate-spin rounded-full border-2 border-ink-700 border-t-brand-500" />
    </div>
  );
}

export default function App() {
  return (
    <AccessGate>
      <AuthProvider>
        <AircraftProvider>
          <BrowserRouter basename={basename}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/learn" element={<LearnScreen />} />
              <Route path="/learn/:id" element={<LessonScreen />} />
              <Route path="/quiz" element={<QuizScreen />} />
              <Route path="/study" element={<StudyScreen />} />
              <Route path="/memory" element={<MemoryScreen />} />
              <Route path="/limits" element={<LimitsScreen />} />
              <Route path="/systems" element={<SystemsScreen />} />
              <Route path="/trainer" element={<TrainerScreen />} />
              <Route path="/phases" element={<PhasesScreen />} />
              <Route path="/procedures" element={<ProceduresScreen />} />
              <Route path="/oral" element={<OralScreen />} />
              <Route path="/differences" element={<DifferencesScreen />} />
              <Route path="/missed" element={<MissedScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          </BrowserRouter>
        </AircraftProvider>
      </AuthProvider>
    </AccessGate>
  );
}
