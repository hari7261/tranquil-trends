
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wind, Play, Pause, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BreathingExercise = () => {
  const [status, setStatus] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const startExercise = () => {
    setStatus("inhale");
    setSecondsLeft(4); // Start with inhale for 4 seconds
    setIsActive(true);
    toast({
      title: "Exercise started",
      description: "Follow the circle's rhythm for deep breathing",
    });
  };

  const pauseExercise = () => {
    setIsActive(prev => !prev);
  };

  const resetExercise = () => {
    setStatus("idle");
    setSecondsLeft(0);
    setIsActive(false);
    setCompletedCycles(0);
  };

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Transition to next phase
            if (status === "inhale") {
              setStatus("hold");
              return 7; // Hold for 7 seconds
            } else if (status === "hold") {
              setStatus("exhale");
              return 8; // Exhale for 8 seconds
            } else if (status === "exhale") {
              setStatus("inhale");
              setCompletedCycles(prev => prev + 1);
              return 4; // Back to inhale
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, status]);

  // Animation size mapping based on breathing phase
  const getCircleSize = () => {
    if (status === "idle") return "w-40 h-40";
    if (status === "inhale") return "w-60 h-60";
    if (status === "hold") return "w-60 h-60";
    if (status === "exhale") return "w-40 h-40";
    return "w-40 h-40";
  };

  const getInstructions = () => {
    if (status === "idle") return "Press start when ready";
    if (status === "inhale") return "Breathe in...";
    if (status === "hold") return "Hold...";
    if (status === "exhale") return "Breathe out...";
    return "";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">4-7-8 Breathing Exercise</h1>
          <p className="text-muted-foreground mt-1">
            A simple technique to help reduce anxiety and promote relaxation
          </p>
        </section>

        <Card className="glass-card overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="flex flex-col items-center justify-center">
                <div className="text-sm text-muted-foreground mb-8">
                  {status !== "idle" && (
                    <span className="font-medium">
                      Cycle {completedCycles} • {secondsLeft}s
                    </span>
                  )}
                </div>

                <div 
                  className={`${getCircleSize()} rounded-full flex items-center justify-center bg-primary/10 border-4 border-primary/30 transition-all duration-1000 ease-in-out`}
                >
                  <Wind className="h-12 w-12 text-primary" />
                </div>
                
                <div className="mt-8 text-center">
                  <h3 className="text-xl font-medium">{getInstructions()}</h3>
                </div>
              </div>

              <div className="flex space-x-4">
                {status === "idle" ? (
                  <Button onClick={startExercise} className="px-8">
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseExercise} variant="outline">
                      {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                      {isActive ? "Pause" : "Resume"}
                    </Button>
                    <Button onClick={resetExercise} variant="secondary">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </>
                )}
              </div>

              <div className="max-w-md text-sm text-muted-foreground text-center">
                <p>
                  The 4-7-8 breathing technique involves breathing in for 4 seconds, holding for 7 seconds, and exhaling for 8 seconds. This pattern helps reduce anxiety and may help with sleep.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BreathingExercise;
