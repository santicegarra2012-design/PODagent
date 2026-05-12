"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  User,
  Key,
  Bell,
  CreditCard,
  Loader2,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({
  id,
  defaultChecked = false,
}: {
  id: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);

  return (
    <button
      id={id}
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative w-10 h-5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        on ? "bg-primary" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────
function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white/5">
          <Icon className="w-4 h-4 text-zinc-300" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}

// ─── Field row ─────────────────────────────────────────────────────────────────
function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-200 font-medium">{value || "—"}</span>
    </div>
  );
}

// ─── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-zinc-200 font-medium">{label}</p>
        <p className="text-xs text-zinc-600 mt-0.5">{description}</p>
      </div>
      <Toggle id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex items-center gap-2 text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Account */}
      <SettingsSection
        icon={User}
        title="Account"
        description="Your personal information from Clerk"
        delay={0}
      >
        <FieldRow label="Email" value={user?.emailAddresses[0]?.emailAddress || ""} />
        <FieldRow label="Full Name" value={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()} />
        <FieldRow label="User ID" value={user?.id?.slice(0, 16) + "…" || ""} />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Control how you receive updates"
        delay={0.08}
      >
        <ToggleRow
          id="email-notifs"
          label="Email Notifications"
          description="Receive emails for generations and updates"
          defaultChecked
        />
        <ToggleRow
          id="weekly-reports"
          label="Weekly Reports"
          description="Get a weekly summary of your activity"
        />
        <ToggleRow
          id="product-updates"
          label="Product Updates"
          description="Be notified about new features"
          defaultChecked
        />
      </SettingsSection>

      {/* API Keys */}
      <SettingsSection
        icon={Key}
        title="API Integrations"
        description="Manage keys for external integrations"
        delay={0.16}
      >
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-zinc-300 font-medium">API Key</p>
            <p className="text-xs text-zinc-600 font-mono mt-1">sk_live_••••••••••••••••</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10 transition-colors">
            Generate New
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </SettingsSection>

      {/* Billing */}
      <SettingsSection
        icon={CreditCard}
        title="Billing"
        description="Manage your subscription"
        delay={0.24}
      >
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-zinc-300 font-medium">Current Plan</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                Pro
              </span>
              <span className="text-xs text-zinc-600">$19 / month</span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 hover:bg-white/10 transition-colors">
            Manage
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        className="rounded-2xl border border-red-500/20 bg-red-500/5 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-red-500/10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10">
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-300">Danger Zone</h3>
            <p className="text-xs text-red-400/60">Irreversible actions</p>
          </div>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-red-300 font-medium">Delete Account</p>
            <p className="text-xs text-red-400/60 mt-0.5">Permanently remove your account and all data</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
