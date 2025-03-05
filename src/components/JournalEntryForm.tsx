
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookText, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface JournalEntryFormProps {
  onClose?: () => void;
  isDialog?: boolean;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onClose, isDialog = false }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would save to a database
    // For now, we'll simulate saving by adding to localStorage
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
    };
    
    entries.push(newEntry);
    localStorage.setItem("journalEntries", JSON.stringify(entries));
    
    // Show success message
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been recorded successfully.",
    });
    
    // Reset form or navigate
    setTimeout(() => {
      setIsSubmitting(false);
      if (isDialog && onClose) {
        onClose();
      } else {
        navigate("/journal");
      }
    }, 500);
  };

  return (
    <Card className="glass-card w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-3 relative">
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
            New Entry
          </div>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BookText className="w-5 h-5 text-primary" />
            Create Journal Entry
          </CardTitle>
          {isDialog && onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-3 right-3" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Title for your entry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-primary/20 focus-visible:ring-primary/30"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none border-primary/20 focus-visible:ring-primary/30"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          {isDialog && onClose && (
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!title.trim() || !content.trim() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Entry"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JournalEntryForm;
