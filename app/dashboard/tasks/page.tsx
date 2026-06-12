"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { Task } from "@/lib/database.types";

const STATUS_ORDER: Task["status"][] = ["pending", "in_progress", "completed"];

const STATUS_CONFIG: Record<
  Task["status"],
  { label: string; icon: React.ElementType; color: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  in_progress: {
    label: "In Progress",
    icon: AlertCircle,
    color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
};

const PRIORITY_CONFIG: Record<Task["priority"], string> = {
  high: "text-red-400 bg-red-400/10 border-red-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  low: "text-green-400 bg-green-400/10 border-green-400/20",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          setTasks(await res.json());
        }
      } catch (e) {
        console.error("Failed to fetch tasks", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading tasks...
      </div>
    );
  }

  const groupedTasks = STATUS_ORDER.map((status) => ({
    status,
    ...STATUS_CONFIG[status],
    tasks: tasks.filter((t) => t.status === status),
  })).filter((group) => group.tasks.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <ListTodo className="w-8 h-8 text-indigo-400" />
          Tasks
        </h1>
        <p className="text-slate-400">
          Track your POD business tasks and progress.
        </p>
      </div>

      {/* Empty State */}
      {tasks.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-white/10 rounded-2xl">
          <ListTodo className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No tasks yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Start chatting with the Copilot to create tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedTasks.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.status} className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <GroupIcon className="w-5 h-5 text-indigo-400" />
                  {group.label}
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    ({group.tasks.length})
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="bg-slate-900 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all"
                    >
                      {/* Title & Priority */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-white font-medium leading-snug">
                          {task.title}
                        </h3>
                        <span
                          className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium capitalize ${PRIORITY_CONFIG[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                          {task.description}
                        </p>
                      )}

                      {/* Footer: Status + Due Date */}
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium ${STATUS_CONFIG[task.status].color}`}
                        >
                          {React.createElement(
                            STATUS_CONFIG[task.status].icon,
                            { className: "w-3 h-3" }
                          )}
                          {STATUS_CONFIG[task.status].label}
                        </span>

                        {task.due_date && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
