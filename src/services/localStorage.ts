
// Mood data interfaces
export interface MoodEntry {
  date: string;
  value: number; // 1-5
  mood: string; // "awful", "bad", "okay", "good", "great"
}

// Meditation session interface
export interface MeditationSession {
  id: string;
  date: string;
  duration: number; // in seconds
  trackId: string;
  completed: boolean;
}

// Save mood entry to localStorage
export const saveMoodEntry = (value: number, mood: string) => {
  const entry: MoodEntry = {
    date: new Date().toISOString(),
    value,
    mood,
  };
  
  const existingEntries = getMoodEntries();
  const newEntries = [...existingEntries, entry];
  
  localStorage.setItem("moodEntries", JSON.stringify(newEntries));
  return entry;
};

// Get all mood entries
export const getMoodEntries = (): MoodEntry[] => {
  const savedEntries = localStorage.getItem("moodEntries");
  return savedEntries ? JSON.parse(savedEntries) : [];
};

// Save meditation session
export const saveMeditationSession = (trackId: string, duration: number, completed: boolean) => {
  const session: MeditationSession = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    duration,
    trackId,
    completed,
  };
  
  const existingSessions = getMeditationSessions();
  const newSessions = [...existingSessions, session];
  
  localStorage.setItem("meditationSessions", JSON.stringify(newSessions));
  return session;
};

// Get all meditation sessions
export const getMeditationSessions = (): MeditationSession[] => {
  const savedSessions = localStorage.getItem("meditationSessions");
  return savedSessions ? JSON.parse(savedSessions) : [];
};

// Get total meditation time (in minutes)
export const getTotalMeditationTime = (): number => {
  const sessions = getMeditationSessions();
  const totalSeconds = sessions.reduce((total, session) => {
    return total + (session.completed ? session.duration : 0);
  }, 0);
  
  return Math.round(totalSeconds / 60);
};

// Get meditation streak (consecutive days)
export const getMeditationStreak = (): number => {
  const sessions = getMeditationSessions();
  if (sessions.length === 0) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Get unique days with completed sessions
  const uniqueDays = new Set();
  sortedSessions.forEach(session => {
    if (session.completed) {
      const day = new Date(session.date).toISOString().split('T')[0];
      uniqueDays.add(day);
    }
  });
  
  // Convert to array and sort
  const days = Array.from(uniqueDays) as string[];
  days.sort().reverse();
  
  // Calculate streak
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  // Check if there's a session today
  if (days[0] === today) {
    streak = 1;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (let i = 1; i < days.length; i++) {
      const currentDate = new Date(days[i-1]);
      const prevDate = new Date(days[i]);
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / oneDayMs);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  return streak;
};
