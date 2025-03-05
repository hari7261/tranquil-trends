
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ReminderCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  time?: string;
  actionText?: string;
  actionPath?: string;
}

const ReminderCard = ({
  title,
  description,
  icon,
  time,
  actionText = "Start Now",
  actionPath,
}: ReminderCardProps) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (actionPath) {
      navigate(actionPath);
    }
  };

  return (
    <Card className="glass-card-accent overflow-hidden transition-all duration-300 card-hover">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs text-muted-foreground">{description}</p>
        {time && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{time}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-xs"
          onClick={handleAction}
        >
          {actionText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReminderCard;
