'use client';

import React, { useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SatelliteServiceConfig } from './satelliteConfigs';
import {
  createSatellite,
  createSatelliteMaterials,
  getOrCreateStudioEnv,
} from './SatelliteFactory';

interface SatelliteModelProps {
  config: SatelliteServiceConfig;
  isSelected?: boolean;
  isHovered?: boolean;
}

export function SatelliteModel({
  config,
  isSelected = false,
  isHovered = false,
}: SatelliteModelProps) {
  const { gl } = useThree();

  // 1. Shared subtle studio PMREM reflection environment map
  const envMap = useMemo(() => {
    return getOrCreateStudioEnv(gl);
  }, [gl]);

  // 2. Physical PBR materials (MeshPhysicalMaterial) for body, panels, metals
  const materials = useMemo(() => {
    return createSatelliteMaterials(config, envMap, isSelected, isHovered);
  }, [config, envMap, isSelected, isHovered]);

  // 3. Shared factory creates the complete realistic spacecraft model
  const satelliteGroup = useMemo(() => {
    return createSatellite(config, materials);
  }, [config, materials]);

  // 4. Dispose per-instance resources when unmounted
  useEffect(() => {
    return () => {
      materials.accent?.dispose();
      materials.indicatorLED?.dispose();
    };
  }, [satelliteGroup, materials]);

  return <primitive object={satelliteGroup} />;
}
