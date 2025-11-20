import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from './ui/BrutalistComponents';
import { generateAIResponse } from '../services/gemini';
import { ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, Lightbulb, HelpCircle, Zap, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

export const ProductSenseAI: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am ProductSense AI. I can explain complex concepts like you are 5, generate analogies, or help you solve a specific product problem. What are we learning today?', timestamp: Date.now() }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    if (typeof textOverride !== 'string') setInput('');
    setLoading(true);

    const responseText = await generateAIResponse(textToSend, messages);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, feedback: type } : msg
    ));
  };

  const quickActions = [
    { label: "Explain Simply (ELI5)", prompt: "Explain the last response again, but explain it like I'm a 5 year old." },
    { label: "Give Analogy", prompt: "Can you give me a real-world analogy to help me understand that?" },
    { label: "Quiz Me", prompt: "Ask me a multiple-choice quiz question about this topic to test my knowledge." },
    { label: "Why this matters?", prompt: "Why does this concept matter in a real Product Manager's day-to-day job?" }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-4">
      <Card className="flex-1 flex flex-col p-0 overflow-hidden bg-gray-50">
        <div className="bg-[#2563eb] p-4 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 border-2 border-black rounded-full">
              <Bot size={24} className="text-black" />
            </div>
            <div>
              <h3 className="text-white font-black text-xl uppercase tracking-tight">ProductSense AI</h3>
              <p className="text-blue-100 text-xs font-bold">Mentoring Mode: Active</p>
            </div>
          </div>
          <Sparkles className="text-yellow-300 animate-pulse" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] md:max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 shrink-0 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${msg.role === 'user' ? 'bg-black text-white' : 'bg-[#a3e635] text-black'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <div className={`border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${msg.role === 'user' ? 'bg-white' : 'bg-white'}`}>
                     <div className="flex justify-between items-center mb-2">
                       <div className="font-bold text-xs uppercase text-gray-400 tracking-widest">{msg.role === 'user' ? 'You' : 'ProductSense'}</div>
                       <div className="text-[10px] text-gray-300 font-mono">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                     </div>
                     <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  
                  {msg.role === 'model' && (
                    <div className="flex flex-wrap justify-between items-start gap-2 mt-1 ml-1">
                      <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={() => handleSend(`Explain this specific concept like I'm 5 years old (ELI5): "${msg.text.substring(0, 150)}..."`)}
                            className="group flex items-center gap-2 text-[10px] font-bold uppercase border border-black px-3 py-1.5 hover:bg-yellow-300 transition-all bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                            title="Get a simpler explanation"
                        >
                            <Zap size={12} className="text-yellow-600 group-hover:text-black" /> ELI5
                        </button>
                        <button 
                            onClick={() => handleSend(`Give me a creative real-world analogy to help me understand this: "${msg.text.substring(0, 150)}..."`)}
                            className="group flex items-center gap-2 text-[10px] font-bold uppercase border border-black px-3 py-1.5 hover:bg-purple-300 transition-all bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                            title="See a real world comparison"
                        >
                            <Lightbulb size={12} className="text-purple-600 group-hover:text-black" /> Analogy
                        </button>
                        <button 
                            onClick={() => handleSend(`Test my understanding of this concept with a quick quiz question: "${msg.text.substring(0, 150)}..."`)}
                            className="group flex items-center gap-2 text-[10px] font-bold uppercase border border-black px-3 py-1.5 hover:bg-green-300 transition-all bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
                            title="Test your knowledge"
                        >
                            <HelpCircle size={12} className="text-green-600 group-hover:text-black" /> Quiz Me
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleFeedback(msg.id, 'up')}
                            className={`p-1.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all ${msg.feedback === 'up' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                            title="This was helpful"
                        >
                            <ThumbsUp size={14} />
                        </button>
                        <button 
                            onClick={() => handleFeedback(msg.id, 'down')}
                            className={`p-1.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all ${msg.feedback === 'down' ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                            title="Not helpful"
                        >
                            <ThumbsDown size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 bg-gray-100 border-2 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                 <div className="w-4 h-4 bg-blue-500 animate-bounce delay-0"></div>
                 <div className="w-4 h-4 bg-green-500 animate-bounce delay-150"></div>
                 <div className="w-4 h-4 bg-purple-500 animate-bounce delay-300"></div>
                 <span className="text-xs font-bold uppercase ml-2 tracking-widest text-gray-500">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t-2 border-black z-10">
          {/* Quick Chips */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 no-scrollbar">
            {quickActions.map((action) => (
              <button 
                key={action.label} 
                onClick={() => handleSend(action.prompt)}
                className="text-[10px] font-bold uppercase border border-gray-300 px-3 py-1 rounded-full hover:bg-black hover:text-white hover:border-black transition-all whitespace-nowrap flex-shrink-0"
              >
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 border-2 border-black p-3 font-medium focus:outline-none focus:ring-4 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
              placeholder="Ask about PRDs, KPIs, or Strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={() => handleSend()} disabled={loading} className="px-6 bg-black text-white hover:bg-gray-800">
              <Send size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};