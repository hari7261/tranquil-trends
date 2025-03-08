
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, ArrowUp, ArrowDown, Heart, Calendar, TrendingUp } from "lucide-react";

interface MoodData {
  day: string;
  value: number;
  mood: string;
}

interface QuizResult {
  score: number;
  date: string;
  maxScore: number;
}

interface HabitActivity {
  date: string;
  completion: number;
}

// Custom formatter for timestamps
const dateFormatter = (timestamp: string) => {
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const DashboardOverview = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [quizData, setQuizData] = useState<{ date: string; percentage: number }[]>([]);
  const [habitData, setHabitData] = useState<HabitActivity[]>([]);
  const [overallTrend, setOverallTrend] = useState<"up" | "down" | "stable">("stable");
  const [avgMood, setAvgMood] = useState(0);

  useEffect(() => {
    // Load mood data from localStorage
    const savedMoodEntries = localStorage.getItem("moodEntries");
    if (savedMoodEntries) {
      const parsedEntries = JSON.parse(savedMoodEntries);
      
      // Convert to format needed for the chart
      const formattedMoodData = parsedEntries.map((entry: any) => ({
        day: new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' }),
        value: entry.value,
        mood: entry.mood,
        date: entry.date,
      }));
      
      setMoodData(formattedMoodData);
      
      // Calculate average mood
      if (formattedMoodData.length > 0) {
        const sum = formattedMoodData.reduce((acc: number, item: MoodData) => acc + item.value, 0);
        setAvgMood(Number((sum / formattedMoodData.length).toFixed(1)));
        
        // Determine trend (simplified)
        if (formattedMoodData.length > 1) {
          const first = formattedMoodData[0].value;
          const last = formattedMoodData[formattedMoodData.length - 1].value;
          setOverallTrend(last > first ? "up" : last < first ? "down" : "stable");
        }
      }
    } else {
      // If no saved data, use mock data
      const mockMoodData = [
        { day: "Mon", value: 3, mood: "okay", date: "2023-06-01" },
        { day: "Tue", value: 4, mood: "good", date: "2023-06-02" },
        { day: "Wed", value: 2, mood: "bad", date: "2023-06-03" },
        { day: "Thu", value: 5, mood: "great", date: "2023-06-04" },
        { day: "Fri", value: 4, mood: "good", date: "2023-06-05" },
        { day: "Sat", value: 3, mood: "okay", date: "2023-06-06" },
        { day: "Sun", value: 4, mood: "good", date: "2023-06-07" },
      ];
      setMoodData(mockMoodData);
      
      // Calculate average mood from mock data
      const sum = mockMoodData.reduce((acc, item) => acc + item.value, 0);
      setAvgMood(Number((sum / mockMoodData.length).toFixed(1)));
      setOverallTrend("up");
    }
    
    // Load quiz results
    const savedQuizResults = localStorage.getItem("quizResults");
    if (savedQuizResults) {
      const parsedResults = JSON.parse(savedQuizResults);
      const formattedQuizData = parsedResults.map((result: QuizResult) => ({
        date: dateFormatter(result.date),
        percentage: Math.round((result.score / result.maxScore) * 100),
      }));
      setQuizData(formattedQuizData);
    } else {
      // Mock quiz data
      setQuizData([
        { date: "Jun 1", percentage: 65 },
        { date: "Jun 8", percentage: 58 },
        { date: "Jun 15", percentage: 49 },
        { date: "Jun 22", percentage: 42 },
      ]);
    }
    
    // Load habit data
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      // Process habit data to get completion percentages by date
      const habits = JSON.parse(savedHabits);
      const dateMap = new Map<string, { completed: number; total: number }>();
      
      habits.forEach((habit: any) => {
        Object.entries(habit.daysCompleted).forEach(([date, completed]) => {
          if (!dateMap.has(date)) {
            dateMap.set(date, { completed: 0, total: 0 });
          }
          
          const entry = dateMap.get(date)!;
          if (completed) {
            entry.completed += 1;
          }
          entry.total += 1;
        });
      });
      
      const habitActivity: HabitActivity[] = Array.from(dateMap.entries())
        .map(([date, stats]) => ({
          date: dateFormatter(date),
          completion: Math.round((stats.completed / stats.total) * 100),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setHabitData(habitActivity);
    } else {
      // Mock habit data
      setHabitData([
        { date: "Jun 1", completion: 50 },
        { date: "Jun 2", completion: 75 },
        { date: "Jun 3", completion: 33 },
        { date: "Jun 4", completion: 100 },
        { date: "Jun 5", completion: 67 },
        { date: "Jun 6", completion: 83 },
        { date: "Jun 7", completion: 50 },
      ]);
    }
  }, []);

  return (
    <Card className="glass-card h-full overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
          Overview
        </div>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Mental Health Dashboard
        </CardTitle>
        <CardDescription>Visualizing your mental wellness trends</CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-accent/50">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium mb-1">Average Mood</p>
                <p className="text-2xl font-bold">{avgMood}/5</p>
                <div className="flex items-center text-xs mt-1">
                  {overallTrend === "up" ? (
                    <>
                      <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">Improving</span>
                    </>
                  ) : overallTrend === "down" ? (
                    <>
                      <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                      <span className="text-red-500">Declining</span>
                    </>
                  ) : (
                    <span className="text-orange-500">Stable</span>
                  )}
                </div>
              </div>
              <Heart className="h-10 w-10 text-primary/40" />
            </CardContent>
          </Card>
          
          <Card className="bg-accent/50">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium mb-1">Assessment Score</p>
                <p className="text-2xl font-bold">
                  {quizData.length > 0 
                    ? `${quizData[quizData.length - 1].percentage}%` 
                    : "N/A"}
                </p>
                <div className="flex items-center text-xs mt-1">
                  {quizData.length > 1 && (
                    <>
                      {quizData[quizData.length - 1].percentage < 
                       quizData[quizData.length - 2].percentage ? (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500">Improving</span>
                        </>
                      ) : (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3 text-orange-500" />
                          <span className="text-orange-500">Increasing</span>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <TrendingUp className="h-10 w-10 text-primary/40" />
            </CardContent>
          </Card>
          
          <Card className="bg-accent/50">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium mb-1">Habit Adherence</p>
                <p className="text-2xl font-bold">
                  {habitData.length > 0
                    ? `${habitData[habitData.length - 1].completion}%`
                    : "N/A"}
                </p>
                <div className="flex items-center text-xs mt-1">
                  <Calendar className="mr-1 h-3 w-3 text-blue-500" />
                  <span className="text-blue-500">Last 7 days</span>
                </div>
              </div>
              <Calendar className="h-10 w-10 text-primary/40" />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Mood Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    domain={[1, 5]} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Assessment History</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={quizData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))'
                      }}
                    />
                    <Bar dataKey="percentage" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Habit Completion</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={habitData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))'
                      }}
                    />
                    <Bar dataKey="completion" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;
