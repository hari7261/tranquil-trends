import React, { useState, useEffect } from "react";
import { Menu, User, MessageSquareText, X, Waves, Home, SquarePen, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSound } from "@/hooks/use-sound";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { playSound } = useSound();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Load user name from localStorage
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  const isActivePath = (path: string) => {
    return currentPath === path;
  };

  const handleMenuItemClick = () => {
    playSound('click');
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    playSound('click');
    
    // Clear authentication data but preserve user info
    localStorage.setItem("isAuthenticated", "false");
    
    // We keep the "users" data in localStorage so login can still work
    // Just clear the current user session data
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userName");
    
    // Show success toast
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    
    // Redirect to home page
    navigate("/");
  };

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="mr-2 w-5 h-5" /> },
    { name: "Journal", path: "/journal", icon: <SquarePen className="mr-2 w-5 h-5" /> },
    { name: "Stats", path: "/stats", icon: <BarChart3 className="mr-2 w-5 h-5" /> },
    { name: "Chatbot", path: "/chatbot", icon: <MessageSquareText className="mr-2 w-5 h-5" /> },
    { name: "Meditation", path: "/meditation", icon: <Waves className="mr-2 w-5 h-5" /> },
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
              <DropdownMenuItem disabled className="opacity-70">
                {userName ? `Signed in as ${userName}` : "Profile"}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                playSound('click');
                navigate("/dashboard");
              }}>Dashboard</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {
                playSound('click'); 
                // Settings functionality would go here
              }}>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSignOut} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
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
                  
                  <Separator className="my-2" />
                  
                  <Button 
                    variant="ghost" 
                    className="flex justify-start px-2 py-6 h-auto text-red-500 hover:bg-red-500/10 hover:text-red-500"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Sign out
                  </Button>
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
