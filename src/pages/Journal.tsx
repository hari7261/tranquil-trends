
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  PlusCircle, 
  BookText, 
  CalendarDays, 
  MoreHorizontal,
  Pencil,
  Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import JournalEntryForm from "@/components/JournalEntryForm";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem("journalEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry deleted",
      description: "Your journal entry has been removed.",
    });
  };

  const onDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Refresh entries when dialog closes
      const savedEntries = localStorage.getItem("journalEntries");
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Journal</h1>
            <p className="text-muted-foreground mt-1">
              Track your thoughts and feelings over time
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Entry</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0">
              <JournalEntryForm onClose={() => setIsDialogOpen(false)} isDialog={true} />
            </DialogContent>
          </Dialog>
        </section>

        {entries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
              <Card key={entry.id} className="glass-card card-hover overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <BookText className="w-4 h-4 text-primary" />
                      <CardTitle className="text-lg font-medium">{entry.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/journal/${entry.id}/edit`)}
                        title="Edit entry"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteEntry(entry.id)}
                        title="Delete entry"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    <span>{format(new Date(entry.date), "PPP 'at' p")}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-3">{entry.content}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto text-xs">
                    Read More
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-4">
              <PlusCircle className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2">No journal entries yet</h2>
            <p className="text-muted-foreground max-w-md">
              Start capturing your thoughts and feelings by creating your first journal entry.
            </p>
            <Button 
              className="mt-6"
              onClick={() => navigate("/journal/new")}
            >
              Create First Entry
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Journal;
