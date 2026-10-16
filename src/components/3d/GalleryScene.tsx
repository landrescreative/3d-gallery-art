import React, { useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import { Artwork, Sculpture, LightingMode, GraphicsQuality } from '../../types/gallery'
import { VisualConfig } from '../../types/visualSettings'
import { GalleryArchitecture } from './GalleryArchitecture'
import { ArtworkFrame } from './ArtworkFrame'
import { SculpturePedestal } from './SculpturePedestal'
import { PlayerController } from './PlayerController'
import { CinematicTour } from './CinematicTour'
import { GalleryEnvironment } from './GalleryEnvironment'

interface GallerySceneProps {
  artworks: Artwork[]
  sculptures: Sculpture[]
  nearestItem: Artwork | Sculpture | null
  onNearestChange: (item: Artwork | Sculpture | null) => void
  onSelect: (item: Artwork | Sculpture) => void
  lightingMode: LightingMode
  graphicsQuality?: GraphicsQuality
  visualConfig?: VisualConfig
  isDebugging?: boolean
  teleportTarget: [number, number, number] | null
  onTeleportComplete: () => void
  isInspecting: boolean
  isTouring: boolean
  tourIndex: number
  tourItems: (Artwork | Sculpture)[]
  onTourItemReached: (item: Artwork | Sculpture) => void
}

// Dynamically calibrate renderer exposure and camera FOV
const DynamicRendererController: React.FC<{
  exposure: number
  fov: number
  isPortrait: boolean
}> = ({ exposure, fov, isPortrait }) => {
  const { gl, camera } = useThree()

  React.useEffect(() => {
    gl.toneMappingExposure = exposure
  }, [gl, exposure])

  React.useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isPortrait ? Math.max(85, fov + 15) : fov
      camera.updateProjectionMatrix()
    }
  }, [camera, fov, isPortrait])

  return null
}

