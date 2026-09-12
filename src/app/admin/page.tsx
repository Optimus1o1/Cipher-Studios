"use client";

import React, { useEffect, useState } from "react";
import { BackgroundScene } from "@/components/ui/glass/BackgroundScene";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { StatCard } from "@/components/ui/glass/StatCard";
import { Button } from "@/components/ui/Button";
import {
  Activity,
  CheckCircle2,
  DollarSign,
  Filter,
  Inbox,
  Mail,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { LeadSubmission } from "@/types";

const INITIAL_LEADS: LeadSubmission[] = [
  {
    id: "lead-01",
    fullName: "Marcus Sterling",
    email: "marcus@zenithmarkets.co.uk",
    company: "Zenith Capital",
    serviceType: "SaaS MVP & Full-Stack App",
    budgetRange: "$10,000+ (₹8L+)",
    timeline: "3–6 Weeks",
    message:
      "Need a Next.js App Router digital cockpit for 50 institutional traders with real-time WebSocket feeds and strict RBAC security.",
    createdAt: "2 hours ago",
    status: "new",
  },
  {
    id: "lead-02",
    fullName: "Dr. Alistair Vance",
    email: "vance@vancebiotech.ch",
    company: "Vance Biotech",
    serviceType: "Internal Dashboard & Command Center",
    budgetRange: "$5,000 – $10,000 (₹4L – ₹8L)",
    timeline: "Immediate (Next 2 Weeks)",
    message:
      "Looking to replace slow Python Streamlit data viewer with high-speed Next.js + Three.js molecular structure visualization.",
    createdAt: "1 day ago",
    status: "contacted",
  },
  {
    id: "lead-03",
    fullName: "Kavita Rao",
    email: "kavita@indialuxuryliving.in",
    company: "Rao Architectural",
    serviceType: "High-Conversion Digital Flagship",
    budgetRange: "$2,000 – $5,000 (₹1.5L – ₹4L)",
    timeline: "3–6 Weeks",
    message:
      "Luxury architectural portfolio website with custom page animations, high-res photography gallery, and WhatsApp inquiry funnel.",
    createdAt: "3 days ago",
    status: "won",
  },
];

export default function AdminPage() {
  const [leads, setLeads] = useState<LeadSubmission[]>(INITIAL_LEADS);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<LeadSubmission | null>(INITIAL_LEADS[0]);

  // Load leads from API if available
  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const data = await res.json();
          if (data.leads && data.leads.length > 0) {
            setLeads(data.leads);
            setSelectedLead(data.leads[0]);
          }
        }
      } catch (err) {
        // Fallback to initial seed data
      }
    }
    fetchLeads();
  }, []);

  const filtered = leads.filter((l) =>
    filterStatus === "all" ? true : l.status === filterStatus
  );

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <BackgroundScene intensity="subtle" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-copper">
              <Shield className="size-3.5 text-copper" />
              <span>CIPHER AGENCY CONTROL PLANE &middot; ANIKET NANDI</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-heading font-semibold text-bone">
              Agency Lead Pipeline &amp; Inquiries
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-dark">
              Review inbound briefs, qualify client budgets, and manage delivery status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-mono border border-emerald-500/25">
              <Activity className="size-3" />
              <span>Pipeline Active &bull; 3 Leads</span>
            </span>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Active Pipeline"
            value="$24,500"
            unit="USD"
            icon={<DollarSign className="size-5" />}
            status="ok"
            bars={[50, 70, 85, 90, 95, 100]}
          />
          <StatCard
            label="New Inbound Inquiries"
            value="03"
            unit="Leads"
            icon={<Inbox className="size-5" />}
            status="pulse"
            dots={{ filled: 3, total: 5 }}
          />
          <StatCard
            label="Proposal Win Rate"
            value="68.2"
            unit="%"
            icon={<TrendingUp className="size-5" />}
            status="ok"
            ring={68}
          />
          <StatCard
            label="Average Sprint Value"
            value="$7,800"
            unit="USD"
            icon={<UserCheck className="size-5" />}
            status="ok"
            dots={{ filled: 4, total: 5 }}
          />
        </div>

        {/* Main Workspace */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Leads Table / List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-4 p-2 bg-white/5 rounded-full border border-white/10 px-4">
              <div className="flex items-center gap-2">
                <Filter className="size-3.5 text-slate-dark" />
                <span className="text-xs font-mono text-slate-dark uppercase">
                  Filter Status:
                </span>
              </div>
              <div className="flex items-center gap-1">
                {["all", "new", "contacted", "won"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-colors ${
                      filterStatus === st
                        ? "bg-copper text-ink font-semibold"
                        : "text-slate-dark hover:text-bone"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filtered.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <GlassCard
                    key={lead.id}
                    tone={isSelected ? "accent" : "dark"}
                    onClick={() => setSelectedLead(lead)}
                    className="p-5 border border-white/10 cursor-pointer hover-lift transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-semibold text-bone text-base">
                            {lead.fullName}
                          </h4>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                              lead.status === "new"
                                ? "bg-copper/20 text-copper border border-copper/30"
                                : lead.status === "won"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/10 text-slate-dark"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-dark mt-0.5">
                          {lead.company} &middot; {lead.email}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono text-copper font-medium block">
                          {lead.budgetRange}
                        </span>
                        <span className="text-[11px] font-mono text-slate-dark">
                          {lead.createdAt}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-bone/80 line-clamp-2 leading-relaxed">
                      {lead.message}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Lead Details & Action Panel (5 cols) */}
          <div className="lg:col-span-5">
            {selectedLead ? (
              <GlassCard tone="dark" className="p-7 border border-white/15 space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-copper">
                      SELECTED INQUIRY
                    </span>
                    <h3 className="text-xl font-heading font-semibold text-bone mt-1">
                      {selectedLead.fullName}
                    </h3>
                    <p className="text-xs text-slate-dark">
                      {selectedLead.company || "Direct Client"}
                    </p>
                  </div>

                  <a
                    href={`mailto:${selectedLead.email}?subject=CIPHER%20Project%20Discovery`}
                    className="p-2 rounded-full bg-copper/20 text-copper hover:bg-copper hover:text-ink transition-colors"
                    aria-label="Reply via email"
                  >
                    <Mail className="size-4" />
                  </a>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-mono text-slate-dark uppercase block text-[10px]">
                      Requested Service:
                    </span>
                    <strong className="text-bone">{selectedLead.serviceType}</strong>
                  </div>
                  <div>
                    <span className="font-mono text-slate-dark uppercase block text-[10px]">
                      Budget Scope:
                    </span>
                    <strong className="text-copper">{selectedLead.budgetRange}</strong>
                  </div>
                  <div>
                    <span className="font-mono text-slate-dark uppercase block text-[10px]">
                      Target Launch:
                    </span>
                    <strong className="text-bone">{selectedLead.timeline}</strong>
                  </div>
                  <div>
                    <span className="font-mono text-slate-dark uppercase block text-[10px]">
                      Full Project Brief:
                    </span>
                    <p className="mt-1 p-3.5 rounded-glass-sm bg-white/5 border border-white/10 text-bone/90 leading-relaxed">
                      {selectedLead.message}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <span className="text-[10px] font-mono uppercase text-slate-dark block">
                    Fast Follow-Up Actions:
                  </span>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`mailto:${selectedLead.email}?subject=CIPHER%20Proposal%20Draft&body=Hi%20${encodeURIComponent(
                        selectedLead.fullName
                      )}%2C%0A%0AThank%20you%20for%20reaching%20out%20to%20CIPHER.%20We%20reviewed%20your%20brief%20regarding%20${encodeURIComponent(
                        selectedLead.serviceType
                      )}.`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-copper text-ink font-semibold text-xs transition-colors hover:bg-copper-hover"
                    >
                      <span>Draft Email Response</span>
                    </a>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard tone="dark" className="p-8 text-center text-slate-dark text-xs">
                Select a lead from the pipeline to review details.
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
