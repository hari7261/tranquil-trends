
import React from "react";
import Layout from "@/components/Layout";
import ChatbotInterface from "@/components/ChatbotInterface";
import { MessageSquareText } from "lucide-react";

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
            Talk to our AI assistant about your mental health concerns
          </p>
        </section>
        
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
              <ChatbotInterface initialOpen={true} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chatbot;
