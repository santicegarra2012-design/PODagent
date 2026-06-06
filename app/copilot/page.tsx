import React from "react";
import { ChatInterface } from "@/components/copilot/ChatInterface";

export const metadata = {
  title: "AI Copilot | POD Agent",
  description: "Your personal print-on-demand business advisor.",
};

export default function CopilotPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">AI Copilot</h1>
        <p className="text-slate-400">Your POD business partner, growth mentor, and research analyst.</p>
      </div>
      
      <div className="flex-1 w-full flex items-center justify-center">
        <ChatInterface />
      </div>
    </div>
  );
}
