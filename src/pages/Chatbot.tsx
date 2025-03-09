
import React from "react";
import Layout from "@/components/Layout";
import ChatbotInterface from "@/components/ChatbotInterface";
import GeminiChatbot from "@/components/GeminiChatbot";
import { MessageSquareText, Bot, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Chatbot = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-2">
            <MessageSquareText className="h-8 w-8 text-primary" />
            Mental Health Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Talk to our AI assistants about your mental health concerns
          </p>
        </section>
        
        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="standard">Standard Assistant</TabsTrigger>
            <TabsTrigger value="gemini">Gemini AI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="glass-card p-6 h-full">
                  <h2 className="text-xl font-medium mb-4">How can the assistant help?</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Discuss your feelings and emotions in a safe, private space</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Get suggestions for coping strategies and self-care activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Learn about different mental health topics and resources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Receive supportive guidance for challenging situations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Practice mindfulness and relaxation techniques</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                    <p className="text-sm font-medium">Important Note</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This AI assistant is not a substitute for professional mental health care. 
                      If you're experiencing a crisis or need immediate help, please contact a mental health 
                      professional or emergency services.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-1">
                <div className="h-full flex flex-col">
                  <ChatbotInterface initialOpen={true} fullHeight />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gemini" className="space-y-4">
            <Card className="glass-card-accent border-0">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row h-[600px]">
                  <div className="w-full lg:w-1/3 p-6 border-r border-border/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Gemini AI Chat</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      Our advanced Gemini-powered mental health assistant provides more personalized responses and can help with complex concerns.
                    </p>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="bg-background/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          About this assistant
                        </h4>
                        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                          <li className="flex items-start gap-1">
                            <span className="text-primary text-xs">•</span>
                            <span>Powered by Google's Gemini AI model</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-primary text-xs">•</span>
                            <span>Advanced understanding of mental health topics</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-primary text-xs">•</span>
                            <span>More personalized conversation flow</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-primary text-xs">•</span>
                            <span>Can understand complex emotional concerns</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-background/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium">Conversation privacy</h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Your conversations are processed by Google's Gemini API.
                          Please review Google's privacy policy for information on how your data is handled.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 h-full">
                    <GeminiChatbot fullHeight />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Chatbot;
