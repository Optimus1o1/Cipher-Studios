import React from 'react';
import { selectedProjects } from '@/data/projects';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';

interface SelectedBuildsSectionProps {
  className?: string;
}

export const SelectedBuildsSection: React.FC<SelectedBuildsSectionProps> = ({ className }) => {
  return (
    <section
      id="work"
      className={cn(
        'relative z-10 py-24 md:py-32 border-t border-line pointer-events-none',
        className
      )}
    >
      <div className="max-w-editorial mx-auto px-6 md:px-8 w-full">
        {/* Section Header */}
        <div className="max-w-[800px] space-y-4 mb-16 md:mb-24 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-copper/10 border border-accent-copper/30 text-accent-copper text-[0.75rem] font-mono tracking-wider uppercase">
            <span className="size-1.5 rounded-full bg-accent-copper animate-pulse" />
            <span>03 Proven Builds · Authentic Engineering Capability</span>
          </div>

          <h2 className="font-serif font-light text-ink text-[2.6rem] sm:text-[3.4rem] md:text-[4.2rem] leading-[1.08] tracking-[-0.02em]">
            Selected Builds. Engineered with Intent.
          </h2>

          <p className="text-mute text-[1.05rem] md:text-[1.15rem] leading-relaxed max-w-[62ch]">
            A curated selection of our independent software products, research engines, and complex interfaces.
            Each build demonstrates our commitment to verifiable architecture, precision data handling, and rigorous engineering.
          </p>
        </div>

        {/* Project Cards List */}
        <div className="space-y-16 md:space-y-24">
          {selectedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
