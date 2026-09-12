import { create } from "zustand";
import { ProcessAct } from "@/types";

/**
 * Plain mutable ref for 60FPS Three.js render loop.
 * GSAP ScrollTrigger onUpdate writes to this directly without triggering React re-renders.
 * BoxesHoverField reads this inside useFrame.
 */
export const scrollProgressRef = { current: 0 };
export const heroProgressRef = { current: 0 };

/**
 * Mutable singleton ref for ProcessAct morphing transition
 */
export const scrollBridgeMutable = {
  progress: 0,
  targetProgress: 0,
  inProcessSection: false,
};

interface ScrollBridgeState {
  activeAct: ProcessAct;
  isNavDocked: boolean;
  setProgress: (progress: number, inProcess?: boolean) => void;
  setActiveAct: (act: ProcessAct) => void;
  setNavDocked: (docked: boolean) => void;
}

export const useScrollBridge = create<ScrollBridgeState>((set, get) => ({
  activeAct: "decode",
  isNavDocked: false,
  setProgress: (progress: number, inProcess: boolean = true) => {
    // 1. Update mutable memory for 60fps WebGL render loop (zero React overhead)
    scrollProgressRef.current = Math.max(0, Math.min(1, progress));
    scrollBridgeMutable.targetProgress = Math.max(0, Math.min(1, progress));
    scrollBridgeMutable.inProcessSection = inProcess;

    // 2. Only trigger Zustand React re-render when the distinct Act boundary changes
    let nextAct: ProcessAct = "decode";
    if (progress >= 0.66) {
      nextAct = "evolve";
    } else if (progress >= 0.33) {
      nextAct = "build";
    }

    if (get().activeAct !== nextAct) {
      set({ activeAct: nextAct });
    }
  },
  setActiveAct: (activeAct: ProcessAct) => {
    let p = 0;
    if (activeAct === "build") p = 0.5;
    if (activeAct === "evolve") p = 0.85;
    scrollProgressRef.current = p;
    scrollBridgeMutable.targetProgress = p;
    set({ activeAct });
  },
  setNavDocked: (isNavDocked: boolean) => {
    if (get().isNavDocked !== isNavDocked) {
      set({ isNavDocked });
    }
  },
}));

