
import React, { useState } from "react";
import { Menu, User, MessageSquareText, X, Waves, Home, SquarePen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { useSound } from "@/hooks/use-sound";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { playSound } = useSound();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActivePath = (path: string) => {
    return currentPath === path;
  };

  const handleMenuItemClick = () => {
    playSound('click');
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: <Home className="w-5 h-5" /> },
    { name: "Journal", path: "/journal", icon: <SquarePen className="w-5 h-5" /> },
    { name: "Stats", path: "/stats", icon: <BarChart3 className="w-5 h-5" /> },
    { name: "Chatbot", path: "/chatbot", icon: <MessageSquareText className="w-5 h-5" /> },
    { name: "Meditation", path: "/meditation", icon: <Waves className="w-5 h-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xl tracking-tight text-foreground">Tranquil Mind</span>
        </div>
        
        <nav className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 px-6">
            {navigationItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(item.path) ? "text-primary" : "text-muted-foreground"
                }`}
                onMouseEnter={() => playSound('hover')}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full"
                onMouseEnter={() => playSound('hover')}
                onClick={() => playSound('click')}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => playSound('click')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => playSound('click')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => playSound('click')}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full md:hidden"
                onMouseEnter={() => playSound('hover')}
                onClick={() => {
                  playSound('click');
                  setIsMenuOpen(true);
                }}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="py-4">
                <div className="flex flex-col space-y-4 mt-6">
                  {navigationItems.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.path} 
                      className={`flex items-center px-2 py-2 rounded-md hover:bg-accent ${
                        isActivePath(item.path) ? "bg-accent/50 text-primary" : "text-muted-foreground"
                      }`}
                      onClick={handleMenuItemClick}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
