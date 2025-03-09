
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  Timer, 
  Waves, 
  MoonStar, 
  Sun,
  Wind,
  Heart,
  BarChart3,
  Clock,
  Flame,
  Calendar,
  Leaf
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { 
  saveMeditationSession,
  getMeditationSessions,
  getTotalMeditationTime,
  getMeditationStreak
} from "@/services/localStorage";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

// Define meditation tracks
const meditationTracks = [
  {
    id: "calm-mind",
    title: "Calm Mind",
    description: "Gentle meditation to quiet your thoughts",
    duration: 300, // 5 minutes in seconds
    type: "guided",
    time: "5 min",
    icon: <MoonStar className="h-5 w-5" />,
    audio: "https://storage.googleapis.com/uamp/The_Kyoto_Connection_-_Wake_Up/01_-_Intro_-_The_Way_Of_Waking_Up_feat_Alan_Watts.mp3"
  },
  {
    id: "morning-energy",
    title: "Morning Energy",
    description: "Start your day with positive energy",
    duration: 180, // 3 minutes in seconds
    type: "guided",
    time: "3 min",
    icon: <Sun className="h-5 w-5" />,
    audio: "https://storage.googleapis.com/uamp/The_Kyoto_Connection_-_Wake_Up/02_-_Geisha.mp3"
  },
  {
    id: "deep-breath",
    title: "Deep Breathing",
    description: "Focus on your breath to reduce anxiety",
    duration: 600, // 10 minutes in seconds
    type: "breath",
    time: "10 min",
    icon: <Wind className="h-5 w-5" />,
    audio: "https://storage.googleapis.com/uamp/The_Kyoto_Connection_-_Wake_Up/03_-_Voyage_I_-_Waterfall.mp3"
  },
  {
    id: "loving-kindness",
    title: "Loving Kindness",
    description: "Develop compassion for yourself and others",
    duration: 420, // 7 minutes in seconds
    type: "guided",
    time: "7 min",
    icon: <Heart className="h-5 w-5" />,
    audio: "https://storage.googleapis.com/uamp/The_Kyoto_Connection_-_Wake_Up/04_-_Voyage_II_-_Shining_Wind.mp3"
  },
  {
    id: "nature-sounds",
    title: "Nature Sounds",
    description: "Immerse yourself in calming nature sounds",
    duration: 900, // 15 minutes in seconds
    type: "ambient",
    time: "15 min",
    icon: <Leaf className="h-5 w-5" />,
    audio: "https://storage.googleapis.com/uamp/The_Kyoto_Connection_-_Wake_Up/05_-_Voyage_III_-_Spirit_Of_The_Wind.mp3"
  }
];

// Format seconds to mm:ss
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
};

