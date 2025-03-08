
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart, ArrowLeft, ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface QuizResult {
  score: number;
  date: string;
  maxScore: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 2,
    text: "Over the past 2 weeks, how often have you had little interest or pleasure in doing things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 3,
    text: "Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 4,
    text: "Over the past 2 weeks, how often have you felt tired or had little energy?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 5,
    text: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 6,
    text: "Over the past 2 weeks, how often have you been able to stop or control worrying?",
    options: ["Nearly every day", "More than half the days", "Several days", "Not at all"],
  },
  {
    id: 7,
    text: "Over the past 2 weeks, how often have you felt good about yourself?",
    options: ["Nearly every day", "More than half the days", "Several days", "Not at all"],
  },
];

const MentalHealthQuiz = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [completed, setCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const savedResults = localStorage.getItem("quizResults");
    return savedResults ? JSON.parse(savedResults) : [];
  });

  const handleStartQuiz = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(-1));
    setCompleted(false);
  };

  const handleSelectOption = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      const score = answers.reduce((sum, value) => sum + value, 0);
      const maxScore = questions.length * 3; // 3 is the max score per question
      
      const newResult = {
        score,
        maxScore,
        date: new Date().toISOString(),
      };
      
      const updatedResults = [...quizResults, newResult];
      setQuizResults(updatedResults);
      localStorage.setItem("quizResults", JSON.stringify(updatedResults));
      
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return answers.reduce((sum, value) => sum + (value >= 0 ? value : 0), 0);
  };

  const getScoreCategory = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage <= 25) {
      return {
        label: "Low Risk",
        description: "Your responses suggest you're currently experiencing low levels of distress.",
        color: "#4ade80", // green
      };
    } else if (percentage <= 50) {
      return {
        label: "Mild Risk",
        description: "Your responses suggest you may be experiencing mild levels of distress.",
        color: "#facc15", // yellow
      };
    } else if (percentage <= 75) {
      return {
        label: "Moderate Risk",
        description: "Your responses suggest you may be experiencing moderate levels of distress.",
        color: "#fb923c", // orange
      };
    } else {
      return {
        label: "High Risk",
        description: "Your responses suggest you may be experiencing significant distress.",
        color: "#f87171", // red
      };
    }
  };

  const renderProgressChart = () => {
    if (quizResults.length === 0) return null;
    
    const latest = quizResults[quizResults.length - 1];
    const score = latest.score;
    const maxScore = latest.maxScore;
    const { label, color } = getScoreCategory(score, maxScore);
    
    const data = {
      labels: [label, ""],
      datasets: [
        {
          data: [score, maxScore - score],
          backgroundColor: [color, "#e2e8f0"],
          borderWidth: 0,
        },
      ],
    };
    
    const options = {
      cutout: "70%",
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
    };
    
    return (
      <div className="relative h-48 w-full">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <p className="text-3xl font-semibold">{Math.round((score / maxScore) * 100)}%</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="glass-card h-full overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
          Assessment
        </div>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart className="w-5 h-5 text-primary" />
          Mental Health Check
        </CardTitle>
        <CardDescription>
          {!started
            ? "Take a quick assessment to check in on your mental wellbeing"
            : !completed
            ? `Question ${currentQuestion + 1} of ${questions.length}`
            : "Your Assessment Results"}
        </CardDescription>
      </CardHeader>
      
      {!started && !completed && (
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-muted-foreground mb-6 max-w-md">
            This short quiz will help you assess your current mental health state. Your responses are stored locally and completely private.
          </p>
          <Button onClick={handleStartQuiz}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Start Assessment
          </Button>
        </CardContent>
      )}
      
      {started && !completed && (
        <>
          <CardContent className="pb-4">
            <Progress 
              value={((currentQuestion + 1) / questions.length) * 100} 
              className="mb-6 h-2" 
            />
            
            <h3 className="text-base font-medium mb-4">
              {questions[currentQuestion].text}
            </h3>
            
            <RadioGroup 
              value={answers[currentQuestion].toString()} 
              onValueChange={handleSelectOption}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={answers[currentQuestion] === -1}
            >
              {currentQuestion < questions.length - 1 ? "Next" : "Complete"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </>
      )}
      
      {completed && (
        <CardContent className="space-y-4">
          {renderProgressChart()}
          
          <div className="text-center">
            {quizResults.length > 0 && (
              <>
                <h3 className="font-medium text-lg">
                  {getScoreCategory(
                    quizResults[quizResults.length - 1].score,
                    quizResults[quizResults.length - 1].maxScore
                  ).label}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {getScoreCategory(
                    quizResults[quizResults.length - 1].score,
                    quizResults[quizResults.length - 1].maxScore
                  ).description}
                </p>
                <div className="mt-6">
                  <Button onClick={handleStartQuiz}>
                    Take Assessment Again
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default MentalHealthQuiz;
