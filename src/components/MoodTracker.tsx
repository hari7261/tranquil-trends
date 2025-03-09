
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smile, Meh, Frown, Heart, Angry } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveMoodEntry } from "@/services/localStorage";
import { toast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";

type Mood = "great" | "good" | "okay" | "bad" | "awful";

const moodEmojis = {
  great: { icon: Smile, color: "text-emerald-500", bg: "bg-emerald-100" },
  good: { icon: Smile, color: "text-teal-500", bg: "bg-teal-100" },
  okay: { icon: Meh, color: "text-yellow-500", bg: "bg-yellow-100" },
  bad: { icon: Frown, color: "text-orange-500", bg: "bg-orange-100" },
  awful: { icon: Angry, color: "text-red-500", bg: "bg-red-100" },
};

const moodValues = {
  great: 5,
  good: 4,
  okay: 3,
  bad: 2,
  awful: 1,
};

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { playSound } = useSound();

  const handleMoodSelect = (mood: Mood) => {
    playSound("click");
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    setSubmitting(true);
    playSound("transition");
    
    // Save to localStorage
    const moodValue = moodValues[selectedMood];
    saveMoodEntry(moodValue, selectedMood);
    
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      toast({
        title: "Mood recorded",
        description: `We've saved your ${selectedMood} mood for today.`,
      });
      
      // Reset after showing success
      setTimeout(() => {
        setSubmitted(false);
        setSelectedMood(null);
      }, 2000);
    }, 800);
  };

  return (
    <Card className="glass-card overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
          Daily Check-in
        </div>
        <CardTitle className="text-lg font-medium">How are you feeling today?</CardTitle>
        <CardDescription>Select the emoji that best represents your mood</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center gap-1 sm:gap-3 my-4">
          {(Object.keys(moodEmojis) as Mood[]).map((mood) => {
            const { icon: Icon, color, bg } = moodEmojis[mood];
            return (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:scale-110",
                  selectedMood === mood ? `${bg} ring-2 ring-primary/40 scale-110` : "bg-white/60"
                )}
              >
                <Icon 
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 transition-all", 
                    selectedMood === mood ? color : "text-muted-foreground"
                  )} 
                />
                <span className="text-xs mt-1 first-letter:uppercase">{mood}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full transition-all" 
          disabled={!selectedMood || submitting}
          onClick={handleSubmit}
        >
          {submitted ? "Mood Recorded!" : submitting ? "Saving..." : "Record Mood"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoodTracker;
