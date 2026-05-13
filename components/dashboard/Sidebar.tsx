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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Projects", href: "/dashboard/projects", icon: FolderOpen },
  { label: "AI Images", href: "/dashboard/images", icon: ImageIcon, badge: "New" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-[15px] tracking-tight text-white">
            POD Agent
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
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
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  active ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300"
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
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
            {user?.firstName?.[0] ?? user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">
              {user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? "User"}
            </p>
            <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
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
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-black/80 border-r border-white/10 backdrop-blur-xl z-40">
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
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed left-0 top-0 h-screen w-72 bg-[#0a0a0a] border-r border-white/10 z-50 flex flex-col"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
