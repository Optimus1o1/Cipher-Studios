import { NextRequest, NextResponse } from "next/server";
import { leadsStore } from "@/lib/leadsStore";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

function verifyAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const adminSecret = process.env.CIPHER_ADMIN_SECRET || "cipher-internal-admin-2026";
  
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token === adminSecret;
}

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rate = checkRateLimit(clientIp, 30, 60 * 1000); // 30 req/min
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  // Security Guard: Prevent public data exfiltration
  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      {
        error: "Unauthorized: Admin authorization required to access client lead data.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    leads: leadsStore,
    total: leadsStore.length,
  });
}

export async function PATCH(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rate = checkRateLimit(clientIp, 20, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  if (!verifyAdminAuth(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin authorization required." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { leadId, status } = body;

    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    lead.status = status;
    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}
