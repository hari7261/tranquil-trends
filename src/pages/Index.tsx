
import React from "react";
import Layout from "@/components/Layout";
import MoodTracker from "@/components/MoodTracker";
import JournalEntry from "@/components/JournalEntry";
import MoodChart from "@/components/MoodChart";
import ReminderCard from "@/components/ReminderCard";
import { Bell, Brain, HeartPulse, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1">
            Track your mental wellbeing and develop healthy habits
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <MoodTracker />
            <JournalEntry />
          </div>
          
          <div className="flex flex-col gap-6">
            <MoodChart />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReminderCard
                title="Breathing Exercise"
                description="Take 5 minutes to center yourself with deep breathing"
                icon={<Sparkles className="h-4 w-4" />}
                time="5 min"
              />
              <ReminderCard
                title="Mindfulness Check"
                description="Pause and reflect on your present emotions"
                icon={<Brain className="h-4 w-4" />}
                time="2 min"
              />
              <ReminderCard
                title="Daily Reminder"
                description="Schedule your evening reflection session"
                icon={<Bell className="h-4 w-4" />}
                actionText="Set Time"
              />
              <ReminderCard
                title="Self Care"
                description="Remember to prioritize your wellbeing today"
                icon={<HeartPulse className="h-4 w-4" />}
                actionText="View Tips"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
