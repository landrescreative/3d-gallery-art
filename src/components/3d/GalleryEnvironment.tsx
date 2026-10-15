import React, { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { LightingMode, GraphicsQuality } from '../../types/gallery'
import { VisualConfig } from '../../types/visualSettings'

interface GalleryEnvironmentProps {
  lightingMode?: LightingMode
  visualConfig?: VisualConfig
  graphicsQuality?: GraphicsQuality
}

// Global cache for HDR textures to allow instantaneous switching between environments
const hdrTextureCache = new Map<string, THREE.DataTexture>()

/**
 * High-fidelity HDRI & Studio IBL Environment Map.
 * Provides realistic specular Fresnel reflections, glossy parquet floor reflections,
 * crystal glass refraction, and an outdoor scenic vista through panoramic glass walls.
 * Fully reactive to real-time debug controls: HDRI selection, rotation, intensity, blur, and exposure.
 */
export const GalleryEnvironment: React.FC<GalleryEnvironmentProps> = ({
  lightingMode = 'dramatic',
  visualConfig,
  graphicsQuality = 'medio'
}) => {
  const { gl, scene } = useThree()
  const activeTextureRef = useRef<THREE.DataTexture | null>(null)

  const isMobile = typeof window !== 'undefined' && (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  )

  const isNight = lightingMode === 'night' || lightingMode === 'dramatic'

  // Dynamic HDRI selection: night mode uses authentic starry sky (dikhololo_night_1k.hdr),
  // day mode uses scenic daylight park (park_scenic_2k / 4k)
  const defaultDayHdri = (isMobile || graphicsQuality === 'bajo')
    ? '/textures/park_scenic_2k.hdr'
    : '/textures/park_scenic_4k.hdr'

  let hdriPath: string
  if (isNight) {
    hdriPath = '/textures/dikhololo_night_1k.hdr'
  } else {
    hdriPath = visualConfig?.hdriPath && !visualConfig.hdriPath.includes('dikhololo')
      ? visualConfig.hdriPath
      : defaultDayHdri
  }

  // Guardrail for Mobile / Low-spec VRAM:
  if ((isMobile || graphicsQuality === 'bajo') && hdriPath.includes('_4k.hdr')) {
    hdriPath = '/textures/park_scenic_2k.hdr'
  }

  const defaultHdriIntensity = isNight ? 0.48 : 0.68
  const defaultBackgroundIntensity = isNight ? 1.35 : 1.0
  const defaultRotationY = isNight ? 190 : 153

  const hdriIntensity = visualConfig?.hdriIntensity ?? defaultHdriIntensity
  const hdriBackgroundIntensity = visualConfig?.hdriBackgroundIntensity ?? defaultBackgroundIntensity
  const hdriRotationY = visualConfig?.hdriRotationY ?? defaultRotationY
  const hdriBlur = visualConfig?.hdriBlur ?? 0.0
  const showBackground = visualConfig?.showBackground ?? true

  // 1. Load / switch HDR Texture based on hdriPath
  useEffect(() => {
    let cancelled = false

    const applyTexture = (texture: THREE.DataTexture) => {
      if (cancelled) return
      activeTextureRef.current = texture
      texture.mapping = THREE.EquirectangularReflectionMapping

      scene.environment = texture
      if (showBackground) {
        scene.background = texture
      } else {
        scene.background = null
      }

      // Initial orientation
      const rotRad = THREE.MathUtils.degToRad(hdriRotationY)
      scene.backgroundRotation = new THREE.Euler(0, rotRad, 0)
      scene.environmentRotation = new THREE.Euler(0, rotRad, 0)
    }

    if (hdrTextureCache.has(hdriPath)) {
      applyTexture(hdrTextureCache.get(hdriPath)!)
      return
    }

    // Fallback RoomEnvironment if no environment is set yet
    if (!scene.environment) {
      const pmrem = new THREE.PMREMGenerator(gl)
      pmrem.compileEquirectangularShader()
      const room = pmrem.fromScene(new RoomEnvironment(), 0.04)
      scene.environment = room.texture
      pmrem.dispose()
    }

    const loader = new RGBELoader()
    loader.load(
      hdriPath,
      (texture) => {
        if (cancelled) {
          texture.dispose()
          return
        }
        hdrTextureCache.set(hdriPath, texture)
        applyTexture(texture)
      },
      undefined,
      (err) => {
        console.warn(`Could not load HDRI from ${hdriPath}, maintaining fallback:`, err)
      }
    )

    return () => {
      cancelled = true
    }
  }, [hdriPath, gl, scene])

  // 2. Real-time Rotation updates (0° - 360°)
  useEffect(() => {
    const rotRad = THREE.MathUtils.degToRad(hdriRotationY)
    try {
      scene.backgroundRotation = new THREE.Euler(0, rotRad, 0)
      scene.environmentRotation = new THREE.Euler(0, rotRad, 0)
    } catch {
      // Ignore if older three version
    }
  }, [hdriRotationY, scene])

  // 3. Real-time Intensities & Blur
  useEffect(() => {
    try {
      scene.environmentIntensity = hdriIntensity
      scene.backgroundIntensity = hdriBackgroundIntensity
      scene.backgroundBlurriness = hdriBlur

      if (!showBackground) {
        scene.background = null
      } else if (activeTextureRef.current && scene.background !== activeTextureRef.current) {
        scene.background = activeTextureRef.current
      }
    } catch {
      // Ignore if unsupported
    }
  }, [hdriIntensity, hdriBackgroundIntensity, hdriBlur, showBackground, scene])

  return null
}
