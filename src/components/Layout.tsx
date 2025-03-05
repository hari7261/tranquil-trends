
import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <footer className="py-6 px-4 mt-auto text-center text-sm text-muted-foreground">
        <p>Tranquil Mind — Track your mental wellbeing with purpose</p>
      </footer>
    </div>
  );
};

export default Layout;
