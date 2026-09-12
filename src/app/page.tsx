import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { SecurityAuditTool } from "@/components/sections/SecurityAuditTool";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ScrollGridSection } from "@/components/three/ScrollGridSection";
import { ClientPortalSection } from "@/components/sections/ClientPortalSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export default function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <TrustStrip />
      <SecurityAuditTool />
      <ServicesSection />
      <WorkSection />
      <AboutSection />
      <ScrollGridSection />
      <ClientPortalSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}

