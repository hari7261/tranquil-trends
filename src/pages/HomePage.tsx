import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Brain,
  Moon,
  CloudSun,
  BookOpen,
  Check,
  ChevronRight,
  Sun,
  Sparkles,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSound } from "@/hooks/use-sound";

const HomePage = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Parallax effect for hero section
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);

  const testimonials = [
    {
      quote: "This app has transformed how I manage my mental wellness journey.",
      author: "Sarah L.",
      role: "Teacher"
    },
    {
      quote: "The meditation features helped me establish a daily practice.",
      author: "Michael T.",
      role: "Software Engineer"
    },
    {
      quote: "I love how beautifully designed and calming this platform is.",
      author: "Aisha K.",
      role: "Therapist"
    }
  ];
  
  const features = [
    {
      icon: <Heart className="h-10 w-10 text-pink-500" />,
      title: "Mood Tracking",
      description: "Record and visualize your emotional patterns over time"
    },
    {
      icon: <Brain className="h-10 w-10 text-purple-500" />,
      title: "Mindfulness Practice",
      description: "Guided exercises to develop present moment awareness"
    },
    {
      icon: <Moon className="h-10 w-10 text-indigo-500" />,
      title: "Sleep Better",
      description: "Improve your sleep with relaxing sounds and meditations"
    },
    {
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
      title: "Journaling",
      description: "Express thoughts and emotions with structured prompts"
    },
    {
      icon: <CloudSun className="h-10 w-10 text-amber-500" />,
      title: "Daily Check-ins",
      description: "Build consistent self-care habits with gentle reminders"
    },
    {
      icon: <Sparkles className="h-10 w-10 text-emerald-500" />,
      title: "AI Assistant",
      description: "Get personalized support from our mental health chatbot"
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-background/70">
      {/* Hero Background with Parallax */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-border/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sun className="h-8 w-8 text-primary rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-8 w-8 text-primary rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Tranquil Mind
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Your Journey to <br />Mental Wellbeing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Track your mood, practice mindfulness, and develop healthy habits with our beautiful, science-based approach to mental wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 group"
                onClick={() => {
                  playSound('click');
                  if (isAuthenticated) {
                    navigate("/dashboard");
                  } else {
                    navigate("/register");
                  }
                }}
                onMouseEnter={() => playSound('hover')}
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              {!isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                  onClick={() => {
                    playSound('click');
                    navigate("/login");
                  }}
                  onMouseEnter={() => playSound('hover')}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                  onClick={() => {
                    playSound('click');
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onMouseEnter={() => playSound('hover')}
                >
                  Explore Features
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Nurture Your Mental Health
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive tools help you build awareness, resilience, and emotional intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshots Carousel */}
      <section className="relative z-10 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Beautiful Interface, Seamless Experience
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed with care to create a calm and intuitive environment for your wellness journey.
            </p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border border-border/40 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80" 
                      alt="Meditation dashboard" 
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border border-border/40 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
                      alt="Journaling interface" 
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl border border-border/40 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1499&q=80" 
                      alt="Mood tracking" 
                      className="w-full h-[500px] object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              What Our Users Say
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === currentTestimonial ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center absolute inset-0"
                  style={{ display: i === currentTestimonial ? 'block' : 'none' }}
                >
                  <p className="text-2xl italic mb-6 text-foreground/90">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-24">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full ${i === currentTestimonial ? 'bg-primary' : 'bg-primary/30'}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 my-10">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-purple-600 p-10 md:p-16 shadow-2xl">
            {/* Abstract shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 bg-white/10 w-64 h-64 rounded-full -mt-20 -mr-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 bg-white/10 w-64 h-64 rounded-full -mb-20 -ml-20 blur-3xl" />
            </div>
            
            <div className="relative text-center md:text-left md:flex items-center justify-between gap-8">
              <div className="mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                  Ready to Begin Your Wellness Journey?
                </h2>
                <p className="text-white/80 text-lg max-w-2xl">
                  Join thousands of others who have transformed their mental wellbeing with our easy-to-use tools and personalized insights.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg group"
                  onClick={() => {
                    playSound('click');
                    if (isAuthenticated) {
                      navigate("/dashboard");
                    } else {
                      navigate("/register");
                    }
                  }}
                  onMouseEnter={() => playSound('hover')}
                >
                  {isAuthenticated ? "Enter Dashboard" : "Create Account"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-background/80 backdrop-blur-sm border-t border-border/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Sun className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold text-xl">Tranquil Mind</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:items-center text-center md:text-left">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">© 2025 Tranquil Mind. All rights reserved.</p>
                <p className="text-sm text-muted-foreground">Your secure space for mental wellness</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;