
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getMoodEntries, MoodEntry } from "@/services/localStorage";

interface ChartDataPoint {
  day: string;
  value: number;
  mood: string;
  date: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card !bg-white/90 p-2 text-xs border rounded-lg shadow-sm">
        <p className="font-medium">{`${label} : ${payload[0].payload.mood}`}</p>
        <p className="text-muted-foreground">{new Date(payload[0].payload.date).toLocaleDateString()}</p>
      </div>
    );
  }

  return null;
};

const MoodChart = () => {
  const [moodData, setMoodData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Load mood data from localStorage
    const entries = getMoodEntries();
    
    if (entries.length > 0) {
      // Get the last 7 entries
      const recentEntries = entries.slice(-7);
      
      // Format for chart display
      const chartData = recentEntries.map((entry: MoodEntry) => ({
        day: new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short' }),
        value: entry.value,
        mood: entry.mood,
        date: entry.date
      }));
      
      setMoodData(chartData);
    } else {
      // Fallback mock data if no entries exist
      const mockData = [
        { day: "Mon", value: 3, mood: "okay", date: new Date().toISOString() },
        { day: "Tue", value: 4, mood: "good", date: new Date().toISOString() },
        { day: "Wed", value: 2, mood: "bad", date: new Date().toISOString() },
        { day: "Thu", value: 5, mood: "great", date: new Date().toISOString() },
        { day: "Fri", value: 4, mood: "good", date: new Date().toISOString() },
        { day: "Sat", value: 3, mood: "okay", date: new Date().toISOString() },
        { day: "Sun", value: 4, mood: "good", date: new Date().toISOString() },
      ];
      setMoodData(mockData);
    }
  }, []);

  return (
    <Card className="glass-card h-full overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
          Insights
        </div>
        <CardTitle className="text-lg font-medium">Your Mood Trends</CardTitle>
        <CardDescription>How your mood has changed this week</CardDescription>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={moodData}
              margin={{ top: 20, right: 20, left: -30, bottom: 0 }}
            >
              <XAxis 
                dataKey="day"
                tickLine={false}
                axisLine={false} 
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={false}
                domain={[1, 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="natural"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
