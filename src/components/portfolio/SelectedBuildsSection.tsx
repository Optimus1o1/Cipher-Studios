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
        'relative z-10 py-12 sm:py-16 md:py-24 border-t border-line bg-veil/75 md:bg-transparent backdrop-blur-[2px] md:backdrop-blur-0 pointer-events-none',
        className
      )}
    >
      <div className="max-w-editorial mx-auto px-5 sm:px-6 md:px-8 w-full">
        {/* Section Header */}
        <div className="max-w-[760px] space-y-3.5 mb-10 sm:mb-14 md:mb-16 pointer-events-auto relative">
          {/* Subtle mobile readability scrim */}
          <div
            aria-hidden="true"
            className="absolute -inset-4 sm:-inset-6 rounded-3xl bg-bg/75 md:bg-transparent backdrop-blur-md md:backdrop-blur-0 -z-10 pointer-events-none"
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-copper/10 border border-accent-copper/30 text-accent-copper text-[0.72rem] font-mono tracking-wider uppercase">
            <span className="size-1.5 rounded-full bg-accent-copper animate-pulse" />
            <span>03 Selected Builds · Authentic Engineering</span>
          </div>

          <h2 className="font-serif font-light text-ink text-[2.1rem] sm:text-[2.8rem] md:text-[3.6rem] leading-[1.1] tracking-[-0.02em]">
            Selected Builds. Engineered with Intent.
          </h2>

          <p className="text-[#C0C6D8] md:text-mute text-[0.95rem] sm:text-[1.05rem] md:text-[1.12rem] leading-relaxed max-w-[58ch]">
            A curated selection of our independent software products, research engines, and complex interfaces.
            Each build demonstrates our commitment to verifiable architecture, precision data handling, and rigorous engineering.
          </p>
        </div>

        {/* Project Cards List */}
        <div className="space-y-8 sm:space-y-10 md:space-y-14">
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
