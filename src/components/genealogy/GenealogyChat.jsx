import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Loader2, Book, Users, FileText, MapPin, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const quickPrompts = [
  { icon: Users, label: "Suggest ancestors", prompt: "Based on our family data, can you suggest potential ancestors I should research?" },
  { icon: FileText, label: "Decipher document", prompt: "I have a historical document I need help reading. What information do you need from me?" },
  { icon: MapPin, label: "Irish history", prompt: "Tell me about life in County Tipperary, Ireland in the mid-1800s during the famine era." },
  { icon: Book, label: "Research tips", prompt: "What are the best resources for researching Irish ancestors who emigrated to America?" }
];

export default function GenealogyChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;
    
    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const initConversation = async () => {
    try {
      const conversation = await base44.agents.createConversation({
        agent_name: "genealogy_assistant",
        metadata: {
          name: "Genealogy Research Session",
          description: "Family history research assistance"
        }
      });
      setConversationId(conversation.id);
      setMessages(conversation.messages || []);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setInitializing(false);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || !conversationId || loading) return;
    
    setLoading(true);
    setInput('');
    
    try {
      const conversation = await base44.agents.getConversation(conversationId);
      await base44.agents.addMessage(conversation, {
        role: "user",
        content: text
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-black/20 rounded-xl border border-white/10">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Genealogy Research Assistant</h3>
          <p className="text-gray-400 text-sm">Ask about ancestors, documents, or history</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <p className="text-gray-400 text-center">Start your genealogy research journey!</p>
            <div className="grid grid-cols-2 gap-2">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(item.prompt)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-left transition-colors"
                >
                  <item.icon className="w-5 h-5 text-amber-400 mb-2" />
                  <span className="text-white text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/10 text-gray-200'
                }`}
              >
                {msg.role === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your family history..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}