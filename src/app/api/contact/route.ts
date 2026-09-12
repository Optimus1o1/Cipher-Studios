import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { leadsStore } from "@/lib/leadsStore";
import { LeadSubmission } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/[&<>"'/]/g, (s) => {
      const entityMap: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;",
      };
      return entityMap[s] || s;
    })
    .trim();
}

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Invalid email address").max(100),
  company: z.string().max(100).optional(),
  serviceType: z.string().min(1, "Service type is required"),
  budgetRange: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // 1. Rate limiting guard (max 5 submissions per 15 minutes per IP)
    const rate = checkRateLimit(clientIp, 5, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a few minutes before submitting another inquiry.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Honeypot check: If bot fills honeypot, silently return 200 OK
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, message: "Inquiry received" });
    }

    // 3. Schema validation
    const validated = contactSchema.parse(body);

    // 4. Sanitize all string inputs against XSS
    const cleanLead: LeadSubmission = {
      id: `lead-${Date.now()}`,
      fullName: sanitize(validated.fullName),
      email: validated.email.toLowerCase().trim(),
      company: validated.company ? sanitize(validated.company) : "Direct Client",
      serviceType: sanitize(validated.serviceType),
      budgetRange: sanitize(validated.budgetRange),
      timeline: sanitize(validated.timeline),
      message: sanitize(validated.message),
      createdAt: "Just now",
      status: "new",
    };

    leadsStore.unshift(cleanLead);

    return NextResponse.json(
      {
        success: true,
        message: "Your project inquiry has been securely received. We will respond within 24 hours.",
        leadId: cleanLead.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact API error:", error);
    if (error instanceof z.ZodError || error?.name === "ZodError" || error?.errors) {
      const firstError = error?.errors?.[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error. Please contact directly." },
      { status: 500 }
    );
  }
}
