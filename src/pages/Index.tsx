
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import MoodTracker from "@/components/MoodTracker";
import JournalEntry from "@/components/JournalEntry";
import MoodChart from "@/components/MoodChart";
import ReminderCard from "@/components/ReminderCard";
import HabitTracker from "@/components/HabitTracker";
import DashboardOverview from "@/components/DashboardOverview";
import MentalHealthQuiz from "@/components/MentalHealthQuiz";
import { Bell, Brain, HeartPulse, Sparkles, Wind, BookText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    // Get user name from localStorage
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setName(savedName);
    }
    
    // Load any previous session data
    const lastVisit = localStorage.getItem("lastVisit");
    if (!lastVisit || new Date().toDateString() !== new Date(lastVisit).toDateString()) {
      // Show welcome message if first visit of the day
      setTimeout(() => {
        toast({
          title: "Welcome back!",
          description: "Remember to check in with your mood today.",
        });
      }, 1000);
      
      // Update last visit timestamp
      localStorage.setItem("lastVisit", new Date().toISOString());
    }
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">
            {name ? `Welcome back, ${name}` : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your mental wellbeing and develop healthy habits
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardOverview />
          </div>
          
          <div className="space-y-6">
            <MoodTracker />
            <MentalHealthQuiz />
          </div>
        </div>
        
        <Separator />
        
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Daily Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ReminderCard
              title="Breathing Exercise"
              description="Take 5 minutes to center yourself with deep breathing"
              icon={<Wind className="h-4 w-4" />}
              time="5 min"
              actionPath="/breathing"
            />
            <ReminderCard
              title="Mindfulness Check"
              description="Pause and reflect on your present emotions"
              icon={<Brain className="h-4 w-4" />}
              time="2 min"
              actionPath="/mindfulness"
            />
            <ReminderCard
              title="Daily Reminder"
              description="Schedule your evening reflection session"
              icon={<Bell className="h-4 w-4" />}
              actionText="Set Time"
              actionPath="/reminders"
            />
            <ReminderCard
              title="Self Care"
              description="Remember to prioritize your wellbeing today"
              icon={<HeartPulse className="h-4 w-4" />}
              actionText="View Tips"
              actionPath="/self-care"
            />
          </div>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <JournalEntry />
          </div>
          
          <div>
            <HabitTracker />
          </div>
        </div>
        
        <section className="pt-6 text-center">
          <p className="text-muted-foreground">
            Need someone to talk to? Our AI assistant is here to help.
          </p>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
