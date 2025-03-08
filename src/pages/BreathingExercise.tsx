
import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wind, PlayCircle, PauseCircle, RotateCcw, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PHASES = [
  { name: "Inhale", duration: 4000, instruction: "Breathe in deeply" },
  { name: "Hold", duration: 4000, instruction: "Hold your breath" },
  { name: "Exhale", duration: 4000, instruction: "Breathe out slowly" },
  { name: "Rest", duration: 2000, instruction: "Pause" },
];

const PRESET_EXERCISES = [
  { 
    name: "Box Breathing", 
    description: "Equal durations for inhale, hold, exhale, and rest",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Breathe in deeply" },
      { name: "Hold", duration: 4000, instruction: "Hold your breath" },
      { name: "Exhale", duration: 4000, instruction: "Breathe out slowly" },
      { name: "Rest", duration: 4000, instruction: "Pause and reset" },
    ],
    cycles: 5,
    color: "from-blue-400 to-purple-500",
  },
  { 
    name: "4-7-8 Breathing", 
    description: "Calming technique to reduce anxiety",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Breathe in through your nose" },
      { name: "Hold", duration: 7000, instruction: "Hold your breath" },
      { name: "Exhale", duration: 8000, instruction: "Exhale completely through your mouth" },
      { name: "Rest", duration: 1000, instruction: "Prepare for next breath" },
    ],
    cycles: 4,
    color: "from-green-400 to-teal-500",
  },
  { 
    name: "Relaxing Breath", 
    description: "Gentle extended exhale for relaxation",
    phases: [
      { name: "Inhale", duration: 4000, instruction: "Breathe in gently" },
      { name: "Hold", duration: 1000, instruction: "Brief pause" },
      { name: "Exhale", duration: 6000, instruction: "Long, slow exhale" },
      { name: "Rest", duration: 2000, instruction: "Rest briefly" },
    ],
    cycles: 6,
    color: "from-purple-400 to-pink-500",
  },
];

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [cyclesTarget, setCyclesTarget] = useState(5);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showHelpText, setShowHelpText] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(PRESET_EXERCISES[0]);
  
  const animationRef = useRef<number | null>(null);
  const lastTimestamp = useRef<number | null>(null);

  // Calculate total breathing session time
  useEffect(() => {
    const phaseDurations = currentExercise.phases.reduce((total, phase) => total + phase.duration, 0);
    const totalTimeValue = phaseDurations * cyclesTarget;
    setTotalTime(totalTimeValue);
  }, [cyclesTarget, currentExercise]);

  // Animation loop
  useEffect(() => {
    if (!isActive) return;

    const animate = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const deltaTime = timestamp - lastTimestamp.current;
      lastTimestamp.current = timestamp;

      // Update elapsed time
      setElapsedTime((prevTime) => {
        const newTime = prevTime + deltaTime;
        const phaseInfo = currentExercise.phases[currentPhase];
        
        // Update progress within current phase
        setProgress((newTime % phaseInfo.duration) / phaseInfo.duration * 100);
        
        // Check if phase is complete
        if (newTime >= phaseInfo.duration) {
          // Move to next phase
          const nextPhase = (currentPhase + 1) % currentExercise.phases.length;
          setCurrentPhase(nextPhase);
          
          // If we've completed a full cycle
          if (nextPhase === 0) {
            setCyclesCompleted((prev) => {
              const newCycles = prev + 1;
              // Check if we've reached the target
              if (newCycles >= cyclesTarget) {
                setIsActive(false);
                toast({
                  title: "Breathing exercise completed",
                  description: `You completed ${cyclesTarget} cycles of breathing exercises.`,
                });
                return newCycles;
              }
              return newCycles;
            });
          }
          
          // Reset timer for new phase
          return 0;
        }
        
        return newTime;
      });

      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, currentPhase, cyclesTarget, currentExercise]);

  const handleStart = () => {
    setIsActive(true);
    setShowHelpText(false);
    lastTimestamp.current = null;
    
    // Reset if exercise was completed previously
    if (cyclesCompleted >= cyclesTarget) {
      setCyclesCompleted(0);
      setCurrentPhase(0);
      setElapsedTime(0);
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setCyclesCompleted(0);
    setProgress(0);
    setElapsedTime(0);
    lastTimestamp.current = null;
  };

  const selectExercise = (exercise: typeof PRESET_EXERCISES[0]) => {
    if (isActive) {
      handleReset();
    }
    setCurrentExercise(exercise);
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateTotalTimeRemaining = () => {
    // Calculate total time of a single cycle
    const cycleTime = currentExercise.phases.reduce((total, phase) => total + phase.duration, 0);
    
    // Calculate time spent in current cycle
    let currentCycleTime = 0;
    for (let i = 0; i < currentPhase; i++) {
      currentCycleTime += currentExercise.phases[i].duration;
    }
    currentCycleTime += elapsedTime;
    
    // Calculate remaining time in current cycle and add time for remaining full cycles
    const remainingCurrentCycle = cycleTime - currentCycleTime;
    const remainingFullCycles = cyclesTarget - cyclesCompleted - 1;
    const remainingFullCyclesTime = remainingFullCycles > 0 ? remainingFullCycles * cycleTime : 0;
    
    return remainingCurrentCycle + remainingFullCyclesTime;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Breathing Exercise</h1>
          <p className="text-muted-foreground mt-1">
            Practice guided breathing to reduce stress and anxiety
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-2">
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
                  Focus
                </div>
                <CardTitle className="text-xl font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-primary" />
                    <span>{currentExercise.name}</span>
                  </div>
                  <div className="flex items-center text-sm font-normal text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {isActive 
                        ? formatTime(calculateTotalTimeRemaining()) 
                        : formatTime(totalTime)} remaining
                    </span>
                  </div>
                </CardTitle>
                <CardDescription>{currentExercise.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="py-6">
                <div className="flex flex-col items-center justify-center">
                  {/* Breathing visualization */}
                  <div 
                    className={`relative w-48 h-48 rounded-full flex items-center justify-center mb-8
                      before:content-[''] before:absolute before:inset-0 before:rounded-full 
                      before:bg-gradient-to-r ${currentExercise.color} before:opacity-20
                      after:content-[''] after:absolute after:inset-0 after:rounded-full 
                      after:bg-gradient-to-r ${currentExercise.color} after:opacity-20
                      ${isActive ? (
                        currentPhase === 0 ? 'before:animate-[ping_4s_ease-in-out_infinite]' : 
                        currentPhase === 2 ? 'after:animate-[scale-down_4s_ease-in-out_infinite]' : ''
                      ) : ''}`}
                  >
                    <div className={`w-40 h-40 rounded-full bg-gradient-to-r ${currentExercise.color} flex items-center justify-center text-white 
                      ${isActive ? (
                        currentPhase === 0 ? 'animate-[pulse_4s_ease-in-out_infinite]' : 
                        currentPhase === 2 ? 'animate-[scale-down_4s_ease-in-out_infinite]' :
                        ''
                      ) : ''}`}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-bold mb-1">
                          {isActive ? currentExercise.phases[currentPhase].name : "Ready"}
                        </h3>
                        <p className="text-sm opacity-90">
                          {isActive 
                            ? currentExercise.phases[currentPhase].instruction 
                            : "Press start when ready"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress indicators */}
                  <div className="w-full max-w-md space-y-4 mb-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current phase</span>
                        <span>{isActive ? `${Math.round(progress)}%` : "0%"}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall progress</span>
                        <span>{`${cyclesCompleted}/${cyclesTarget} cycles`}</span>
                      </div>
                      <Progress 
                        value={(cyclesCompleted / cyclesTarget) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex space-x-4">
                    {!isActive ? (
                      <Button onClick={handleStart} className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5" />
                        {cyclesCompleted >= cyclesTarget ? "Restart" : "Start"}
                      </Button>
                    ) : (
                      <Button onClick={handlePause} variant="outline" className="flex items-center gap-2">
                        <PauseCircle className="h-5 w-5" />
                        Pause
                      </Button>
                    )}
                    
                    <Button 
                      onClick={handleReset} 
                      variant="outline" 
                      className="flex items-center gap-2"
                      disabled={cyclesCompleted === 0 && !isActive}
                    >
                      <RotateCcw className="h-5 w-5" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              {showHelpText && (
                <CardFooter className="bg-primary/5 py-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    Find a comfortable position, close your eyes, and focus on your breathing.
                    Try to clear your mind and follow the guided breathing pattern.
                  </p>
                </CardFooter>
              )}
            </Card>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Exercise Presets</h2>
            
            {PRESET_EXERCISES.map((exercise, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  currentExercise.name === exercise.name 
                    ? 'ring-2 ring-primary' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => selectExercise(exercise)}
              >
                <CardHeader className="py-4">
                  <CardTitle className="text-base">{exercise.name}</CardTitle>
                  <CardDescription className="text-xs">{exercise.description}</CardDescription>
                </CardHeader>
                <CardFooter className="py-2 border-t text-xs text-muted-foreground">
                  {exercise.cycles} cycles • {formatTime(
                    exercise.phases.reduce((total, phase) => total + phase.duration, 0) * exercise.cycles
                  )} duration
                </CardFooter>
              </Card>
            ))}
            
            <h2 className="text-lg font-medium pt-4">Exercise Settings</h2>
            <Card>
              <CardContent className="py-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Number of cycles</label>
                    <div className="flex gap-2 mt-2">
                      {[3, 5, 7, 10].map((num) => (
                        <Button
                          key={num}
                          variant={cyclesTarget === num ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (isActive) handleReset();
                            setCyclesTarget(num);
                          }}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BreathingExercise;
