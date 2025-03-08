
import React, { useState } from "react";
import { Menu, User, MessageSquareText, X } from "lucide-react";
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
              onMouseEnter={() => playSound('hover')}
            >
              Dashboard
            </Link>
            <Link 
              to="/journal" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/journal") ? "text-primary" : "text-muted-foreground"
              }`}
              onMouseEnter={() => playSound('hover')}
            >
              Journal
            </Link>
            <Link 
              to="/stats" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/stats") ? "text-primary" : "text-muted-foreground"
              }`}
              onMouseEnter={() => playSound('hover')}
            >
              Insights
            </Link>
            <Link 
              to="/chatbot" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActivePath("/chatbot") ? "text-primary" : "text-muted-foreground"
              }`}
              onMouseEnter={() => playSound('hover')}
            >
              Assistant
            </Link>
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
                  <Link 
                    to="/" 
                    className={`flex items-center px-2 py-2 rounded-md hover:bg-accent ${
                      isActivePath("/") ? "bg-accent/50 text-primary" : "text-muted-foreground"
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/journal" 
                    className={`flex items-center px-2 py-2 rounded-md hover:bg-accent ${
                      isActivePath("/journal") ? "bg-accent/50 text-primary" : "text-muted-foreground"
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    Journal
                  </Link>
                  <Link 
                    to="/stats" 
                    className={`flex items-center px-2 py-2 rounded-md hover:bg-accent ${
                      isActivePath("/stats") ? "bg-accent/50 text-primary" : "text-muted-foreground"
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    Insights
                  </Link>
                  <Link 
                    to="/chatbot" 
                    className={`flex items-center px-2 py-2 rounded-md hover:bg-accent ${
                      isActivePath("/chatbot") ? "bg-accent/50 text-primary" : "text-muted-foreground"
                    }`}
                    onClick={handleMenuItemClick}
                  >
                    Assistant
                  </Link>
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
