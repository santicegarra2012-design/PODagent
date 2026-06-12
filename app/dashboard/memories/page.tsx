"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Loader2, Trash2, Pin, Tag } from "lucide-react";
import { toast } from "sonner";
import type { Memory } from "@/lib/database.types";

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch("/api/memories");
      if (res.ok) {
        setMemories(await res.json());
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load memories");
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (id: string) => {
    try {
      setMemories(m => m.filter(x => x.id !== id));
      const res = await fetch(`/api/memories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Memory deleted");
    } catch (error) {
      fetchMemories();
      toast.error("Failed to delete memory");
    }
  };

  const togglePin = async (id: string, currentImportance: number) => {
    const newImportance = currentImportance === 10 ? 5 : 10;
    try {
      setMemories(m => m.map(x => x.id === id ? { ...x, importance: newImportance } : x));
      const res = await fetch(`/api/memories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importance: newImportance })
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(newImportance === 10 ? "Memory pinned" : "Memory unpinned");
    } catch (error) {
      fetchMemories();
      toast.error("Failed to update memory");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading memories...
      </div>
    );
  }

  const pinned = memories.filter(m => m.importance === 10);
  const others = memories.filter(m => m.importance !== 10);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-indigo-400" />
          Memory Management
        </h1>
        <p className="text-slate-400">
          The Copilot automatically extracts goals, niches, and preferences from your conversations.
          Manage them here to influence future advice.
        </p>
      </div>

      {memories.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl">
          <BrainCircuit className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No memories yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Start chatting with the AI Copilot. It will automatically remember your business goals and preferences.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {pinned.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Pin className="w-5 h-5 text-amber-400" /> Pinned Priorities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinned.map(m => (
                  <MemoryCard key={m.id} memory={m} onDelete={deleteMemory} onTogglePin={togglePin} />
                ))}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Learned Context</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {others.map(m => (
                  <MemoryCard key={m.id} memory={m} onDelete={deleteMemory} onTogglePin={togglePin} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MemoryCard({ memory, onDelete, onTogglePin }: { memory: Memory, onDelete: (id: string) => void, onTogglePin: (id: string, i: number) => void }) {
  const isPinned = memory.importance === 10;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group bg-slate-900 border ${isPinned ? 'border-amber-500/30 shadow-lg shadow-amber-500/5' : 'border-white/10'} rounded-xl p-5 hover:border-indigo-500/30 transition-all`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700 capitalize">
          <Tag className="w-3 h-3" />
          {memory.category}
        </span>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onTogglePin(memory.id, memory.importance)}
            className={`p-1.5 rounded-lg transition-colors ${isPinned ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-amber-400 hover:bg-amber-400/10'}`}
            title={isPinned ? "Unpin memory" : "Pin memory"}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(memory.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete memory"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <p className="text-slate-200 leading-relaxed">{memory.content}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Added {new Date(memory.created_at).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}
