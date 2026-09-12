import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

interface AuditResult {
  url: string;
  domain: string;
  grade: "A" | "B" | "C" | "F";
  score: number;
  ttfbMs: number;
  protocol: string;
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
  timestamp: string;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rate = checkRateLimit(clientIp, 12, 10 * 60 * 1000); // 12 audits per 10 mins
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Audit rate limit exceeded. Please wait a few minutes before testing another URL." },
        { status: 429 }
      );
    }

    const body = await req.json();
    let rawUrl = (body?.url || "").trim();
    if (!rawUrl) {
      return NextResponse.json({ error: "Please enter a valid website URL." }, { status: 400 });
    }

    if (!/^https?:\/\//i.test(rawUrl)) {
      rawUrl = `https://${rawUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    const domain = parsedUrl.hostname;

    // Probe the target URL with a 6-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const startTime = Date.now();
    let response: Response;
    try {
      response = await fetch(parsedUrl.toString(), {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CIPHER-Security-Auditor/1.0",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: controller.signal,
        redirect: "follow",
        cache: "no-store",
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          error: `Could not connect to ${domain}. Please verify the domain is live and accessible over HTTPS.`,
        },
        { status: 422 }
      );
    }
    clearTimeout(timeoutId);
    const ttfbMs = Date.now() - startTime;

    // Analyze headers
    const hsts = Boolean(response.headers.get("strict-transport-security"));
    const csp = Boolean(response.headers.get("content-security-policy"));
    const xFrame = Boolean(response.headers.get("x-frame-options"));
    const xContentType = Boolean(response.headers.get("x-content-type-options"));
    const referrerPolicy = Boolean(response.headers.get("referrer-policy"));
    const serverHeader = response.headers.get("server") || response.headers.get("x-powered-by");

    // Calculate score
    let score = 100;
    const findings: AuditResult["findings"] = [];

    if (!hsts) {
      score -= 25;
      findings.push({
        type: "critical",
        title: "Missing HSTS (Strict-Transport-Security)",
        description: "Your site does not enforce encrypted HTTPS connections, leaving patient and visitor sessions susceptible to man-in-the-middle downgrade attacks.",
      });
    } else {
      findings.push({
        type: "good",
        title: "HSTS Enforced",
        description: "Encrypted HTTPS transport is enforced with strict transport security.",
      });
    }

    if (!csp) {
      score -= 25;
      findings.push({
        type: "critical",
        title: "Missing Content Security Policy (CSP)",
        description: "Zero restrictions on executable scripts. Vulnerable to malicious code injection, keyloggers, and cross-site scripting (XSS).",
      });
    } else {
      findings.push({
        type: "good",
        title: "CSP Policy Detected",
        description: "Content Security Policy is restricting unauthorized inline script execution.",
      });
    }

    if (!xFrame) {
      score -= 15;
      findings.push({
        type: "warning",
        title: "Missing X-Frame-Options",
        description: "Your pages can be embedded in hidden iframes on external phishing domains (Clickjacking vulnerability).",
      });
    }

    if (!xContentType) {
      score -= 15;
      findings.push({
        type: "warning",
        title: "Missing X-Content-Type-Options: nosniff",
        description: "Browsers may attempt to execute uploaded non-script files as scripts (MIME-type sniffing hazard).",
      });
    }

    if (ttfbMs > 900) {
      score -= 20;
      findings.push({
        type: "warning",
        title: `Slow Server Response Time (${ttfbMs}ms)`,
        description: `Server response exceeds recommended thresholds (CIPHER standard is < 180ms). High mobile abandonment likely.`,
      });
    } else {
      findings.push({
        type: "good",
        title: `Acceptable Server Latency (${ttfbMs}ms)`,
        description: "Initial server handshake and header response is responsive.",
      });
    }

    if (serverHeader) {
      score -= 5;
      findings.push({
        type: "warning",
        title: `Server Technology Fingerprint Leaked`,
        description: `Server header exposes: "${serverHeader}", allowing attackers to target version-specific vulnerabilities.`,
      });
    }

    score = Math.max(15, Math.min(100, score));

    let grade: AuditResult["grade"] = "F";
    if (score >= 85) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 50) grade = "C";

    const result: AuditResult = {
      url: rawUrl,
      domain,
      grade,
      score,
      ttfbMs,
      protocol: parsedUrl.protocol,
      headersCheck: {
        hsts,
        csp,
        xFrame,
        xContentType,
        referrerPolicy,
      },
      serverLeak: serverHeader,
      findings,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Failed to perform diagnostic audit." }, { status: 500 });
  }
}
