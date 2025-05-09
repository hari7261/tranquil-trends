import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  UserPlus,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Sun,
  Moon,
  User,
  Check,
  X,
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
import { useSound } from "@/hooks/use-sound";
import { toast } from "@/hooks/use-toast";

interface User {
  email: string;
  password: string;
  name: string;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationState {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isValid, setIsValid] = useState<ValidationState>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

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
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Validate form fields
  useEffect(() => {
    setIsValid({
      name: formState.name.length >= 2,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email),
      password: formState.password.length >= 6,
      confirmPassword: formState.password === formState.confirmPassword && formState.confirmPassword.length > 0,
    });
  }, [formState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    playSound("click");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Mark all fields as touched for validation
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Check if all fields are valid
    if (!Object.values(isValid).every(Boolean)) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoading(true);
    playSound("click");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Get existing users from localStorage
      const usersJSON = localStorage.getItem("users");
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

      // Check if user with this email already exists
      if (users.some((user) => user.email === formState.email)) {
        setError("An account with this email already exists.");
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser: User = {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      };

      // Add user to localStorage
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Set as logged in
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      localStorage.setItem("userName", newUser.name);

      // Success!
      toast({
        title: "Account created successfully!",
        description: `Welcome to Tranquil Mind, ${newUser.name}!`,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background to-background/70 flex flex-col">
      {/* Hero Background with Parallax */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-15"
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

      <main className="flex-1 flex items-center justify-center p-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-primary/10 shadow-xl bg-background/80 backdrop-blur-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>
                Enter your information to create your Tranquil Mind account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister}>
                {error && (
                  <Alert variant="destructive" className="mb-4 bg-destructive/5 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name
                      {touched.name && (
                        <span className="ml-2">
                          {isValid.name ? (
                            <Check className="inline h-4 w-4 text-green-500" />
                          ) : (
                            <X className="inline h-4 w-4 text-red-500" />
                          )}
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        className={`pl-10 ${
                          touched.name && !isValid.name ? "border-red-500" : ""
                        }`}
                        value={formState.name}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        required
                      />
                    </div>
                    {touched.name && !isValid.name && (
                      <p className="text-xs text-red-500">Name must be at least 2 characters</p>
                    )}
                  </div>
                  
                  {/* Email field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email
                      {touched.email && (
                        <span className="ml-2">
                          {isValid.email ? (
                            <Check className="inline h-4 w-4 text-green-500" />
                          ) : (
                            <X className="inline h-4 w-4 text-red-500" />
                          )}
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        className={`pl-10 ${
                          touched.email && !isValid.email ? "border-red-500" : ""
                        }`}
                        value={formState.email}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        required
                      />
                    </div>
                    {touched.email && !isValid.email && (
                      <p className="text-xs text-red-500">Please enter a valid email address</p>
                    )}
                  </div>
                  
                  {/* Password field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password
                      {touched.password && (
                        <span className="ml-2">
                          {isValid.password ? (
                            <Check className="inline h-4 w-4 text-green-500" />
                          ) : (
                            <X className="inline h-4 w-4 text-red-500" />
                          )}
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`pl-10 pr-10 ${
                          touched.password && !isValid.password ? "border-red-500" : ""
                        }`}
                        value={formState.password}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
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
                    {touched.password && !isValid.password && (
                      <p className="text-xs text-red-500">Password must be at least 6 characters</p>
                    )}
                  </div>
                  
                  {/* Confirm Password field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password
                      {touched.confirmPassword && (
                        <span className="ml-2">
                          {isValid.confirmPassword ? (
                            <Check className="inline h-4 w-4 text-green-500" />
                          ) : (
                            <X className="inline h-4 w-4 text-red-500" />
                          )}
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className={`pl-10 ${
                          touched.confirmPassword && !isValid.confirmPassword ? "border-red-500" : ""
                        }`}
                        value={formState.confirmPassword}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        required
                      />
                    </div>
                    {touched.confirmPassword && !isValid.confirmPassword && (
                      <p className="text-xs text-red-500">Passwords do not match</p>
                    )}
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
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                onClick={() => navigate("/login")}
                onMouseEnter={() => playSound('hover')}
              >
                Already have an account? Sign in
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardFooter>
          </Card>
        </motion.div>
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

export default RegisterPage;