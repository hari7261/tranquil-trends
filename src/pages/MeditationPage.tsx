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
  Leaf,
  Music
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
import song1 from "@/../public/music/ethereal-electronic-01-263925.mp3";
import song2 from "@/../public/music/mixkit-relaxation-meditation-365.mp3";
import song3 from "@/../public/music/mixkit-serene-view-443 (1).mp3";
import song4 from "@/../public/music/mixkit-smooth-meditation-324.mp3";
import song5 from "@/../public/music/mixkit-spiritual-moment-525.mp3";
import song6 from "@/../public/music/mixkit-valley-sunset-127.mp3";
import song7 from "@/../public/music/mixkit-yoga-music-04-386.mp3";
import song8 from "@/../public/music/om-namah-shivaya-song-229613.mp3";
import song9 from "@/../public/music/soft-drum-and-bass-215941.mp3";
import song10 from "@/../public/music/you-belong-to-me-178037.mp3";
import song11 from "@/../public/music/Interstellar-Theme.mp3";


// Define meditation tracks with local file paths (place audio files in the public/music folder)
const meditationTracks = [
  {
    id: "ethereal-electronic",
    title: "Ethereal Electronic",
    description: "Ambient electronic soundscape for deep relaxation",
    duration: 180,
    type: "ambient",
    time: "3:00 min",
    icon: <MoonStar className="h-5 w-5" />,
    audio: song1
  },
  {
    id: "relaxation-meditation",
    title: "Relaxation Meditation",
    description: "Soothing sounds to calm the mind and reduce stress",
    duration: 240,
    type: "guided",
    time: "4:00 min",
    icon: <Wind className="h-5 w-5" />,
    audio: song2
  },
  {
    id: "serene-view",
    title: "Serene View",
    description: "Peaceful nature-inspired meditation soundtrack",
    duration: 210,
    type: "ambient",
    time: "3:30 min",
    icon: <Leaf className="h-5 w-5" />,
    audio: song3
  },
  {
    id: "smooth-meditation",
    title: "Smooth Meditation",
    description: "Gentle flowing tones for mindfulness practice",
    duration: 300,
    type: "ambient",
    time: "5:00 min",
    icon: <Waves className="h-5 w-5" />,
    audio: song4
  },
  {
    id: "spiritual-moment",
    title: "Spiritual Moment",
    description: "Transcendent sounds for spiritual connection",
    duration: 270,
    type: "chant",
    time: "4:30 min",
    icon: <Sun className="h-5 w-5" />,
    audio: song5
  },
  {
    id: "valley-sunset",
    title: "Valley Sunset",
    description: "Immersive soundscape inspired by natural landscapes",
    duration: 330,
    type: "ambient",
    time: "5:30 min",
    icon: <Music className="h-5 w-5" />,
    audio: song6
  },
  {
    id: "yoga-music",
    title: "Yoga Harmony",
    description: "Perfect accompaniment for yoga and stretching",
    duration: 360,
    type: "rhythm",
    time: "6:00 min",
    icon: <Heart className="h-5 w-5" />,
    audio: song7
  },
  {
    id: "om-namah-shivaya",
    title: "Om Namah Shivaya",
    description: "Traditional sacred mantra for deep meditation",
    duration: 420,
    type: "chant",
    time: "7:00 min",
    icon: <Sun className="h-5 w-5" />,
    audio: song8
  },
  {
    id: "soft-drum-bass",
    title: "Soft Drum & Bass",
    description: "Gentle rhythmic patterns to focus the mind",
    duration: 285,
    type: "rhythm",
    time: "4:45 min",
    icon: <Waves className="h-5 w-5" />,
    audio: song9
  },
  {
    id: "you-belong-to-me",
    title: "You Belong To Me",
    description: "Soothing melody for emotional balance",
    duration: 240,
    type: "ambient",
    time: "4:00 min",
    icon: <Heart className="h-5 w-5" />,
    audio: song10
  },
  {
    id: "interstellar-theme",
    title: "Interstellar Theme",
    description: "By Hans Zimmer - Cosmic meditation journey",
    duration: 390,
    type: "cinematic",
    time: "6:30 min",
    icon: <Clock className="h-5 w-5" />,
    audio: song11
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
  const [availableTracks, setAvailableTracks] = useState<string[]>([]);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const { playSound } = useSound();

  // Check if audio files exist
  useEffect(() => {
    const checkAudioFiles = async () => {
      const availableAudioFiles: string[] = [];
      
      for (const track of meditationTracks) {
        try {
          const response = await fetch(track.audio, { method: 'HEAD' });
          if (response.ok) {
            availableAudioFiles.push(track.id);
          } else {
            console.warn(`Audio file not found: ${track.audio}`);
          }
        } catch (error) {
          console.warn(`Error checking audio file: ${track.audio}`, error);
        }
      }
      
      setAvailableTracks(availableAudioFiles);
      
      if (availableAudioFiles.length === 0) {
        toast({
          title: "Audio files missing",
          description: "No meditation audio files found. Please add MP3 files to your public/music folder.",
          variant: "destructive"
        });
      } else if (availableAudioFiles.length !== meditationTracks.length) {
        toast({
          title: "Some audio files missing",
          description: `Found ${availableAudioFiles.length} out of ${meditationTracks.length} audio files.`,
          variant: "warning"
        });
      }
    };
    
    checkAudioFiles();
  }, []);

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
    
    setAudioError(null);
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
      // Check if track is available before playing
      if (!availableTracks.includes(selectedTrack.id)) {
        setAudioError(`Unable to play "${selectedTrack.title}". Audio file not found.`);
        toast({
          title: "Audio file not found",
          description: `The audio file for "${selectedTrack.title}" is missing.`,
          variant: "destructive"
        });
        return;
      }
      
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Playback started successfully
          timerRef.current = window.setInterval(() => {
            if (audioRef.current) {
              setCurrentTime(Math.floor(audioRef.current.currentTime));
            }
          }, 1000);
        }).catch(error => {
          // Playback failed
          setAudioError(`Unable to play "${selectedTrack.title}". ${error.message}`);
          toast({
            title: "Playback error",
            description: `Failed to play "${selectedTrack.title}": ${error.message}`,
            variant: "destructive"
          });
          return;
        });
      }
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

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    if (selectedTrack) {
      setIsPlaying(false);
      setAudioError(`Unable to load "${selectedTrack.title}". Please check if the audio file exists.`);
      toast({
        title: "Audio error",
        description: `Failed to load "${selectedTrack.title}". Please make sure the file exists.`,
        variant: "destructive"
      });
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
                <CardDescription>
                  {availableTracks.length === 0 
                    ? "No audio files found. Please add MP3 files to your public/music folder." 
                    : `${availableTracks.length} of ${meditationTracks.length} audio tracks available`}
                </CardDescription>
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
                      } ${!availableTracks.includes(track.id) && 'opacity-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          selectedTrack?.id === track.id ? 'bg-primary/30' : 'bg-accent/20'
                        }`}>
                          {track.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm flex items-center gap-1">
                            {track.title}
                            {!availableTracks.includes(track.id) && 
                              <span className="text-xs bg-red-500/10 text-red-500 rounded-full px-2">Missing</span>}
                          </h3>
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
                          {audioError && <p className="text-sm text-red-500 mt-2">{audioError}</p>}
                        </div>
                        <Button 
                          onClick={handlePlayPause}
                          size="lg"
                          className={`rounded-full h-14 w-14 ${isPlaying ? 'bg-primary/80' : 'bg-primary'}`}
                          disabled={!availableTracks.includes(selectedTrack.id)}
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
                        onError={handleAudioError}
                        preload="metadata"
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