const MeditationPage = () => {
  const [selectedTrack, setSelectedTrack] = useState<typeof meditationTracks[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionsByDay, setSessionsByDay] = useState<any[]>([]);
  const [sessionsByType, setSessionsByType] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const { playSound } = useSound();

  useEffect(() => {
    // Load meditation statistics
    const sessions = getMeditationSessions();
    setTotalSessions(sessions.length);
    setTotalTime(getTotalMeditationTime());
    setStreak(getMeditationStreak());
    
    // Process sessions by day (last 7 days)
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sessionsByDayData = last7Days.map(date => {
      const day = new Date(date);
      const dayName = dayLabels[day.getDay()];
      const dayStr = day.toISOString().split('T')[0];
      
      const sessionsOnDay = sessions.filter(s => s.date.startsWith(dayStr));
      const timeInMinutes = sessionsOnDay.reduce((total, s) => {
        return total + (s.completed ? Math.floor(s.duration / 60) : 0);
      }, 0);
      
      return {
        name: dayName,
        date: dayStr,
        minutes: timeInMinutes
      };
    });
    
    setSessionsByDay(sessionsByDayData);
    
    // Process sessions by type
    const typeMap = new Map();
    sessions.forEach(session => {
      const track = meditationTracks.find(t => t.id === session.trackId);
      if (track && session.completed) {
        const type = track.type;
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      }
    });
    
    const sessionsByTypeData = Array.from(typeMap.entries()).map(([name, value]) => ({ name, value }));
    if (sessionsByTypeData.length === 0) {
      // Add placeholder data
      sessionsByTypeData.push(
        { name: "guided", value: 0 },
        { name: "breath", value: 0 },
        { name: "ambient", value: 0 }
      );
    }
    
    setSessionsByType(sessionsByTypeData);
    
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleTrackSelect = (track: typeof meditationTracks[0]) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    playSound("click");
    setSelectedTrack(track);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (!selectedTrack) return;
    
    playSound("transition");
    
    if (isPlaying) {
      audioRef.current?.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      audioRef.current?.play();
      timerRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(Math.floor(audioRef.current.currentTime));
        }
      }, 1000);
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleTrackEnd = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Save completed session
    if (selectedTrack) {
      saveMeditationSession(selectedTrack.id, selectedTrack.duration, true);
      toast({
        title: "Meditation complete!",
        description: `You've completed a ${selectedTrack.time} meditation session.`,
      });
      
      // Update stats
      setTotalSessions(prev => prev + 1);
      setTotalTime(getTotalMeditationTime());
      setStreak(getMeditationStreak());
    }
  };

  // Colors for charts
  const COLORS = ['#4ade80', '#a855f7', '#60a5fa', '#fb923c'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card !bg-white/90 p-2 text-xs border rounded-lg shadow-sm">
          <p className="font-medium">{`${label}: ${payload[0].value} min`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Waves className="h-8 w-8 text-primary" />
            Sound Meditation
          </h1>
          <p className="text-muted-foreground mt-1">
            Find peace and balance with guided meditation sessions
          </p>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meditation Player */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-full overflow-hidden">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
                  Player
                </div>
                <CardTitle className="text-lg font-medium">Meditation Sessions</CardTitle>
                <CardDescription>Select a track to begin your meditation journey</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                  {meditationTracks.map((track) => (
                    <div 
                      key={track.id}
                      onClick={() => handleTrackSelect(track)}
                      className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        selectedTrack?.id === track.id 
                          ? 'bg-primary/20 border border-primary/30' 
                          : 'bg-accent/30 border border-accent/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          selectedTrack?.id === track.id ? 'bg-primary/30' : 'bg-accent/20'
                        }`}>
                          {track.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{track.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Timer className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{track.time}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{track.description}</p>
                    </div>
                  ))}
                </div>
                
                {selectedTrack ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-accent/30 border border-accent/10">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <Badge className="mb-2">{selectedTrack.type}</Badge>
                          <h2 className="text-xl font-medium">{selectedTrack.title}</h2>
                          <p className="text-sm text-muted-foreground">{selectedTrack.description}</p>
                        </div>
                        <Button 
                          onClick={handlePlayPause}
                          size="lg"
                          className={`rounded-full h-14 w-14 ${isPlaying ? 'bg-primary/80' : 'bg-primary'}`}
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <div className="h-2 w-full bg-accent/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(currentTime / selectedTrack.duration) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(selectedTrack.duration)}</span>
                        </div>
                      </div>
                      
                      <audio 
                        ref={audioRef}
                        src={selectedTrack.audio}
                        onEnded={handleTrackEnd}
                        className="hidden"
                      />
                    </div>
                    
                    <div className="p-4 bg-accent/20 rounded-lg border border-accent/10">
                      <div className="flex items-center gap-2 text-sm">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <p>Tip: Find a quiet place and focus on your breathing while listening.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground mb-2">Select a meditation track from above to begin</p>
                    <Waves className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Statistics */}
          <div>
            <Card className="glass-card h-full">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
                  Statistics
                </div>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Your Meditation Journey
                </CardTitle>
                <CardDescription>Track your progress and consistency</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="bg-accent/30 p-4 rounded-lg border border-accent/10">
                    <p className="text-xs text-muted-foreground mb-1">Total Sessions</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xl font-semibold">{totalSessions}</span>
                    </div>
                  </div>
                  
                  <div className="bg-accent/30 p-4 rounded-lg border border-accent/10">
                    <p className="text-xs text-muted-foreground mb-1">Total Minutes</p>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="text-xl font-semibold">{totalTime}</span>
                    </div>
                  </div>
                  
                  <div className="bg-accent/30 p-4 rounded-lg border border-accent/10">
                    <p className="text-xs text-muted-foreground mb-1">Current Streak</p>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-primary" />
                      <span className="text-xl font-semibold">{streak} days</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <Tabs defaultValue="time">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="time">Session Time</TabsTrigger>
                    <TabsTrigger value="type">Session Types</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="time" className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Daily Meditation Minutes</h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sessionsByDay}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="minutes" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="type" className="pt-4">
                    <h3 className="text-sm font-medium mb-2">Session Types</h3>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sessionsByType}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name }) => name}
                          >
                            {sessionsByType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Weekly Goal
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">5 meditation sessions per week</p>
                  <div className="h-2 w-full bg-accent/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${Math.min((totalSessions / 5) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-right">
                    {totalSessions}/5 sessions completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MeditationPage;
