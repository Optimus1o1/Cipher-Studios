import { LeadSubmission } from "@/types";

// Persistent in-memory leads store for dev / fallback mode
const globalForLeads = globalThis as unknown as {
  inMemoryLeads: LeadSubmission[];
};

export const leadsStore: LeadSubmission[] =
  globalForLeads.inMemoryLeads || [
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

if (process.env.NODE_ENV !== "production") {
  globalForLeads.inMemoryLeads = leadsStore;
}
