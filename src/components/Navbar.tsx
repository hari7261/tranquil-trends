
import React from "react";
import { Menu, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xl tracking-tight text-foreground">Tranquil Mind</span>
        </div>
        
        <nav className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-6 px-6">
            <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </a>
            <a href="/journal" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Journal
            </a>
            <a href="/stats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Insights
            </a>
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
