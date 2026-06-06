"use client";

import React, { useRef, useEffect, useState } from "react";
import { Send, Loader2, StopCircle } from "lucide-react";
import { MessageBubble } from "./MessageBubble";

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your POD Agent Copilot. I can help you find profitable niches, analyze opportunities, and plan your next big product. What should we work on today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) throw new Error("Request failed");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantId = "assistant-" + Date.now().toString();

      setMessages(msgs => [...msgs, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });

        setMessages(msgs => 
          msgs.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
        );
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Chat Error:", error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[800px] w-full max-w-4xl mx-auto border border-white/10 rounded-2xl overflow-hidden bg-slate-900 shadow-2xl relative">
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar" ref={scrollRef}>
        {messages.map(m => (
          <MessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-14 mb-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            Copilot is thinking...
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950 border-t border-white/10">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about niches, tasks, or business strategy..."
            className="w-full bg-transparent text-white px-4 py-4 pr-14 focus:outline-none placeholder:text-slate-500"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center">
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
