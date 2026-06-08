import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AircraftProvider } from "@/providers/AircraftProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { HomeScreen } from "@/features/home/HomeScreen";
import { QuizScreen } from "@/features/quiz/QuizScreen";
import { ComingSoon } from "@/features/ComingSoon";

export default function App() {
  return (
    <AuthProvider>
      <AircraftProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/quiz" element={<QuizScreen />} />
            <Route path="/study" element={<ComingSoon title="Study Mode" />} />
            <Route path="/memory" element={<ComingSoon title="Memory Items" />} />
            <Route path="/limits" element={<ComingSoon title="Limitations" />} />
            <Route path="/systems" element={<ComingSoon title="Systems & Schematics" />} />
            <Route path="/trainer" element={<ComingSoon title="Procedure Trainer" />} />
            <Route path="/phases" element={<ComingSoon title="Live Flight Phases" />} />
            <Route path="/procedures" element={<ComingSoon title="Procedures" />} />
            <Route path="/oral" element={<ComingSoon title="Checkride Oral Prep" />} />
            <Route path="/differences" element={<ComingSoon title="Differences & Specs" />} />
            <Route path="/missed" element={<ComingSoon title="Review Missed" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AircraftProvider>
    </AuthProvider>
  );
}
