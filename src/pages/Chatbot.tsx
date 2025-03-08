import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './chatbot.css';

const MentalHealthChatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [userProfile, setUserProfile] = useState({
    mentalState: '',
    mentalHealthGoals: [],
    stressLevel: 0,
    copingMechanisms: [],
    sleepHours: 0,
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
          text: "👋 Welcome to MindTracker, your personal mental health assistant! I'm here to help you monitor and improve your mental wellbeing. Whether you're dealing with stress, anxiety, looking to improve your mood, or just want someone to talk to - I'm here to support you. How are you feeling today?"
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

  // Enhance the user input with mental health context
  const enhancePrompt = (userInput) => {
    let systemContext = `You are MindTracker, an intelligent mental health assistant that provides personalized guidance on emotional wellbeing, stress management, anxiety reduction, and overall mental health. Be empathetic, supportive, and understanding. Provide evidence-based advice that is practical and actionable. Keep responses concise but compassionate. Never suggest you are replacing professional mental health care - always recommend seeking professional help for serious concerns.`;
    
    if (userProfile.initialized) {
      systemContext += `\n\nUser Profile:
- Current Mental State: ${userProfile.mentalState}
- Mental Health Goals: ${userProfile.mentalHealthGoals.join(', ')}
- Stress Level (1-10): ${userProfile.stressLevel}
- Coping Mechanisms: ${userProfile.copingMechanisms.join(', ')}
- Sleep Hours: ${userProfile.sleepHours} hours/night`;
    }

    // Extract conversation history for context
    const conversationHistory = messages.map(msg => 
      `${msg.sender === 'user' ? 'User' : 'MindTracker'}: ${msg.text}`
    ).join('\n');

    return `${systemContext}\n\nConversation History:\n${conversationHistory}\n\nUser: ${userInput}\n\nMindTracker:`;
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
      
      // Enhanced prompt with mental health context
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
          text: 'Sorry, I had trouble connecting. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user profile based on conversation context
  const updateUserProfile = (userInput, botResponse) => {
    // Only try to initialize profile if not already done or update incrementally
    const input = userInput.toLowerCase();
    
    // Check for mental state indicators
    const mentalStateKeywords = {
      'anxious': 'Anxious',
      'worried': 'Anxious',
      'stressed': 'Stressed',
      'overwhelmed': 'Overwhelmed',
      'sad': 'Sad',
      'depressed': 'Sad',
      'happy': 'Happy',
      'content': 'Content',
      'calm': 'Calm',
      'angry': 'Angry',
      'frustrated': 'Frustrated'
    };
    
    Object.keys(mentalStateKeywords).forEach(keyword => {
      if (input.includes(keyword)) {
        setUserProfile(prev => ({...prev, mentalState: mentalStateKeywords[keyword], initialized: true}));
      }
    });
    
    // Check for mental health goals
    const possibleGoals = ['reduce anxiety', 'manage stress', 'improve mood', 'sleep better', 
                         'mindfulness', 'build resilience', 'reduce negative thoughts'];
    const detectedGoals = [];
    
    possibleGoals.forEach(goal => {
      if (input.includes(goal)) {
        detectedGoals.push(goal);
      }
    });
    
    if (detectedGoals.length > 0) {
      setUserProfile(prev => ({...prev, mentalHealthGoals: [...prev.mentalHealthGoals, ...detectedGoals], initialized: true}));
    }
    
    // Check for stress level
    const stressMatch = input.match(/stress level (?:of |is |at |)(\d+)/i) || 
                       input.match(/(\d+)(?:\/10)? stress/i);
    if (stressMatch) {
      const level = parseInt(stressMatch[1]);
      if (level >= 0 && level <= 10) {
        setUserProfile(prev => ({...prev, stressLevel: level, initialized: true}));
      }
    }
    
    // Check for coping mechanisms
    const copingMechanisms = ['meditation', 'exercise', 'reading', 'journaling', 'therapy', 
                            'breathing exercises', 'yoga', 'talking to friends'];
    
    copingMechanisms.forEach(mechanism => {
      if (input.includes(mechanism)) {
        setUserProfile(prev => ({
          ...prev, 
          copingMechanisms: [...prev.copingMechanisms, mechanism].filter((v, i, a) => a.indexOf(v) === i), 
          initialized: true
        }));
      }
    });
    
    // Check for sleep hours
    const sleepMatch = input.match(/sleep (?:for |)(\d+)(?: hours| hrs)/i) ||
                      input.match(/(\d+) hours of sleep/i);
    if (sleepMatch) {
      const hours = parseInt(sleepMatch[1]);
      if (hours > 0 && hours <= 24) {
        setUserProfile(prev => ({...prev, sleepHours: hours, initialized: true}));
      }
    }
  };

  const clearChat = () => {
    setMessages([{
      sender: 'bot',
      text: "👋 Welcome back to MindTracker! I'm here to continue supporting your mental health journey. How are you feeling right now?"
    }]);
    setUserProfile({
      mentalState: '',
      mentalHealthGoals: [],
      stressLevel: 0,
      copingMechanisms: [],
      sleepHours: 0,
      initialized: false
    });
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "It's okay not to be okay. It's not okay to stay that way.",
      "Self-care is how you take your power back.",
      "You don't have to control your thoughts. You just have to stop letting them control you.",
      "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      "Healing takes time, and asking for help is a courageous step.",
      "There is hope, even when your brain tells you there isn't.",
      "Recovery is not one and done. It is one day at a time.",
      "Be proud of yourself for how hard you're trying."
    ];
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    setMessages([...messages, { 
      sender: 'bot', 
      text: `💭 *Daily Mindfulness* 💭\n\n"${quotes[randomIndex]}"` 
    }]);
  };

  return (
    <div className="chatbot-container mental-health-theme">
      {/* Header */}
      <header className="chatbot-header">
        <h1>MindTracker AI</h1>
        <p>Your personal mental health companion, mood tracker, and wellness guide</p>
      </header>

      {/* Model info */}
      <div className="model-info-banner">
        <p>Powered by Gemini 2.0 Flash</p>
        <button 
          className="mindfulness-button"
          onClick={getMotivationalQuote}
          disabled={isLoading}
        >
          Get Mindfulness Quote
        </button>
      </div>

      {/* Chatbot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="chatbot"
      >
        <button className="clear-chat" onClick={clearChat}>
          Reset MindTracker
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
                  {msg.sender === 'user' ? '👤' : '🧠'}
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
                <div className="avatar">🧠</div>
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
            placeholder="How are you feeling? Share your thoughts..."
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
          <h3>Your Mental Health Profile</h3>
          <div className="profile-details">
            <p><strong>Current State:</strong> {userProfile.mentalState || "Not specified"}</p>
            <p><strong>Goals:</strong> {userProfile.mentalHealthGoals.length > 0 ? userProfile.mentalHealthGoals.join(", ") : "Not specified"}</p>
            <p><strong>Stress Level:</strong> {userProfile.stressLevel > 0 ? `${userProfile.stressLevel}/10` : "Not specified"}</p>
            <p><strong>Coping Strategies:</strong> {userProfile.copingMechanisms.length > 0 ? userProfile.copingMechanisms.join(", ") : "Not specified"}</p>
            {userProfile.sleepHours > 0 && <p><strong>Sleep:</strong> {userProfile.sleepHours} hours/night</p>}
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="chatbot-footer">
        <p>© 2025 MindTracker AI. Supporting your journey to mental wellbeing.</p>
        <p className="disclaimer">This is not a substitute for professional mental health care. If you're in crisis, please contact a mental health professional or emergency services.</p>
        <p className="model-info">Powered by: Gemini 2.0 Flash</p>
      </footer>
    </div>
  );
};

export default MentalHealthChatbot;