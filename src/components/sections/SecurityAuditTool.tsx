"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Search,
  RefreshCw,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface AuditData {
  url: string;
  domain: string;
  protocol?: string;
  grade: "A" | "B" | "C" | "F";
  score: number;
  ttfbMs: number;
  headersCheck: {
    hsts: boolean;
    csp: boolean;
    xFrame: boolean;
    xContentType: boolean;
    referrerPolicy: boolean;
  };
  serverLeak: string | null;
  findings: {
    type: "critical" | "warning" | "good";
    title: string;
    description: string;
  }[];
}

export function SecurityAuditTool() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditData | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to audit website.");
      }

      setAuditResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to connect to target website.");
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "B":
        return "text-copper border-copper/30 bg-copper/10";
      case "C":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      default:
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
    }
  };

  return (
    <section id="audit-tool" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-ink/70 backdrop-blur-md border-t border-b border-white/5">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-copper">
            <Lock className="size-3.5" />
            <span>Interactive Lead Diagnostic</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-bone">
            Audit Your Practice&apos;s Digital Security &amp; Speed
          </h2>
          <p className="text-sm sm:text-base text-slate font-sans leading-relaxed">
            Most clinic websites leak patient form data, omit critical security headers, and suffer from multi-second load times. Run an instant live diagnostic on your current domain.
          </p>
        </div>

        {/* Audit Search Bar */}
        <form onSubmit={handleAudit} className="mt-10 max-w-2xl mx-auto">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="relative flex-1 flex items-center pl-3">
              <Search className="size-5 text-slate shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. yourclinic.com or drsmithortho.com"
                className="w-full px-3 py-2.5 bg-transparent text-sm font-mono text-bone placeholder:text-slate-dark focus:outline-none"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !urlInput.trim()}
              className="sm:w-auto w-full justify-center text-xs font-mono"
              rightIcon={loading ? <RefreshCw className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            >
              {loading ? "Probing Infrastructure..." : "Run Diagnostic"}
            </Button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-xs font-mono text-rose-400"
            >
              {error}
            </motion.p>
          )}
        </form>

        {/* Audit Result Card */}
        <AnimatePresence>
          {auditResult && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="mt-10 p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate">
                    <span>Audit Target:</span>
                    <strong className="text-bone">{auditResult.domain}</strong>
                    {auditResult.protocol && (
                      <span className="text-slate-dark">({auditResult.protocol.replace(":", "")})</span>
                    )}
                  </div>
                  <h3 className="mt-1 text-xl sm:text-2xl font-heading font-semibold text-bone">
                    Diagnostic Scorecard
                  </h3>
                </div>

                <div className="flex items-center gap-4 self-start md:self-auto">
                  <div className={`px-4 py-2 rounded-xl border text-center ${getGradeColor(auditResult.grade)}`}>
                    <span className="text-[10px] font-mono uppercase tracking-wider block">Security Grade</span>
                    <span className="text-3xl font-heading font-bold">{auditResult.grade}</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-center">
                    <span className="text-[10px] font-mono text-slate uppercase tracking-wider block">Server Latency</span>
                    <span className="text-xl font-heading font-semibold text-bone">{auditResult.ttfbMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Security Header Checklist */}
              <div className="mt-6">
                <h4 className="text-xs font-mono text-slate uppercase tracking-wider mb-3">
                  Essential Security Controls:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-slate">HSTS Transport</span>
                    {auditResult.headersCheck.hsts ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <XCircle className="size-4 text-rose-400" />
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-slate">CSP Script Guard</span>
                    {auditResult.headersCheck.csp ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <XCircle className="size-4 text-rose-400" />
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-slate">X-Frame Protection</span>
                    {auditResult.headersCheck.xFrame ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <XCircle className="size-4 text-rose-400" />
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-slate">MIME Nosniff</span>
                    {auditResult.headersCheck.xContentType ? (
                      <CheckCircle2 className="size-4 text-emerald-400" />
                    ) : (
                      <XCircle className="size-4 text-rose-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Actionable Findings */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-xs font-mono text-slate uppercase tracking-wider mb-3">
                  Actionable Findings &amp; Risk Surface:
                </h4>
                <div className="space-y-2.5">
                  {auditResult.findings.map((f, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-start gap-3"
                    >
                      {f.type === "critical" && <AlertTriangle className="size-4 text-rose-400 shrink-0 mt-0.5" />}
                      {f.type === "warning" && <AlertTriangle className="size-4 text-amber-400 shrink-0 mt-0.5" />}
                      {f.type === "good" && <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />}
                      <div>
                        <div className="text-xs font-heading font-medium text-bone">{f.title}</div>
                        <p className="mt-0.5 text-xs font-sans text-slate leading-relaxed">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion CTA to CIPHER Remediation */}
              <div className="mt-8 p-4 rounded-xl bg-copper/10 border border-copper/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-heading font-semibold text-bone">
                    Need your clinic&apos;s infrastructure secured and accelerated?
                  </div>
                  <p className="text-[11px] font-sans text-slate-light">
                    We fix these security gaps, configure strict CSP/HSTS policies, and achieve sub-second speeds.
                  </p>
                </div>
                <Link href={`/contact?domain=${encodeURIComponent(auditResult.domain)}`}>
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="size-3.5" />}>
                    Request Remediation Sprint
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
