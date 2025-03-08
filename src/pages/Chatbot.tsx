import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './chatbot.css';

const FitnessChatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [userProfile, setUserProfile] = useState({
    fitnessLevel: '',
    fitnessGoals: [],
    workoutDays: 0,
    dietaryPreferences: '',
    initialized: false
  });

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: "👋 Welcome to FitBot, your personal fitness assistant! I'm here to help you achieve your health and fitness goals. Let me know what you're looking to accomplish - whether it's weight loss, muscle gain, improved endurance, better flexibility, or overall well-being. How can I assist you today?"
        }
      ]);
    }
  }, []);

  const formatMessage = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return parts;
  };

  const CodeBlock = ({ language, content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="code-block">
        <div className="code-header">
          <span>{language}</span>
          <button className="copy-button" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers
        >
          {content}
        </SyntaxHighlighter>
      </div>
    );
  };

  const TypingAnimation = () => (
    <div className="loading-animation">
      <motion.div
        className="loading-dot"
        initial={{ scale: 0.8, opacity: 0.2 }}
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <motion.div
        className="loading-dot"
        initial={{ scale: 0.8, opacity: 0.2 }}
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.4, delay: 0.2, repeat: Infinity }}
      />
      <motion.div
        className="loading-dot"
        initial={{ scale: 0.8, opacity: 0.2 }}
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.4, delay: 0.4, repeat: Infinity }}
      />
    </div>
  );

  const AnimatedText = ({ text }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="typing-animation"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </motion.div>
    );
  };

  // Enhance the user input with fitness context
  const enhancePrompt = (userInput) => {
    let systemContext = `You are FitBot, an intelligent fitness assistant that provides personalized guidance on fitness, nutrition, mental health, and overall well-being. Be engaging, motivational, and supportive. Provide evidence-based advice that is practical and actionable. Keep responses concise but informative.`;
    
    if (userProfile.initialized) {
      systemContext += `\n\nUser Profile:
- Fitness Level: ${userProfile.fitnessLevel}
- Fitness Goals: ${userProfile.fitnessGoals.join(', ')}
- Available Workout Days: ${userProfile.workoutDays} days per week
- Dietary Preferences: ${userProfile.dietaryPreferences}`;
    }

    // Extract conversation history for context
    const conversationHistory = messages.map(msg => 
      `${msg.sender === 'user' ? 'User' : 'FitBot'}: ${msg.text}`
    ).join('\n');

    return `${systemContext}\n\nConversation History:\n${conversationHistory}\n\nUser: ${userInput}\n\nFitBot:`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      // Enhanced prompt with fitness context
      const enhancedPrompt = enhancePrompt(input);
      
      const response = await axios.post(
        apiUrl,
        {
          contents: [{
            parts: [{
              text: enhancedPrompt,
            }],
          }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const botResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
      
      // Update user profile based on responses if needed
      updateUserProfile(input, botResponse);
      
      setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: 'Sorry, I had trouble connecting to my fitness knowledge base. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple function to update user profile based on conversation context
  const updateUserProfile = (userInput, botResponse) => {
    // Only try to initialize profile if not already done
    if (!userProfile.initialized) {
      // Check for fitness level indicators
      if (userInput.toLowerCase().includes('beginner') || 
          userInput.toLowerCase().includes('new to fitness') ||
          botResponse.toLowerCase().includes('beginner')) {
        setUserProfile(prev => ({...prev, fitnessLevel: 'Beginner', initialized: true}));
      } else if (userInput.toLowerCase().includes('intermediate')) {
        setUserProfile(prev => ({...prev, fitnessLevel: 'Intermediate', initialized: true}));
      } else if (userInput.toLowerCase().includes('advanced')) {
        setUserProfile(prev => ({...prev, fitnessLevel: 'Advanced', initialized: true}));
      }
      
      // Check for goals
      const possibleGoals = ['weight loss', 'lose weight', 'build muscle', 'muscle gain', 
                           'endurance', 'flexibility', 'mental health', 'strength'];
      const detectedGoals = [];
      
      possibleGoals.forEach(goal => {
        if (userInput.toLowerCase().includes(goal)) {
          detectedGoals.push(goal);
        }
      });
      
      if (detectedGoals.length > 0) {
        setUserProfile(prev => ({...prev, fitnessGoals: detectedGoals, initialized: true}));
      }
      
      // Check for workout days
      const daysMatch = userInput.match(/(\d+)[\s-]*days?/i);
      if (daysMatch) {
        setUserProfile(prev => ({...prev, workoutDays: parseInt(daysMatch[1]), initialized: true}));
      }
      
      // Check for dietary preferences
      const diets = ['vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free'];
      diets.forEach(diet => {
        if (userInput.toLowerCase().includes(diet)) {
          setUserProfile(prev => ({...prev, dietaryPreferences: diet, initialized: true}));
        }
      });
    }
  };

  const clearChat = () => {
    setMessages([{
      sender: 'bot',
      text: "👋 Welcome back to FitBot! Let's continue working on your fitness journey. How can I help you today?"
    }]);
    setUserProfile({
      fitnessLevel: '',
      fitnessGoals: [],
      workoutDays: 0,
      dietaryPreferences: '',
      initialized: false
    });
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "The only bad workout is the one that didn't happen.",
      "Your body can stand almost anything. It's your mind you have to convince.",
      "Fitness is not about being better than someone else. It's about being better than you used to be.",
      "Take care of your body. It's the only place you have to live.",
      "The hard part isn't getting your body in shape. The hard part is getting your mind in shape.",
      "Your health is an investment, not an expense.",
      "The pain you feel today will be the strength you feel tomorrow."
    ];
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    setMessages([...messages, { 
      sender: 'bot', 
      text: `💪 *Daily Motivation* 💪\n\n"${quotes[randomIndex]}"` 
    }]);
  };

  return (
    <div className="chatbot-container fitness-theme">
      {/* Header */}
      <header className="chatbot-header">
        <h1>FitBot AI</h1>
        <p>Your personal fitness coach, nutrition guide, and wellness companion</p>
      </header>

      {/* Model info */}
      <div className="model-info-banner">
        <p>Powered by Gemini 2.0 Flash</p>
        <button 
          className="motivation-button"
          onClick={getMotivationalQuote}
          disabled={isLoading}
        >
          Get Motivation
        </button>
      </div>

      {/* Chatbot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="chatbot"
      >
        <button className="clear-chat" onClick={clearChat}>
          Reset FitBot
        </button>

        <div className="messages">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`message ${msg.sender}`}
              >
                <div className="avatar">
                  {msg.sender === 'user' ? '👤' : '💪'}
                </div>
                <div className="message-content">
                  {formatMessage(msg.text).map((part, i) =>
                    part.type === 'code' ? (
                      <CodeBlock
                        key={i}
                        language={part.language}
                        content={part.content}
                      />
                    ) : (
                      <AnimatedText key={i} text={part.content} />
                    )
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="message bot"
              >
                <div className="avatar">💪</div>
                <div className="message-content">
                  <TypingAnimation />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about workouts, nutrition, or wellness..."
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            disabled={isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={isLoading}
            className="send-button"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </motion.button>
        </div>
      </motion.div>

      {/* User profile display */}
      {userProfile.initialized && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="user-profile-container"
        >
          <h3>Your Fitness Profile</h3>
          <div className="profile-details">
            <p><strong>Level:</strong> {userProfile.fitnessLevel || "Not specified"}</p>
            <p><strong>Goals:</strong> {userProfile.fitnessGoals.length > 0 ? userProfile.fitnessGoals.join(", ") : "Not specified"}</p>
            <p><strong>Workout Days:</strong> {userProfile.workoutDays > 0 ? `${userProfile.workoutDays} days/week` : "Not specified"}</p>
            <p><strong>Diet:</strong> {userProfile.dietaryPreferences || "No restrictions"}</p>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="chatbot-footer">
        <p>© 2025 FitBot AI. Your journey to better health.</p>
        <p className="model-info">Powered by: Gemini 2.0 Flash</p>
      </footer>
    </div>
  );
};

export default FitnessChatbot;