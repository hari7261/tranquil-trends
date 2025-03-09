import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { 
  Bot, 
  Send, 
  User, 
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  RefreshCcw,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";

// Mock responses for the chatbot
const SAMPLE_RESPONSES = [
  "I'm here to support you. How can I help with your mental health today?",
  "It sounds like you're going through a difficult time. Remember that it's okay to feel this way, and seeking help is a sign of strength.",
  "Have you tried any relaxation techniques, like deep breathing or meditation?",
  "Your feelings are valid. Would you like to talk more about what's troubling you?",
  "Consider incorporating small self-care activities into your daily routine. What are some activities you enjoy?",
  "Remember that progress isn't always linear. Give yourself grace during challenging moments.",
  "It might be helpful to break down overwhelming tasks into smaller, more manageable steps.",
  "How have you been sleeping lately? Sleep can significantly impact our mental wellbeing.",
  "Have you spoken with a mental health professional about these feelings?",
  "I'm here to listen whenever you need to talk.",
];

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  id?: string;
}

interface ChatbotInterfaceProps {
  initialOpen?: boolean;
  fullHeight?: boolean;
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({ 
  initialOpen = false,
  fullHeight = false
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm your mental health assistant. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
      id: "welcome-message"
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playSound, toggleSound, isSoundEnabled } = useSound();
  const [isTyping, setIsTyping] = useState(false);
  const [currentlyTyping, setCurrentlyTyping] = useState("");
  const typingSpeed = 30; // milliseconds per character

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentlyTyping]);

  // Simulate typing effect for bot messages
  const simulateTyping = (text: string, onComplete: (text: string) => void) => {
    setIsTyping(true);
    setCurrentlyTyping("");
    
    let i = 0;
    const interval = setInterval(() => {
      setCurrentlyTyping(prev => prev + text[i]);
      i++;
      
      if (i === text.length) {
        clearInterval(interval);
        setIsTyping(false);
        onComplete(text);
      }
    }, typingSpeed);
    
    return () => clearInterval(interval);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    playSound('click');

    // Add user message with unique ID
    const userMessage: Message = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      // In a real app, we would call the Gemini API here
      const randomResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      
      // Start typing animation
      simulateTyping(randomResponse, (text) => {
        const botMessage: Message = {
          text,
          sender: "bot",
          timestamp: new Date(),
          id: `bot-${Date.now()}`
        };
        
        setMessages((prev) => [...prev, botMessage]);
        setIsProcessing(false);
        playSound('notification');
      });
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    playSound('transition');
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false); // Reset expanded state when opening
    }
  };

  const toggleExpand = () => {
    playSound('click');
    setIsExpanded(!isExpanded);
  };

  const handleToggleSound = () => {
    const newSoundState = toggleSound();
    toast({
      title: newSoundState ? "Sound effects enabled" : "Sound effects disabled",
      description: newSoundState ? "You will now hear interactive sounds" : "Sounds are now muted",
    });
  };
  
  const resetChat = () => {
    playSound('transition');
    setMessages([{
      text: "Hi there! I'm your mental health assistant. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
      id: "welcome-message-new"
    }]);
  };

  if (fullHeight && isOpen) {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden bg-background/80 backdrop-blur-sm">
        <div className="bg-secondary/10 py-3 px-4 border-b border-secondary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-secondary/20">
                <Bot className="h-4 w-4 text-secondary" />
              </Avatar>
              <div>
                <h3 className="text-base font-medium">Mental Health Assistant</h3>
                <p className="text-xs text-muted-foreground">Supportive conversation & coping strategies</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-secondary/10"
                onClick={handleToggleSound}
                onMouseEnter={() => playSound('hover')}
              >
                {isSoundEnabled() ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-secondary/10"
                onClick={resetChat}
                onMouseEnter={() => playSound('hover')}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] flex ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start gap-3`}
                >
                  <div 
                    className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
                      message.sender === "user" 
                        ? "bg-primary/20 text-primary-foreground" 
                        : "bg-secondary/20 text-secondary"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/10 border border-secondary/10"
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 px-1 flex items-center gap-1">
                      {message.sender === "bot" && (
                        <Badge variant="outline" className="text-[10px] py-0 h-4 px-1 mr-1 border-secondary/20">
                          <Sparkles className="h-2.5 w-2.5 mr-1 text-secondary/70" />
                          AI Assistant
                        </Badge>
                      )}
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[85%] flex flex-row items-start gap-3">
                <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-secondary/20 text-secondary">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/10">
                    <p className="text-sm">{currentlyTyping}<span className="animate-pulse">|</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-secondary/10 bg-background/50">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-background/50 border-secondary/20 focus-visible:ring-secondary/30"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isProcessing}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              onMouseEnter={() => playSound('hover')}
            >
              <Send className="h-4 w-4 mr-2" />
              {isProcessing ? "Processing..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // This is the floating version, which we'll keep in case it's ever used elsewhere
  return (
    <>
      {/* Floating button to open chat when closed */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50 flex items-center justify-center animate-pulse-glow bg-secondary hover:bg-secondary/90"
          onMouseEnter={() => playSound('hover')}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat interface */}
      {isOpen && (
        <Card
          className={`fixed ${
            isExpanded ? "top-4 left-4 right-4 bottom-4" : "bottom-4 right-4 w-80 h-96"
          } shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden glass-card-accent`}
        >
          <CardHeader className="bg-secondary/20 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-secondary/30">
                  <Bot className="h-4 w-4 text-secondary-foreground" />
                </Avatar>
                <CardTitle className="text-base">Mental Health Assistant</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleToggleSound}
                  onMouseEnter={() => playSound('hover')}
                >
                  {isSoundEnabled() ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleExpand}
                  onMouseEnter={() => playSound('hover')}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={toggleChat}
                  onMouseEnter={() => playSound('hover')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground animate-slide-in"
                        : "bg-secondary/20 animate-fade-in"
                    }`}
                  >
                    <div className="flex items-center mb-1 gap-1">
                      {message.sender === "bot" ? (
                        <Bot className="h-3 w-3" />
                      ) : (
                        <User className="h-3 w-3" />
                      )}
                      <span className="text-xs opacity-75">
                        {message.sender === "user" ? "You" : "Assistant"}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-50 mt-1 text-right">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-secondary/20 p-3 rounded-lg max-w-[80%]">
                  <div className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    <div className="ml-2 flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 pt-2 border-t border-secondary/20">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-background/50"
                disabled={isProcessing}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isProcessing}
                onMouseEnter={() => playSound('hover')}
                className="bg-secondary hover:bg-secondary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default ChatbotInterface;
