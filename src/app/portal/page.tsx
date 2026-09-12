"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BackgroundScene } from "@/components/ui/glass/BackgroundScene";
import { GlassCard } from "@/components/ui/glass/GlassCard";
import { StatCard } from "@/components/ui/glass/StatCard";
import { ScoreHero } from "@/components/ui/glass/ScoreHero";
import { PillTabs } from "@/components/ui/glass/PillTabs";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderGit2,
  KeyRound,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  User,
  Zap,
} from "lucide-react";

interface ClientUser {
  name: string;
  email: string;
  company: string;
  service: string;
  project: string;
  status: string;
}

const DASHBOARD_TABS = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="size-3.5" /> },
  { id: "milestones", label: "Milestones", icon: <FolderGit2 className="size-3.5" />, badge: "Active" },
  { id: "deliverables", label: "Documents", icon: <FileText className="size-3.5" /> },
];

const MILESTONES = [
  {
    phase: "Phase 01: Decode & Spec",
    status: "completed",
    completion: "100%",
    date: "Sep 04, 2026",
    summary: "System architecture, API schemas & technical specifications signed off.",
  },
  {
    phase: "Phase 02: Core Engine & Design Tokens",
    status: "completed",
    completion: "100%",
    date: "Sep 08, 2026",
    summary: "Next.js App Router scaffold, Tailwind design tokens, and Glass UI components.",
  },
  {
    phase: "Phase 03: Telemetry & API Integration",
    status: "in_progress",
    completion: "88%",
    date: "Sep 14, 2026 (In Sprint)",
    summary: "Live WebSocket feed, state management, and user authentication flow.",
  },
  {
    phase: "Phase 04: QA, Core Web Vitals & Launch",
    status: "upcoming",
    completion: "0%",
    date: "Sep 20, 2026",
    summary: "Lighthouse 95+ audit, security penetration pass, and DNS switchover.",
  },
];

const COCKPIT_CAPABILITIES = [
  {
    id: "telemetry",
    icon: <Activity className="size-6 text-copper" />,
    badge: "REAL-TIME MONITORING",
    title: "Sprint Health & Velocity Telemetry",
    description:
      "Inspect commit-by-commit burn-down charts, Sprint Health Index (SHI), and test suite pass rates in real time without waiting for end-of-week summaries.",
    metric: "98.4% On-Time Sprint Rate",
  },
  {
    id: "staging",
    icon: <Terminal className="size-6 text-copper" />,
    badge: "CI/CD DEPLOYMENT",
    title: "Dedicated Staging Preview Sandboxes",
    description:
      "Every pull request auto-provisions an isolated, password-protected staging URL with mock datasets to review features before production merge.",
    metric: "<45s PR Preview Deploy Time",
  },
  {
    id: "escrow",
    icon: <ShieldCheck className="size-6 text-copper" />,
    badge: "TRANSPARENT BILLING",
    title: "Milestone Deliverables & Invoicing",
    description:
      "One-click downloads of technical architectural documentation, OpenAPI schemas, typed design tokens, and verified milestone escrow invoices.",
    metric: "100% IP & Source Code Ownership",
  },
];

const SPRINT_CADENCE = [
  {
    step: "01",
    phase: "Decode",
    duration: "Days 1–3",
    tagline: "Architecture, Schemas & System Proofs",
    detail: "We audit your product requirements, lock down PostgreSQL data schemas, and produce interactive Glass UI tokens before writing a line of core code.",
  },
  {
    step: "02",
    phase: "Build",
    duration: "Weeks 1–4",
    tagline: "App Router, Strict TypeScript & Daily PRs",
    detail: "Rapid, test-driven full-stack development with Next.js App Router, Prisma ORM, and WCAG AA compliance. Daily staging preview deployments.",
  },
  {
    step: "03",
    phase: "Evolve",
    duration: "Launch & Beyond",
    tagline: "Sub-Second TTFB & Continuous Retainers",
    detail: "Zero-downtime DNS cutover, Core Web Vitals 95+ mobile guarantee, and proactive monthly engineering sprints to compound your product velocity.",
  },
];

