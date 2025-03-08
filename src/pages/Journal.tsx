
import React, { useState, useEffect } from "react";
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
import { BookText, Calendar, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSound } from "@/hooks/use-sound";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  tags?: string[];
}

const Journal = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { playSound } = useSound();

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const filteredEntries = entries.filter(entry => {
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query) ||
      (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Journal</h1>
            <p className="text-muted-foreground mt-1">
              Express your thoughts and track your emotional journey
            </p>
          </div>
          <Button 
            onClick={() => {
              playSound('click');
              navigate("/journal/new");
            }}
            onMouseEnter={() => playSound('hover')}
            className="bg-primary hover:bg-primary/90 group"
          >
            <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            New Entry
          </Button>
        </section>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search journal entries..."
            className="pl-10 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {entries.length === 0 ? (
          <Card className="glass-card animate-breathe">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <BookText className="h-12 w-12 text-secondary mb-4 animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Your Journal is Empty</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Start documenting your thoughts, feelings, and experiences to track your mental wellbeing journey.
              </p>
              <Button 
                onClick={() => {
                  playSound('click');
                  navigate("/journal/new");
                }}
                onMouseEnter={() => playSound('hover')}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Entry
              </Button>
            </CardContent>
          </Card>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No entries match your search.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry, idx) => (
              <Card 
                key={entry.id} 
                className="glass-card card-hover transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(entry.date)}
                    </div>
                  </div>
                  {entry.mood && (
                    <CardDescription>Mood: {entry.mood}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{getExcerpt(entry.content)}</p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-auto"
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => playSound('click')}
                  >
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Separator />
        
        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Journaling Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass-card-primary animate-float" style={{ animationDelay: "0s" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Emotional Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Writing helps process emotions and make sense of experiences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card-primary animate-float" style={{ animationDelay: "0.5s" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pattern Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Regular journaling helps identify patterns in your mood and behavior.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card-primary animate-float" style={{ animationDelay: "1s" }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stress Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expressing your thoughts on paper can significantly reduce anxiety and stress.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Journal;
