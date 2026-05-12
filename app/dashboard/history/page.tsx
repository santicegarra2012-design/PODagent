"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  niche: string;
  title: string | null;
  tags: string[] | null;
  description: string | null;
  created_at: string;
}

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      if (!isLoaded || !user) return;
      
      try {
        const res = await fetch("/api/projects");
        const json = await res.json();
        
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to fetch projects");
        }
        
        setProjects(json.data || []);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [isLoaded, user]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert("❌ Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleCopy = (text: string | null, type: string) => {
    if (!text) {
      alert(`No ${type} to copy.`);
      return;
    }
    navigator.clipboard.writeText(text);
    alert(`✅ ${type} copied to clipboard!`);
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600 bg-gradient-to-br from-blue-50 to-indigo-50">Loading...</div>;
  }

  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchNiche = p.niche?.toLowerCase().includes(query);
    const matchTitle = p.title?.toLowerCase().includes(query);
    return matchNiche || matchTitle;
  });

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
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-100 text-indigo-600 font-semibold transition-colors" href="/dashboard/history">
            📜 History
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/projects">
            📁 Projects
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/settings">
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-60 pt-8 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900">Generation History</h2>
              <p className="text-gray-600 mt-2">View all your previous SEO generations and re-use them.</p>
            </div>
            
            <div className="w-full md:w-72">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search niche or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center text-red-700">
              <span className="text-4xl mb-4 block">⚠️</span>
              <h3 className="text-xl font-semibold mb-2">Error Loading Projects</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          ) : projects.length === 0 ? (
            /* Empty State (No Projects) */
            <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No History Yet</h3>
              <p className="text-gray-600 mb-6">Start generating SEO content to see your history here.</p>
              <a href="/dashboard" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                ✨ Create New Generation
              </a>
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Empty State (Search No Results) */
            <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">No projects match your search for &quot;{searchQuery}&quot;.</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-4 text-indigo-600 font-medium hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      {project.niche}
                    </span>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Project"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {project.title || "Untitled Project"}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                    {project.description || "No description available."}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags?.slice(0, 4).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {project.tags && project.tags.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-medium">
                          +{project.tags.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(project.created_at).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleCopy(project.title, "Title")}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Copy Title"
                      >
                        📋
                      </button>
                      <button 
                        onClick={() => handleCopy(project.tags ? project.tags.join(", ") : null, "Tags")}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Copy Tags"
                      >
                        🏷️
                      </button>
                      <button 
                        onClick={() => handleCopy(project.description, "Description")}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Copy Description"
                      >
                        📝
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
