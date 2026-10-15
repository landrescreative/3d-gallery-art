import React, { useMemo } from 'react'
import * as THREE from 'three'
import { LightingMode, GraphicsQuality } from '../../types/gallery'
import { VisualConfig } from '../../types/visualSettings'
import {
  createParquetFloorTexture,
  createWallTexture,
  createTechWallTexture,
  createStudio3DWallTexture,
  createAtelierWallTexture,
  createSignageTexture,
  createContactShadowTexture,
  createRectContactShadowTexture,
  createLaptopKeyboardTexture
} from '../../utils/canvasTextures'

interface GalleryArchitectureProps {
  lightingMode?: LightingMode
  isMobile?: boolean
  graphicsQuality?: GraphicsQuality
  visualConfig?: VisualConfig
}

export const GalleryArchitecture: React.FC<GalleryArchitectureProps> = ({
  lightingMode = 'dramatic',
  isMobile = false,
  graphicsQuality = 'medio',
  visualConfig
}) => {
  // Adaptive glass material properties to prevent mobile WebGL crashes:
  // Transmission passes require full-screen render target blits every frame.
  // On mobile devices or graphics 'bajo', use lightweight physical alpha blending (transmission = 0).
  const usePhysicalTransmission = !isMobile && graphicsQuality !== 'bajo'
  const effectiveGlassTransmission = usePhysicalTransmission ? (visualConfig?.glassTransmission ?? 0.96) : 0
  const effectiveGlassOpacity = usePhysicalTransmission ? 1.0 : 0.35

  const parquetFloorTexture = useMemo(() => createParquetFloorTexture(), [])
  const wallTexture = useMemo(() => createWallTexture(), [])
  const techWallTexture = useMemo(() => createTechWallTexture(), [])
  const studio3DWallTexture = useMemo(() => createStudio3DWallTexture(), [])
  const atelierWallTexture = useMemo(() => createAtelierWallTexture(), [])
  const contactShadowTexture = useMemo(() => createContactShadowTexture(), [])
  const rectContactShadowTexture = useMemo(() => createRectContactShadowTexture(), [])
  const keyboardTexture = useMemo(() => createLaptopKeyboardTexture(), [])

  // Portal signage textures (generated procedurally on canvas, crisp & lightweight)
  const sign3DNorth = useMemo(() => createSignageTexture('SALA 3D & ESCULTURA', 'MODELADO STL · CGI · PERSONAJES'), [])
  const signAtriumFromNorth = useMemo(() => createSignageTexture('GRAN ATRIO CENTRAL', 'RECEPCIÓN & SALÓN PRINCIPAL'), [])

  const signGraphicWest = useMemo(() => createSignageTexture('DISEÑO GRÁFICO & FOTO', 'FOTOCOMPOSICIÓN · CARTELES · PUBLICIDAD'), [])
  const signAtriumFromGraphic = useMemo(() => createSignageTexture('GRAN ATRIO CENTRAL', 'RECEPCIÓN & SALÓN PRINCIPAL'), [])

  const signUiWebEast = useMemo(() => createSignageTexture('UI/UX, WEB & PLATAFORMAS', 'INTERFACES · DESARROLLO · APPS MÓVILES'), [])
  const signAtriumFromUiWeb = useMemo(() => createSignageTexture('GRAN ATRIO CENTRAL', 'RECEPCIÓN & SALÓN PRINCIPAL'), [])

  const skylightGableShape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-7.4, 0)
    shape.lineTo(0, 1.6)
    shape.lineTo(7.4, 0)
    shape.closePath()
    return shape
  }, [])

  const wallHeight = 5.8
  const wallThickness = 0.4

  return (
    <group>
      {/* 1. Main Scandinavian Blonde Oak Parquet Museum Floor with Satin Gloss Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -9]} receiveShadow>
        <planeGeometry args={[46, 38]} />
        <meshStandardMaterial
          map={parquetFloorTexture}
          roughness={visualConfig?.floorRoughness ?? 0.20}
          metalness={visualConfig?.floorMetalness ?? 0.05}
        />
      </mesh>

      {/* 2. Contemporary Minimalist Architectural Gallery Ceilings with Skylight Apertures */}
      {/* 2.1 West Gallery Ceiling (Graphic Design & Photography: X = -23 to -7, Z = -9 to +9) */}
      <mesh position={[-15, wallHeight + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 0.2, 18]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>

      {/* 2.2 East Gallery Ceiling (UI/UX Pavilion: X = 7 to 23, Z = -9 to +9) */}
      <mesh position={[15, wallHeight + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[16, 0.2, 18]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>

      {/* 2.3 Atrium North and South Spandrel Ceilings */}
      {/* North hallway ceiling framing (Z = -6 to -9, X = -7 to -3.5 and 3.5 to 7) */}
      <mesh position={[-5.25, wallHeight + 0.1, -7.5]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.2, 3.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      <mesh position={[5.25, wallHeight + 0.1, -7.5]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.2, 3.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* South Atrium continuous ceiling slab across full 14m width (Z = 6.0 to 8.0) */}
      <mesh position={[0, wallHeight + 0.1, 7.0]} castShadow receiveShadow>
        <boxGeometry args={[14.0, 0.2, 2.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>

      {/* 2.4 Sala 3D Ceiling Slabs (Framing the central 14.8m x 13.6m Monumental Glass Skylight Aperture) */}
      {/* West ceiling slab (X = -14 to -7.4, Z = -26 to -9) */}
      <mesh position={[-10.7, wallHeight + 0.1, -17.5]} castShadow receiveShadow>
        <boxGeometry args={[6.6, 0.2, 17.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* East ceiling slab (X = 7.4 to 14, Z = -26 to -9) */}
      <mesh position={[10.7, wallHeight + 0.1, -17.5]} castShadow receiveShadow>
        <boxGeometry args={[6.6, 0.2, 17.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* North ceiling slab (X = -7.4 to 7.4, Z = -26 to -23.8) */}
      <mesh position={[0, wallHeight + 0.1, -24.9]} castShadow receiveShadow>
        <boxGeometry args={[14.8, 0.2, 2.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {/* South ceiling slab (X = -7.4 to 7.4, Z = -10.2 to -9) */}
      <mesh position={[0, wallHeight + 0.1, -9.6]} castShadow receiveShadow>
        <boxGeometry args={[14.8, 0.2, 1.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>


      {/* 2.1 Themed Wing Overhead Ceiling Architecture */}
      {/* UI/UX & Web Pavilion: Natural Warm Oak Acoustic Ceiling Baffles */}
      <group position={[14, wallHeight - 0.15, -0.5]}>
        {[-6, -3, 0, 3, 6].map((zOffset, idx) => (
          <mesh key={idx} position={[0, 0, zOffset]} castShadow receiveShadow>
            <boxGeometry args={[13.4, 0.14, 0.18]} />
            <meshStandardMaterial color="#c5b095" roughness={0.6} metalness={0.05} />
          </mesh>
        ))}
      </group>

      {/* Graphic Design Gallery: Architectural Museum Track Spotlights in Satin Champagne Titanium */}
      <group position={[-14, wallHeight - 0.12, -0.5]}>
        <mesh position={[0, 0, -6.8]}>
          <boxGeometry args={[11.5, 0.06, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, 6.8]}>
          <boxGeometry args={[11.5, 0.06, 0.06]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[-5.8, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 13.6]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.25} />
        </mesh>
        {[-4, -2, 0, 2, 4].map((xOffset, idx) => (
          <group key={idx}>
            <mesh position={[xOffset, -0.1, -6.8]} rotation={[0.4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.16, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[xOffset, -0.1, 6.8]} rotation={[-0.4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.16, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Sala 3D, CGI & Escultura: Modern Architectural Studio Truss in Satin Aluminum */}
      <group position={[0, wallHeight - 0.2, -16]}>
        <mesh position={[-5.5, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 18.5]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[5.5, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 18.5]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
        {[-7, -3.5, 0, 3.5, 7].map((zOff, idx) => (
          <group key={idx} position={[0, 0, zOff]}>
            <mesh>
              <boxGeometry args={[11.0, 0.1, 0.1]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.25} />
            </mesh>
            <mesh position={[-5.5, -0.16, 0]} rotation={[0.3, 0, -0.4]} castShadow>
              <cylinderGeometry args={[0.1, 0.08, 0.22, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
            </mesh>
            <mesh position={[5.5, -0.16, 0]} rotation={[0.3, 0, 0.4]} castShadow>
              <cylinderGeometry args={[0.1, 0.08, 0.22, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.25} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2.0 Grand Central Atrium Classical Vaulted Dome (Apex at Y = 11.4m) */}
      <group position={[0, wallHeight - 0.05, 1]} name="grand-atrium-dome">
        {/* Hemispherical Coffered Architectural Dome Shell (Contemporary Gallery White Plaster) */}
        <mesh>
          <sphereGeometry args={[7.15, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2.25]} />
          <meshStandardMaterial
            color="#f8fafc"
            roughness={0.65}
            metalness={0.02}
            side={THREE.BackSide}
          />
        </mesh>
        {/* Exterior Weathering Shell */}
        <mesh>
          <sphereGeometry args={[7.28, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2.25]} />
          <meshStandardMaterial
            color="#e2e8f0"
            roughness={0.8}
            metalness={0.05}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* 8 Structural Vaulted Arch Ribs in Contemporary Brushed Titanium Aluminum */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <group key={i} rotation={[0, angle, 0]}>
              <mesh position={[0, 0, 0]}>
                <torusGeometry args={[7.12, 0.075, 12, 32, Math.PI / 2.25]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
              </mesh>
            </group>
          )
        })}

        {/* Dome Drum Base Ring Molding */}
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.95, 7.35, 48]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.35} metalness={0.2} />
        </mesh>
        {/* Drum Base Soft Reveal Strip */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.05, 7.15, 48]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>

        {/* Circular Oculus at Dome Apex (Natural Museum Sky Laylight) */}
        <group position={[0, 5.55, 0]}>
          {/* Double-paned Oculus Glass */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.1, 48]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={usePhysicalTransmission ? 0.96 : 0}
              opacity={usePhysicalTransmission ? 0.35 : 0.25}
              transparent
              roughness={0.02}
              ior={1.52}
              reflectivity={0.9}
              clearcoat={usePhysicalTransmission ? 1.0 : 0.2}
              depthWrite={false}
            />
          </mesh>
          {/* Oculus Architectural Framing Ring in Brushed Titanium */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.14, 0.12, 16, 48]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.18, 0.04, 16, 48]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Radiant Oculus Cross-Mullion Spokes (8 spokes) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} rotation={[0, (i / 8) * Math.PI, 0]}>
              <boxGeometry args={[4.2, 0.06, 0.05]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
            </mesh>
          ))}
          {/* Soft Natural Daylight Oculus Halo Ring */}
          <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.98, 2.05, 48]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
          </mesh>
        </group>
      </group>

      {/* Monumental Transparent Architectural Glass Skylight Roof over Sala 3D & Sculpture Gallery */}
      <group position={[0, wallHeight, -17]} name="sala-3d-monumental-skylight">
        {/* White Cast Stone Base Perimeter Curb surrounding the aperture */}
        <mesh position={[0, 0.15, 6.8]} castShadow receiveShadow>
          <boxGeometry args={[15.2, 0.3, 0.35]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.15, -6.8]} castShadow receiveShadow>
          <boxGeometry args={[15.2, 0.3, 0.35]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[-7.4, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.3, 13.6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[7.4, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.3, 13.6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>

        {/* Central Ridge Cap Beam in Contemporary White Aluminum */}
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[0.14, 0.22, 13.6]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.15} roughness={0.3} />
        </mesh>

        {/* West Pitched Low-Iron Architectural Glass Roof Panels */}
        {[-5.5, -3.3, -1.1, 1.1, 3.3, 5.5].map((zBay, idx) => (
          <mesh
            key={`w-glass-${idx}`}
            position={[-3.7, 0.8, zBay]}
            rotation={[0, 0, Math.atan2(1.6, 7.4)]}
          >
            <boxGeometry args={[7.57, 0.024, 2.14]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={effectiveGlassTransmission}
              roughness={visualConfig?.glassRoughness ?? 0.02}
              ior={1.52}
              reflectivity={0.92}
              clearcoat={usePhysicalTransmission ? 1.0 : 0.2}
              clearcoatRoughness={0.01}
              transparent
              opacity={effectiveGlassOpacity}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* West Architectural White Rafters / Mullions */}
        {[-6.6, -4.4, -2.2, 0, 2.2, 4.4, 6.6].map((zRafter, rIdx) => (
          <mesh
            key={`w-rafter-${rIdx}`}
            position={[-3.7, 0.8, zRafter]}
            rotation={[0, 0, Math.atan2(1.6, 7.4)]}
            castShadow
          >
            <boxGeometry args={[7.57, 0.08, 0.06]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.35} />
          </mesh>
        ))}

        {/* East Pitched Low-Iron Architectural Glass Roof Panels */}
        {[-5.5, -3.3, -1.1, 1.1, 3.3, 5.5].map((zBay, idx) => (
          <mesh
            key={`e-glass-${idx}`}
            position={[3.7, 0.8, zBay]}
            rotation={[0, 0, -Math.atan2(1.6, 7.4)]}
          >
            <boxGeometry args={[7.57, 0.024, 2.14]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={effectiveGlassTransmission}
              roughness={visualConfig?.glassRoughness ?? 0.02}
              ior={1.52}
              reflectivity={0.92}
              clearcoat={usePhysicalTransmission ? 1.0 : 0.2}
              clearcoatRoughness={0.01}
              transparent
              opacity={effectiveGlassOpacity}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* East Architectural White Rafters / Mullions */}
        {[-6.6, -4.4, -2.2, 0, 2.2, 4.4, 6.6].map((zRafter, rIdx) => (
          <mesh
            key={`e-rafter-${rIdx}`}
            position={[3.7, 0.8, zRafter]}
            rotation={[0, 0, -Math.atan2(1.6, 7.4)]}
            castShadow
          >
            <boxGeometry args={[7.57, 0.08, 0.06]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.1} roughness={0.35} />
          </mesh>
        ))}

        {/* North and South Transparent Triangular Glazing Gable Ends */}
        <mesh position={[0, 0, 6.8]}>
          <shapeGeometry args={[skylightGableShape]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={effectiveGlassTransmission}
            roughness={visualConfig?.glassRoughness ?? 0.02}
            ior={1.52}
            transparent
            opacity={effectiveGlassOpacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, -6.8]}>
          <shapeGeometry args={[skylightGableShape]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={effectiveGlassTransmission}
            roughness={visualConfig?.glassRoughness ?? 0.02}
            ior={1.52}
            transparent
            opacity={effectiveGlassOpacity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Minimalist Tension Tie Trusses Spanning Across Ceiling Line */}
        {[-4.4, -2.2, 0, 2.2, 4.4].map((zTruss, tIdx) => (
          <group key={`truss-${tIdx}`} position={[0, -0.05, zTruss]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[14.8, 0.06, 0.06]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.15} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[-3.7, 0.25, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[3.7, 0.25, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. Outer Museum Perimeter Walls (Minimalist Contemporary Gallery White) */}
      {/* 4.2 Atrium South Museum Viewing Benches */}
      <group position={[-4.8, 0, 7.4]}>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 1.1]} />
          <meshBasicMaterial map={rectContactShadowTexture} transparent opacity={0.65} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.12, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[-0.9, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.9, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.54, 0]} receiveShadow>
          <boxGeometry args={[2.3, 0.08, 0.75]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>
      <group position={[4.8, 0, 7.4]}>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 1.1]} />
          <meshBasicMaterial map={rectContactShadowTexture} transparent opacity={0.65} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.12, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[-0.9, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.9, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.54, 0]} receiveShadow>
          <boxGeometry args={[2.3, 0.08, 0.75]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>

      {/* Gran Atrio South Wall (Solid White Cast Stone Perimeter Wall at Z = 8) */}
      <mesh position={[0, wallHeight / 2, 8]} receiveShadow castShadow>
        <boxGeometry args={[14, wallHeight, wallThickness]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* South Wall: Graphic Design Gallery (Minimalist White Plaster) */}
      <mesh position={[-14, wallHeight / 2, 8]} receiveShadow castShadow>
        <boxGeometry args={[14, wallHeight, wallThickness]} />
        <meshStandardMaterial map={atelierWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>
      {/* South Wall: UI/UX & Web Pavilion (Minimalist Light Mist Plaster) */}
      <mesh position={[14, wallHeight / 2, 8]} receiveShadow castShadow>
        <boxGeometry args={[14, wallHeight, wallThickness]} />
        <meshStandardMaterial map={techWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* ========================================================================= */}
      {/* MONUMENTAL FLOOR-TO-CEILING GLASS CURTAIN WALL & OUTDOOR SCENIC GARDEN    */}
      {/* Installed at the North Wall of Sala 3D & Escultura (Z = -26, vista to -48) */}
      {/* ========================================================================= */}
      {/* North Wall Corner Pilasters framing the 24m panoramic window */}
      <mesh position={[-13, wallHeight / 2, -26]} receiveShadow castShadow>
        <boxGeometry args={[2.0, wallHeight, wallThickness]} />
        <meshStandardMaterial map={studio3DWallTexture} roughness={0.75} color="#ffffff" />
      </mesh>
      <mesh position={[13, wallHeight / 2, -26]} receiveShadow castShadow>
        <boxGeometry args={[2.0, wallHeight, wallThickness]} />
        <meshStandardMaterial map={studio3DWallTexture} roughness={0.75} color="#ffffff" />
      </mesh>

      {/* North Panoramic Glass Curtain Wall at Z = -26 (24m wide × 5.8m high) */}
      <group position={[0, 0, -26]} name="panoramic-glass-curtain-wall">
        {/* Top Header Transom Beam */}
        <mesh position={[0, wallHeight - 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[24, 0.16, 0.28]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Bottom Floor Sill Curb in Brushed Aluminum */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[24, 0.16, 0.32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Intermediate Horizontal Mullion Rails at Y = 1.9m and Y = 3.8m */}
        {[1.9, 3.8].map((yRail, rIdx) => (
          <mesh key={rIdx} position={[0, yRail, 0]} castShadow receiveShadow>
            <boxGeometry args={[24, 0.06, 0.18]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}

        {/* 9 Vertical Architectural Structural Steel Mullions (spaced every 3.0m across 24m) */}
        {[-12, -9, -6, -3, 0, 3, 6, 9, 12].map((xMullion, mIdx) => (
          <mesh key={mIdx} position={[xMullion, wallHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, wallHeight, 0.24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}

        {/* 8 Monumental Floor-to-Ceiling Low-Iron Architectural Glass Panes */}
        {[-10.5, -7.5, -4.5, -1.5, 1.5, 4.5, 7.5, 10.5].map((xBay, bIdx) => (
          <mesh key={bIdx} position={[xBay, wallHeight / 2, 0]}>
            <planeGeometry args={[2.92, wallHeight - 0.16]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={effectiveGlassTransmission}
              roughness={visualConfig?.glassRoughness ?? 0.03}
              ior={1.52}
              reflectivity={0.92}
              clearcoat={usePhysicalTransmission ? 1.0 : 0.2}
              clearcoatRoughness={0.02}
              transparent
              opacity={effectiveGlassOpacity}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Subtle Architectural Low-E Horizon Glaze Reveal */}
        <mesh position={[0, 0.22, 0.01]}>
          <planeGeometry args={[23.8, 0.14]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Exterior Landscaped Garden Terrace & Reflecting Infinity Pool (Z = -26 to -48) */}
      <group position={[0, 0, 0]} name="exterior-scenic-courtyard">
        {/* Exterior Terrace Granite Paving Deck */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -37]} receiveShadow>
          <planeGeometry args={[36, 22]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.05} />
        </mesh>

        {/* Exterior Minimalist Architectural Terrace Border Curb */}
        <mesh position={[0, 0.06, -26.3]} receiveShadow>
          <boxGeometry args={[24.4, 0.12, 0.3]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Reflecting Infinity Water Pool Basin (12m wide × 8m deep, center Z = -34) */}
        <group position={[0, 0, -34]}>
          {/* Pool Coping Border (Brushed Architectural Aluminum) */}
          <mesh position={[0, 0.04, 0]} receiveShadow>
            <boxGeometry args={[12.6, 0.1, 8.6]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Reflecting Water Plane */}
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[12.0, 8.0]} />
            <meshStandardMaterial
              color="#090d16"
              roughness={0.04}
              metalness={0.94}
            />
          </mesh>
        </group>

        {/* Modern Minimalist Architectural Planters with Cypress Foliage Columns */}
        {[-9.2, 9.2].map((xPlanter, pIdx) => (
          <group key={pIdx} position={[xPlanter, 0, -34]}>
            {/* White Architectural Cast Stone Planter Box */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.6, 0.9, 10.0]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
            </mesh>
            {/* Planter Soil Bed */}
            <mesh position={[0, 0.91, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.4, 9.8]} />
              <meshStandardMaterial color="#1c1917" roughness={0.9} />
            </mesh>
            {/* Manicured Architectural Cypress Foliage Columns */}
            {[-3.6, -1.8, 0, 1.8, 3.6].map((zOffset, tIdx) => (
              <group key={tIdx} position={[0, 0.9, zOffset]}>
                {/* Trunk */}
                <mesh position={[0, 0.4, 0]} castShadow>
                  <cylinderGeometry args={[0.06, 0.08, 0.8, 8]} />
                  <meshStandardMaterial color="#3d2817" roughness={0.8} />
                </mesh>
                {/* Slender Conical Cypress Canopy */}
                <mesh position={[0, 1.8, 0]} castShadow>
                  <coneGeometry args={[0.55, 2.4, 12]} />
                  <meshStandardMaterial color="#2d5a3f" roughness={0.7} />
                </mesh>
                <mesh position={[0, 2.6, 0]} castShadow>
                  <coneGeometry args={[0.42, 1.8, 12]} />
                  <meshStandardMaterial color="#366847" roughness={0.65} />
                </mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Courtyard Lateral Flank Walls (Enclosing the scenic garden for architectural purity) */}
        <mesh position={[-18, 2.5, -37]} receiveShadow castShadow>
          <boxGeometry args={[0.24, 5.0, 22.0]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
        </mesh>
        <mesh position={[18, 2.5, -37]} receiveShadow castShadow>
          <boxGeometry args={[0.24, 5.0, 22.0]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
        </mesh>

        {/* Minimalist Frameless Glass Terrace Balustrade at Z = -47.8 */}
        <group position={[0, 0, -47.8]}>
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[35.6, 1.2, 0.04]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={usePhysicalTransmission ? (visualConfig?.glassTransmission ?? 0.94) : 0}
              roughness={visualConfig?.glassRoughness ?? 0.04}
              ior={1.5}
              transparent
              opacity={usePhysicalTransmission ? 0.4 : 0.25}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 1.22, 0]}>
            <boxGeometry args={[35.8, 0.04, 0.08]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* West Outer Wall: Graphic Design Gallery (Minimalist White Plaster) */}
      <mesh position={[-21, wallHeight / 2, -0.5]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, 17]} />
        <meshStandardMaterial map={atelierWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* East Outer Wall: UI/UX & Web Pavilion (Minimalist Light Mist Plaster) */}
      <mesh position={[21, wallHeight / 2, -0.5]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, 17]} />
        <meshStandardMaterial map={techWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* 4. Internal Dividers & Grand Arched Portals (Minimalist Contemporary Gallery Finish) */}

      {/* A. North Divider (Separates Atrium from 3D Pavilion hallway at Z = -6) */}
      {/* West portion (X = -7 to -3.5, width 3.5, center -5.25) */}
      <mesh position={[-5.25, wallHeight / 2, -6]} receiveShadow castShadow>
        <boxGeometry args={[3.5, wallHeight, wallThickness]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>
      {/* East portion (X = 3.5 to 7.0, width 3.5, center 5.25) */}
      <mesh position={[5.25, wallHeight / 2, -6]} receiveShadow castShadow>
        <boxGeometry args={[3.5, wallHeight, wallThickness]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* Grand Arch Lintel Beam across central opening (opening is 7m wide: X = -3.5 to 3.5) */}
      <group position={[0, 0, -6]}>
        <mesh position={[0, wallHeight - 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.4, 1.0, wallThickness + 0.16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Brushed titanium accent reveal under the arch */}
        <mesh position={[0, wallHeight - 1.01, 0]}>
          <boxGeometry args={[7.2, 0.04, wallThickness + 0.18]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Arch Jamb Pilaster Posts in White Cast Stone */}
        {[-3.5, 3.5].map((xPos, jIdx) => (
          <group key={jIdx} position={[xPos, (wallHeight - 1.0) / 2, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.24, wallHeight - 1.0, wallThickness + 0.16]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
            </mesh>
            <mesh position={[jIdx === 0 ? 0.13 : -0.13, 0, 0]}>
              <boxGeometry args={[0.03, wallHeight - 1.0, wallThickness + 0.18]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
        ))}
        {/* 3D Signage Lightbox: Facing South into Atrium */}
        <group position={[0, 4.4, 0.22]}>
          <mesh castShadow>
            <boxGeometry args={[4.90, 1.28, 0.04]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[4.80, 1.20]} />
            <meshBasicMaterial map={sign3DNorth} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* Hallway walls connecting Atrium (Z = -6) to Sala 3D (Z = -9) */}
      {/* East hallway wall at X = 3.5 */}
      <mesh position={[3.5, wallHeight / 2, -7.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 3.0]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>
      {/* West hallway wall at X = -3.5 */}
      <mesh position={[-3.5, wallHeight / 2, -7.5]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 3.0]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* Grand Classical Barrel Vault Overhead (Bóveda de Cañón) connecting Atrium to Sala 3D */}
      <group position={[0, wallHeight - 0.95, -7.5]}>
        {/* Semicircular Coffered Vault Shell in Contemporary Gallery White Plaster */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[3.5, 3.5, 3.0, 32, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} metalness={0.02} side={THREE.BackSide} />
        </mesh>
        {/* Exterior Shell Cap */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[3.6, 3.6, 3.0, 32, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} metalness={0.05} side={THREE.FrontSide} />
        </mesh>
        {/* Structural Transverse Titanium Ribs along the Vault */}
        {[-1.35, 0, 1.35].map((zRib, idx) => (
          <mesh key={idx} position={[0, 0, zRib]} rotation={[0, 0, 0]}>
            <torusGeometry args={[3.48, 0.055, 12, 32, Math.PI]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* Arch portal at Sala 3D entrance (Z = -9) */}
      <group position={[0, 0, -9]}>
        <mesh position={[0, wallHeight - 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.4, 1.0, 0.42]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
        </mesh>
        <mesh position={[0, wallHeight - 1.01, 0]}>
          <boxGeometry args={[7.2, 0.04, 0.44]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* 3D Signage Lightbox: Facing North into Sala 3D */}
        <group position={[0, 4.4, -0.22]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow>
            <boxGeometry args={[4.90, 1.28, 0.04]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[4.80, 1.20]} />
            <meshBasicMaterial map={signAtriumFromNorth} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* B. West Divider along X = -7 (Dual-Layer: Atrium White Cube vs Graphic White Cube) */}
      {/* South section: Z = 2.5 to 8 (length 5.5, center 5.25) */}
      {/* Facing Atrium (East face) */}
      <mesh position={[-7 + 0.1, wallHeight / 2, 5.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 5.5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>
      {/* Facing Graphic Gallery (West face) */}
      <mesh position={[-7 - 0.1, wallHeight / 2, 5.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 5.5]} />
        <meshStandardMaterial map={atelierWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* North section: Z = -6 to -2.5 (length 3.5, center -4.25) */}
      {/* Facing Atrium (East face) */}
      <mesh position={[-7 + 0.1, wallHeight / 2, -4.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 3.5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>
      {/* Facing Graphic Gallery (West face) */}
      <mesh position={[-7 - 0.1, wallHeight / 2, -4.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 3.5]} />
        <meshStandardMaterial map={atelierWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* Structural core wall for Graphic Gallery from Z = -6 to -9 */}
      <mesh position={[-7, wallHeight / 2, -7.5]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, 3.0]} />
        <meshStandardMaterial map={atelierWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* West Arch Portal Surround in Contemporary White Cast Stone & Titanium */}
      <group position={[-7, 0, 0]}>
        {/* Lintel Beam */}
        <mesh position={[0, wallHeight - 0.5, 0.0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness + 0.16, 1.0, 5.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Titanium under-arch reveal strip */}
        <mesh position={[0, wallHeight - 1.01, 0.0]}>
          <boxGeometry args={[wallThickness + 0.18, 0.04, 5.0]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Left and Right Arch Jamb Columns */}
        {[-2.5, 2.5].map((zPos, jIdx) => (
          <group key={jIdx} position={[0, (wallHeight - 1.0) / 2, zPos]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[wallThickness + 0.16, wallHeight - 1.0, 0.24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
            </mesh>
            <mesh position={[0, 0, jIdx === 0 ? 0.13 : -0.13]}>
              <boxGeometry args={[wallThickness + 0.18, wallHeight - 1.0, 0.03]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* 3D Lightbox Signage: Facing East (into Atrium) */}
        <group position={[0.22, 4.4, 0.0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.92, 1.04, 0.04]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[3.84, 0.96]} />
            <meshBasicMaterial map={signGraphicWest} toneMapped={false} />
          </mesh>
        </group>

        {/* 3D Lightbox Signage: Facing West (into Graphic Gallery) */}
        <group position={[-0.22, 4.4, 0.0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.92, 1.04, 0.04]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[3.84, 0.96]} />
            <meshBasicMaterial map={signAtriumFromGraphic} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* C. East Divider along X = 7 (Dual-Layer: Atrium White Cube vs UI/UX Light Mist) */}
      {/* South section: Z = 2.5 to 8 (length 5.5, center 5.25) */}
      {/* Facing Atrium (West face) */}
      <mesh position={[7 - 0.1, wallHeight / 2, 5.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 5.5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>
      {/* Facing UI/UX Pavilion (East face) */}
      <mesh position={[7 + 0.1, wallHeight / 2, 5.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 5.5]} />
        <meshStandardMaterial map={techWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* North section: Z = -6 to -2.5 (length 3.5, center -4.25) */}
      {/* Facing Atrium (West face) */}
      <mesh position={[7 - 0.1, wallHeight / 2, -4.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 3.5]} />
        <meshStandardMaterial map={wallTexture} roughness={0.78} color="#ffffff" />
      </mesh>
      {/* Facing UI/UX Pavilion (East face) */}
      <mesh position={[7 + 0.1, wallHeight / 2, -4.25]} receiveShadow castShadow>
        <boxGeometry args={[0.2, wallHeight, 3.5]} />
        <meshStandardMaterial map={techWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* Structural core wall for UI/UX Pavilion from Z = -6 to -9 */}
      <mesh position={[7, wallHeight / 2, -7.5]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, 3.0]} />
        <meshStandardMaterial map={techWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* East Arch Portal Surround in Contemporary White Cast Stone & Titanium */}
      <group position={[7, 0, 0]}>
        {/* Lintel Beam */}
        <mesh position={[0, wallHeight - 0.5, 0.0]} castShadow receiveShadow>
          <boxGeometry args={[wallThickness + 0.16, 1.0, 5.2]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Titanium under-arch reveal strip */}
        <mesh position={[0, wallHeight - 1.01, 0.0]}>
          <boxGeometry args={[wallThickness + 0.18, 0.04, 5.0]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Left and Right Arch Jamb Columns */}
        {[-2.5, 2.5].map((zPos, jIdx) => (
          <group key={jIdx} position={[0, (wallHeight - 1.0) / 2, zPos]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[wallThickness + 0.16, wallHeight - 1.0, 0.24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
            </mesh>
            <mesh position={[0, 0, jIdx === 0 ? 0.13 : -0.13]}>
              <boxGeometry args={[wallThickness + 0.18, wallHeight - 1.0, 0.03]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* 3D Lightbox Signage: Facing West (into Atrium) */}
        <group position={[-0.22, 4.4, 0.0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.92, 1.04, 0.04]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[3.84, 0.96]} />
            <meshBasicMaterial map={signUiWebEast} toneMapped={false} />
          </mesh>
        </group>

        {/* 3D Lightbox Signage: Facing East (into UI/UX Pavilion) */}
        <group position={[0.22, 4.4, 0.0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.92, 1.04, 0.04]} />
            <meshStandardMaterial color="#0f172a" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[3.84, 0.96]} />
            <meshBasicMaterial map={signAtriumFromUiWeb} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* D. Room-Isolated North/South Boundary Walls at Z = -9 */}
      {/* 1. UI/UX Pavilion North Wall (facing South into UI/UX, Z > -9, X = 7 to 21) */}
      <mesh position={[14, wallHeight / 2, -9 + 0.1]} receiveShadow castShadow>
        <boxGeometry args={[14, wallHeight, 0.2]} />
        <meshStandardMaterial map={techWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* 2. Graphic Design Gallery North Wall (facing South into Graphic, Z > -9, X = -21 to -7) */}
      <mesh position={[-14, wallHeight / 2, -9 + 0.1]} receiveShadow castShadow>
        <boxGeometry args={[14, wallHeight, 0.2]} />
        <meshStandardMaterial map={atelierWallTexture} roughness={0.78} color="#ffffff" />
      </mesh>

      {/* 3. Sala 3D South Wall East (facing North into Sala 3D, Z < -9, X = 3.5 to 14) */}
      <mesh position={[8.75, wallHeight / 2, -9 - 0.1]} receiveShadow castShadow>
        <boxGeometry args={[10.5, wallHeight, 0.2]} />
        <meshStandardMaterial map={studio3DWallTexture} roughness={0.75} color="#ffffff" />
      </mesh>

      {/* 4. Sala 3D South Wall West (facing North into Sala 3D, Z < -9, X = -14 to -3.5) */}
      <mesh position={[-8.75, wallHeight / 2, -9 - 0.1]} receiveShadow castShadow>
        <boxGeometry args={[10.5, wallHeight, 0.2]} />
        <meshStandardMaterial map={studio3DWallTexture} roughness={0.75} color="#ffffff" />
      </mesh>

      {/* E. 3D Pavilion Inner Side Walls at X = ±14 (Z = -9 to -26, length 17) */}
      <mesh position={[-14, wallHeight / 2, -17.5]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, 17]} />
        <meshStandardMaterial map={studio3DWallTexture} roughness={0.75} color="#ffffff" />
      </mesh>
      <mesh position={[14, wallHeight / 2, -17.5]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, wallHeight, 17]} />
        <meshStandardMaterial map={studio3DWallTexture} roughness={0.75} color="#ffffff" />
      </mesh>

      {/* 5. Contemporary Architectural Monolithic Columns in White Cast Stone & Graphite Aluminum */}
      {[
        // Grand Atrium rotunda columns
        [-4.5, 0, 3],
        [4.5, 0, 3],
        [-4.5, 0, -3],
        [4.5, 0, -3],
        // 3D Pavilion runway columns
        [-8.5, 0, -11],
        [8.5, 0, -11],
        [-8.5, 0, -21],
        [8.5, 0, -21]
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          {/* Square Pale Architectural Stone Plinth Base */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.05, 0.16, 1.05]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.05} roughness={0.4} />
          </mesh>
          {/* Titanium Anodized Trim Ring on Plinth */}
          <mesh position={[0, 0.17, 0]}>
            <boxGeometry args={[1.08, 0.02, 1.08]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>

          {/* Torus / Base Ring */}
          <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.46, 0.54, 0.20, 24]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.39, 0]}>
            <cylinderGeometry args={[0.44, 0.46, 0.04, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>

          {/* Main Monolithic White Cast Stone Column Shaft */}
          <mesh position={[0, wallHeight / 2 + 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.36, 0.40, wallHeight - 0.9, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.02} />
          </mesh>

          {/* Capital Astragal Neck Ring */}
          <mesh position={[0, wallHeight - 0.45, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.05, 24]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Classical Capital Bell / Echinus */}
          <mesh position={[0, wallHeight - 0.30, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.54, 0.40, 0.22, 24]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Square Abacus Slab at Ceiling Junction */}
          <mesh position={[0, wallHeight - 0.10, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.1, 0.18, 1.1]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.05} roughness={0.4} />
          </mesh>
          <mesh position={[0, wallHeight - 0.19, 0]}>
            <boxGeometry args={[1.12, 0.02, 1.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* 6. Museum Viewing Benches in Contemporary White Cast Stone & Titanium */}
      {/* Atrium side benches (clear central walking corridor & unobstructed portals) */}
      <group position={[-4.2, 0, 2.0]}>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 1.1]} />
          <meshBasicMaterial map={rectContactShadowTexture} transparent opacity={0.65} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.12, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[-0.8, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.8, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.54, 0]} receiveShadow>
          <boxGeometry args={[2.1, 0.08, 0.75]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>

      <group position={[4.2, 0, 2.0]}>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 1.1]} />
          <meshBasicMaterial map={rectContactShadowTexture} transparent opacity={0.65} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.12, 0.8]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[-0.8, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.8, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.54, 0]} receiveShadow>
          <boxGeometry args={[2.1, 0.08, 0.75]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>

      {/* 3D room central viewing bench */}
      <group position={[0, 0, -16]}>
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.2, 1.3]} />
          <meshBasicMaterial map={rectContactShadowTexture} transparent opacity={0.65} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.12, 1.0]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh position={[-1.1, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[1.1, 0.22, 0]} castShadow>
          <boxGeometry args={[0.1, 0.44, 0.8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.54, 0]} receiveShadow>
          <boxGeometry args={[2.7, 0.08, 0.9]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
      </group>

      {/* 7. Decorative Museum Floor Inlays */}
      {/* Central Atrium titanium ring around Torus Knot */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.3, 2.38, 64]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
      </mesh>

      {/* 8. Modern Architectural Display Table in UI/UX Pavilion */}
      <group position={[14.0, 0, -0.5]}>
        {/* Soft Radial Ambient Floor Shadow */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.8, 6.2]} />
          <meshBasicMaterial map={rectContactShadowTexture} transparent opacity={0.75} depthWrite={false} />
        </mesh>

        {/* Lower White Cast Stone Table Plinth */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.44, 5.0]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.4} metalness={0.05} />
        </mesh>

        {/* Brushed Titanium Mid-Tier Accent Reveal Band */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[2.46, 0.03, 5.06]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Natural Blonde Oak Table Base */}
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.3, 0.56, 4.9]} />
          <meshStandardMaterial color="#d4c1a5" roughness={0.45} metalness={0.05} />
        </mesh>

        {/* Top Deck Natural Blonde Oak Surface */}
        <mesh position={[0, 1.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.36, 0.04, 4.96]} />
          <meshStandardMaterial color="#dbc8ad" roughness={0.35} metalness={0.05} />
        </mesh>

        {/* 4 Dedicated Minimalist Workstation Trays */}
        {[
          { pos: [-0.6, 1.04, -0.9], rotY: -Math.PI / 2 },
          { pos: [-0.6, 1.04, 1.1], rotY: -Math.PI / 2 },
          { pos: [0.6, 1.04, -0.9], rotY: Math.PI / 2 },
          { pos: [0.6, 1.04, 1.1], rotY: Math.PI / 2 },
        ].map((ws, wIdx) => (
          <group key={wIdx} position={ws.pos as [number, number, number]} rotation={[0, ws.rotY, 0]}>
            {/* Recessed Tray in Slate & Steel */}
            <mesh position={[0, 0.012, 0.32]} castShadow receiveShadow>
              <boxGeometry args={[0.54, 0.01, 0.28]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.35} metalness={0.4} />
            </mesh>
            {/* Keyboard Texture */}
            <mesh position={[0, 0.018, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.50, 0.24]} />
              <meshStandardMaterial map={keyboardTexture} roughness={0.4} metalness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Central Inlaid Titanium Medallion on Table */}
        <mesh position={[0, 1.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.20, 0.32, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* Overhead Minimalist Architectural Luminaire above Table (Y = 5.6m) */}
      <group position={[14.0, wallHeight - 0.2, -0.5]}>
        {/* Suspended Brushed Titanium Frame */}
        <mesh castShadow>
          <boxGeometry args={[2.6, 0.06, 5.2]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Clean Linear Museum Task Lighting (4000K Neutral White) */}
        {[-0.7, 0, 0.7].map((lx, lIdx) => (
          <mesh key={lIdx} position={[lx, -0.035, 0]}>
            <boxGeometry args={[0.12, 0.02, 4.8]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.2} emissive="#f8fafc" emissiveIntensity={0.65} />
          </mesh>
        ))}
      </group>

      {/* 8.1 UI/UX Pavilion Architectural Wall Pilasters in White Cast Stone */}
      <group name="ui-ux-architectural-alcoves">
        {/* North Wall Pilasters (Z = -8.76) */}
        {[7.2, 11.75, 16.25, 20.8].map((px, pIdx) => (
          <group key={`n-pilaster-${pIdx}`} position={[px, wallHeight / 2, -8.76]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.24, wallHeight, 0.14]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.45} metalness={0.05} />
            </mesh>
          </group>
        ))}

        {/* East Wall Pilasters (X = 20.76) */}
        {[-7.5, -2.5, 2.5, 7.5].map((pz, pIdx) => (
          <group key={`e-pilaster-${pIdx}`} position={[20.76, wallHeight / 2, pz]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.14, wallHeight, 0.24]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.45} metalness={0.05} />
            </mesh>
          </group>
        ))}

        {/* South Wall Pilasters (Z = 7.74) */}
        {[7.2, 11.75, 16.25, 20.8].map((px, pIdx) => (
          <group key={`s-pilaster-${pIdx}`} position={[px, wallHeight / 2, 7.74]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.24, wallHeight, 0.14]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.45} metalness={0.05} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 9. Architectural Baseboards & Perimeter Floor Trims in Light Aluminum */}
      <group name="architectural-baseboards">
        {[
          // Outer West Wall Baseboard (Graphic Gallery)
          { pos: [-21 + 0.04, 0.06, -0.5] as [number, number, number], args: [0.06, 0.12, 17] as [number, number, number], color: '#e2e8f0' },
          // Outer East Wall Baseboard (UI/UX Pavilion)
          { pos: [21 - 0.04, 0.06, -0.5] as [number, number, number], args: [0.06, 0.12, 17] as [number, number, number], color: '#e2e8f0' },
          // South Walls Baseboards (Full continuous perimeter across Atrium, Graphic, and UI/UX)
          { pos: [-14, 0.06, 8 - 0.04] as [number, number, number], args: [14, 0.12, 0.06] as [number, number, number], color: '#e2e8f0' },
          { pos: [14, 0.06, 8 - 0.04] as [number, number, number], args: [14, 0.12, 0.06] as [number, number, number], color: '#e2e8f0' },
          { pos: [0, 0.06, 8 - 0.04] as [number, number, number], args: [14, 0.12, 0.06] as [number, number, number], color: '#e2e8f0' },
          // North Wall Baseboards (Sala 3D corner pilasters)
          { pos: [-13, 0.06, -26 + 0.04] as [number, number, number], args: [2.0, 0.12, 0.06] as [number, number, number], color: '#e2e8f0' },
          { pos: [13, 0.06, -26 + 0.04] as [number, number, number], args: [2.0, 0.12, 0.06] as [number, number, number], color: '#e2e8f0' },
        ].map((bb, idx) => (
          <mesh key={idx} position={bb.pos} receiveShadow castShadow>
            <boxGeometry args={bb.args} />
            <meshStandardMaterial color={bb.color} metalness={0.1} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* 10. Architectural Cornice Moldings — techo-pared junction in every room */}
      <group name="cornices">
        {/* Atrium cornices in architectural white plaster */}
        {[
          { pos: [0, wallHeight - 0.08, -6] as [number, number, number], args: [14.4, 0.16, 0.28] as [number, number, number] },
          { pos: [0, wallHeight - 0.08, 8] as [number, number, number], args: [14.4, 0.16, 0.28] as [number, number, number] },
          { pos: [-7, wallHeight - 0.08, 1] as [number, number, number], args: [0.28, 0.16, 14.4] as [number, number, number] },
          { pos: [7, wallHeight - 0.08, 1] as [number, number, number], args: [0.28, 0.16, 14.4] as [number, number, number] },
        ].map((c, i) => (
          <mesh key={i} position={c.pos} castShadow receiveShadow>
            <boxGeometry args={c.args} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.05} />
          </mesh>
        ))}
        {/* Atrium titanium reveal strips under cornice */}
        {[
          { pos: [0, wallHeight - 0.185, -6] as [number, number, number], args: [14.4, 0.03, 0.04] as [number, number, number] },
          { pos: [0, wallHeight - 0.185, 8] as [number, number, number], args: [14.4, 0.03, 0.04] as [number, number, number] },
          { pos: [-7, wallHeight - 0.185, 1] as [number, number, number], args: [0.04, 0.03, 14.4] as [number, number, number] },
          { pos: [7, wallHeight - 0.185, 1] as [number, number, number], args: [0.04, 0.03, 14.4] as [number, number, number] },
        ].map((g, i) => (
          <mesh key={i} position={g.pos}>
            <boxGeometry args={g.args} />
            <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
          </mesh>
        ))}

        {/* Sala 3D cornices */}
        {[
          { pos: [0, wallHeight - 0.08, -26] as [number, number, number], args: [28.4, 0.16, 0.28] as [number, number, number] },
          { pos: [-14, wallHeight - 0.08, -17.5] as [number, number, number], args: [0.28, 0.16, 17.4] as [number, number, number] },
          { pos: [14, wallHeight - 0.08, -17.5] as [number, number, number], args: [0.28, 0.16, 17.4] as [number, number, number] },
        ].map((c, i) => (
          <mesh key={i} position={c.pos} castShadow receiveShadow>
            <boxGeometry args={c.args} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.05} />
          </mesh>
        ))}
        <mesh position={[0, wallHeight - 0.185, -26]}>
          <boxGeometry args={[28.4, 0.03, 0.04]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Graphic Gallery cornices */}
        {[
          { pos: [-14, wallHeight - 0.08, 8] as [number, number, number], args: [14.4, 0.16, 0.28] as [number, number, number] },
          { pos: [-14, wallHeight - 0.08, -9] as [number, number, number], args: [14.4, 0.16, 0.28] as [number, number, number] },
          { pos: [-21, wallHeight - 0.08, -0.5] as [number, number, number], args: [0.28, 0.16, 17.4] as [number, number, number] },
        ].map((c, i) => (
          <mesh key={i} position={c.pos} castShadow receiveShadow>
            <boxGeometry args={c.args} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.05} />
          </mesh>
        ))}
        <mesh position={[-21, wallHeight - 0.185, -0.5]}>
          <boxGeometry args={[0.04, 0.03, 17.4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* UI/UX Pavilion cornices */}
        {[
          { pos: [14, wallHeight - 0.08, 8] as [number, number, number], args: [14.4, 0.16, 0.28] as [number, number, number] },
          { pos: [14, wallHeight - 0.08, -9] as [number, number, number], args: [14.4, 0.16, 0.28] as [number, number, number] },
          { pos: [21, wallHeight - 0.08, -0.5] as [number, number, number], args: [0.28, 0.16, 17.4] as [number, number, number] },
        ].map((c, i) => (
          <mesh key={i} position={c.pos} castShadow receiveShadow>
            <boxGeometry args={c.args} />
            <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.05} />
          </mesh>
        ))}
        <mesh position={[21, wallHeight - 0.185, -0.5]}>
          <boxGeometry args={[0.04, 0.03, 17.4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* 11. Grand Multi-Tier Monolithic Pedestal in Contemporary White Marble & Titanium */}
      <group position={[0, 0, 0]} name="atrium-grand-pedestal">
        {/* Grounding shadow */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.65, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.25} depthWrite={false} />
        </mesh>
        {/* Base plinth — pale architectural stone */}
        <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.18, 2.5]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.05} roughness={0.4} />
        </mesh>
        {/* First tier — white cast marble */}
        <mesh position={[0, 0.30, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.24, 2.1]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Titanium band 1 */}
        <mesh position={[0, 0.43, 0]}>
          <boxGeometry args={[2.15, 0.04, 2.15]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Second tier — white cast marble */}
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.30, 1.6]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Titanium band 2 */}
        <mesh position={[0, 0.78, 0]}>
          <boxGeometry args={[1.65, 0.04, 1.65]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Third tier — cylindrical column cap */}
        <mesh position={[0, 0.98, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.6, 0.72, 0.38, 28]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.05} />
        </mesh>
        {/* Circular crown ring */}
        <mesh position={[0, 1.19, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Flat top surface */}
        <mesh position={[0, 1.22, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.58, 0.58, 0.04, 32]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.05} />
        </mesh>
      </group>

      {/* 12. Decorative Atrium Pilasters in White Cast Stone & Titanium */}
      {/* At Z=-6 (North divider face) */}
      {[-3.5, 3.5].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, -5.82]}>
          <mesh position={[0, wallHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.20, wallHeight, 0.10]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, wallHeight - 0.22, 0]}>
            <boxGeometry args={[0.28, 0.14, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.28, 0.22, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      ))}
      {/* At Z=8 (South wall face, atrium) */}
      {[-3.5, 3.5].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 7.82]}>
          <mesh position={[0, wallHeight / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.20, wallHeight, 0.10]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, wallHeight - 0.22, 0]}>
            <boxGeometry args={[0.28, 0.14, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.28, 0.22, 0.12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

