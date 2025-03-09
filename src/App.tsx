
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Journal from "./pages/Journal";
import JournalNew from "./pages/JournalNew";
import Stats from "./pages/Stats";
import BreathingExercise from "./pages/BreathingExercise";
import MindfulnessCheck from "./pages/MindfulnessCheck";
import DailyReminder from "./pages/DailyReminder";
import SelfCare from "./pages/SelfCare";
import Chatbot from "./pages/Chatbot";
import MeditationPage from "./pages/MeditationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/new" element={<JournalNew />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/breathing" element={<BreathingExercise />} />
          <Route path="/mindfulness" element={<MindfulnessCheck />} />
          <Route path="/reminders" element={<DailyReminder />} />
          <Route path="/self-care" element={<SelfCare />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/meditation" element={<MeditationPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
