import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Moon,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useSound } from "@/hooks/use-sound";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  password: string;
  name: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect for background
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const lastPath = localStorage.getItem("lastPath") || "/dashboard";
    
    if (isAuthenticated) {
      navigate(lastPath);
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    playSound("click");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    playSound("click");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get users from localStorage
      const usersJSON = localStorage.getItem("users");
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

      // Check if user exists and password matches
      const user = users.find((u) => u.email === email);
      
      if (!user) {
        setError("No account found with this email. Please sign up.");
        setIsLoading(false);
        return;
      }
      
      if (user.password !== password) {
        setError("Incorrect password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("userName", user.name);
      
      // Success!
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      
      const lastPath = localStorage.getItem("lastPath") || "/dashboard";
      navigate(lastPath);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-background/70 flex flex-col">
      {/* Hero Background with Parallax */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520052205864-92d242b3a76b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-15"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 border-b border-border/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sun className="h-8 w-8 text-primary rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-8 w-8 text-primary rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <Link to="/" className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Tranquil Mind
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/10 shadow-xl bg-background/80 backdrop-blur-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  {error && (
                    <Alert variant="destructive" className="mb-4 bg-destructive/5 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          placeholder="you@example.com"
                          type="email"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-xs text-muted-foreground p-0 h-auto"
                          onMouseEnter={() => playSound('hover')}
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={togglePasswordVisibility}
                          onMouseEnter={() => playSound('hover')}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">Toggle password visibility</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="mt-6 w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 group"
                    disabled={isLoading}
                    onMouseEnter={() => playSound('hover')}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <>
                        Sign In
                        <LogIn className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-center w-full">
                  <Separator className="flex-1" />
                  <span className="mx-4 text-xs text-muted-foreground">OR</span>
                  <Separator className="flex-1" />
                </div>
                <Button
                  variant="outline"
                  className="w-full border-primary/20"
                  onClick={() => navigate("/register")}
                  onMouseEnter={() => playSound('hover')}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create an Account
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Right side - Image and info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="space-y-6">
              <AspectRatio ratio={4/3} className="bg-muted overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Peaceful meditation scene"
                  className="object-cover h-full w-full"
                />
              </AspectRatio>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Begin Your Wellness Journey</h2>
                <p className="text-muted-foreground">
                  Track your mood, practice mindfulness, and develop healthy habits with our
                  beautiful, science-based approach to mental wellness.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Mood Tracking</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Record and visualize your emotional patterns
                  </p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Sun className="h-5 w-5 text-amber-500" />
                    </div>
                    <h3 className="font-medium">Daily Check-ins</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Build consistent self-care routines
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-background/80 backdrop-blur-sm border-t border-border/10 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2025 Tranquil Mind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;