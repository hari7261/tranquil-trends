
import React, { useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Check, Sparkles, Brain, Wind, BookText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SelfCareActivity {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  duration: string;
  link?: string;
  completed?: boolean;
}

const SelfCare = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<SelfCareActivity[]>([
    {
      id: "1",
      title: "Breathing Exercise",
      description: "Practice deep breathing to reduce stress and anxiety",
      icon: <Wind className="h-5 w-5" />,
      duration: "5 min",
      link: "/breathing",
      completed: false,
    },
    {
      id: "2",
      title: "Mindfulness Check",
      description: "Take a moment to observe your thoughts and feelings",
      icon: <Brain className="h-5 w-5" />,
      duration: "2 min",
      link: "/mindfulness",
      completed: false,
    },
    {
      id: "3",
      title: "Journal Reflection",
      description: "Write down your thoughts to gain clarity",
      icon: <BookText className="h-5 w-5" />,
      duration: "10 min",
      link: "/journal/new",
      completed: false,
    },
    {
      id: "4",
      title: "Gratitude Practice",
      description: "List three things you're grateful for today",
      icon: <Sparkles className="h-5 w-5" />,
      duration: "3 min",
      completed: false,
    },
    {
      id: "5",
      title: "Body Scan",
      description: "Bring awareness to each part of your body",
      icon: <HeartPulse className="h-5 w-5" />,
      duration: "8 min",
      completed: false,
    },
  ]);

  const toggleCompleted = (id: string) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const handleActivityClick = (activity: SelfCareActivity) => {
    if (activity.link) {
      navigate(activity.link);
    } else {
      toggleCompleted(activity.id);
    }
  };

  const completedCount = activities.filter(a => a.completed).length;

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Self Care</h1>
          <p className="text-muted-foreground mt-1">
            Activities to nurture your mental and emotional wellbeing
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card-primary overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-primary" />
                Daily Self-Care Activities
              </CardTitle>
              <CardDescription>
                {completedCount} of {activities.length} activities completed today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`flex items-center justify-between p-3 rounded-md border transition-all hover:bg-accent cursor-pointer ${
                      activity.completed
                        ? "border-primary/30 bg-primary/10"
                        : "border-muted"
                    }`}
                    onClick={() => handleActivityClick(activity)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{activity.icon}</div>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{activity.duration}</span>
                      {activity.completed ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : activity.link ? (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Start
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Self-Care Tips</CardTitle>
              <CardDescription>
                Incorporate these practices into your daily routine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Practice mindfulness</strong>: Take a few minutes each day to be fully present and aware.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Move your body</strong>: Even a short walk can improve your mood and energy levels.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Connect with others</strong>: Social connection is vital for mental wellbeing.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Get enough rest</strong>: Quality sleep is essential for mental health.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Set boundaries</strong>: Learn to say no to demands that overwhelm you.
                  </span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/breathing")}
              >
                <Wind className="mr-2 h-4 w-4" />
                Try a Breathing Exercise
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SelfCare;
