import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  enabled: boolean;
}

const daysOfWeek = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

const DailyReminder = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const savedReminders = localStorage.getItem("reminders");
    return savedReminders ? JSON.parse(savedReminders) : [
      {
        id: "1",
        title: "Morning Mindfulness",
        time: "08:00",
        days: ["mon", "tue", "wed", "thu", "fri"],
        enabled: true
      },
      {
        id: "2",
        title: "Evening Journal",
        time: "20:00",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        enabled: true
      }
    ];
  });
  
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id'>>({
    title: "",
    time: "",
    days: [],
    enabled: true
  });

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
    
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    try {
      const selfCareActivities = localStorage.getItem("selfCareActivities");
      if (selfCareActivities && reminders.length > 0) {
        const activities = JSON.parse(selfCareActivities);
        const updatedActivities = activities.map((activity: any) => {
          if (activity.title === "Daily Reminder") {
            return { ...activity, completed: true };
          }
          return activity;
        });
        localStorage.setItem("selfCareActivities", JSON.stringify(updatedActivities));
      }
    } catch (error) {
      console.error("Error updating self-care activities:", error);
    }
  }, [reminders]);

  const handleAddReminder = () => {
    if (!newReminder.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your reminder.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newReminder.time) {
      toast({
        title: "Time required",
        description: "Please set a time for your reminder.",
        variant: "destructive",
      });
      return;
    }
    
    if (newReminder.days.length === 0) {
      toast({
        title: "Days required",
        description: "Please select at least one day for your reminder.",
        variant: "destructive",
      });
      return;
    }
    
    const reminder: Reminder = {
      ...newReminder,
      id: Date.now().toString(),
    };
    
    setReminders([...reminders, reminder]);
    setNewReminder({
      title: "",
      time: "",
      days: [],
      enabled: true
    });
    setIsAddingReminder(false);
    
    toast({
      title: "Reminder created",
      description: `Your reminder "${reminder.title}" has been created.`,
    });
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => {
      if (prev.days.includes(day)) {
        return {
          ...prev,
          days: prev.days.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          days: [...prev.days, day]
        };
      }
    });
  };

  const toggleReminderEnabled = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, enabled: !reminder.enabled } 
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder deleted",
      description: "Your reminder has been removed.",
    });
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const timeObj = new Date();
      timeObj.setHours(parseInt(hours), parseInt(minutes), 0);
      return timeObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return time;
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Daily Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Set reminders for your mental health practices
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </section>

      <Card className="glass-card-primary overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg md:text-xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            These reminders help you establish consistent mental health habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Reminders will be saved in your browser and will show as notifications when the browser is open. For persistent reminders across all devices, consider using your phone's built-in calendar or reminder app.
          </p>
          
          {reminders.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No reminders set yet</p>
              <Button 
                variant="outline"
                onClick={() => setIsAddingReminder(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Reminder
              </Button>
            </div>
          )}
          
          {reminders.length > 0 && (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className={reminder.enabled ? "glass-card" : "bg-muted/50"}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full p-2.5 ${reminder.enabled ? "bg-primary/20" : "bg-muted"}`}>
                        <Bell className={`h-5 w-5 ${reminder.enabled ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${!reminder.enabled && "text-muted-foreground"}`}>{reminder.title}</h4>
                        <div className="flex items-center text-xs text-muted-foreground gap-3 mt-1">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatTime(reminder.time)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {reminder.days.length === 7 
                              ? "Every day" 
                              : reminder.days.map(day => day.charAt(0).toUpperCase()).join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <input 
                              type="checkbox" 
                              checked={reminder.enabled}
                              onChange={() => toggleReminderEnabled(reminder.id)}
                              className="sr-only"
                            />
                            <div className={`w-9 h-5 rounded-full relative ${
                              reminder.enabled ? "bg-primary" : "bg-muted-foreground/30"
                            } transition-colors`}>
                              <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                                reminder.enabled ? "translate-x-4" : ""
                              }`} />
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-auto p-2">
                          <p className="text-xs">
                            {reminder.enabled ? "Disable reminder" : "Enable reminder"}
                          </p>
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteReminder(reminder.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-auto p-2">
                          <p className="text-xs">Delete reminder</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent

