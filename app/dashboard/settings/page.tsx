"use client";

import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();

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
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard">
            📊 Dashboard
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/history">
            📜 History
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" href="/dashboard/projects">
            📁 Projects
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-100 text-indigo-600 font-semibold transition-colors" href="/dashboard/settings">
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-60 pt-8 pb-12 px-8">
        <div className="max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600 mt-2">Manage your account preferences and preferences.</p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">👤 Account</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 font-medium mt-1">{user?.emailAddresses[0]?.emailAddress || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900 font-medium mt-1">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
            </div>

            {/* API Settings */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">🔑 API Keys</h3>
              <p className="text-gray-600 mb-6">Manage your API keys for integrations.</p>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                📋 Generate New Key
              </button>
            </div>

            {/* Preferences */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">⚙️ Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Weekly Reports</span>
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Dark Mode</span>
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-red-900 mb-6">🗑️ Danger Zone</h3>
              <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
