import { SatelliteConfig, SATELLITE_CONFIGS } from '@/components/three/satellites/types';

export interface SatelliteScreenCoord {
  id: number;
  slug: string;
  config: SatelliteConfig;
  screenX: number; // Viewport screen X (px)
  screenY: number; // Viewport screen Y (px)
  depthZ: number;  // Camera depth Z
  behindMoon: boolean;
  edgeOccluded: boolean;
  moonScreenX: number;
  moonScreenY: number;
  viewportWidth: number;
  viewportHeight: number;
  silhouette?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
}

type CoordsListener = (coords: Map<string, SatelliteScreenCoord>) => void;

class OrbitalCoordsBridge {
  private coords = new Map<string, SatelliteScreenCoord>();
  private listeners = new Set<CoordsListener>();
  private isBroadcasting = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('msl-orbital-coords-sync', ((event: CustomEvent<Map<string, SatelliteScreenCoord>>) => {
        if (this.isBroadcasting) return;
        if (event.detail) {
          this.coords = event.detail;
          this.listeners.forEach((listener) => listener(this.coords));
        }
      }) as EventListener);
    }
  }

  public updateSatellite(data: SatelliteScreenCoord) {
    this.coords.set(data.slug, data);
  }

  public get(slug: string): SatelliteScreenCoord | undefined {
    return this.coords.get(slug);
  }

  public getAll(): Map<string, SatelliteScreenCoord> {
    return this.coords;
  }

  public subscribe(listener: CoordsListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify() {
    this.isBroadcasting = true;
    this.listeners.forEach((listener) => listener(this.coords));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('msl-orbital-coords-sync', { detail: this.coords })
      );
    }
    this.isBroadcasting = false;
  }
}

export const orbitalCoordsBridge = new OrbitalCoordsBridge();
