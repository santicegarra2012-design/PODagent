"use client";

import { useState } from "react";

import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const [niche, setNiche] = useState("");
  const [seoResult, setSeoResult] = useState<string | { title: string; tags: string[]; description: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [seoRetryCountdown, setSeoRetryCountdown] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function createProject() {
    if (!user) {
      alert("Please sign in to save projects.");
      return;
    }

    if (!seoResult || typeof seoResult !== 'object' || !('title' in seoResult)) {
      alert("Please generate SEO content first before saving.");
      return;
    }

    setIsSaving(true);
    
    try {
      const response = await fetch("/api/save-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          niche,
          title: seoResult.title,
          tags: seoResult.tags,
          description: seoResult.description
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("❌ Failed to save project\n\n" + (data.message || "Unknown error"));
        return;
      }

      alert("✅ Project saved to library!");
    } catch (error) {
      console.error("Error saving project:", error);
      alert("❌ An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  }



  async function generateSEO(autoRetry: boolean = false) {
    if (!niche.trim()) {
      alert("Please enter a niche");
      return;
    }

    // Prevent duplicate requests while loading or during cooldown
    if (loading) {
      return;
    }

    // Cooldown protection (1 second minimum between requests)
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < 1000 && !autoRetry) {
      const waitTime = Math.ceil((1000 - timeSinceLastRequest) / 1000);
      alert(`⏰ Please wait ${waitTime} second${waitTime !== 1 ? 's' : ''} before making another request.`);
      return;
    }

    setLoading(true);
    setLastRequestTime(now);

    try {
      const response = await fetch("/api/generate-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          niche,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        // Handle quota exceeded with countdown and auto-retry
        if (response.status === 429 && data.retryDelay && !autoRetry) {
          const retryDelay = data.retryDelay;
          setSeoRetryCountdown(retryDelay);

          // Start countdown timer
          const countdownInterval = setInterval(() => {
            setSeoRetryCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(countdownInterval);
                // Auto-retry once after countdown
                setTimeout(() => {
                  setSeoRetryCountdown(null);
                  generateSEO(true);
                }, 100);
                return null;
              }
              return prev - 1;
            });
          }, 1000);

          return;
        }

        // Handle other API errors
        const errorMessage = data?.message || data?.error || "SEO generation failed";
        setSeoResult(errorMessage);
        alert("❌ Error\n\n" + errorMessage);
        return;
      }

      // Handle structured result object
      if (data && typeof data === "object" && !Array.isArray(data) && "title" in data) {
        const { title, tags, description } = data as {
          title?: string;
          tags?: string[];
          description?: string;
        };
        setSeoResult({
          title: title || "No title generated",
          tags: Array.isArray(tags) ? tags : [],
          description: description || "No description generated",
        });
      } else {
        setSeoResult(JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error(error);
      alert("SEO generation failed");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
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
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-100 text-indigo-600 font-semibold transition-colors" href="/dashboard">
            📊 Dashboard
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/history">
            📜 History
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/projects">
            📁 Projects
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/settings">
            ⚙️ Settings
          </a>
        </nav>
        <button
          onClick={createProject}
          disabled={isSaving}
          className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSaving ? "⏳ Saving..." : "➕ Save Project"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-60 pt-8 pb-12 px-8">
        <div className="max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Create New Generation</h2>
            <p className="text-gray-600 mt-2">Harness AI to generate market-ready titles, tags, and product descriptions for your POD niche.</p>
          </div>

          {/* Input Section */}
          <section className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-gray-700">Enter your niche or theme</label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateSEO()}
                  placeholder="e.g., 'Retro 80s Cyberpunk Cats'"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                onClick={() => generateSEO()}
                disabled={loading || seoRetryCountdown !== null}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 h-12"
              >
                {seoRetryCountdown !== null ? (
                  <>⏰ Retrying in {seoRetryCountdown}s</>
                ) : loading ? (
                  <>✨ Generating...</>
                ) : (
                  <>✨ Generate Design</>
                )}
              </button>
            </div>

            {/* Loading State */}
            {(loading || seoRetryCountdown !== null) && (
              <div className="mt-6">
                {seoRetryCountdown !== null ? (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-orange-600 font-medium">⏰ AI servers are busy...</span>
                      <span className="text-sm text-orange-600 font-bold">Retrying in {seoRetryCountdown}s</span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-orange-600 h-full rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(seoRetryCountdown / 60) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-orange-700 mt-2 text-center">
                      Auto-retry enabled • Please wait while we handle the quota limit
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 font-medium">Analyzing niche trends...</span>
                      <span className="text-sm text-indigo-600 font-bold">Processing...</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Results Section */}
          {seoResult && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Suggested Titles Card */}
              {typeof seoResult === 'object' && seoResult.title && (
                <>
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600 text-xl">📋</span>
                        <h3 className="text-lg font-semibold text-gray-900">Suggested Title</h3>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(seoResult.title)}
                        className="text-indigo-600 font-medium text-sm hover:underline transition-colors"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="group flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer">
                      <span className="text-gray-900 font-medium">{seoResult.title}</span>
                    </div>
                  </div>

                  {/* SEO Tags Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600 text-xl">🏷️</span>
                        <h3 className="text-lg font-semibold text-gray-900">SEO Tags</h3>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(seoResult.tags.join(', '))}
                        className="text-indigo-600 font-medium text-sm hover:underline transition-colors"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {seoResult.tags && seoResult.tags.length > 0 ? (
                        seoResult.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors cursor-pointer"
                            onClick={() => navigator.clipboard.writeText(tag)}
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No tags generated</span>
                      )}
                    </div>
                    <div className="mt-auto pt-6">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 border-dashed">
                        <p className="text-xs text-blue-700 italic">💡 Optimized for Etsy & Redbubble algorithms</p>
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600 text-xl">📝</span>
                        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(seoResult.description)}
                        className="text-indigo-600 font-medium text-sm hover:underline transition-colors"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed flex-1">{seoResult.description}</p>
                  </div>

                  {/* AI Image Generation Coming Soon */}
                  <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-indigo-600 text-xl">🎨</span>
                      <h3 className="text-lg font-semibold text-gray-900">AI Image Generation Coming Soon</h3>
                    </div>
                    <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg aspect-square flex items-center justify-center border-2 border-dashed border-indigo-300">
                      <div className="text-center">
                        <div className="text-5xl mb-4">✨</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Image Generation Coming Soon</h4>
                        <p className="text-gray-600 mb-4">We&apos;re working on integrating advanced image generation capabilities.</p>
                        <p className="text-sm text-gray-500">Stay tuned for updates! Your SEO content is ready to use in the meantime.</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={createProject}
                        disabled={isSaving}
                        className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-gray-900"
                      >
                        <span>{isSaving ? "Saving..." : "Save to Library"}</span>
                        <span>{isSaving ? "⏳" : "💾"}</span>
                      </button>
                      <button className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors font-medium text-gray-900">
                        <span>Push to Store</span>
                        <span>📤</span>
                      </button>
                      <button className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 transition-colors font-medium text-gray-900">
                        <span>Download Assets</span>
                        <span>⬇️</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
