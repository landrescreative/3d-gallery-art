import React, { useState, useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import * as THREE from 'three'
import { RotateCw, Box, Eye, Sparkles } from 'lucide-react'
import { Sculpture } from '../../types/gallery'
import { getOrCreateDynamicMatcap, SCULPTURE_MATCAP_PRESETS, MatcapStyle, applyHouseToonMaterials, applySkinCareCremaMaterials } from '../../utils/canvasTextures'

type RenderMode = 'realistic' | 'clay'

interface StudioOrbitInspectorProps {
  sculpture: Sculpture
}

// Inner Model Renderer inside the Studio Canvas
const StudioModel: React.FC<{
  sculpture: Sculpture
  renderMode: RenderMode
  activePresetId?: string
}> = ({
  sculpture,
  renderMode,
  activePresetId
}) => {
  // 1. Procedural or Custom Model Geometry
  if (sculpture.modelUrl) {
    return <CustomGLTFInspector sculpture={sculpture} renderMode={renderMode} activePresetId={activePresetId} />
  }

  // Procedural geometries based on sculpture type
  if (sculpture.type === 'torus_knot') {
    return (
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <torusKnotGeometry args={[0.72, 0.22, 128, 32, 2, 3]} />
        {renderMode === 'clay' ? (
          <meshStandardMaterial color="#cbd5e1" roughness={0.7} metalness={0.05} />
        ) : (
          <meshStandardMaterial
            color={sculpture.primaryColor}
            metalness={0.88}
            roughness={0.16}
          />
        )}
      </mesh>
    )
  }

  if (sculpture.type === 'crystal_poly') {
    return (
      <group position={[0, 0, 0]}>
        <mesh castShadow>
          <icosahedronGeometry args={[0.82, 0]} />
          {renderMode === 'clay' ? (
            <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
          ) : (
            <meshPhysicalMaterial
              color={sculpture.primaryColor}
              roughness={0.04}
              metalness={0.1}
              transmission={0.65}
              ior={1.54}
              thickness={0.8}
            />
          )}
        </mesh>
      </group>
    )
  }

  if (sculpture.type === 'golden_helix') {
    return (
      <group position={[0, 0, 0]}>
        {Array.from({ length: 30 }).map((_, i) => {
          const t = (i / 30) * Math.PI * 4
          const r = 0.55
          const y = (i / 30) * 1.6 - 0.8
          return (
            <mesh key={i} position={[Math.cos(t) * r, y, Math.sin(t) * r]} castShadow>
              <sphereGeometry args={[0.075, 16, 16]} />
              {renderMode === 'clay' ? (
                <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
              ) : (
                <meshStandardMaterial color={sculpture.primaryColor} metalness={0.92} roughness={0.18} />
              )}
            </mesh>
          )
        })}
      </group>
    )
  }

  // Fallback parametric sphere
  return (
    <mesh castShadow>
      <sphereGeometry args={[0.7, 32, 32]} />
      {renderMode === 'clay' ? (
        <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
      ) : (
        <meshStandardMaterial color={sculpture.primaryColor} metalness={0.8} roughness={0.2} />
      )}
    </mesh>
  )
}

// Custom GLTF Model Loader with Override Materials
const CustomGLTFInspector: React.FC<{
  sculpture: Sculpture
  renderMode: RenderMode
  activePresetId?: string
}> = ({
  sculpture,
  renderMode,
  activePresetId
}) => {
  const { scene } = useGLTF(
    sculpture.modelUrl!,
    false,
    true,
    (loader) => {
      loader.setMeshoptDecoder(MeshoptDecoder)
    }
  )

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = maxDim > 0 ? 1.6 / maxDim : 1.0
    clone.scale.set(scale, scale, scale)

    const scaledBox = new THREE.Box3().setFromObject(clone)
    const center = scaledBox.getCenter(new THREE.Vector3())
    clone.position.set(-center.x, -center.y, -center.z)

    const isInartiva = sculpture.id.includes('inartiva') || (sculpture.modelUrl?.includes('personaje-inartiva') ?? false)
    const isAforeAventura = (sculpture.id.startsWith('sculpture-aforeaventura') || (sculpture.modelUrl?.includes('personaje-') ?? false)) && !isInartiva
    const isHouseToon = sculpture.id === 'sculpture-maqueta-house-toon' || (sculpture.modelUrl?.includes('maqueta-house-toon') ?? false)
    const isSkinCareCrema = sculpture.id === 'sculpture-skincare-crema' || (sculpture.modelUrl?.includes('skincare-crema') ?? false)
    
    let dynamicMatcap: THREE.CanvasTexture | null = null
    if (isInartiva) {
      dynamicMatcap = getOrCreateDynamicMatcap(
        sculpture.primaryColor || '#030712',
        sculpture.accentColor || '#00e5ff',
        sculpture.matcapStyle || 'neon_dark'
      )
    } else if (isAforeAventura) {
      const preset = SCULPTURE_MATCAP_PRESETS.find((p) => p.id === activePresetId)
      const primary = preset?.primaryColor || sculpture.primaryColor || '#6d3f22'
      const accent = preset?.accentColor || sculpture.accentColor || '#d19870'
      const style = (preset?.style || sculpture.matcapStyle || 'clay') as MatcapStyle
      dynamicMatcap = getOrCreateDynamicMatcap(primary, accent, style)
    }

    if (isHouseToon && renderMode === 'realistic') {
      applyHouseToonMaterials(clone)
    } else if (isSkinCareCrema && renderMode === 'realistic') {
      applySkinCareCremaMaterials(clone)
    } else {
      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true

          // Hide inverted hull in clay and realistic only for inartiva toon model
          const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
          if (isInartiva && origMat?.name === 'Material.002') {
            mesh.visible = false
            return
          }

          if (renderMode === 'clay') {
            mesh.material = new THREE.MeshStandardMaterial({ color: '#cbd5e1', roughness: 0.65, metalness: 0.05 })
          } else if (isInartiva) {
            const meshName = mesh.name.toLowerCase()
            const matName = Array.isArray(mesh.material)
              ? mesh.material.map(m => m.name.toLowerCase()).join(' ')
              : (mesh.material?.name?.toLowerCase() || '')

            const isEyes = meshName.includes('.001') || meshName.includes('eye') || matName.includes('013')
            const isChibiBody = (meshName.includes('chibi') || meshName.includes('object_0') || meshName.includes('base')) && !isEyes

            if (isEyes) {
              mesh.material = new THREE.MeshBasicMaterial({
                color: '#ffffff',
                side: THREE.DoubleSide
              })
            } else if (isChibiBody && dynamicMatcap) {
              mesh.material = new THREE.MeshMatcapMaterial({
                matcap: dynamicMatcap,
                side: THREE.DoubleSide
              })
            } else {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                  mat.side = THREE.DoubleSide
                  mat.needsUpdate = true
                })
              } else if (mesh.material) {
                mesh.material.side = THREE.DoubleSide
                mesh.material.needsUpdate = true
              }
            }
          } else if (isAforeAventura && dynamicMatcap) {
            mesh.material = new THREE.MeshMatcapMaterial({
              matcap: dynamicMatcap,
              side: THREE.DoubleSide
            })
          }
        }
      })
    }

    return clone
  }, [scene, sculpture, renderMode, activePresetId])

  useEffect(() => {
    return () => {
      try {
        clonedScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose())
            } else if (mesh.material) {
              mesh.material.dispose()
            }
          }
        })
      } catch (e) {}
    }
  }, [clonedScene])

  return <primitive object={clonedScene} />
}

