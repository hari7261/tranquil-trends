
import React, { useState } from "react";
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
import { 
  HeartPulse, 
  Leaf, 
  Moon, 
  Sun, 
  Music, 
  Bath, 
  BookOpen,
  Brain,
  Coffee,
  Utensils,
  Heart,
  Timer,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface SelfCareActivity {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  durationMinutes: number;
  category: "physical" | "mental" | "emotional" | "social";
  completed: boolean;
}

const SelfCare = () => {
  const [activities, setActivities] = useState<SelfCareActivity[]>(() => {
    const savedActivities = localStorage.getItem("selfCareActivities");
    if (savedActivities) {
      return JSON.parse(savedActivities);
    }
    
    // Default activities
    return [
      {
        id: "1",
        title: "Deep Breathing",
        description: "Take 5 minutes to practice deep, mindful breathing",
        icon: <Leaf className="h-6 w-6 text-emerald-500" />,
        durationMinutes: 5,
        category: "mental",
        completed: false
      },
      {
        id: "2",
        title: "Hydration",
        description: "Drink a glass of water and take a moment to be present",
        icon: <Coffee className="h-6 w-6 text-blue-500" />,
        durationMinutes: 2,
        category: "physical",
        completed: false
      },
      {
        id: "3",
        title: "Stretching",
        description: "Gentle stretching to release tension in your body",
        icon: <RefreshCcw className="h-6 w-6 text-purple-500" />,
        durationMinutes: 10,
        category: "physical",
        completed: false
      },
      {
        id: "4",
        title: "Gratitude",
        description: "Write down three things you're grateful for today",
        icon: <Heart className="h-6 w-6 text-red-500" />,
        durationMinutes: 5,
        category: "emotional",
        completed: false
      },
      {
        id: "5",
        title: "Mindful Eating",
        description: "Eat a snack or meal with full awareness and no distractions",
        icon: <Utensils className="h-6 w-6 text-orange-500" />,
        durationMinutes: 15,
        category: "physical",
        completed: false
      },
      {
        id: "6",
        title: "Reading",
        description: "Read a few pages of an enjoyable book",
        icon: <BookOpen className="h-6 w-6 text-indigo-500" />,
        durationMinutes: 15,
        category: "mental",
        completed: false
      },
      {
        id: "7",
        title: "Music Break",
        description: "Listen to calming or uplifting music",
        icon: <Music className="h-6 w-6 text-teal-500" />,
        durationMinutes: 10,
        category: "emotional",
        completed: false
      },
      {
        id: "8",
        title: "Digital Detox",
        description: "Take a short break from all electronic devices",
        icon: <Moon className="h-6 w-6 text-slate-500" />,
        durationMinutes: 30,
        category: "mental",
        completed: false
      }
    ];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Save activities to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("selfCareActivities", JSON.stringify(activities));
  }, [activities]);

  const markAsCompleted = (id: string) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === id) {
        return { ...activity, completed: !activity.completed };
      }
      return activity;
    });
    
    setActivities(updatedActivities);
    
    const activity = activities.find(a => a.id === id);
    if (activity) {
      if (!activity.completed) {
        toast({
          title: "Activity completed!",
          description: `You've completed "${activity.title}". Great job taking care of yourself!`,
        });
      }
    }
  };

  const resetActivities = () => {
    const resetActs = activities.map(activity => ({
      ...activity,
      completed: false
    }));
    
    setActivities(resetActs);
    
    toast({
      title: "Activities reset",
      description: "All activities have been reset for a new day.",
    });
  };

  const getCompletionPercentage = () => {
    const completed = activities.filter(a => a.completed).length;
    return Math.round((completed / activities.length) * 100);
  };

  const getTotalMinutes = () => {
    return activities.filter(a => a.completed).reduce((total, activity) => total + activity.durationMinutes, 0);
  };

  const filteredActivities = selectedCategory === "all" 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Self Care</h1>
          <p className="text-muted-foreground mt-1">
            Practices to nurture your mental and physical wellbeing
          </p>
        </section>

        <Card className="glass-card-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg md:text-xl">Daily Self-Care Progress</CardTitle>
            <CardDescription>Track your self-care journey today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Completion</span>
                <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-accent/50">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Completed</p>
                    <p className="text-xl font-bold">{activities.filter(a => a.completed).length}/{activities.length}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-primary/40" />
                </CardContent>
              </Card>
              
              <Card className="bg-accent/50">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Time Invested</p>
                    <p className="text-xl font-bold">{getTotalMinutes()} min</p>
                  </div>
                  <Timer className="h-8 w-8 text-primary/40" />
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetActivities} variant="outline" className="ml-auto">
              Reset for New Day
            </Button>
          </CardFooter>
        </Card>

        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-none">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            All Activities
          </Button>
          <Button
            variant={selectedCategory === "physical" ? "default" : "outline"}
            onClick={() => setSelectedCategory("physical")}
            className="rounded-full"
          >
            <HeartPulse className="mr-2 h-4 w-4" />
            Physical
          </Button>
          <Button
            variant={selectedCategory === "mental" ? "default" : "outline"}
            onClick={() => setSelectedCategory("mental")}
            className="rounded-full"
          >
            <Brain className="mr-2 h-4 w-4" />
            Mental
          </Button>
          <Button
            variant={selectedCategory === "emotional" ? "default" : "outline"}
            onClick={() => setSelectedCategory("emotional")}
            className="rounded-full"
          >
            <Heart className="mr-2 h-4 w-4" />
            Emotional
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className={`transition-all duration-300 ${activity.completed ? 'glass-card-primary' : 'glass-card'} hover:shadow-md`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {activity.icon}
                    <CardTitle className="text-base font-medium">{activity.title}</CardTitle>
                  </div>
                  <div className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-accent">
                    {activity.durationMinutes} min
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => markAsCompleted(activity.id)} 
                  variant={activity.completed ? "outline" : "default"}
                  className="w-full"
                >
                  {activity.completed ? "Completed ✓" : "Mark as Done"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Separator />

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Self-Care Tips</h2>
          <div className="glass-card p-4 space-y-4">
            <h3 className="font-medium">Creating a Sustainable Self-Care Routine</h3>
            <ul className="space-y-2 list-disc pl-5">
              <li>Start small with 5-minute activities and gradually increase.</li>
              <li>Be consistent rather than perfect - aim for regular practice.</li>
              <li>Set reminders or specific times for self-care activities.</li>
              <li>Track your progress to stay motivated.</li>
              <li>Adjust your routine as needed based on your changing needs.</li>
            </ul>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Learn More About Self-Care
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SelfCare;
