
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useSound } from "@/hooks/use-sound";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { playSound } = useSound();
  
  useEffect(() => {
    // Play a subtle transition sound when the layout mounts
    playSound('transition');
    
    // Add a subtle background pattern
    document.body.classList.add('bg-background');
    
    return () => {
      document.body.classList.remove('bg-background');
    };
  }, [playSound]);

  return (
    <div className="min-h-screen flex flex-col bg-background bg-gradient-radial from-background to-background/70">
      <div className="fixed inset-0 bg-purple-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800/10 to-transparent pointer-events-none"></div>
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <footer className="py-6 px-4 mt-auto text-center text-sm text-muted-foreground relative z-10">
        <p>Tranquil Mind — Track your mental wellbeing with purpose</p>
      </footer>
    </div>
  );
};

export default Layout;