// Force immediate context destruction and VRAM deallocation on unmount to prevent mobile iOS WebGL context exhaustion crashes
const StudioCanvasDisposer: React.FC = () => {
  const { gl, scene } = useThree()
  useEffect(() => {
    return () => {
      try {
        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh
            mesh.geometry?.dispose()
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose())
            } else if (mesh.material) {
              mesh.material.dispose()
            }
          }
        })
        gl.dispose()
        gl.forceContextLoss()
      } catch (e) {}
    }
  }, [gl, scene])
  return null
}

export const StudioOrbitInspector: React.FC<StudioOrbitInspectorProps> = ({ sculpture }) => {
  const [renderMode, setRenderMode] = useState<RenderMode>('realistic')
  const [autoRotate, setAutoRotate] = useState(true)

  const isInartiva = sculpture.id.includes('inartiva') || (sculpture.modelUrl?.includes('personaje-inartiva') ?? false)
  const isAforeAventura = (sculpture.id.startsWith('sculpture-aforeaventura') || (sculpture.modelUrl?.includes('personaje-') ?? false)) && !isInartiva

  const isHouseToon = sculpture.id === 'sculpture-maqueta-house-toon' || (sculpture.modelUrl?.includes('maqueta-house-toon') ?? false)

  // Initial preset selected based on sculpture's assigned color / style
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    const matched = SCULPTURE_MATCAP_PRESETS.find(
      (p) => p.primaryColor === sculpture.primaryColor || p.style === sculpture.matcapStyle
    )
    return matched ? matched.id : 'jade-celadon'
  })

  const currentPreset = SCULPTURE_MATCAP_PRESETS.find((p) => p.id === selectedPresetId)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#09090b', overflow: 'hidden' }}>
      {/* 3D Orbit Canvas (dpr capped at 1.2 to prevent mobile WebKit VRAM overflow) */}
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.8, 2.5], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: 'low-power'
        }}
      >
        <StudioCanvasDisposer />
        <color attach="background" args={['#09090b']} />
        
        {/* Calibrated studio lighting rig with golden key sun and cyan skylight fill */}
        <ambientLight intensity={isHouseToon ? 0.65 : 0.5} color="#ffffff" />
        {/* Key Spotlight */}
        <directionalLight
          position={isHouseToon ? [3.5, 6.0, 4.0] : [3, 5, 4]}
          intensity={isHouseToon ? 2.2 : 1.3}
          castShadow
          color={isHouseToon ? '#fffbeb' : '#ffffff'}
        />
        {/* Fill Light */}
        <directionalLight
          position={[-4, 2, 2]}
          intensity={isHouseToon ? 0.95 : 0.5}
          color={isHouseToon ? '#bae6fd' : '#e2e8f0'}
        />
        {/* Rim / Backlight */}
        <directionalLight
          position={[0, 4, -4]}
          intensity={isHouseToon ? 1.4 : 0.8}
          color={isHouseToon ? '#fef08a' : '#f8fafc'}
        />

        {/* Orbit Controls with Damping */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={1.8}
          minDistance={1.0}
          maxDistance={5.5}
        />

        <Suspense fallback={null}>
          <StudioModel
            sculpture={sculpture}
            renderMode={renderMode}
            activePresetId={selectedPresetId}
          />
        </Suspense>

        {/* Floating Studio Turntable Plinth */}
        <group position={[0, -0.9, 0]}>
          <mesh receiveShadow>
            <cylinderGeometry args={[1.2, 1.28, 0.1, 48]} />
            <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1.05, 48]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </mesh>
          {/* Ground Soft Shadow Disc */}
          <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.6, 32]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.6} depthWrite={false} />
          </mesh>
        </group>
      </Canvas>

      {/* Top Floating Control Toolbar */}
      <div
        className="studio-orbit-toolbar"
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        {/* Mode Selector */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(12, 12, 14, 0.85)',
          backdropFilter: 'blur(10px)',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setRenderMode('realistic')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: renderMode === 'realistic' ? '#ffffff' : 'transparent',
              color: renderMode === 'realistic' ? '#09090b' : '#a1a1aa',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={12} />
            <span>{isAforeAventura ? 'MatCap Acabado' : 'PBR Realista'}</span>
          </button>

          <button
            onClick={() => setRenderMode('clay')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: renderMode === 'clay' ? '#ffffff' : 'transparent',
              color: renderMode === 'clay' ? '#09090b' : '#a1a1aa',
              transition: 'all 0.15s ease'
            }}
          >
            <Box size={12} />
            <span>Clay Blanco</span>
          </button>
        </div>

        {/* Auto-Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Alternar rotación automática"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: autoRotate ? 'rgba(255, 255, 255, 0.12)' : 'rgba(12, 12, 14, 0.85)',
            border: autoRotate ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            color: autoRotate ? '#ffffff' : '#a1a1aa',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            pointerEvents: 'auto',
            transition: 'all 0.15s ease'
          }}
        >
          <RotateCw size={12} style={{ transform: autoRotate ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s' }} />
          <span>{autoRotate ? 'Girando' : 'Pausado'}</span>
        </button>
      </div>

      {/* Material Variations Bar for AforeAventura Models (Bottom horizontal scroll pill carousel) */}
      {isAforeAventura && renderMode === 'realistic' ? (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          pointerEvents: 'auto',
          zIndex: 15,
          padding: '4px 6px',
          background: 'rgba(10, 12, 16, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#94a3b8',
            flexShrink: 0,
            padding: '2px 6px'
          }}>
            Acabado:
          </span>
          {SCULPTURE_MATCAP_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                title={preset.description}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 9px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#000000' : '#d4d4d8',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: preset.colorBadge,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    flexShrink: 0
                  }}
                />
                <span>{preset.label}</span>
              </button>
            )
          })}
        </div>
      ) : (
        /* Bottom Hint Banner */
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '5px 14px',
          background: 'rgba(12, 12, 14, 0.82)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          fontSize: '11px',
          color: '#a1a1aa',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          maxWidth: '90%',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          <Eye size={12} color="#ffffff" />
          <span>Arrastra para rotar 360° · Rueda o pellizca para zoom</span>
        </div>
      )}
    </div>
  )
}

