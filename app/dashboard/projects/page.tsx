"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  niche: string;
  created_at: string;
};

export default function ProjectsPage() {
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoadingProjects(false);
    }

    loadProjects();
  }, [user]);

  if (!isLoaded || loadingProjects) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 py-8 px-4 flex flex-col z-50">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">
            P
          </div>
          <div>
            <h1 className="font-bold text-sm text-gray-900">PrintAI</h1>
            <p className="text-xs text-gray-500 tracking-wider uppercase mt-1">Pro Plan</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard">
            📊 Dashboard
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/history">
            📜 History
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-100 text-indigo-600 font-semibold transition-colors" href="/dashboard/projects">
            📁 Projects
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/settings">
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-60 pt-8 pb-12 px-8">
        <div className="max-w-6xl">
          {/* Header Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">My Projects</h2>
              <p className="text-gray-600 mt-2">Manage all your saved POD niche projects.</p>
            </div>
            <a href="/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
              ➕ New Project
            </a>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.niche}</h3>
                  <p className="text-sm text-gray-600 mb-4">Created {new Date(project.created_at).toLocaleDateString()}</p>
                  <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                    📝 Edit Project
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600 mb-6">Create your first project to get started.</p>
              <a href="/dashboard" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                ✨ Create Project
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
