import React from "react";
import Layout from "@/components/Layout";
import ChatbotInterface from "@/components/ChatbotInterface";
import { MessageSquareText, Info, BookOpen, Brain, Heart, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Chatbot = () => {
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-purple-500 bg-clip-text text-transparent mb-2">
            AI Mental Health Assistant
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A supportive, judgment-free AI companion designed to provide emotional support, coping strategies, 
            and resources for your mental wellbeing journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Card className="overflow-hidden border-2 border-secondary/10 bg-card/50 backdrop-blur-sm h-[700px]">
              <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  Mental Health Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-4rem)]">
                <ChatbotInterface fullHeight={true} initialOpen={true} />
              </CardContent>
            </Card>
          </div>
              
          <div className="lg:col-span-1 space-y-4 order-1 lg:order-2">
            <Card className="border-2 border-secondary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-secondary" />
                  About This Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <p>Our Mental Health Assistant provides:</p>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  <li>Emotional support & active listening</li>
                  <li>Coping strategies for anxiety & stress</li>
                  <li>Mindfulness & relaxation techniques</li>
                  <li>Resources for professional help</li>
                </ul>
                    
                <Separator className="my-4" />
                    
                <div className="text-xs bg-secondary/5 p-3 rounded-lg">
                  <p className="font-medium text-secondary">Important Note</p>
                  <p className="mt-1">This AI assistant is not a replacement for professional mental health care. If you're experiencing a crisis, please contact emergency services or a mental health helpline immediately.</p>
                </div>
              </CardContent>
            </Card>
                
            <Card className="border-2 border-secondary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Heart className="h-4 w-4 text-secondary" />
                  Sample Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-2">
                  {[
                    "I'm feeling overwhelmed with work lately",
                    "What are some good breathing techniques for anxiety?",
                    "How can I improve my sleep quality?",
                    "I'm having trouble staying motivated",
                    "What are some self-care activities I can try?"
                  ].map((question, i) => (
                    <div key={i} className="p-2 bg-secondary/5 rounded-md hover:bg-secondary/10 cursor-pointer transition-colors text-xs">
                      {question}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-secondary" />
                  Privacy & Ethics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <p>Your conversations with our assistant are:</p>
                <ul className="mt-2 space-y-1 list-disc pl-5">
                  <li>Private and not stored permanently</li>
                  <li>Not used to train AI without consent</li>
                  <li>Protected by industry-standard encryption</li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">We prioritize your confidentiality while providing supportive guidance.</p>
              </CardContent>
            </Card>
                
            <Card className="border-2 border-secondary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="bg-secondary/5 border-b border-secondary/10 pb-4">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-secondary" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 text-sm">
                <div className="space-y-3">
                  <a href="#" className="block bg-secondary/5 p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <p className="font-medium">Mental Health Foundation</p>
                    <p className="text-xs mt-1 text-muted-foreground">Evidence-based resources and guidance</p>
                  </a>
                  <a href="#" className="block bg-secondary/5 p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <p className="font-medium">Mindfulness Practices</p>
                    <p className="text-xs mt-1 text-muted-foreground">Simple techniques for daily well-being</p>
                  </a>
                  <a href="#" className="block bg-secondary/5 p-3 rounded-lg hover:bg-secondary/10 transition-colors">
                    <p className="font-medium">Crisis Support Hotlines</p>
                    <p className="text-xs mt-1 text-muted-foreground">24/7 assistance for emergencies</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chatbot;