
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookText } from "lucide-react";

const JournalEntry = () => {
  const [entry, setEntry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEntryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntry(e.target.value);
  };

  const handleSubmit = () => {
    if (!entry.trim()) return;

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      // Reset after showing success
      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    }, 800);
  };

  return (
    <Card className="glass-card h-full overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
          Journal
        </div>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BookText className="w-5 h-5 text-primary" />
          Record Your Thoughts
        </CardTitle>
        <CardDescription>Write down what's on your mind today</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={entry}
          onChange={handleEntryChange}
          placeholder="Today I feel..."
          className="min-h-[120px] resize-none border-primary/20 focus-visible:ring-primary/30"
        />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full transition-all"
          disabled={!entry.trim() || submitting}
          onClick={handleSubmit}
        >
          {submitted ? "Saved Successfully!" : submitting ? "Saving..." : "Save Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalEntry;