export const GalleryScene: React.FC<GallerySceneProps> = ({
  artworks,
  sculptures,
  nearestItem,
  onNearestChange,
  onSelect,
  lightingMode,
  graphicsQuality = 'medio',
  visualConfig,
  isDebugging = false,
  teleportTarget,
  onTeleportComplete,
  isInspecting,
  isTouring,
  tourIndex,
  tourItems,
  onTourItemReached
}) => {
  // Theme-based enhanced lighting taking postprocessing into account (7 rich architectural presets)
  const lighting = useMemo(() => {
    switch (lightingMode) {
      case 'noon':
        return {
          ambientIntensity: 0.48,
          ambientColor: '#e0f2fe',
          hemiSky: '#bae6fd',
          hemiGround: '#94a3b8',
          hemiIntensity: 0.45,
          sunIntensity: 3.20,
          sunColor: '#fffdf5',
          sunPos: [2, 24, 14] as [number, number, number],
          atriumColor: '#fffdf7',
          graphicColor: '#f8fafc',
          uiWebColor: '#f0f9ff',
          threeDColor: '#e0f2fe',
          fogColor: '#e0f2fe',
          fogNear: 55,
          fogFar: 180,
          ceilingFillIntensity: 0.95
        }
      case 'warm':
        return {
          ambientIntensity: 0.40,
          ambientColor: '#fef3c7',
          hemiSky: '#fed7aa',
          hemiGround: '#7c2d12',
          hemiIntensity: 0.38,
          sunIntensity: 2.80,
          sunColor: '#f59e0b',
          sunPos: [14, 9, 24] as [number, number, number],
          atriumColor: '#fed7aa',
          graphicColor: '#fef3c7',
          uiWebColor: '#fde68a',
          threeDColor: '#fed7aa',
          fogColor: '#2d1508',
          fogNear: 38,
          fogFar: 135,
          ceilingFillIntensity: 0.80
        }
      case 'city':
        return {
          ambientIntensity: 0.44,
          ambientColor: '#e2e8f0',
          hemiSky: '#cbd5e1',
          hemiGround: '#334155',
          hemiIntensity: 0.38,
          sunIntensity: 2.65,
          sunColor: '#f8fafc',
          sunPos: [-8, 18, 22] as [number, number, number],
          atriumColor: '#f1f5f9',
          graphicColor: '#e2e8f0',
          uiWebColor: '#38bdf8',
          threeDColor: '#f8fafc',
          fogColor: '#1e293b',
          fogNear: 46,
          fogFar: 145,
          ceilingFillIntensity: 0.85
        }
      case 'cyberpunk':
        return {
          ambientIntensity: 0.14,
          ambientColor: '#1e1035',
          hemiSky: '#a855f7',
          hemiGround: '#020617',
          hemiIntensity: 0.25,
          sunIntensity: 0.65,
          sunColor: '#06b6d4',
          sunPos: [-12, 14, 20] as [number, number, number],
          atriumColor: '#a855f7',
          graphicColor: '#f43f5e',
          uiWebColor: '#06b6d4',
          threeDColor: '#38bdf8',
          fogColor: '#0c0517',
          fogNear: 24,
          fogFar: 85,
          ceilingFillIntensity: 1.10
        }
      case 'studio':
        return {
          ambientIntensity: 0.50,
          ambientColor: '#ffffff',
          hemiSky: '#ffffff',
          hemiGround: '#cbd5e1',
          hemiIntensity: 0.42,
          sunIntensity: 2.40,
          sunColor: '#ffffff',
          sunPos: [0, 20, 20] as [number, number, number],
          atriumColor: '#ffffff',
          graphicColor: '#ffffff',
          uiWebColor: '#ffffff',
          threeDColor: '#ffffff',
          fogColor: '#f8fafc',
          fogNear: 50,
          fogFar: 160,
          ceilingFillIntensity: 0.90
        }
      case 'nordic':
        return {
          ambientIntensity: 0.46,
          ambientColor: '#f1f5f9',
          hemiSky: '#f8fafc',
          hemiGround: '#94a3b8',
          hemiIntensity: 0.40,
          sunIntensity: 2.10,
          sunColor: '#e2e8f0',
          sunPos: [3, 19, 24] as [number, number, number],
          atriumColor: '#f8fafc',
          graphicColor: '#f1f5f9',
          uiWebColor: '#e2e8f0',
          threeDColor: '#f1f5f9',
          fogColor: '#e2e8f0',
          fogNear: 48,
          fogFar: 145,
          ceilingFillIntensity: 0.78
        }
      case 'dramatic':
        return {
          ambientIntensity: 0.05,
          ambientColor: '#0a0a0c',
          hemiSky: '#18181b',
          hemiGround: '#030303',
          hemiIntensity: 0.08,
          sunIntensity: 2.90,
          sunColor: '#fef08a',
          sunPos: [8, 14, 18] as [number, number, number],
          atriumColor: '#fbbf24',
          graphicColor: '#f59e0b',
          uiWebColor: '#93c5fd',
          threeDColor: '#fde047',
          fogColor: '#050507',
          fogNear: 22,
          fogFar: 75,
          ceilingFillIntensity: 0.45
        }
      case 'gallery':
        return {
          ambientIntensity: 0.46,
          ambientColor: '#ffffff',
          hemiSky: '#f8fafc',
          hemiGround: '#cbd5e1',
          hemiIntensity: 0.42,
          sunIntensity: 2.70,
          sunColor: '#ffffff',
          sunPos: [4, 16, 26] as [number, number, number],
          atriumColor: '#ffffff',
          graphicColor: '#ffffff',
          uiWebColor: '#ffffff',
          threeDColor: '#ffffff',
          fogColor: '#f1f5f9',
          fogNear: 50,
          fogFar: 160,
          ceilingFillIntensity: 0.85
        }
      case 'sunset_crimson':
        return {
          ambientIntensity: 0.35,
          ambientColor: '#2e1065',
          hemiSky: '#db2777',
          hemiGround: '#4c0519',
          hemiIntensity: 0.35,
          sunIntensity: 2.90,
          sunColor: '#f43f5e',
          sunPos: [16, 7, 22] as [number, number, number],
          atriumColor: '#f43f5e',
          graphicColor: '#fb7185',
          uiWebColor: '#ec4899',
          threeDColor: '#e11d48',
          fogColor: '#1e0521',
          fogNear: 35,
          fogFar: 125,
          ceilingFillIntensity: 0.82
        }
      case 'aurora':
        return {
          ambientIntensity: 0.12,
          ambientColor: '#022c22',
          hemiSky: '#10b981',
          hemiGround: '#021c17',
          hemiIntensity: 0.28,
          sunIntensity: 0.45,
          sunColor: '#38bdf8',
          sunPos: [5, 18, -20] as [number, number, number],
          atriumColor: '#10b981',
          graphicColor: '#2dd4bf',
          uiWebColor: '#06b6d4',
          threeDColor: '#34d399',
          fogColor: '#021814',
          fogNear: 25,
          fogFar: 90,
          ceilingFillIntensity: 0.55
        }
      case 'autumn':
        return {
          ambientIntensity: 0.42,
          ambientColor: '#fef3c7',
          hemiSky: '#fed7aa',
          hemiGround: '#78350f',
          hemiIntensity: 0.40,
          sunIntensity: 2.85,
          sunColor: '#f59e0b',
          sunPos: [10, 14, 20] as [number, number, number],
          atriumColor: '#fed7aa',
          graphicColor: '#f59e0b',
          uiWebColor: '#fbbf24',
          threeDColor: '#d97706',
          fogColor: '#2e1406',
          fogNear: 42,
          fogFar: 140,
          ceilingFillIntensity: 0.88
        }
      case 'noir':
        return {
          ambientIntensity: 0.08,
          ambientColor: '#000000',
          hemiSky: '#f8fafc',
          hemiGround: '#000000',
          hemiIntensity: 0.18,
          sunIntensity: 3.10,
          sunColor: '#ffffff',
          sunPos: [-6, 22, 18] as [number, number, number],
          atriumColor: '#ffffff',
          graphicColor: '#ffffff',
          uiWebColor: '#ffffff',
          threeDColor: '#ffffff',
          fogColor: '#09090b',
          fogNear: 35,
          fogFar: 110,
          ceilingFillIntensity: 0.70
        }
      case 'night':
      default:
        return {
          ambientIntensity: 0.06,
          ambientColor: '#090d16',
          hemiSky: '#1e293b',
          hemiGround: '#020617',
          hemiIntensity: 0.09,
          sunIntensity: 0.30,
          sunColor: '#93c5fd', // Soft cool lunar silver-blue
          sunPos: [4, 16, -18] as [number, number, number], // Moon positioned above the outdoor scenic courtyard
          atriumColor: '#fff1d6', // Warm glowing interior museum fixtures
          graphicColor: '#fef3c7',
          uiWebColor: '#e0f2fe',
          threeDColor: '#f8fafc',
          fogColor: '#030508', // Deep starry night sky fog
          fogNear: 28,
          fogFar: 95,
          ceilingFillIntensity: 0.38 // Subtle warm interior lamps at night
        }
    }
  }, [lightingMode])

  // Robust mobile detection (works in landscape and portrait)
  const isMobile = typeof window !== 'undefined' && (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  )

  const [isPortrait, setIsPortrait] = React.useState(
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  )

  React.useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Dynamic DPR calibrated strictly for 60fps performance and pristine edge clarity
  const dpr = useMemo<[number, number]>(() => {
    switch (graphicsQuality) {
      case 'bajo':
        return isMobile ? [1.0, 1.0] : [0.85, 1.0]
      case 'medio':
        return isMobile ? [1.0, 1.5] : [1.0, 1.5]
      case 'alto':
      default:
        return isMobile ? [1.0, 1.75] : [1.0, 2.0]
    }
  }, [graphicsQuality, isMobile])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        frameloop={isInspecting ? 'never' : 'always'}
        shadows={graphicsQuality !== 'bajo' ? 'soft' : false}
        dpr={dpr}
        camera={{ position: [0, 1.7, 5], fov: isPortrait ? 85 : 70, near: 0.1, far: 140 }}
        gl={{
          antialias: true, // Hardware MSAA multi-sampling active across mobile and desktop to eliminate jagged edges
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
          powerPreference: "high-performance"
        }}
      >
        <DynamicRendererController
          exposure={visualConfig?.exposure ?? 1.08}
          fov={visualConfig?.fov ?? 70}
          isPortrait={isPortrait}
        />

        {/* Interior Atmospheric Fog — blends softly at far distances without obstructing the glass window vista */}
        {visualConfig?.fogEnabled !== false && (
          <fog
            attach="fog"
            args={[
              visualConfig?.fogColor ?? lighting.fogColor,
              visualConfig?.fogNear ?? lighting.fogNear,
              visualConfig?.fogFar ?? lighting.fogFar
            ]}
          />
        )}

        {/* Studio Image-Based Lighting (IBL) Environment Map (Physically realistic reflections) */}
        <GalleryEnvironment
          lightingMode={lightingMode}
          visualConfig={visualConfig}
          graphicsQuality={graphicsQuality}
        />

        {/* Global Balanced Ambient Fill (Luminous museum illumination) */}
        <ambientLight
          intensity={visualConfig?.ambientIntensity ?? lighting.ambientIntensity}
          color={visualConfig?.ambientColor ?? lighting.ambientColor}
        />

        {/* Natural Upward Floor Bounce from warm parquet hardwood */}
        <hemisphereLight
          args={[
            visualConfig?.hemiSkyColor ?? lighting.hemiSky,
            visualConfig?.hemiGroundColor ?? lighting.hemiGround,
            visualConfig?.hemiIntensity ?? lighting.hemiIntensity
          ]}
        />

        {/* 1. Main Architectural Sunlight (Full Gallery Coverage 46x50m) */}
        <directionalLight
          position={visualConfig ? [visualConfig.sunPosX, visualConfig.sunPosY, visualConfig.sunPosZ] : lighting.sunPos}
          intensity={visualConfig?.sunIntensity ?? lighting.sunIntensity}
          color={visualConfig?.sunColor ?? lighting.sunColor}
          castShadow={(visualConfig?.castShadow ?? true) && graphicsQuality !== 'bajo'}
          shadow-mapSize-width={graphicsQuality === 'alto' ? 2048 : 1024}
          shadow-mapSize-height={graphicsQuality === 'alto' ? 2048 : 1024}
          shadow-bias={visualConfig?.shadowBias ?? -0.0003}
          shadow-normalBias={0.03}
          shadow-camera-near={1.0}
          shadow-camera-far={45}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={28}
          shadow-camera-bottom={-28}
        />

        {/* 2. Dedicated Museum Skylight Key Light for Sala 3D & Sculpture Gallery (Z = -17) */}
        <directionalLight
          position={[3, 9.5, -13]}
          intensity={visualConfig?.skylight3DIntensity ?? (lighting.sunIntensity * 0.70)}
          color={lighting.threeDColor}
          castShadow={(visualConfig?.castShadow ?? true) && graphicsQuality !== 'bajo'}
          shadow-mapSize-width={graphicsQuality === 'alto' ? 1024 : 512}
          shadow-mapSize-height={graphicsQuality === 'alto' ? 1024 : 512}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
          shadow-camera-near={1.0}
          shadow-camera-far={22}
          shadow-camera-left={-14.5}
          shadow-camera-right={14.5}
          shadow-camera-top={11.0}
          shadow-camera-bottom={-11.0}
        />

        {/* Streamlined Architectural Room Fill Lights (Soft luminous fills per room) */}
        {/* 1. Gran Atrio Central */}
        <pointLight
          position={[0, 6.2, 0]}
          intensity={lighting.ceilingFillIntensity * 1.3 * (visualConfig?.fillIntensity ?? 1.0)}
          distance={20}
          decay={2}
          color={visualConfig?.atriumColor ?? lighting.atriumColor}
        />

        {/* 2. Galería de Diseño Gráfico & Foto (West) */}
        <pointLight
          position={[-14, 4.8, 0]}
          intensity={lighting.ceilingFillIntensity * 1.2 * (visualConfig?.fillIntensity ?? 1.0)}
          distance={18}
          decay={2}
          color={visualConfig?.graphicColor ?? lighting.graphicColor}
        />

        {/* 3. Pabellón UI/UX, Web & Plataformas (East) */}
        <pointLight
          position={[14, 4.8, 0]}
          intensity={lighting.ceilingFillIntensity * 1.2 * (visualConfig?.fillIntensity ?? 1.0)}
          distance={18}
          decay={2}
          color={visualConfig?.uiWebColor ?? lighting.uiWebColor}
        />

        {/* 4. Sala 3D, CGI & Escultura (North) */}
        <pointLight
          position={[0, 5.0, -17]}
          intensity={lighting.ceilingFillIntensity * 1.3 * (visualConfig?.fillIntensity ?? 1.0)}
          distance={20}
          decay={2}
          color={visualConfig?.threeDColor ?? lighting.threeDColor}
        />

        {/* Architecture with Themed Materials */}
        <GalleryArchitecture
          lightingMode={lightingMode}
          isMobile={isMobile}
          graphicsQuality={graphicsQuality}
          visualConfig={visualConfig}
        />

        {/* Artworks */}
        {artworks.map((art) => (
          <ArtworkFrame
            key={art.id}
            artwork={art}
            isNearest={nearestItem?.id === art.id}
            onSelect={onSelect}
          />
        ))}

        {/* 3D Sculptures */}
        {sculptures.map((sculp) => (
          <SculpturePedestal
            key={sculp.id}
            sculpture={sculp}
            isNearest={nearestItem?.id === sculp.id}
            onSelect={onSelect}
          />
        ))}

        {/* Player First Person Controller */}
        <PlayerController
          artworks={artworks}
          sculptures={sculptures}
          onNearestChange={onNearestChange}
          onInspect={onSelect}
          teleportTarget={teleportTarget}
          onTeleportComplete={onTeleportComplete}
          isInspecting={isInspecting}
          isTouring={isTouring}
          isDebugging={isDebugging}
        />

        {/* Guided Tour camera interpolation */}
        <CinematicTour
          isTouring={isTouring}
          currentIndex={tourIndex}
          items={tourItems}
          onItemReached={onTourItemReached}
        />

        {/* WebGL Shader Pipeline Pre-compilation (pre-warms all materials across 360 degrees to eliminate first-look stutter) */}
        <Preload all />
      </Canvas>
    </div>
  )
}
