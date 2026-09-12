export type DeviceTier = "full" | "lite" | "off";

export type ProcessAct = "decode" | "build" | "evolve";

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  bigStat: string;
  statUnit: string;
  statLabel: string;
  isFlagship?: boolean;
  timeline: string;
  priceFloor: {
    usd: string;
    inr: string;
  };
  deliverables: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  category: "SaaS MVP" | "E-Commerce" | "Landing Page" | "Web Application";
  tagline: string;
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
  techStack: string[];
  deliverables: string[];
  featured?: boolean;
  image?: string;
  link?: string;
}

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  location: string;
  quote: string;
  metric: string;
  metricLabel: string;
}

export interface LeadSubmission {
  id?: string;
  fullName: string;
  email: string;
  company?: string;
  serviceType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  honeypot?: string;
  createdAt?: string;
  status?: "new" | "reviewing" | "contacted" | "won" | "archived";
}

export interface ClientMilestone {
  id: string;
  title: string;
  phase: string;
  status: "completed" | "in_progress" | "upcoming";
  dueDate: string;
  notes: string;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: string;
  currency: string;
  status: "paid" | "pending" | "processing";
  issuedDate: string;
  dueDate: string;
}
