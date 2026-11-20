'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, GitBranch } from 'lucide-react';
import type { ProjectBuild } from '@/data/projects';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectBuild;
  reverse?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, reverse = false }) => {
  return (
    <article
      className={cn(
        'group rounded-2xl bg-bg-surface/95 sm:bg-bg-surface/70 border border-line/80 p-5 sm:p-7 md:p-8 backdrop-blur-md',
        'transition-all duration-300 hover:border-line hover:shadow-2xl hover:shadow-black/50 pointer-events-auto'
      )}
    >
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center',
          reverse && 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
        )}
      >
        {/* Info Column */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5">
          {/* Heading */}
          <h3 className="font-serif font-light text-ink text-2xl sm:text-3xl lg:text-[2.2rem] leading-tight tracking-tight">
            {project.title}
          </h3>

          {/* Concise Description */}
          <p className="text-mute text-[0.92rem] sm:text-[0.98rem] leading-relaxed max-w-[52ch]">
            {project.summary}
          </p>

          {/* Tech Stack Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="block font-mono text-[0.66rem] uppercase tracking-wider text-mute/80">
              Technology Stack
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-[0.72rem] font-mono bg-white/[0.03] border border-line/50 text-mute transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.provenance.liveUrl && (
              <a
                href={project.provenance.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-bg text-[0.86rem] font-medium hover:bg-accent-hover transition-colors shadow-sm"
              >
                <span>Live Application</span>
                <ArrowUpRight className="size-4" />
              </a>
            )}
            {project.provenance.repoUrl && (
              <a
                href={project.provenance.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-line text-ink hover:text-accent hover:border-line/80 text-[0.86rem] font-medium transition-colors bg-white/[0.02]"
              >
                <GitBranch className="size-4" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Visual Preview Column */}
        <div className="lg:col-span-6">
          <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-line/70 bg-bg shadow-xl group-hover:border-line/90 transition-colors">
            <Image
              src={project.assets.desktop.src}
              alt={project.assets.desktop.alt}
              width={1440}
              height={900}
              loading="lazy"
              sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) calc(100vw - 64px), 600px"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </article>
  );
};
