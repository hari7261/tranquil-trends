import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          } />
          <Route path="/journal/new" element={
            <ProtectedRoute>
              <JournalNew />
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          } />
          <Route path="/breathing" element={
            <ProtectedRoute>
              <BreathingExercise />
            </ProtectedRoute>
          } />
          <Route path="/mindfulness" element={
            <ProtectedRoute>
              <MindfulnessCheck />
            </ProtectedRoute>
          } />
          <Route path="/reminders" element={
            <ProtectedRoute>
              <DailyReminder />
            </ProtectedRoute>
          } />
          <Route path="/self-care" element={
            <ProtectedRoute>
              <SelfCare />
            </ProtectedRoute>
          } />
          <Route path="/chatbot" element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } />
          <Route path="/meditation" element={
            <ProtectedRoute>
              <MeditationPage />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
