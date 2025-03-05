
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Check, Trash, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  time: string;
  text: string;
  enabled: boolean;
}

const DailyReminder = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderTime, setNewReminderTime] = useState("");
  const [newReminderText, setNewReminderText] = useState("");

  // Load saved reminders from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem("dailyReminders");
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("dailyReminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!newReminderTime || !newReminderText) {
      toast({
        title: "Missing information",
        description: "Please provide both a time and description for your reminder.",
        variant: "destructive",
      });
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      time: newReminderTime,
      text: newReminderText,
      enabled: true,
    };

    setReminders([...reminders, newReminder]);
    setNewReminderTime("");
    setNewReminderText("");

    toast({
      title: "Reminder added",
      description: "Your daily reminder has been set.",
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "Your reminder has been removed.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">Daily Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Set regular reminders to help maintain your mental wellness routine
          </p>
        </section>

        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Create New Reminder
            </CardTitle>
            <CardDescription>
              Add times to be reminded for important wellness activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="time"
                value={newReminderTime}
                onChange={(e) => setNewReminderTime(e.target.value)}
                className="border-primary/20 focus-visible:ring-primary/30"
              />
              <Input
                placeholder="Reminder description"
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                className="flex-grow border-primary/20 focus-visible:ring-primary/30"
              />
              <Button 
                onClick={addReminder}
                disabled={!newReminderTime || !newReminderText}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {reminders.length > 0 ? (
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Your Reminders</CardTitle>
              <CardDescription>
                {reminders.filter(r => r.enabled).length} active reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div 
                    key={reminder.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      reminder.enabled ? "border-primary/20 bg-primary/5" : "border-muted/30 bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm">
                        {reminder.time}
                      </div>
                      <div className={reminder.enabled ? "text-foreground" : "text-muted-foreground line-through"}>
                        {reminder.text}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleReminder(reminder.id)}
                        title={reminder.enabled ? "Disable reminder" : "Enable reminder"}
                      >
                        <Check className={`h-4 w-4 ${reminder.enabled ? "text-primary" : "text-muted-foreground"}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        title="Delete reminder"
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Note: These reminders will appear as browser notifications when this app is open
              </p>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </Layout>
  );
};

export default DailyReminder;
