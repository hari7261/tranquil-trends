
import React, { useState, useEffect, useRef } from "react";
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
import { ArrowLeft, Play, Pause, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const INHALE_TIME = 4; // seconds
const HOLD_TIME = 7; // seconds
const EXHALE_TIME = 8; // seconds
const PAUSE_TIME = 1; // seconds

type BreathState = "inhale" | "hold" | "exhale" | "pause";

const BreathingExercise = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathState>("inhale");
  const [timeLeft, setTimeLeft] = useState(INHALE_TIME);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const circleRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  // Breathing cycle logic
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            // Move to next phase when time is up
            let nextPhase: BreathState;
            let nextTime: number;
            
            switch (currentPhase) {
              case "inhale":
                nextPhase = "hold";
                nextTime = HOLD_TIME;
                if (soundEnabled && audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                }
                break;
              case "hold":
                nextPhase = "exhale";
                nextTime = EXHALE_TIME;
                if (soundEnabled && audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                }
                break;
              case "exhale":
                nextPhase = "pause";
                nextTime = PAUSE_TIME;
                if (soundEnabled && audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                }
                break;
              case "pause":
                nextPhase = "inhale";
                nextTime = INHALE_TIME;
                setCompletedCycles(prev => prev + 1);
                break;
              default:
                nextPhase = "inhale";
                nextTime = INHALE_TIME;
            }
            
            setCurrentPhase(nextPhase);
            return nextTime;
          }
          return prevTimeLeft - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isActive, currentPhase, soundEnabled]);

  // Check if we've completed all cycles
  useEffect(() => {
    if (completedCycles >= targetCycles && isActive) {
      setIsActive(false);
      toast({
        title: "Exercise Complete!",
        description: `You've completed ${targetCycles} breathing cycles. Great job!`,
      });
      
      // Save the activity completion to localStorage
      try {
        const selfCareActivities = localStorage.getItem("selfCareActivities");
        if (selfCareActivities) {
          const activities = JSON.parse(selfCareActivities);
          const updatedActivities = activities.map((activity: any) => {
            if (activity.title === "Deep Breathing") {
              return { ...activity, completed: true };
            }
            return activity;
          });
          localStorage.setItem("selfCareActivities", JSON.stringify(updatedActivities));
        }
      } catch (error) {
        console.error("Error updating self-care activities:", error);
      }
    }
  }, [completedCycles, targetCycles, isActive]);

  // Animation for the breathing circle
  useEffect(() => {
    if (!circleRef.current) return;
    
    const circle = circleRef.current;
    
    if (currentPhase === "inhale") {
      circle.style.transform = "scale(1.5)";
      circle.style.transition = `transform ${INHALE_TIME}s ease-in-out`;
    } else if (currentPhase === "hold") {
      circle.style.transform = "scale(1.5)";
      circle.style.transition = "none";
    } else if (currentPhase === "exhale") {
      circle.style.transform = "scale(1)";
      circle.style.transition = `transform ${EXHALE_TIME}s ease-in-out`;
    } else {
      circle.style.transform = "scale(1)";
      circle.style.transition = "none";
    }
  }, [currentPhase]);

  const toggleActive = () => {
    if (!isActive && completedCycles >= targetCycles) {
      // Reset if we're starting again after completing all cycles
      setCompletedCycles(0);
    }
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setTimeLeft(INHALE_TIME);
    setCompletedCycles(0);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case "inhale": return "Inhale";
      case "hold": return "Hold";
      case "exhale": return "Exhale";
      case "pause": return "Rest";
      default: return "";
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case "inhale": return "Breathe in slowly through your nose";
      case "hold": return "Hold your breath";
      case "exhale": return "Breathe out slowly through your mouth";
      case "pause": return "Pause briefly before the next breath";
      default: return "";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Breathing Exercise</h1>
            <p className="text-muted-foreground mt-1">
              4-7-8 breathing technique for relaxation and stress reduction
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </section>

        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg md:text-xl">Guided Breathing</CardTitle>
            <CardDescription>Follow the animation and instructions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center w-48 h-48 mb-8">
              <div
                ref={circleRef}
                className="absolute w-32 h-32 bg-primary/20 backdrop-blur-lg rounded-full"
              ></div>
              <div className="absolute pointer-events-none flex flex-col items-center justify-center text-center z-10">
                <h3 className="text-2xl font-bold mb-1">{getPhaseText()}</h3>
                <p className="text-sm text-muted-foreground">{timeLeft}s</p>
              </div>
            </div>
            
            <p className="text-center mb-6">{getPhaseDescription()}</p>
            
            <div className="flex flex-col items-center gap-2 mb-6">
              <p className="text-sm font-medium">Cycles Completed</p>
              <div className="flex gap-1">
                {Array.from({ length: targetCycles }).map((_, index) => (
                  <div 
                    key={index}
                    className={`w-6 h-2 rounded-full ${
                      index < completedCycles ? 'bg-primary' : 'bg-muted'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={toggleActive} 
                className="w-32"
                variant={isActive ? "outline" : "default"}
              >
                {isActive ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={resetExercise}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button variant="ghost" size="icon" onClick={toggleSound}>
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Benefits of 4-7-8 Breathing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Reduces Anxiety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This technique helps activate the parasympathetic nervous system, reducing feelings of anxiety and stress.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Improves Sleep</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Regular practice can help you fall asleep faster and improve overall sleep quality.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Enhances Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  By calming the mind, this breathing exercise can improve concentration and mental clarity.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      
      <audio ref={audioRef} src="https://cdn.pixabay.com/download/audio/2021/08/08/audio_012e4ece50.mp3?filename=bells-audio-30s-7407.mp3" />
    </Layout>
  );
};

export default BreathingExercise;
