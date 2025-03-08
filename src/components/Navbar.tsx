
import React from "react";
import { Menu, Moon, Sun, User, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActivePath = (path: string) => {
    return currentPath === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xl tracking-tight text-foreground">Tranquil Mind</span>
        </div>
        
        <nav className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 px-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/journal" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/journal") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Journal
            </Link>
            <Link 
              to="/stats" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/stats") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Insights
            </Link>
            <Link 
              to="/chatbot" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/chatbot") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Assistant
            </Link>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" className="rounded-full md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
