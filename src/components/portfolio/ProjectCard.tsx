import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink, GitBranch, Terminal, CheckCircle2 } from 'lucide-react';
import type { ProjectBuild } from '@/data/projects';
import { ProjectMetricHUD } from './ProjectMetricHUD';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectBuild;
  reverse?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, reverse = false }) => {
  const isLive = project.provenance.status === 'LIVE';

  let badgeVariantClasses = 'bg-accent-copper/10 text-accent-copper border-accent-copper/30';
  if (project.classification.variant === 'space') {
    badgeVariantClasses = 'bg-sky-400/10 text-sky-400 border-sky-400/30';
  } else if (project.classification.variant === 'research') {
    badgeVariantClasses = 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30';
  }

  let assetTypePill = 'LOCAL QUALIFIED BUILD';
  let assetTypeColor = 'text-accent-copper border-accent-copper/40 bg-accent-copper/10';
  if (project.assets.desktop.type === 'live-production') {
    assetTypePill = 'LIVE PRODUCTION DEPLOYMENT';
    assetTypeColor = 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
  } else if (project.assets.desktop.type === 'architecture-diagram') {
    assetTypePill = 'SYSTEM ARCHITECTURE DIAGRAM';
    assetTypeColor = 'text-sky-400 border-sky-400/40 bg-sky-400/10';
  }

  return (
    <article
      className={cn(
        'group relative rounded-2xl bg-bg-surface/80 border border-line p-6 sm:p-8 md:p-10 backdrop-blur-md',
        'transition-all duration-300 hover:border-line/70 hover:shadow-2xl hover:shadow-black/50 pointer-events-auto'
      )}
    >
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center',
          reverse && 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1'
        )}
      >
        {/* Left / Primary Info Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Classification & Provenance Tag */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[0.68rem] font-mono font-medium tracking-wider uppercase border',
                badgeVariantClasses
              )}
            >
              {project.classification.label}
            </span>
            <span className="font-mono text-[0.66rem] text-mute flex items-center gap-1">
              <Terminal className="size-3 text-accent" />
              <span>Commit {project.provenance.commit.slice(0, 7)}</span>
            </span>
          </div>

          {/* Heading & Tagline */}
          <div className="space-y-1.5">
            <h3 className="font-serif font-light text-ink text-[2.2rem] sm:text-[2.6rem] leading-[1.1] tracking-tight">
              {project.title}
            </h3>
            <p className="text-accent text-[1.05rem] font-medium tracking-wide">
              {project.tagline}
            </p>
          </div>

          {/* Summary */}
          <p className="text-mute text-[0.98rem] leading-relaxed">
            {project.summary}
          </p>

          {/* Mathematical Proof / Equations Block (If present) */}
          {(project.keyEquation || project.secondaryEquation) && (
            <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border-l-2 border-l-accent-copper border-line/50 font-mono text-[0.78rem]">
              {project.keyEquation && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-mute">
                    <span className="uppercase tracking-wider text-[0.68rem] text-accent">
                      {project.keyEquation.name}
                    </span>
                    <span className="text-[0.66rem] text-mute/80">{project.keyEquation.units}</span>
                  </div>
                  <div className="text-ink font-semibold text-[0.92rem]">
                    {project.keyEquation.formula}
                  </div>
                  <div className="text-[0.70rem] text-mute/90 leading-normal">
                    {project.keyEquation.note}
                  </div>
                </div>
              )}
              {project.secondaryEquation && (
                <div className="space-y-1 pt-2 border-t border-line/30">
                  <div className="flex items-center justify-between text-mute">
                    <span className="uppercase tracking-wider text-[0.68rem] text-sky-400">
                      {project.secondaryEquation.name}
                    </span>
                    <span className="text-[0.66rem] text-mute/80">{project.secondaryEquation.units}</span>
                  </div>
                  <div className="text-ink font-semibold text-[0.92rem]">
                    {project.secondaryEquation.formula}
                  </div>
                  <div className="text-[0.70rem] text-mute/90 leading-normal">
                    {project.secondaryEquation.note}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Capabilities */}
          <div className="space-y-2.5 pt-1">
            <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-mute">
              Core Implemented Capabilities
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[0.88rem] text-ink/90">
              {project.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-accent-copper shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    <strong className="font-medium text-ink">{cap.title}:</strong>{' '}
                    <span className="text-mute">{cap.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {project.techStack.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full text-[0.72rem] font-mono bg-white/[0.03] border border-line/40 text-mute"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {project.provenance.liveUrl && (
              <a
                href={project.provenance.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent text-bg text-[0.88rem] font-medium hover:bg-accent-hover transition-colors shadow-sm"
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
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-line text-ink hover:text-accent hover:border-line/80 text-[0.88rem] font-medium transition-colors bg-white/[0.02]"
              >
                <GitBranch className="size-4" />
                <span>Source Repository</span>
              </a>
            )}
          </div>
        </div>

        {/* Right / Visual Preview Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Metrics HUD Banner */}
          <ProjectMetricHUD metrics={project.metrics} />

          {/* Browser Mockup Window */}
          <div className="rounded-xl overflow-hidden border border-line/80 bg-black/60 shadow-2xl">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0C0E1A] border-b border-line/60">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-white/20" />
                <span className="size-2 rounded-full bg-white/20" />
                <span className="size-2 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 mx-3 px-2.5 py-0.5 rounded bg-white/[0.03] border border-line/30 font-mono text-[0.66rem] text-mute truncate text-center">
                {project.provenance.liveUrl ? (
                  <span className="flex items-center justify-center gap-1 truncate">
                    <span className="text-emerald-400">●</span> {project.provenance.liveUrl}
                  </span>
                ) : (
                  <span className="truncate">privguard://gateway.telemetry/v1</span>
                )}
              </div>
              <span
                className={cn(
                  'px-2 py-0.5 rounded font-mono text-[0.60rem] uppercase tracking-wider border shrink-0',
                  assetTypeColor
                )}
              >
                {assetTypePill}
              </span>
            </div>

            {/* Application Screenshot Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg">
              <Image
                src={project.assets.desktop.src}
                alt={project.assets.desktop.alt}
                width={1440}
                height={900}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* Visual Provenance Caption Bar */}
            <div className="px-3.5 py-2 bg-[#080912] border-t border-line/40 flex items-center justify-between text-[0.68rem] font-mono text-mute">
              <span className="truncate">{project.assets.desktop.caption}</span>
              <span className="shrink-0 text-mute/60">{project.assets.desktop.viewport}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
