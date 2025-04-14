'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { processMessage } from '@/utils/chatUtils';

// Types
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Suggested queries to help users get started
const suggestedQueries = [
  "What kind of gifts do you offer?",
  "Help me find a wedding gift",
  "Do you offer customization?",
  "How does Gift Concierge work?",
  "Tell me about your collections"
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to Bling×Beyond! I\'m your luxury gifting assistant. How may I help you find the perfect gift today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Reset error state when chat is opened/closed
  useEffect(() => {
    if (isOpen) {
      setApiError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Hide suggestions after a user sends their first message
  useEffect(() => {
    if (messages.length > 1 && messages.some(msg => msg.sender === 'user')) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e?: React.FormEvent, suggestedText?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = suggestedText || inputText;
    if (!textToSend.trim()) return;

    // Reset error state
    setApiError(null);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Process the message using our utility function
      const response = await processMessage(textToSend);
      respondWithBotMessage(response);
    } catch (error) {
      console.error('Error processing message:', error);
      setApiError('Failed to connect to Gemini API. Please try again later.');
      respondWithBotMessage('I apologize for the inconvenience. I seem to be having trouble connecting to our systems. Please try again in a moment or reach out to our customer service for immediate assistance.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(undefined, query);
  };

  const respondWithBotMessage = (text: string) => {
    // Format links in the text - replace paths with readable text and use ivory color
    const formattedText = text.replace(
      /(\/([\w-]+)(\/[\w-]+)*)/g, 
      (match, path) => {
        // Extract the last segment from the path to use as display text
        const segments = path.split('/').filter(Boolean);
        const displayText = segments.length > 0 
          ? segments[segments.length - 1].replace(/-/g, ' ')
          : path;
        
        // Capitalize first letter of each word
        const capitalizedText = displayText
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        return `<a href="${path}" class="text-ivory font-semibold hover:underline">${capitalizedText}</a>`;
      }
    );

    const botMessage: Message = {
      id: Date.now().toString(),
      text: formattedText,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      text: 'Welcome to Bling×Beyond! I\'m your luxury gifting assistant. How may I help you find the perfect gift today?',
      sender: 'bot',
      timestamp: new Date(),
    }]);
    setShowSuggestions(true);
  };

  const formatMessage = (text: string) => {
    return { __html: text };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 rounded-full bg-gold text-charcoal shadow-lg flex items-center justify-center hover:bg-gold/90 transition-colors duration-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-charcoal text-ivory p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gold text-charcoal flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium font-playfair">Bling×Beyond Assistant</h3>
                  <p className="text-xs text-ivory/70">Luxury Gifting Expert</p>
                </div>
              </div>
              <button 
                onClick={resetChat}
                className="text-ivory/70 hover:text-ivory transition-colors p-1"
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 bg-charcoal/5">
              {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">
                  <p className="font-medium">Connection Error</p>
                  <p>{apiError}</p>
                </div>
              )}
            
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-gold text-charcoal' 
                        : 'bg-charcoal/10 text-charcoal'
                    }`}
                  >
                    <div 
                      dangerouslySetInnerHTML={formatMessage(message.text)} 
                      className={`${message.sender === 'bot' ? 'prose prose-sm max-w-none' : ''}`}
                    />
                    <p className="text-xs opacity-50 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-left mb-4">
                  <div className="inline-block rounded-lg px-4 py-2 bg-charcoal/10 text-charcoal">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-charcoal/60 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-charcoal/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-charcoal/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Queries */}
              {showSuggestions && messages.length === 1 && !isLoading && (
                <div className="my-4">
                  <p className="text-sm text-charcoal/70 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQueries.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuery(query)}
                        className="text-sm bg-white border border-charcoal/20 hover:border-gold hover:bg-gold/5 text-charcoal px-3 py-1 rounded-full transition-colors duration-200"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gold"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold text-charcoal rounded-r-md hover:bg-gold/90 transition-colors"
                  disabled={isLoading || !inputText.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 