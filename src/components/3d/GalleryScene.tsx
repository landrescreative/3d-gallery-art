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
          ambientIntensity: 0.46,
          ambientColor: '#ede8e1',
          hemiSky: '#fffdfa',
          hemiGround: '#d8cebe',
          hemiIntensity: 0.40,
          sunIntensity: 2.30,
          sunColor: '#fffdf5',
          sunPos: [3, 17, 2] as [number, number, number],
          atriumColor: '#fffdf7',
          graphicColor: '#fffef9',
          uiWebColor: '#fffdf5',
          threeDColor: '#fffdf7',
          fogColor: '#ebe6de',
          fogNear: 30,
          fogFar: 90,
          ceilingFillIntensity: 0.85
        }
      case 'warm':
        return {
          ambientIntensity: 0.38,
          ambientColor: '#f7eee3',
          hemiSky: '#fed7aa',
          hemiGround: '#bfa78a',
          hemiIntensity: 0.35,
          sunIntensity: 2.20,
          sunColor: '#fbbf24',
          sunPos: [6, 14, 5] as [number, number, number],
          atriumColor: '#fed7aa',
          graphicColor: '#fed7aa',
          uiWebColor: '#fef3c7',
          threeDColor: '#fef08a',
          fogColor: '#e8dcce',
          fogNear: 25,
          fogFar: 85,
          ceilingFillIntensity: 0.75
        }
      case 'studio':
        return {
          ambientIntensity: 0.42,
          ambientColor: '#ede8e1',
          hemiSky: '#ffffff',
          hemiGround: '#d5ccbd',
          hemiIntensity: 0.38,
          sunIntensity: 2.15,
          sunColor: '#ffffff',
          sunPos: [4, 16, 4] as [number, number, number],
          atriumColor: '#ede8e1',
          graphicColor: '#ede8e1',
          uiWebColor: '#ede9e2',
          threeDColor: '#eae6df',
          fogColor: '#ebe6de',
          fogNear: 28,
          fogFar: 88,
          ceilingFillIntensity: 0.80
        }
      case 'nordic':
        return {
          ambientIntensity: 0.38,
          ambientColor: '#e9ecef',
          hemiSky: '#f1f5f9',
          hemiGround: '#cbd5e1',
          hemiIntensity: 0.35,
          sunIntensity: 2.00,
          sunColor: '#e2e8f0',
          sunPos: [-5, 16, -3] as [number, number, number],
          atriumColor: '#f1f5f9',
          graphicColor: '#e9ecef',
          uiWebColor: '#f1f5f9',
          threeDColor: '#e2e8f0',
          fogColor: '#e2e8f0',
          fogNear: 26,
          fogFar: 82,
          ceilingFillIntensity: 0.75
        }
      case 'gallery':
        return {
          ambientIntensity: 0.46,
          ambientColor: '#ffffff',
          hemiSky: '#f8fafc',
          hemiGround: '#cbd5e1',
          hemiIntensity: 0.42,
          sunIntensity: 2.50,
          sunColor: '#ffffff',
          sunPos: [4, 16, 26] as [number, number, number],
          atriumColor: '#ffffff',
          graphicColor: '#ffffff',
          uiWebColor: '#ffffff',
          threeDColor: '#ffffff',
          fogColor: '#f1f5f9',
          fogNear: 45,
          fogFar: 140,
          ceilingFillIntensity: 0.85
        }
      case 'night':
      case 'dramatic':
      default:
        return {
          ambientIntensity: 0.05,
          ambientColor: '#090d16',
          hemiSky: '#1e293b',
          hemiGround: '#020617',
          hemiIntensity: 0.08,
          sunIntensity: 0.25,
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
          color={lighting.atriumColor}
        />

        {/* 2. Galería de Diseño Gráfico & Foto (West) */}
        <pointLight
          position={[-14, 4.8, 0]}
          intensity={lighting.ceilingFillIntensity * 1.2 * (visualConfig?.fillIntensity ?? 1.0)}
          distance={18}
          decay={2}
          color={lighting.graphicColor}
        />

        {/* 3. Pabellón UI/UX, Web & Plataformas (East) */}
        <pointLight
          position={[14, 4.8, 0]}
          intensity={lighting.ceilingFillIntensity * 1.2 * (visualConfig?.fillIntensity ?? 1.0)}
          distance={18}
          decay={2}
          color={lighting.uiWebColor}
        />

        {/* 4. Sala 3D, CGI & Escultura (North) */}
        <pointLight
          position={[0, 5.0, -17]}
          intensity={lighting.ceilingFillIntensity * 1.3 * (visualConfig?.fillIntensity ?? 1.0)}
          distance={20}
          decay={2}
          color={lighting.threeDColor}
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
