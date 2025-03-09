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
  Sparkles,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Fallback responses in case API fails
const FALLBACK_RESPONSES = [
  "I'm here to support you. How can I help with your mental health today?",
  "It sounds like you're going through a difficult time. Remember that it's okay to feel this way, and seeking help is a sign of strength.",
  "Have you tried any relaxation techniques, like deep breathing or meditation?",
];

// API configuration - Updated with specific flash model endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Get from environment variables

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
  const [apiError, setApiError] = useState<string | null>(null);
  const typingSpeed = 30; // milliseconds per character

  // Enhanced scroll behavior - only smooth scroll for new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      // Only use smooth scrolling if user is already near the bottom
      const messageContainer = messagesEndRef.current.parentElement;
      if (messageContainer) {
        const { scrollTop, scrollHeight, clientHeight } = messageContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
        
        messagesEndRef.current.scrollIntoView({
          behavior: isNearBottom ? "smooth" : "auto",
          block: "end"
        });
      }
    }
  }, [messages, isTyping, currentlyTyping]);

  // Check if API key is available when component mounts
  useEffect(() => {
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key is not set. Using fallback responses.");
      setApiError("API key not configured. Using simulated responses.");
    }
  }, []);

  // Simulate typing effect for bot messages with more stability
  const simulateTyping = (text: string, onComplete: (text: string) => void) => {
    setIsTyping(true);
    setCurrentlyTyping("");
    
    // Use a slightly faster typing speed for long messages
    const adaptiveSpeed = text.length > 100 ? 15 : typingSpeed;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setCurrentlyTyping(prev => prev + text[i]);
        i++;
      } else {
        clearInterval(interval);
        // Small delay before completing to avoid visual jumps
        setTimeout(() => {
          setIsTyping(false);
          onComplete(text);
        }, 100);
      }
    }, adaptiveSpeed);
    
    return () => clearInterval(interval);
  };

  // Function to generate context for the AI based on conversation history
  const generatePromptContext = () => {
    const systemPrompt = 
      "You are a supportive mental health assistant designed to provide emotional support, " +
      "coping strategies, and wellness advice. Respond with empathy and care. " +
      "Provide practical, evidence-based guidance when appropriate. " +
      "If someone is in crisis, suggest they seek professional help and provide " +
      "resources. Always maintain a calm, supportive tone. Keep responses concise but helpful.";
    
    // Include recent conversation history (last 6 messages)
    const recentMessages = messages.slice(-6);
    const conversationHistory = recentMessages.map(msg => 
      `${msg.sender === "user" ? "User" : "Assistant"}: ${msg.text}`
    ).join("\n");

    return `${systemPrompt}\n\nConversation history:\n${conversationHistory}\n\nUser: `;
  };

  // Function to call Gemini API - fixed and simplified
  const callGeminiAPI = async (userInput: string): Promise<string> => {
    if (!GEMINI_API_KEY) {
      const fallbackResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      return new Promise(resolve => setTimeout(() => resolve(fallbackResponse), 1000));
    }

    try {
      const context = generatePromptContext();
      const fullPrompt = context + userInput;
      
      console.log('Calling Gemini API with Flash model');
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [
              { text: fullPrompt }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      setApiError(null);
      
      const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        throw new Error("No response text received from API");
      }
      
      return responseText;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        setApiError(`API Error: ${errorMessage}`);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
      
      return "I'm having trouble connecting to my knowledge base. Let me try to help with what I know. How can I support you?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    playSound('click');

    const userMessage: Message = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsProcessing(true);

    try {
      const botResponse = await callGeminiAPI(inputMessage);
      
      simulateTyping(botResponse, (text) => {
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
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      
      const errorMessage: Message = {
        text: "I'm sorry, I encountered an issue processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        id: `error-${Date.now()}`
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      setIsProcessing(false);
    }
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
      setIsExpanded(false);
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
                <p className="text-xs text-muted-foreground">Powered by Gemini Flash</p>
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

        {/* API Error Alert */}
        {apiError && (
          <div className="px-4 py-2">
            <Alert variant="warning" className="bg-amber-500/10 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>API Configuration Notice</AlertTitle>
              <AlertDescription className="text-xs">{apiError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Fixed height message container with stable scroll */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-secondary/10 scrollbar-track-transparent"
            style={{ scrollBehavior: "smooth" }}  
          >
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                    <div className="min-w-[50px]"> {/* Minimum width to prevent sudden shifts */}
                      <div
                        className={`p-3 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/10 border border-secondary/10"
                        }`}
                      >
                        <div className="prose prose-sm dark:prose-invert max-w-none break-words">
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

            {/* Fixed-height typing indicator that doesn't cause layout shifts */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] flex flex-row items-start gap-3">
                  <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-secondary/20 text-secondary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="min-w-[50px]"> {/* Minimum width to prevent sudden shifts */}
                    <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/10">
                      <p className="text-sm min-h-[20px]">{currentlyTyping}<span className="animate-pulse ml-0.5">|</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Add an empty placeholder when not typing to reserve space */}
            {!isTyping && !isProcessing && (
              <div className="h-10" aria-hidden="true"></div> 
            )}
            
            {/* Processing indicator that doesn't cause layout shifts */}
            {isProcessing && !isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] flex flex-row items-start gap-3">
                  <div className="shrink-0 h-8 w-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="min-h-[40px] flex items-center">
                    <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/10">
                      <div className="flex space-x-2 items-center h-5">
                        <span className="h-2 w-2 bg-secondary/40 rounded-full animate-pulse"></span>
                        <span className="h-2 w-2 bg-secondary/40 rounded-full animate-pulse" style={{animationDelay: "0.2s"}}></span>
                        <span className="h-2 w-2 bg-secondary/40 rounded-full animate-pulse" style={{animationDelay: "0.4s"}}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Fixed-height input container */}
        <div className="p-4 border-t border-secondary/10 bg-background/50">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-background/50 border-secondary/20 focus-visible:ring-secondary/30 h-10"
              disabled={isProcessing}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputMessage.trim() || isProcessing}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-10"
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

  // Floating version (also stabilized) - fixed for proper JSX structure
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

      {/* Chat interface with stable heights */}
      {isOpen && (
        <Card
          className={`fixed ${
            isExpanded ? "top-4 left-4 right-4 bottom-4" : "bottom-4 right-4 w-80 h-[28rem]"
          } shadow-xl z-50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden glass-card-accent`}
        >
          <CardHeader className="bg-secondary/20 py-3 px-4 shrink-0">
            <div className="flex flex-col gap-2">
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
            </div>
          </CardHeader>
          
          {/* API Error Alert for floating version */}
          {apiError && (
            <div className="px-3 py-1 bg-amber-500/5">
              <Alert variant="warning" className="py-2">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription className="text-[10px]">{apiError}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <CardContent className="flex-1 overflow-hidden p-0">
            <div className="h-full overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-secondary/10 scrollbar-track-transparent">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
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
                      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
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
              
              {/* Stable typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary/20 p-3 rounded-lg max-w-[80%]">
                    <div className="flex items-center gap-1 mb-1">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs opacity-75">Assistant</span>
                    </div>
                    <p className="text-sm min-h-[20px]">{currentlyTyping}<span className="animate-pulse">|</span></p>
                  </div>
                </motion.div>
              )}
              
              {/* Processing indicator */}
              {isProcessing && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
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
                </motion.div>
              )}
              
              {!isProcessing && !isTyping && (
                <div className="h-6" aria-hidden="true"></div>
              )}
              
              <div ref={messagesEndRef} className="h-2" />
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-2 border-t border-secondary/20 shrink-0">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-background/50 h-9"
                disabled={isProcessing}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isProcessing}
                onMouseEnter={() => playSound('hover')}
                className="bg-secondary hover:bg-secondary/90 h-9 px-3"
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
