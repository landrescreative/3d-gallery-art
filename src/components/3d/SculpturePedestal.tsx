import React, { useRef, useMemo, useState, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import * as THREE from 'three'
import { Sculpture } from '../../types/gallery'
import { createContactShadowTexture, getOrCreateDynamicMatcap, getOrCreateToonGradientMap, applyHouseToonMaterials, applySkinCareCremaMaterials, createMuseumPlaqueTexture } from '../../utils/canvasTextures'
import { zoomManager } from '../../utils/zoomState'

// Preload custom GLTF portfolio models
useGLTF.preload('/models/conejomodelo.glb')
useGLTF.preload('/models/personaje-1.glb')
useGLTF.preload('/models/personaje-2.glb')
useGLTF.preload('/models/personaje-3.glb')
useGLTF.preload('/models/personaje-4.glb')
useGLTF.preload('/models/personaje-inartiva-solo.glb')
useGLTF.preload('/models/maqueta-house-toon.glb')
useGLTF.preload('/models/skincare-crema.glb')

const CustomGLTFModel: React.FC<{ sculpture: Sculpture }> = ({ sculpture }) => {
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

    // Check if this model is the architectural toon diorama maqueta or the skincare crema
    const isHouseToon = sculpture.id === 'sculpture-maqueta-house-toon' || (sculpture.modelUrl?.includes('maqueta-house-toon') ?? false)
    const isSkinCareCrema = sculpture.id === 'sculpture-skincare-crema' || (sculpture.modelUrl?.includes('skincare-crema') ?? false)

    // Standardize display scale
    const maxDim = Math.max(size.x, size.y, size.z)
    const userScale = sculpture.modelScale ?? 1.0
    const targetSize = isHouseToon ? 1.48 : (isSkinCareCrema ? 1.05 : 1.15)
    const baseScale = maxDim > 0 ? (targetSize / maxDim) * userScale : userScale
    clone.scale.set(baseScale, baseScale, baseScale)

    // Measure after scaling to center precisely
    const scaledBox = new THREE.Box3().setFromObject(clone)
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3())

    const offset = sculpture.modelOffset ?? [0, 0, 0]
    clone.position.x = -scaledCenter.x + offset[0]
    clone.position.y = (isHouseToon || isSkinCareCrema) ? (-scaledBox.min.y + offset[1]) : (-scaledCenter.y + offset[1])
    clone.position.z = -scaledCenter.z + offset[2]

    if (isHouseToon) {
      // Apply authentic, vibrant cel-shaded materials and hide black inverted hull casing
      applyHouseToonMaterials(clone)
    } else if (isSkinCareCrema) {
      // Apply authentic semi-transparent cosmetic container & cream materials
      applySkinCareCremaMaterials(clone)
    } else {
      // Identify AforeAventura characters and Inartiva model
      const isAforeAventura = sculpture.id.startsWith('sculpture-aforeaventura') || (
        sculpture.modelUrl?.includes('personaje-1') ||
        sculpture.modelUrl?.includes('personaje-2') ||
        sculpture.modelUrl?.includes('personaje-3') ||
        sculpture.modelUrl?.includes('personaje-4')
      )
      const isInartiva = sculpture.id.includes('inartiva') || (sculpture.modelUrl?.includes('personaje-inartiva') ?? false)

      const matcapTexture = (isAforeAventura || isInartiva)
        ? getOrCreateDynamicMatcap(
            sculpture.primaryColor || (isInartiva ? '#030712' : '#6d3f22'),
            sculpture.accentColor || (isInartiva ? '#00e5ff' : '#d19870'),
            sculpture.matcapStyle || (isInartiva ? 'neon_dark' : 'default')
          )
        : null

      clone.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true

          if (isInartiva) {
            // Identify character body meshes vs eye meshes vs iPad meshes
            const meshName = mesh.name.toLowerCase()
            const matName = Array.isArray(mesh.material)
              ? mesh.material.map(m => m.name.toLowerCase()).join(' ')
              : (mesh.material?.name?.toLowerCase() || '')

            // Node: 'anime chibi Base.001', Mesh: 'Object_0.001', Material: 'Material.013'
            const isEyes = meshName.includes('.001') || meshName.includes('eye') || matName.includes('013')
            const isChibiBody = (meshName.includes('chibi') || meshName.includes('object_0') || meshName.includes('base')) && !isEyes

            if (isEyes) {
              // Pure crisp white anime eyes without matcap (semi-closed eye geometry)
              mesh.material = new THREE.MeshBasicMaterial({
                color: '#ffffff',
                side: THREE.DoubleSide
              })
            } else if (isChibiBody && matcapTexture) {
              // Apply stylized dark blue/obsidian toon shader with neon rim glow to body
              mesh.material = new THREE.MeshMatcapMaterial({
                matcap: matcapTexture,
                side: THREE.DoubleSide
              })
            } else {
              // Preserve iPad screen texture, metals, and frame materials
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
          } else if (isAforeAventura && matcapTexture) {
            mesh.material = new THREE.MeshMatcapMaterial({
              matcap: matcapTexture,
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
        }
      })
    }

    return clone
  }, [scene, sculpture])

  return <primitive object={clonedScene} />
}

