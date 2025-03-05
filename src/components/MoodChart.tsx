
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock data
const moodData = [
  { day: "Mon", value: 3, mood: "okay" },
  { day: "Tue", value: 4, mood: "good" },
  { day: "Wed", value: 2, mood: "bad" },
  { day: "Thu", value: 5, mood: "great" },
  { day: "Fri", value: 4, mood: "good" },
  { day: "Sat", value: 3, mood: "okay" },
  { day: "Sun", value: 4, mood: "good" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card !bg-white/90 p-2 text-xs border rounded-lg shadow-sm">
        <p className="font-medium">{`${label} : ${payload[0].payload.mood}`}</p>
      </div>
    );
  }

  return null;
};

const MoodChart = () => {
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
