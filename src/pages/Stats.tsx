
import React from "react";
import Layout from "@/components/Layout";
import MoodChart from "@/components/MoodChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Mock data
const emotionData = [
  { name: "Happy", value: 35 },
  { name: "Calm", value: 25 },
  { name: "Anxious", value: 15 },
  { name: "Stressed", value: 10 },
  { name: "Excited", value: 15 },
];

const COLORS = ["#4ade80", "#22d3ee", "#fb923c", "#f87171", "#60a5fa"];

const Stats = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
            <p className="text-muted-foreground mt-1">
              Visualize your mental health patterns and trends
            </p>
          </div>
          <Button variant="outline">Last 7 Days</Button>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoodChart />
          
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
                Emotions
              </div>
              <CardTitle className="text-lg font-medium">Emotion Distribution</CardTitle>
              <CardDescription>Your most frequent emotions this week</CardDescription>
            </CardHeader>
            <CardContent className="p-1 sm:p-6">
              <div className="w-full h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
                Analysis
              </div>
              <CardTitle className="text-lg font-medium">Monthly Overview</CardTitle>
              <CardDescription>Compare your mood patterns across months</CardDescription>
            </CardHeader>
            <CardContent className="p-1 sm:p-6">
              <div className="text-center text-muted-foreground py-12">
                <p>More detailed insights will appear here as you continue tracking your mood.</p>
                <Button variant="outline" className="mt-4">Go to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Stats;
