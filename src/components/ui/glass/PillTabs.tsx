"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface PillTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function PillTabs({ tabs, activeTab, onChange, className }: PillTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Section Tabs"
      className={cn(
        "inline-flex items-center gap-1.5 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200 outline-none",
              isActive
                ? "bg-copper text-ink font-semibold shadow-md"
                : "text-slate-dark hover:text-bone hover:bg-white/5"
            )}
          >
            {tab.icon && <span className="size-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-mono",
                  isActive
                    ? "bg-ink/20 text-ink"
                    : "bg-white/10 text-slate-dark"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
