'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, ShieldAlert, BadgeDollarSign, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Salom! I'm your AureumTech Assistant. How can I help you customize your hardware setup today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { sender: 'user', text: textToSend, time: userTime };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });
      const data = await res.json();
      
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply,
        time: botTime
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, I am facing connectivity issues. Please try again.',
        time: userTime
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-80 sm:w-96 h-[450px] rounded-2xl glass-panel border border-brand-glass-border flex flex-col shadow-2xl overflow-hidden backdrop-blur-2xl mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-brand-dark-brown/50 border-b border-brand-glass-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-bronze flex items-center justify-center">
                  <MessageSquare className="w-4.5 h-4.5 text-brand-black" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-cream">Aureum Assistant</h3>
                  <span className="text-[10px] text-brand-bronze flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" /> Online Support
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-brand-brown/40 text-brand-taupe hover:text-brand-cream transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-black/25">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed border ${
                      msg.sender === 'user'
                        ? 'bg-brand-bronze text-brand-black border-brand-bronze/20 rounded-tr-none'
                        : 'bg-brand-brown/30 text-brand-cream border-brand-glass-border rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-brand-taupe/70 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1.5 items-center mr-auto p-2.5 rounded-2xl bg-brand-brown/30 border border-brand-glass-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-bronze animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-bronze animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-bronze animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Panel */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-brand-glass-border/30 bg-brand-brown/5 flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-brand-taupe/80 px-1">Common Questions:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSuggestion("Check PC builder compatibility")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-brand-glass-border hover:border-brand-bronze/35 bg-brand-black/20 text-brand-cream text-[10px] font-semibold transition-all hover:bg-brand-brown/10"
                  >
                    <Cpu className="w-3 h-3 text-brand-bronze" /> Builder Compatibility
                  </button>
                  <button
                    onClick={() => handleSuggestion("How to buy via OLX link?")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-brand-glass-border hover:border-brand-bronze/35 bg-brand-black/20 text-brand-cream text-[10px] font-semibold transition-all hover:bg-brand-brown/10"
                  >
                    <ShieldAlert className="w-3 h-3 text-brand-bronze" /> OLX Trust Listings
                  </button>
                  <button
                    onClick={() => handleSuggestion("Is real-time pricing active?")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-brand-glass-border hover:border-brand-bronze/35 bg-brand-black/20 text-brand-cream text-[10px] font-semibold transition-all hover:bg-brand-brown/10"
                  >
                    <BadgeDollarSign className="w-3 h-3 text-brand-bronze" /> Live Market Prices
                  </button>
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-brand-glass-border bg-brand-dark-brown/30 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask helper..."
                className="flex-1 px-3 py-2 rounded-xl bg-brand-black/60 border border-brand-glass-border text-brand-cream focus:outline-none focus:border-brand-bronze text-xs transition-all"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-brand-bronze hover:bg-brand-bronze-hover text-brand-black transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-bronze text-brand-black hover:bg-brand-bronze-hover flex items-center justify-center shadow-xl shadow-brand-bronze/10 border border-brand-bronze-dark/30 hover:scale-105 active:scale-95 transition-all"
        aria-label="Toggle Live Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