interface SculpturePedestalProps {
  sculpture: Sculpture
  isNearest: boolean
  onSelect: (sculpture: Sculpture) => void
}

export const SculpturePedestal: React.FC<SculpturePedestalProps> = ({
  sculpture,
  isNearest,
  onSelect
}) => {
  const isMobile = typeof window !== 'undefined' && (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  )
  const [hovered, setHovered] = useState(false)
  const sculptureRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Pedestal dimensions (adaptive for standard pedestals vs architectural display tables)
  const isTable = sculpture.displayStyle === 'architectural_table' || sculpture.id === 'sculpture-maqueta-house-toon'
  const isSkinCareCrema = sculpture.id === 'sculpture-skincare-crema' || (sculpture.modelUrl?.includes('skincare-crema') ?? false)
  const pedestalWidth = isTable ? (sculpture.pedestalWidth ?? 2.4) : 1.0
  const pedestalDepth = isTable ? (sculpture.pedestalDepth ?? 1.8) : 1.0
  const pedestalHeight = isTable ? (sculpture.pedestalHeight ?? 0.82) : sculpture.pedestalHeight // 1.15

  // Procedural contact shadow for realistic floor grounding
  const contactShadowTexture = useMemo(() => createContactShadowTexture(), [])

  // Particle positions for kinetic particles
  const particleGeo = useMemo(() => {
    if (sculpture.type !== 'kinetic_particles') return null
    const count = 350
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const pColor1 = new THREE.Color(sculpture.primaryColor)
    const pColor2 = new THREE.Color(sculpture.accentColor)

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 12
      const radius = 0.3 + (i / count) * 0.6
      const y = (i / count) * 1.4 - 0.7
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * radius

      const mixed = pColor1.clone().lerp(pColor2, Math.random())
      colors[i * 3] = mixed.r
      colors[i * 3 + 1] = mixed.g
      colors[i * 3 + 2] = mixed.b
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [sculpture])

  // Helix curve points
  const helixSpheres = useMemo(() => {
    if (sculpture.type !== 'golden_helix') return []
    const points: [number, number, number][] = []
    const count = 28
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 4
      const r = 0.45
      const y = (i / count) * 1.5 - 0.75
      points.push([Math.cos(t) * r, y, Math.sin(t) * r])
    }
    return points
  }, [sculpture])

  // Plaque texture - Unified Minimalist Obsidian Museum Exhibition Plaque Texture (3.2:1 @ 1024x320)
  const plaqueTexture = useMemo(() => {
    return createMuseumPlaqueTexture({
      title: sculpture.title,
      medium: sculpture.medium,
      year: sculpture.year || '2024',
      artist: sculpture.artist || 'Landres Creative',
      category: 'SALA 3D & ESCULTURA · MODELADO CGI & ARTE DIGITAL',
      type: 'sculpture'
    })
  }, [sculpture])

  const isHighlighted = !sculpture.isDecorative && (hovered || isNearest)

  // Animation frame loop for dynamic kinetic sculptures
  useFrame((_, delta) => {
    if (sculptureRef.current) {
      sculptureRef.current.rotation.y += delta * (sculpture.rotationSpeed ?? 0.45)
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.6
      innerRef.current.rotation.z += delta * 0.5
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.3
    }
  })

  return (
    <group 
      position={sculpture.position}
      userData={sculpture.isDecorative ? undefined : { interactableId: sculpture.id }}
      onClick={(e) => {
        if (sculpture.isDecorative) return
        if ((e as any).button !== 0 || zoomManager.isZoomed) return
        e.stopPropagation()
        if (isNearest) {
          onSelect(sculpture)
        }
      }}
      onPointerOver={(e) => {
        if (sculpture.isDecorative) return
        e.stopPropagation()
        if (isNearest) {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        if (sculpture.isDecorative) return
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* 1. Dedicated pedestal presentation based on type */}
      {sculpture.type === 'crystal_poly' ? (
        <group position={[0, pedestalHeight, 0]}>
          {/* Sleek Cylindrical Dark Bronze Hub on Table */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.44, 0.08, 32]} />
            <meshStandardMaterial color="#2a221b" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.30, 0.36, 32]} />
            <meshStandardMaterial color="#6b5a47" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Angled Acrylic Plaque Standing on Table in front of hub */}
          <group position={[0, 0.04, 0.55]} rotation={[-0.35, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.54, 0.02, 0.185]} />
              <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.22} />
            </mesh>
            <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.512, 0.16]} />
              <meshBasicMaterial map={plaqueTexture} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ) : sculpture.type === 'torus_knot' ? (
        /* Torus Knot rests on the Atrium Grand Multi-Tier Travertine Pedestal as pure architectural sculpture */
        null
      ) : (
        <>
          {/* Ground Soft Ambient Occlusion Contact Shadow */}
          <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[pedestalWidth * 1.4, pedestalDepth * 1.4]} />
            <meshBasicMaterial
              map={contactShadowTexture}
              transparent
              opacity={0.65}
              depthWrite={false}
            />
          </mesh>

          {/* 1. Base skirt touching floor firmly at y = 0 in architectural aged bronze */}
          <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
            <boxGeometry args={[pedestalWidth + 0.12, 0.08, pedestalDepth + 0.12]} />
            <meshStandardMaterial color="#4a3e32" roughness={0.4} metalness={0.7} />
          </mesh>

          {/* 2. Main Monolithic Warm Honed Limestone Pedestal Shaft */}
          <mesh position={[0, pedestalHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[pedestalWidth, pedestalHeight, pedestalDepth]} />
            <meshStandardMaterial
              color="#ede7de"
              roughness={0.45}
              metalness={0.05}
            />
          </mesh>

          {/* 3. Architectural Bronze Inlay Accent Ring */}
          <mesh position={[0, pedestalHeight * 0.94, 0]}>
            <boxGeometry args={[pedestalWidth + 0.03, 0.03, pedestalDepth + 0.03]} />
            <meshStandardMaterial
              color={isHighlighted ? '#d4af37' : '#6b5a47'}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>

          {/* 4. Pedestal Top Cap */}
          <mesh position={[0, pedestalHeight + 0.02, 0]} receiveShadow>
            <boxGeometry args={[pedestalWidth + 0.05, 0.04, pedestalDepth + 0.05]} />
            <meshStandardMaterial color="#ded6c8" roughness={0.4} metalness={0.1} />
          </mesh>

          {/* 5. Beveled Clear Architectural Glass Plinth */}
          <mesh position={[0, pedestalHeight + 0.052, 0]}>
            <boxGeometry args={[pedestalWidth - 0.04, 0.03, pedestalDepth - 0.04]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.75}
              roughness={0.04}
              metalness={0.05}
              clearcoat={1.0}
              clearcoatRoughness={0.02}
              ior={1.54}
              reflectivity={0.9}
              transmission={0.75}
              thickness={0.06}
              depthWrite={false}
            />
          </mesh>

          {/* Titanium Corner Plinth Fixtures */}
          {[
            [-pedestalWidth / 2 + 0.04, -pedestalDepth / 2 + 0.04],
            [pedestalWidth / 2 - 0.04, -pedestalDepth / 2 + 0.04],
            [-pedestalWidth / 2 + 0.04, pedestalDepth / 2 - 0.04],
            [pedestalWidth / 2 - 0.04, pedestalDepth / 2 - 0.04]
          ].map(([cx, cz], i) => (
            <mesh key={i} position={[cx, pedestalHeight + 0.052, cz]}>
              <boxGeometry args={[0.035, 0.034, 0.035]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}

          {/* 6. Elevated Angled Museum Reading Plaque on South Face (Facing Entrance) */}
          <group position={[0, isTable ? (pedestalHeight + 0.04) : 1.14, pedestalDepth / 2 + 0.09]}>
            {/* Pedestal Rim Heavy-Duty Mounting Clamp */}
            <mesh position={[0, -0.045, -0.075]} castShadow>
              <boxGeometry args={[0.38, 0.032, 0.018]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Dual Architectural Cantilever Support Struts (Anchored strictly to back of casing) */}
            {[-0.16, 0.16].map((sx, idx) => (
              <mesh key={idx} position={[sx, -0.045, -0.04]} rotation={[0.08, 0, 0]} castShadow>
                <boxGeometry args={[0.026, 0.024, 0.065]} />
                <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.25} />
              </mesh>
            ))}

            {/* Angled Lectern Head (Tilted 31.5 deg up toward visitor eyes at Y=1.7) */}
            <group rotation={[-0.55, 0, 0]}>
              {/* Rear Mounting Plate strictly on the back of casing - never penetrates front card */}
              <mesh position={[0, -0.02, -0.010]} castShadow>
                <boxGeometry args={[0.38, 0.10, 0.006]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* Sleek Brushed Titanium Lectern Casing (Single solid shell - zero back z-fighting) */}
              <mesh castShadow receiveShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.80, 0.275, 0.016]} />
                <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.22} />
              </mesh>
              {/* Front Bevel Titanium Inset Trim */}
              <mesh position={[0, 0, 0.0085]}>
                <boxGeometry args={[0.785, 0.258, 0.002]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
              </mesh>
              {/* High-Resolution Obsidian Museum Info Card (3.2:1 @ 0.768 x 0.24) */}
              <mesh position={[0, 0, 0.010]}>
                <planeGeometry args={[0.768, 0.24]} />
                <meshBasicMaterial map={plaqueTexture} toneMapped={false} />
              </mesh>
            </group>
          </group>

          {/* 6.1 Elevated Angled Museum Reading Plaque on Aisle Face (Facing Central Walkway) */}
          {sculpture.position[0] !== 0 && (
            <group
              position={[
                sculpture.position[0] < 0 ? (pedestalWidth / 2 + 0.09) : (-pedestalWidth / 2 - 0.09),
                1.14,
                0
              ]}
              rotation={[0, sculpture.position[0] < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              {/* Pedestal Rim Heavy-Duty Mounting Clamp */}
              <mesh position={[0, -0.045, -0.075]} castShadow>
                <boxGeometry args={[0.38, 0.032, 0.018]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
              </mesh>

              {/* Dual Architectural Cantilever Support Struts (Anchored strictly to back of casing) */}
              {[-0.16, 0.16].map((sx, idx) => (
                <mesh key={idx} position={[sx, -0.045, -0.04]} rotation={[0.08, 0, 0]} castShadow>
                  <boxGeometry args={[0.026, 0.024, 0.065]} />
                  <meshStandardMaterial color="#334155" metalness={0.88} roughness={0.25} />
                </mesh>
              ))}

              {/* Angled Lectern Head (Single solid shell - zero back z-fighting) */}
              <group rotation={[-0.55, 0, 0]}>
                {/* Rear Mounting Plate strictly on the back of casing - never penetrates front card */}
                <mesh position={[0, -0.02, -0.010]} castShadow>
                  <boxGeometry args={[0.38, 0.10, 0.006]} />
                  <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
                </mesh>

                <mesh castShadow receiveShadow position={[0, 0, 0]}>
                  <boxGeometry args={[0.80, 0.275, 0.016]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.22} />
                </mesh>
                <mesh position={[0, 0, 0.0085]}>
                  <boxGeometry args={[0.785, 0.258, 0.002]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
                </mesh>
                {/* High-Resolution Obsidian Museum Info Card (3.2:1 @ 0.768 x 0.24) */}
                <mesh position={[0, 0, 0.010]}>
                  <planeGeometry args={[0.768, 0.24]} />
                  <meshBasicMaterial map={plaqueTexture} toneMapped={false} />
                </mesh>
              </group>
            </group>
          )}

          {/* Physical museum uplight optical ring on pedestal cap */}
          <group position={[0, pedestalHeight + 0.068, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[0.13, 0.20, 32]} />
              <meshBasicMaterial
                color={sculpture.primaryColor}
                transparent
                opacity={isHighlighted ? 0.95 : 0.4}
              />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <circleGeometry args={[0.12, 24]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isHighlighted ? 0.7 : 0.15}
              />
            </mesh>
          </group>
        </>
      )}

      {/* Dedicated studio key light for architectural maqueta diorama (matching Blender render sun angle) */}
      {isTable && (
        <group position={[0, pedestalHeight, 0]}>
          <directionalLight
            position={[-2.5, 4.0, 3.0]}
            intensity={2.4}
            color="#fffdf5"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0005}
          />
          <directionalLight
            position={[2.5, 3.5, -2.5]}
            intensity={1.2}
            color="#e0f2fe"
          />
        </group>
      )}

      {/* 6. Clickable 3D Sculpture Group resting directly atop pedestal / table */}
      <group position={[0, pedestalHeight + (isTable ? 0.08 : (isSkinCareCrema ? 0.065 : 0.7)), 0]}>
        
        {/* Removed dedicated hitbox; interaction is now handled by the root group */}

        <group ref={sculptureRef}>
          {/* Torus Knot */}
          {sculpture.type === 'torus_knot' && (
            <mesh castShadow receiveShadow>
              <torusKnotGeometry args={isMobile ? [0.42, 0.13, 64, 16, 2, 3] : [0.42, 0.13, 128, 32, 2, 3]} />
              {isMobile ? (
                <meshStandardMaterial
                  color={sculpture.primaryColor}
                  roughness={0.2}
                  metalness={0.8}
                />
              ) : (
                <meshPhysicalMaterial
                  color={sculpture.primaryColor}
                  roughness={0.1}
                  metalness={0.9}
                  clearcoat={1.0}
                  clearcoatRoughness={0.1}
                  reflectivity={1.0}
                />
              )}
            </mesh>
          )}

          {/* Crystal Polyhedron */}
          {sculpture.type === 'crystal_poly' && (
            <group>
              <mesh castShadow>
                <icosahedronGeometry args={[0.55, 0]} />
                {isMobile ? (
                  <meshStandardMaterial
                    color="#ffffff"
                    opacity={0.3}
                    transparent
                    roughness={0.1}
                    metalness={0.5}
                  />
                ) : (
                  <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.88}
                    opacity={1}
                    transparent
                    roughness={0.05}
                    ior={1.7}
                    thickness={1.2}
                  />
                )}
              </mesh>
              <mesh ref={innerRef}>
                <octahedronGeometry args={[0.26, 0]} />
                <meshStandardMaterial
                  color={sculpture.primaryColor}
                  emissive={sculpture.accentColor}
                  emissiveIntensity={1.8}
                  roughness={0.2}
                />
              </mesh>
            </group>
          )}

          {/* Golden Helix */}
          {sculpture.type === 'golden_helix' && (
            <group>
              {helixSpheres.map((pos, idx) => (
                <mesh key={idx} position={pos} castShadow>
                  <sphereGeometry args={[0.07, 16, 16]} />
                  <meshStandardMaterial
                    color={idx % 2 === 0 ? sculpture.primaryColor : '#ffffff'}
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
              ))}
              <mesh>
                <cylinderGeometry args={[0.02, 0.02, 1.6, 16]} />
                <meshStandardMaterial color="#44403c" metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          )}

          {/* Kinetic Particles */}
          {sculpture.type === 'kinetic_particles' && particleGeo && (
            <group>
              <points ref={particlesRef} geometry={particleGeo}>
                <pointsMaterial
                  size={0.035}
                  vertexColors
                  transparent
                  opacity={0.85}
                  blending={THREE.AdditiveBlending}
                />
              </points>
              <mesh>
                <sphereGeometry args={[0.18, 32, 32]} />
                <meshStandardMaterial
                  color={sculpture.primaryColor}
                  emissive={sculpture.accentColor}
                  emissiveIntensity={2.5}
                />
              </mesh>
            </group>
          )}

          {/* Custom GLTF Portfolio Model */}
          {sculpture.type === 'custom_model' && sculpture.modelUrl && (
            <Suspense fallback={null}>
              <CustomGLTFModel sculpture={sculpture} />
            </Suspense>
          )}
        </group>
      </group>
    </group>
  )
}
