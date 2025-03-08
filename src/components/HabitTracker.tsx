
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Habit {
  id: string;
  name: string;
  daysCompleted: Record<string, boolean>;
  createdAt: string;
}

const HabitTracker = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Get the past 7 days as date strings
  const getDaysOfWeek = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const daysOfWeek = getDaysOfWeek();

  useEffect(() => {
    // Load habits from localStorage
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    // Save habits to localStorage whenever they change
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.trim()) return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit,
      daysCompleted: {},
      createdAt: new Date().toISOString(),
    };

    setHabits([...habits, habit]);
    setNewHabit("");
    setIsAdding(false);
    toast({
      title: "Habit added",
      description: `${newHabit} has been added to your habits.`,
    });
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    toast({
      title: "Habit removed",
      description: "Your habit has been removed.",
    });
  };

  const toggleHabitForDay = (habitId: string, day: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          return {
            ...habit,
            daysCompleted: {
              ...habit.daysCompleted,
              [day]: !habit.daysCompleted[day],
            },
          };
        }
        return habit;
      })
    );
  };

  const getCompletionRate = (habit: Habit) => {
    let completed = 0;
    daysOfWeek.forEach((day) => {
      if (habit.daysCompleted[day]) {
        completed++;
      }
    });
    return (completed / daysOfWeek.length) * 100;
  };

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "short" }).substring(0, 1);
  };

  const formatFullDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: "short" });
  };

  return (
    <Card className="glass-card overflow-hidden transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary-foreground mb-2">
          Habits
        </div>
        <CardTitle className="text-lg font-medium">Habit Tracker</CardTitle>
        <CardDescription>Track your daily wellness habits</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {habits.length === 0 && !isAdding ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No habits added yet</p>
            <Button 
              variant="outline" 
              className="mb-2" 
              onClick={() => setIsAdding(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Habit
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Days of week header */}
            <div className="grid grid-cols-[minmax(100px,1fr)_repeat(7,40px)] gap-1 items-center">
              <div className="text-sm font-medium">Habit</div>
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium"
                  title={formatFullDay(day)}
                >
                  {formatDay(day)}
                </div>
              ))}
            </div>

            {/* Habits list */}
            <div className="space-y-3">
              {habits.map((habit) => (
                <div key={habit.id} className="grid grid-cols-[minmax(100px,1fr)_repeat(7,40px)] gap-1 items-center">
                  <div className="flex items-center justify-between pr-2">
                    <span className="text-sm truncate" title={habit.name}>
                      {habit.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-50 hover:opacity-100"
                      onClick={() => removeHabit(habit.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex justify-center">
                      <button
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                          habit.daysCompleted[day]
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                        onClick={() => toggleHabitForDay(habit.id, day)}
                        title={`${formatFullDay(day)}: ${
                          habit.daysCompleted[day] ? "Completed" : "Not completed"
                        }`}
                      >
                        {habit.daysCompleted[day] && <Check className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Progress bars */}
            {habits.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium mb-2">Weekly Progress</h4>
                {habits.map((habit) => (
                  <div key={`progress-${habit.id}`} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{habit.name}</span>
                      <span>{Math.round(getCompletionRate(habit))}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${getCompletionRate(habit)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isAdding && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="New habit name..."
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addHabit} disabled={!newHabit.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {habits.length > 0 && !isAdding && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Habit
          </Button>
        )}
        {isAdding && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HabitTracker;
