
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const questions = [
  "What physical sensations are you experiencing right now?",
  "What emotions are present for you in this moment?",
  "What thoughts are running through your mind?",
  "What are you grateful for today?",
  "What do you need right now to feel more balanced?",
];

const MindfulnessCheck = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [completed, setCompleted] = useState(false);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeCheck();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeCheck = () => {
    setCompleted(true);
    toast({
      title: "Mindfulness check completed",
      description: "Great job completing your mindfulness check-in!",
    });
    
    // Save to localStorage
    const date = new Date().toISOString();
    const mindfulnessData = JSON.parse(localStorage.getItem("mindfulnessChecks") || "[]");
    mindfulnessData.push({
      id: Date.now().toString(),
      date,
      answers,
    });
    localStorage.setItem("mindfulnessChecks", JSON.stringify(mindfulnessData));
  };

  const restartCheck = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(""));
    setCompleted(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Mindfulness Check</h1>
          <p className="text-muted-foreground mt-1">
            Take a moment to pause and reflect on your present experience
          </p>
        </section>

        <Card className="glass-card overflow-hidden">
          {!completed ? (
            <>
              <CardHeader className="pb-3">
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  {questions[currentQuestion]}
                </CardTitle>
                <CardDescription>
                  Take your time to reflect before answering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your answer here..."
                  value={answers[currentQuestion]}
                  onChange={handleAnswerChange}
                  className="min-h-[150px] resize-none border-primary/20 focus-visible:ring-primary/30"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={goToNextQuestion}
                  disabled={!answers[currentQuestion].trim()}
                >
                  {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="pb-3 text-center">
                <div className="mx-auto bg-primary/10 rounded-full p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-medium">
                  Mindfulness Check Completed
                </CardTitle>
                <CardDescription>
                  Thank you for taking time to be present with yourself
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">
                  By regularly checking in with yourself, you develop greater self-awareness and emotional regulation.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={restartCheck}>
                  Start New Check
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default MindfulnessCheck;
