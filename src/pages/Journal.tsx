
import React from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Journal = () => {
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
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New Entry</span>
          </Button>
        </section>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-primary/10 rounded-full p-6 mb-4">
            <PlusCircle className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">No journal entries yet</h2>
          <p className="text-muted-foreground max-w-md">
            Start capturing your thoughts and feelings by creating your first journal entry.
          </p>
          <Button className="mt-6">Create First Entry</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Journal;
