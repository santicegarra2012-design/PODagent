"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  History,
  FolderOpen,
  Settings,
  Sparkles,
  X,
  ChevronRight,
  ImageIcon,
  LineChart,
  ShieldAlert,
  PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/use-subscription";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Images", href: "/dashboard/images", icon: ImageIcon, badge: "New" },
  { label: "Trend Research", href: "/dashboard/trends", icon: LineChart },
  { label: "Listing Optimizer", href: "/dashboard/optimizer", icon: PenTool },
  { label: "Trademark Checker", href: "/dashboard/trademark", icon: ShieldAlert },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { subscription, isPro, isLoading } = useSubscription();

  const planLabel = subscription?.plan === "premium"
    ? "Premium Plan"
    : isPro
    ? "Pro Plan"
    : "Free Plan";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-slate-900">
            POD Agent
          </span>
        </Link>
        {onClose && (
          <button            onClick={onClose}
                className="md:hidden text-slate-400 hover:text-slate-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",                    active ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.label}
              {"badge" in item && item.badge && !active && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/20">
                  {item.badge}
                </span>
              )}
              {active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 mt-auto">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
            {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {isLoading ? "Loading plan..." : planLabel}
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-white/90 border-r border-slate-200 backdrop-blur-xl z-40">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 z-50 flex flex-col"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
