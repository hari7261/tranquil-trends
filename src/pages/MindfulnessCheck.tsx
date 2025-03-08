
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Emotion {
  name: string;
  emoji: string;
  color: string;
}

const emotions: Emotion[] = [
  { name: "Calm", emoji: "😌", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "Happy", emoji: "😊", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { name: "Grateful", emoji: "🙏", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { name: "Anxious", emoji: "😰", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { name: "Stressed", emoji: "😓", color: "bg-red-100 text-red-700 border-red-200" },
  { name: "Tired", emoji: "😴", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { name: "Frustrated", emoji: "😤", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { name: "Sad", emoji: "😢", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { name: "Excited", emoji: "🤩", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { name: "Peaceful", emoji: "🧘", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { name: "Overwhelmed", emoji: "🥴", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { name: "Content", emoji: "🙂", color: "bg-teal-100 text-teal-700 border-teal-200" },
];

interface CheckInEntry {
  date: string;
  emotion: Emotion;
  thoughts: string;
}

const MindfulnessCheck = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [thoughts, setThoughts] = useState("");
  const [entries, setEntries] = useState<CheckInEntry[]>(() => {
    const savedEntries = localStorage.getItem("mindfulnessEntries");
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  const [timer, setTimer] = useState(60); // 60 seconds for mindfulness
  const [timerActive, setTimerActive] = useState(false);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem("mindfulnessEntries", JSON.stringify(entries));
  }, [entries]);

  // Timer logic
  useEffect(() => {
    let interval: number | null = null;
    
    if (timerActive && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      toast({
        title: "Mindfulness session complete",
        description: "Great job taking a moment for yourself.",
      });
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timer]);

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedEmotion) {
      toast({
        title: "Please select an emotion",
        description: "Select how you're feeling right now to continue.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3) {
      // Save the check-in
      if (selectedEmotion) {
        const newEntry: CheckInEntry = {
          date: new Date().toISOString(),
          emotion: selectedEmotion,
          thoughts: thoughts,
        };
        
        setEntries([newEntry, ...entries]);
        
        // Update self-care activity if it exists
        try {
          const selfCareActivities = localStorage.getItem("selfCareActivities");
          if (selfCareActivities) {
            const activities = JSON.parse(selfCareActivities);
            const updatedActivities = activities.map((activity: any) => {
              if (activity.title === "Mindfulness Check") {
                return { ...activity, completed: true };
              }
              return activity;
            });
            localStorage.setItem("selfCareActivities", JSON.stringify(updatedActivities));
          }
        } catch (error) {
          console.error("Error updating self-care activities:", error);
        }
        
        toast({
          title: "Check-in recorded",
          description: "Your mindfulness check-in has been saved.",
        });
      }
    }
    
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetCheckIn = () => {
    setSelectedEmotion(null);
    setThoughts("");
    setCurrentStep(1);
    setTimer(60);
    setTimerActive(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Mindfulness Check</h1>
            <p className="text-muted-foreground mt-1">
              Take a moment to reflect on your current state of mind
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </section>

        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3">
            <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
              Step {currentStep} of {currentStep >= 4 ? 3 : 3}
            </div>
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {currentStep === 1 && "How are you feeling?"}
              {currentStep === 2 && "Take a mindful minute"}
              {currentStep === 3 && "Reflect on your thoughts"}
              {currentStep >= 4 && "Check-in complete"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Select the emotion that best describes how you feel right now"}
              {currentStep === 2 && "Focus on your breath and observe your thoughts without judgment"}
              {currentStep === 3 && "Write down any observations about your current mental state"}
              {currentStep >= 4 && "Thank you for taking time for your mental wellbeing"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-6">
            {currentStep === 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {emotions.map((emotion) => (
                  <button
                    key={emotion.name}
                    onClick={() => handleEmotionSelect(emotion)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                      selectedEmotion?.name === emotion.name 
                        ? `${emotion.color} ring-2 ring-primary/40` 
                        : "bg-card hover:bg-accent/50"
                    } transition-all duration-200`}
                  >
                    <span className="text-2xl mb-1">{emotion.emoji}</span>
                    <span className="text-sm">{emotion.name}</span>
                  </button>
                ))}
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-48 h-48 mb-6">
                  <div className={`absolute inset-0 rounded-full bg-primary/10 transition-all duration-1000 ${
                    timerActive ? 'animate-pulse' : ''
                  }`}></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-3xl font-bold">{formatTime(timer)}</p>
                    <p className="text-sm text-muted-foreground">seconds</p>
                  </div>
                </div>
                
                <div className="text-center space-y-6 max-w-md mx-auto mb-6">
                  <p>Take a minute to focus on your breath. Inhale deeply through your nose, hold briefly, then exhale slowly through your mouth.</p>
                  <Button 
                    onClick={() => setTimerActive(!timerActive)}
                    variant={timerActive ? "outline" : "default"}
                    className="w-32"
                  >
                    {timerActive ? "Pause" : timer < 60 ? "Resume" : "Start"}
                  </Button>
                  
                  {timer < 60 && timer > 0 && !timerActive && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setTimer(60)}
                      className="ml-2"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-4">
                {selectedEmotion && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-md ${selectedEmotion.color}`}>
                      <span className="text-2xl">{selectedEmotion.emoji}</span>
                    </div>
                    <p>You're feeling <strong>{selectedEmotion.name}</strong></p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="thoughts">What's on your mind right now?</Label>
                  <Textarea
                    id="thoughts"
                    placeholder="Write your thoughts here..."
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            )}
            
            {currentStep >= 4 && (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Check-in Complete!</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You've successfully completed your mindfulness check-in. Taking these moments for yourself is an important part of your mental wellbeing journey.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={resetCheckIn}>
                    New Check-in
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/')}>
                    Return Home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          {currentStep < 4 && (
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button 
                onClick={handleNextStep}
                disabled={currentStep === 2 && timer === 60}
              >
                {currentStep === 3 ? "Complete" : "Next"}
              </Button>
            </CardFooter>
          )}
        </Card>

        {currentStep >= 4 && entries.length > 0 && (
          <>
            <Separator />
            
            <section>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Previous Check-ins</h2>
              <div className="space-y-4">
                {entries.slice(0, 3).map((entry, index) => (
                  <Card key={index} className="glass-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${entry.emotion.color}`}>
                            <span className="text-xl">{entry.emotion.emoji}</span>
                          </div>
                          <CardTitle className="text-base">{entry.emotion.name}</CardTitle>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleString()}
                        </div>
                      </div>
                    </CardHeader>
                    {entry.thoughts && (
                      <CardContent>
                        <p className="text-sm">{entry.thoughts}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
                
                {entries.length > 3 && (
                  <Button variant="outline" className="w-full">
                    View All Check-ins
                  </Button>
                )}
              </div>
            </section>
          </>
        )}

        <Separator />
        
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Benefits of Mindfulness</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Improved Focus</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Regular mindfulness practice enhances concentration and attention span.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Stress Reduction</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mindfulness helps lower stress hormone levels and improves emotional regulation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Present Awareness</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Being mindful helps you stay present rather than dwelling on the past or worrying about the future.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default MindfulnessCheck;
