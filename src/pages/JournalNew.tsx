
import React from "react";
import JournalEntryForm from "@/components/JournalEntryForm";

const JournalNew = () => {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">New Journal Entry</h1>
        <p className="text-muted-foreground mt-1">
          Express your thoughts and feelings
        </p>
      </section>
      
      <JournalEntryForm />
    </div>
  );
};

export default JournalNew;