export default function PortalPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Client Session State
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Authentication Form State
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Registration specifics
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check verified server session cookie on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setClientUser({
            name: data.user.name || "Client Partner",
            email: data.user.email || "",
            company: data.user.role === "admin" ? "CIPHER Studios (Admin)" : "Client Organization",
            service: "Active Production Sprint",
            project: "Project Zenith",
            status: "active",
          });
          setIsLoggedIn(true);
        }
      } catch (err) {
        // Continue to unauthenticated state
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/session", { method: "DELETE" });
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setClientUser(null);
    setIsLoggedIn(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both your email address and password.");
      return;
    }

    if (authMode === "signup" && (!fullName || !company)) {
      setErrorMsg("Please provide your full name and company name.");
      return;
    }

    setIsLoading(true);

    try {
      let userCredential;
      if (authMode === "signin") {
        userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (fullName) {
          try {
            await updateProfile(userCredential.user, { displayName: fullName });
          } catch (e) {
            // non-fatal
          }
        }
      }

      const idToken = await userCredential.user.getIdToken();

      // POST to /api/session for server-side verification and httpOnly cookie
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const sessionData = await res.json();
      if (!res.ok) {
        throw new Error(sessionData.error || "Failed to establish verified session.");
      }

      const verifiedUser = sessionData.user;
      setClientUser({
        name: verifiedUser.name || fullName || userCredential.user.displayName || email.split("@")[0],
        email: verifiedUser.email || email,
        company: verifiedUser.isAdmin ? "CIPHER Studios (Admin)" : company || "Client Organization",
        service: "Active Production Sprint",
        project: "Production Workspace",
        status: "active",
      });
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "Authentication failed. Please verify your credentials.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        msg = "Invalid email or password. Please verify and try again.";
      } else if (err.code === "auth/email-already-in-use") {
        msg = "An account with this email address already exists. Please sign in.";
      } else if (err.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      }
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const sessionData = await res.json();
      if (!res.ok) {
        throw new Error(sessionData.error || "Failed to establish verified session.");
      }

      const verifiedUser = sessionData.user;
      setClientUser({
        name: verifiedUser.name || userCredential.user.displayName || "Google Partner",
        email: verifiedUser.email || userCredential.user.email || "",
        company: verifiedUser.isAdmin ? "CIPHER Studios (Admin)" : "Client Organization",
        service: "Active Production Sprint",
        project: "Production Workspace",
        status: "active",
      });
      setIsLoggedIn(true);
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setErrorMsg(err.message || "Google authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Demo fallback for instant local inspection when Firebase project keys are mock
  const handleDemoBypass = async () => {
    setIsLoading(true);
    try {
      const mockPayload = {
        email: "marcus@zenithmarkets.co.uk",
        name: "Marcus Sterling",
        user_id: "demo-client-zenith",
      };
      const mockToken =
        "dev-header." +
        Buffer.from(JSON.stringify(mockPayload)).toString("base64") +
        ".dev-signature";

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: mockToken }),
      });

      const sessionData = await res.json();
      setClientUser({
        name: "Marcus Sterling",
        email: "marcus@zenithmarkets.co.uk",
        company: "Zenith Capital",
        service: "SaaS MVP & Cockpit",
        project: "Project Zenith",
        status: "active",
      });
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 bg-ink">
        <div className="flex items-center gap-3 text-xs font-mono text-copper">
          <RefreshCw className="size-4 animate-spin" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <BackgroundScene intensity="subtle" />

      {/* =========================================================================
          VIEW A: UNLOCKED STATE — CLIENT SPRINT COCKPIT (Authenticated View)
         ========================================================================= */}
      {isLoggedIn && clientUser ? (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
          {/* Top greeting line with Client Info & Sign Out */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-copper">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span>
                  ACTIVE CLIENT SPRINT · {clientUser.project} ({clientUser.service})
                </span>
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-heading font-semibold text-bone">
                Hey, {clientUser.name}! Welcome to your cockpit.
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-dark">
                {clientUser.company} · Sprint 03 is tracking 2 days ahead of the original timeline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PillTabs
                tabs={DASHBOARD_TABS}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-dark hover:text-bone transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="size-3.5 text-copper" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Dashboard Shell: Main content + Right detail column */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Area (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* ScoreHero with Range Gauge */}
              <ScoreHero
                score={94}
                maxScore={100}
                label="SPRINT HEALTH INDEX"
                delta="+4.2% efficiency"
                subtext="Architecture benchmark exceeding target TTFB, zero blocking lint errors, and 100% test coverage on API handlers."
              />

              {/* StatCard Grid with 3D Tilt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  label="Current Sprint Velocity"
                  value="98.4"
                  unit="% on-time"
                  icon={<Activity className="size-5" />}
                  status="ok"
                  dots={{ filled: 5, total: 5 }}
                />
                <StatCard
                  label="Days to Staging Freeze"
                  value="03"
                  unit="Days Left"
                  icon={<Clock className="size-5" />}
                  status="ok"
                  bars={[40, 60, 75, 80, 90, 95]}
                />
                <StatCard
                  label="Mobile Performance Score"
                  value="99"
                  unit="/100"
                  icon={<ShieldCheck className="size-5" />}
                  status="ok"
                  dots={{ filled: 5, total: 5 }}
                />
                <StatCard
                  label="Test Suite Coverage"
                  value="100"
                  unit="% pass rate"
                  icon={<CheckCircle2 className="size-5" />}
                  status="ok"
                  bars={[100, 100, 100, 100, 100]}
                />
              </div>

              {/* Milestones Phase List */}
              <GlassCard tone="dark" className="p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="size-4 text-copper" />
                    <h3 className="text-sm font-heading font-semibold text-bone">
                      Production Sprint Milestones
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-copper bg-copper/10 px-2 py-0.5 rounded-full border border-copper/20">
                    2 of 4 Closed
                  </span>
                </div>

                <div className="space-y-3">
                  {MILESTONES.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-glass-sm bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${
                              m.status === "completed"
                                ? "bg-emerald-400"
                                : m.status === "in_progress"
                                ? "bg-copper animate-ping"
                                : "bg-white/20"
                            }`}
                          />
                          <span className="text-xs font-heading font-medium text-bone">
                            {m.phase}
                          </span>
                          <span className="text-[10px] font-mono text-slate-dark">
                            ({m.date})
                          </span>
                        </div>
                        <p className="text-xs text-slate-dark pl-4">{m.summary}</p>
                      </div>

                      <div className="flex items-center gap-3 pl-4 sm:pl-0 shrink-0">
                        <span className="text-xs font-mono font-semibold text-bone">
                          {m.completion}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                            m.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : m.status === "in_progress"
                              ? "bg-copper/10 text-copper border border-copper/20"
                              : "bg-white/5 text-slate-dark border border-white/10"
                          }`}
                        >
                          {m.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Detail Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Active Staging URL Card */}
              <GlassCard tone="accent" className="p-6 border border-copper/20 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono text-copper">
                  <Terminal className="size-4" />
                  <span>STAGING ENVIRONMENT</span>
                </div>
                <div>
                  <p className="text-xs text-slate-dark">Sandbox Preview URL:</p>
                  <p className="mt-1 text-sm font-mono text-bone break-all bg-white/5 p-2 rounded-glass-sm border border-white/10">
                    https://zenith-staging-pr82.cipherstudios.dev
                  </p>
                </div>
                <div className="pt-1 flex items-center justify-between text-xs font-mono text-slate-dark">
                  <span>Branch: main-telemetry</span>
                  <span className="text-emerald-400">● LIVE</span>
                </div>
              </GlassCard>

              {/* Deliverable Downloads */}
              <GlassCard tone="dark" className="p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  <FileText className="size-4 text-copper" />
                  <h3 className="text-sm font-heading font-semibold text-bone">
                    Project Deliverables
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-glass-sm bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-mono text-bone truncate">System Architecture Spec v1.4.pdf</span>
                    <button type="button" className="text-copper hover:text-bone p-1" aria-label="Download architecture spec">
                      <Download className="size-3.5" />
                    </button>
                  </div>
                  <div className="p-2.5 rounded-glass-sm bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-mono text-bone truncate">OpenAPI Schema Contracts.json</span>
                    <button type="button" className="text-copper hover:text-bone p-1" aria-label="Download schema contract">
                      <Download className="size-3.5" />
                    </button>
                  </div>
                  <div className="p-2.5 rounded-glass-sm bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-mono text-bone truncate">Milestone 02 Escrow Invoice.pdf</span>
                    <button type="button" className="text-copper hover:text-bone p-1" aria-label="Download escrow invoice">
                      <Download className="size-3.5" />
                    </button>
                  </div>
                </div>
              </GlassCard>

              {/* Direct Engineering Line */}
              <GlassCard tone="dark" className="p-6 border border-white/10 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-copper font-mono">
                  <Zap className="size-4" />
                  <span>DIRECT ENGINEERING LINE</span>
                </div>
                <p className="text-slate-dark leading-relaxed">
                  Lead engineer Aniket Nandi is available on your private Slack channel for technical discussions and sprint feedback.
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:aniket@cipherstudios.dev"
                    className="inline-flex items-center gap-1.5 text-copper hover:underline font-mono"
                  >
                    <MessageSquare className="size-3.5" />
                    <span>Send direct message &rarr;</span>
                  </a>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
           VIEW B: CLIENT AUTHENTICATION (The Single Sign-In Entry Point)
           ========================================================================= */
        <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in duration-300">
          {/* Top Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-copper">
              <Logo size={16} tone="dark" withWordmark={false} />
              <span>CIPHER PRIVATE CLIENT COCKPIT · SECURE ACCESS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-semibold text-bone tracking-tight leading-[1.1]">
              The Operating System <br />
              <span className="text-slate-dark">For Your Active Build.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-dark leading-relaxed max-w-2xl mx-auto">
              Where engineering transparency meets real-time telemetry. Sign in with your verified client credentials to access commit burndowns, staging builds, and milestone documents.
            </p>
          </div>

          {/* Central Authentication Glass Card */}
          <div id="auth-card" className="max-w-md mx-auto">
            <GlassCard
              tone="dark"
              tilt={true}
              maxTilt={2}
              className="p-6 sm:p-8 border border-white/15 shadow-2xl relative backdrop-blur-2xl"
            >
              {/* Tab Selector: Sign In vs. Register */}
              <div className="flex rounded-full bg-white/5 p-1 border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    setErrorMsg("");
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-medium rounded-full transition-all ${
                    authMode === "signin"
                      ? "bg-copper text-ink font-semibold shadow-md"
                      : "text-slate-dark hover:text-bone"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setErrorMsg("");
                  }}
                  className={`flex-1 py-2 text-xs font-mono font-medium rounded-full transition-all ${
                    authMode === "signup"
                      ? "bg-copper text-ink font-semibold shadow-md"
                      : "text-slate-dark hover:text-bone"
                  }`}
                >
                  Register Account
                </button>
              </div>

              {/* Real Firebase Client Auth Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-dark">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Marcus Sterling"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-bone placeholder:text-slate-dark focus:outline-none focus:border-copper/60 transition-colors"
                        />
                        <User className="size-4 text-slate-dark absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-dark">
                        Company / Organization
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g. Zenith Capital"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-bone placeholder:text-slate-dark focus:outline-none focus:border-copper/60 transition-colors"
                        />
                        <Layers className="size-4 text-slate-dark absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-dark">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@organization.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-bone placeholder:text-slate-dark focus:outline-none focus:border-copper/60 transition-colors font-mono"
                    />
                    <Mail className="size-4 text-slate-dark absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-dark">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-bone placeholder:text-slate-dark focus:outline-none focus:border-copper/60 transition-colors"
                    />
                    <Lock className="size-4 text-slate-dark absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dark hover:text-bone"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2 text-xs text-rose-400">
                    <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isLoading}
                  className="w-full justify-center mt-2 font-mono text-xs"
                  rightIcon={
                    isLoading ? (
                      <RefreshCw className="size-4 animate-spin" />
                    ) : (
                      <ArrowRight className="size-4" />
                    )
                  }
                >
                  {isLoading
                    ? "Authenticating Session..."
                    : authMode === "signin"
                    ? "Sign In to Workspace"
                    : "Create Client Account"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-ink/90 text-[10px] font-mono uppercase tracking-wider text-slate-dark">
                  Or Continue With
                </span>
              </div>

              {/* Google Sign-In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-bone flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google Workspace</span>
              </button>

              {/* Dev / Demonstration Helper */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <button
                  type="button"
                  onClick={handleDemoBypass}
                  className="text-[11px] font-mono text-copper/80 hover:text-copper transition-colors underline"
                >
                  Quick Demo: Inspect Active Sprint Cockpit &rarr;
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Section 1: Cockpit Capabilities */}
          <div className="space-y-8 pt-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <p className="text-xs font-mono text-copper uppercase tracking-widest">
                BUILT FOR ENGINEERING VELOCITY
              </p>
              <h2 className="text-2xl sm:text-4xl font-heading font-semibold text-bone">
                Complete Visibility Into Every Line of Code.
              </h2>
              <p className="text-xs sm:text-sm text-slate-dark leading-relaxed">
                CIPHER replaces slow agency bureaucracy with high-velocity telemetry. As our client, you have total access to every stage of development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COCKPIT_CAPABILITIES.map((cap) => (
                <GlassCard
                  key={cap.id}
                  tone="dark"
                  tilt={true}
                  maxTilt={3}
                  className="p-6 sm:p-8 flex flex-col justify-between border border-white/10 hover:border-copper/40"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="p-3 rounded-full bg-white/5 border border-white/10">
                        {cap.icon}
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-copper bg-copper/10 px-2.5 py-1 rounded-full border border-copper/25 font-semibold">
                        {cap.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-heading font-semibold text-bone">
                      {cap.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-dark leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-dark">Benchmark:</span>
                    <span className="text-copper font-semibold">{cap.metric}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Section 2: Interactive 3-Phase Sprint Cadence Timeline */}
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <p className="text-xs font-mono text-copper uppercase tracking-widest">
                THE SPRINT LIFECYCLE
              </p>
              <h2 className="text-2xl sm:text-4xl font-heading font-semibold text-bone">
                Decode. Build. Evolve.
              </h2>
              <p className="text-xs sm:text-sm text-slate-dark">
                How active client sprints execute from day zero to post-launch scaling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPRINT_CADENCE.map((cad, idx) => (
                <GlassCard
                  key={idx}
                  tone="dark"
                  tilt={true}
                  maxTilt={3}
                  className="p-6 sm:p-8 border border-white/10 relative overflow-hidden"
                >
                  <div className="text-4xl sm:text-5xl font-mono font-bold text-copper/20 absolute -top-2 right-4 pointer-events-none select-none">
                    {cad.step}
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-copper">
                      <Clock className="size-3.5" />
                      <span>{cad.duration}</span>
                    </div>

                    <h3 className="text-xl font-heading font-semibold text-bone">
                      Phase {cad.step}: {cad.phase}
                    </h3>

                    <p className="text-xs font-mono text-bone/80">
                      {cad.tagline}
                    </p>

                    <p className="text-xs text-slate-dark leading-relaxed pt-1">
                      {cad.detail}
                    </p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
