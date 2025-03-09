
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
import { Bot, Send, User, Volume2, VolumeX } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSound } from "@/hooks/use-sound";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface GeminiChatbotProps {
  fullHeight?: boolean;
}

const GeminiChatbot: React.FC<GeminiChatbotProps> = ({ 
  fullHeight = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm your mental health assistant powered by Gemini AI. How can I support you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { playSound, toggleSound, isSoundEnabled } = useSound();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    playSound('click');

    // Add user message
    const userMessage: Message = {
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsProcessing(true);

    try {
      // Call Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.REACT_APP_GEMINI_FLASH_API_KEY || '',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `I want you to act as a mental health assistant. Provide supportive, empathetic responses. Your goal is to listen, validate feelings, and offer general mental health guidance. Never diagnose medical conditions or provide medical advice. Keep responses concise (under 150 words). Context: The user asks: "${inputMessage}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the bot response from the API response
      let botResponseText = "I'm sorry, I couldn't process your request right now.";
      
      if (data.candidates && data.candidates[0].content) {
        botResponseText = data.candidates[0].content.parts[0].text;
      }
      
      const botMessage: Message = {
        text: botResponseText,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      playSound('notification');
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      // Add error message
      const errorMessage: Message = {
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: "Connection error",
        description: "Could not connect to the Gemini API. Please check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleSound = () => {
    const newSoundState = toggleSound();
    toast({
      title: newSoundState ? "Sound effects enabled" : "Sound effects disabled",
      description: newSoundState ? "You will now hear interactive sounds" : "Sounds are now muted",
    });
  };

  return (
    <Card className={`w-full ${fullHeight ? 'h-full max-h-[75vh] md:max-h-none' : 'h-[600px]'} flex flex-col overflow-hidden glass-card-accent`}>
      <CardHeader className="bg-secondary/20 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-secondary/30">
              <Bot className="h-4 w-4 text-secondary-foreground" />
            </Avatar>
            <CardTitle className="text-base">Gemini Mental Health Assistant</CardTitle>
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
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
          </div>
        ))}
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
      <CardFooter className="p-3 pt-2 border-t border-accent/20">
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
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeminiChatbot;
