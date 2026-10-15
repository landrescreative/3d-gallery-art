import React, { useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Artwork } from '../../types/gallery'
import { 
  createArtworkFallback, 
  createLaptopKeyboardTexture, 
  createBrowserBarTexture,
  createLandresPortfolioCartelTexture,
  createMuseumPlaqueTexture
} from '../../utils/canvasTextures'
import { zoomManager } from '../../utils/zoomState'

interface ArtworkFrameProps {
  artwork: Artwork
  isNearest: boolean
  onSelect: (artwork: Artwork) => void
}

export const ArtworkFrame: React.FC<ArtworkFrameProps> = ({ artwork, isNearest, onSelect }) => {
  const isMobile = typeof window !== 'undefined' && (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  )
  const [hovered, setHovered] = useState(false)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [mobileTexture, setMobileTexture] = useState<THREE.Texture | null>(null)
  const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null)
  const keyboardTexture = useMemo(() => createLaptopKeyboardTexture(), [])
  const landresCartelTexture = useMemo(() => {
    if (artwork.id === 'landres-banner' || artwork.displayType === 'video_wall') {
      return createLandresPortfolioCartelTexture()
    }
    return null
  }, [artwork.id, artwork.displayType])

  // Setup HTML5 Video and THREE.VideoTexture for artworks with motion reel/video
  useEffect(() => {
    if (!artwork.videoUrl) return

    let active = true
    const video = document.createElement('video')
    video.src = artwork.videoUrl
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')

    const vTex = new THREE.VideoTexture(video)
    vTex.colorSpace = THREE.SRGBColorSpace
    vTex.minFilter = THREE.LinearFilter
    vTex.magFilter = THREE.LinearFilter
    vTex.generateMipmaps = false

    const handleLoadedData = () => {
      if (!active) return
      video.play().catch(() => {
        // Autoplay may wait for user gesture on mobile browsers
      })
      setVideoTexture(vTex)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.load()

    const handleUserGesture = () => {
      if (video.paused) {
        video.play().catch(() => {})
      }
    }
    window.addEventListener('click', handleUserGesture, { once: true })
    window.addEventListener('touchstart', handleUserGesture, { once: true })

    return () => {
      active = false
      window.removeEventListener('click', handleUserGesture)
      window.removeEventListener('touchstart', handleUserGesture)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.pause()
      video.removeAttribute('src')
      video.load()
      vTex.dispose()
      setVideoTexture(null)
    }
  }, [artwork.videoUrl])

  // Measure natural aspect ratio from loaded texture if available
  const naturalRatio = useMemo(() => {
    const img = texture?.image as { width?: number; height?: number } | undefined
    if (img?.width && img?.height) {
      return img.width / img.height
    }
    return artwork.aspectRatio
  }, [texture, artwork.aspectRatio])

  const height = artwork.size[1]
  const width = height * naturalRatio

  // Determine effective display style based on explicit type or room thematic
  const displayType = artwork.displayType || (
    artwork.room === 'Pabellón de UI/UX, Web & Plataformas'
      ? (artwork.id === 'scoop-doggy' ? 'titanium_phone' : 'floating_browser')
      : artwork.room === 'Sala 3D & Escultura'
        ? 'cinema_screen'
        : artwork.room === 'Gran Atrio Central'
          ? 'video_wall'
          : 'classic_frame'
  )

  const isTech = useMemo(() => {
    return (
      displayType === 'tech_monitor' ||
      displayType === 'mobile_device' ||
      displayType === 'smart_tv' ||
      displayType === 'laptop' ||
      displayType === 'table_laptop' ||
      displayType === 'table_tablet' ||
      displayType === 'floating_browser' ||
      displayType === 'responsive_kiosk' ||
      displayType === 'titanium_phone' ||
      artwork.room === 'Pabellón de UI/UX, Web & Plataformas'
    )
  }, [displayType, artwork.room])

  // Browser Chrome Arc / macOS top bar texture
  const browserBarTexture = useMemo(() => {
    const effectiveUrl = artwork.url || `https://${artwork.id.replace(/-/g, '')}.landrescreative.com`
    return createBrowserBarTexture(artwork.title, effectiveUrl)
  }, [artwork.title, artwork.url, artwork.id])

  // Load primary image with procedural fallback
  useEffect(() => {
    let active = true
    THREE.Cache.enabled = true
    const loader = new THREE.TextureLoader()
    loader.load(
      artwork.imageUrl,
      (tex) => {
        if (!active) return
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 16

        // For UI/UX and web interfaces, bypass aggressive mipmap downsampling so that
        // text, icons, and interface details remain pin-sharp at any viewing angle
        if (isTech) {
          tex.generateMipmaps = false
          tex.minFilter = THREE.LinearFilter
          tex.magFilter = THREE.LinearFilter
        } else {
          tex.generateMipmaps = true
          tex.minFilter = THREE.LinearMipmapLinearFilter
          tex.magFilter = THREE.LinearFilter
        }

        tex.needsUpdate = true
        setTexture(tex)
      },
      undefined,
      () => {
        if (!active) return
        const fallback = createArtworkFallback(
          artwork.title,
          artwork.artist,
          artwork.fallbackColor1,
          artwork.fallbackColor2,
          artwork.aspectRatio
        )
        fallback.colorSpace = THREE.SRGBColorSpace
        fallback.needsUpdate = true
        setTexture(fallback)
      }
    )
    return () => {
      active = false
    }
  }, [artwork.imageUrl, isTech])

  // Load secondary/mobile companion image if available
  const secondaryImageUrl = artwork.mobileImageUrl || (
    artwork.galleryImages && artwork.galleryImages.length > 1 ? artwork.galleryImages[1] : null
  )

  useEffect(() => {
    if (!secondaryImageUrl) return
    let active = true
    const loader = new THREE.TextureLoader()
    loader.load(
      secondaryImageUrl,
      (tex) => {
        if (!active) return
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 16

        if (isTech) {
          tex.generateMipmaps = false
          tex.minFilter = THREE.LinearFilter
          tex.magFilter = THREE.LinearFilter
        } else {
          tex.generateMipmaps = true
          tex.minFilter = THREE.LinearMipmapLinearFilter
          tex.magFilter = THREE.LinearFilter
        }

        tex.needsUpdate = true
        setMobileTexture(tex)
      }
    )
    return () => {
      active = false
    }
  }, [secondaryImageUrl, isTech])

  // Unified Minimalist Obsidian Museum Exhibition Plaque Texture (3.2:1 @ 1024x320)
  const plaqueTexture = useMemo(() => {
    let category = 'MUSEO LANDRES CREATIVE · COLECCIÓN PERMANENTE'
    let type: 'tech' | 'cinema' | 'sculpture' | 'graphic' | 'art' = 'art'

    if (isTech) {
      type = 'tech'
      category = (displayType === 'titanium_phone' || displayType === 'mobile_device')
        ? 'PABELLÓN UI/UX & WEB · MOBILE APPLICATION'
        : displayType === 'responsive_kiosk'
          ? 'PABELLÓN UI/UX & WEB · RESPONSIVE PLATFORM'
          : displayType === 'floating_browser'
            ? 'PABELLÓN UI/UX & WEB · LIVE WEB APPLICATION'
            : (displayType === 'table_tablet')
              ? 'PABELLÓN UI/UX & WEB · WORKSTATION INTERACTIVA'
              : (displayType === 'laptop' || displayType === 'table_laptop')
                ? 'PABELLÓN UI/UX & WEB · MACBOOK WORKSTATION'
                : displayType === 'smart_tv'
                  ? 'PABELLÓN UI/UX & WEB · 4K SMART DISPLAY'
                  : 'PABELLÓN UI/UX & WEB · EXPERIENCIA DIGITAL'
    } else if (displayType === 'cinema_screen') {
      type = 'cinema'
      category = 'SALA 3D & ESCULTURA · CGI & RENDER'
    } else if (artwork.room?.toLowerCase().includes('gráfico') || artwork.room?.toLowerCase().includes('foto')) {
      type = 'graphic'
      category = 'DISEÑO GRÁFICO & FOTO · CARTELISMO & PUBLICIDAD'
    }

    return createMuseumPlaqueTexture({
      title: artwork.title,
      medium: artwork.medium,
      techStack: artwork.techStack,
      year: artwork.year,
      artist: artwork.artist,
      url: artwork.url,
      category,
      type
    })
  }, [artwork, displayType, isTech])

  const isHighlighted = hovered || isNearest

  const handleItemClick = (e: any) => {
    // Only primary button (left click) and never while actively zooming
    if (e.button !== 0 || zoomManager.isZoomed) return
    e.stopPropagation()
    if (isNearest) onSelect(artwork)
  }

  // ==========================================
  // RENDER PER DISPLAY TYPE
  // ==========================================

  // 0.1 FLOATING BROWSER & CLEAN KIOSK (Frosted Glass Arc / macOS Floating Window with Live URL Chrome)
  if (displayType === 'floating_browser' || displayType === 'responsive_kiosk') {
    const barHeight = 0.22
    const totalHeight = height + barHeight
    const bodyDepth = 0.04

    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        {/* Wall Standoff Mounts (4 Stainless Steel Cylinders) */}
        {[
          [-width / 2 + 0.12, totalHeight / 2 - 0.10],
          [width / 2 - 0.12, totalHeight / 2 - 0.10],
          [-width / 2 + 0.12, -totalHeight / 2 + 0.10],
          [width / 2 - 0.12, -totalHeight / 2 + 0.10]
        ].map(([sx, sy], sIdx) => (
          <group key={sIdx} position={[sx, sy, 0.04]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.024, 0.024, 0.08, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.15} />
            </mesh>
            <mesh position={[0, 0, -0.038]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.008, 16]} />
              <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        ))}

        {/* Interactive Click Group */}
        <group
          userData={{ interactableId: artwork.id }}
          position={[0, 0, 0.08]}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Frosted Dark Glass Window Chassis Backing */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[width + 0.05, totalHeight + 0.05, bodyDepth]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#0b1120'}
              metalness={0.92}
              roughness={0.25}
            />
          </mesh>

          {/* Browser Chrome Header Bar (macOS traffic lights, live URL pill) */}
          <mesh position={[0, totalHeight / 2 - barHeight / 2, bodyDepth / 2 + 0.002]} castShadow>
            <planeGeometry args={[width, barHeight]} />
            <meshStandardMaterial
              map={browserBarTexture}
              roughness={0.15}
              metalness={0.3}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={-1}
            />
          </mesh>

          {/* Main Website Viewport (Screen: Pure, Glare-Free Digital Reproduction) */}
          <mesh position={[0, -barHeight / 2, bodyDepth / 2 + 0.002]} receiveShadow>
            <planeGeometry args={[width, height]} />
            {texture ? (
              <meshBasicMaterial
                key={texture.uuid}
                map={texture}
                toneMapped={false}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
              />
            ) : (
              <meshStandardMaterial color="#090d16" />
            )}
          </mesh>

          {/* Bottom Window Status Pill: Live Status Dot */}
          <mesh position={[width / 2 - 0.08, -totalHeight / 2 + 0.035, bodyDepth / 2 + 0.004]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
        </group>

        {/* Laser-Etched Titanium Spec Plaque with URL */}
        <group position={[0, -totalHeight / 2 - 0.22, 0.04]}>
          {/* Dual Titanium Mounting Brackets connecting browser window to plaque */}
          {[-0.32, 0.32].map((bx, bIdx) => (
            <mesh key={bIdx} position={[bx, 0.17, -0.01]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.12, 12]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </mesh>
          ))}
          <mesh
            castShadow
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[1.00, 0.34, 0.018]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#030712'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh
            position={[0, 0, 0.011]}
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[0.96, 0.30]} />
            <meshBasicMaterial map={plaqueTexture} />
          </mesh>
        </group>
      </group>
    )
  }

  // 0.3 TITANIUM PHONE (Monumental iPhone 16 Pro Mockup for Mobile Apps like Scoop Doggy)
  if (displayType === 'titanium_phone') {
    const phoneWidth = width
    const phoneHeight = height
    const bodyDepth = 0.06

    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        {/* Standoff Wall Anchors */}
        {[
          [-phoneWidth / 2 + 0.08, phoneHeight / 2 - 0.12],
          [phoneWidth / 2 - 0.08, phoneHeight / 2 - 0.12],
          [-phoneWidth / 2 + 0.08, -phoneHeight / 2 + 0.12],
          [phoneWidth / 2 - 0.08, -phoneHeight / 2 + 0.12]
        ].map(([sx, sy], sIdx) => (
          <group key={sIdx} position={[sx, sy, 0.03]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.06, 16]} />
              <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.15} />
            </mesh>
          </group>
        ))}

        {/* Interactive Click Group */}
        <group
          userData={{ interactableId: artwork.id }}
          position={[0, 0, 0.06]}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Natural Titanium Smartphone Body */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[phoneWidth + 0.08, phoneHeight + 0.12, bodyDepth]} />
            <meshStandardMaterial
              color={isHighlighted ? '#3f3f46' : '#27272a'}
              metalness={0.96}
              roughness={0.18}
            />
          </mesh>

          {/* Smartphone Screen Surface (Screen: Pure, Glare-Free Digital Reproduction) */}
          <mesh position={[0, 0, bodyDepth / 2 + 0.002]} receiveShadow>
            <planeGeometry args={[phoneWidth, phoneHeight]} />
            {texture ? (
              <meshBasicMaterial
                key={texture.uuid}
                map={texture}
                toneMapped={false}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
              />
            ) : (
              <meshStandardMaterial color="#090d16" />
            )}
          </mesh>

          {/* Dynamic Island Pill Cutout on Top with Camera Lens Dot */}
          <mesh position={[0, phoneHeight / 2 - 0.06, bodyDepth / 2 + 0.01]}>
            <capsuleGeometry args={[0.02, 0.08, 8, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[-0.028, phoneHeight / 2 - 0.06, bodyDepth / 2 + 0.012]}>
            <circleGeometry args={[0.006, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>

          {/* Side Buttons (Action Button, Volume, Power) */}
          <mesh position={[-phoneWidth / 2 - 0.044, phoneHeight / 4, 0]}>
            <boxGeometry args={[0.008, 0.08, 0.018]} />
            <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-phoneWidth / 2 - 0.044, phoneHeight / 4 - 0.12, 0]}>
            <boxGeometry args={[0.008, 0.12, 0.018]} />
            <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[phoneWidth / 2 + 0.044, phoneHeight / 4 - 0.05, 0]}>
            <boxGeometry args={[0.008, 0.16, 0.018]} />
            <meshStandardMaterial color="#52525b" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>

        {/* Plaque */}
        <group position={[0, -phoneHeight / 2 - 0.24, 0.035]}>
          <mesh
            castShadow
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[0.92, 0.315, 0.018]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#030712'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh
            position={[0, 0, 0.011]}
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[0.88, 0.275]} />
            <meshBasicMaterial map={plaqueTexture} />
          </mesh>
        </group>
      </group>
    )
  }

  // 1. TECH MONITOR (Modern Ultra-Slim Workstation Display)
  if (displayType === 'tech_monitor') {
    const bezel = 0.035
    const bodyDepth = 0.045
    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        {/* Wall Mounting Articulated Arm / Bracket */}
        <mesh position={[0, 0, 0.012]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.024]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.024]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* Interactive Click Group */}
        <group
          userData={{ interactableId: artwork.id }}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Anodized Aluminum Monitor Body */}
          <mesh position={[0, 0, bodyDepth / 2 + 0.015]} castShadow receiveShadow>
            <boxGeometry args={[width + bezel * 2, height + bezel * 2, bodyDepth]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>

          {/* Chamfered Outer Metallic Rim */}
          <mesh position={[0, 0, bodyDepth + 0.014]} castShadow>
            <boxGeometry args={[width + bezel * 2 + 0.01, height + bezel * 2 + 0.01, 0.006]} />
            <meshStandardMaterial
              color={isHighlighted ? '#64748b' : '#334155'}
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>

          {/* Active Retina / OLED Display Surface */}
          <mesh position={[0, 0, bodyDepth + 0.018]} castShadow receiveShadow>
            <boxGeometry args={[width, height, 0.008]} />
            {texture ? (
              <meshBasicMaterial
                key={texture.uuid}
                map={texture}
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial color="#090d16" />
            )}
          </mesh>

          {/* Minimal Power Status LED on Lower Bezel */}
          <mesh position={[width / 2 - 0.05, -height / 2 - bezel / 2, bodyDepth + 0.02]}>
            <circleGeometry args={[0.012, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Tech Spec Laser-Etched Wall Plaque */}
        <group position={[0, -height / 2 - 0.26, 0.035]}>
          <mesh
            castShadow
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[0.92, 0.315, 0.018]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#030712'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh
            position={[0, 0, 0.011]}
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[0.88, 0.275]} />
            <meshBasicMaterial map={plaqueTexture} />
          </mesh>
        </group>
      </group>
    )
  }

  // 2. SMART TV (Modern 4K Ultra-Slim OLED TV with Matching Soundbar & Bias Backlight)
  if (displayType === 'smart_tv') {
    const bezel = 0.02
    const bodyDepth = 0.04
    const soundbarW = Math.min(width * 0.82, 2.6)
    const soundbarH = 0.09
    const soundbarD = 0.10
    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        {/* Heavy-Duty Wall Articulated Bracket */}
        <mesh position={[0, 0, 0.015]} castShadow>
          <boxGeometry args={[0.55, 0.45, 0.025]} />
          <meshStandardMaterial color="#090d16" metalness={0.92} roughness={0.25} />
        </mesh>
        <mesh position={[-0.15, 0, 0.025]} castShadow>
          <boxGeometry args={[0.04, 0.35, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.15, 0, 0.025]} castShadow>
          <boxGeometry args={[0.04, 0.35, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Interactive Click Group (TV Screen) */}
        <group
          userData={{ interactableId: artwork.id }}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* OLED TV Chassis Backing */}
          <mesh position={[0, 0, bodyDepth / 2 + 0.018]} castShadow receiveShadow>
            <boxGeometry args={[width + bezel * 2, height + bezel * 2, bodyDepth]} />
            <meshStandardMaterial
              color="#0b0f17"
              metalness={0.94}
              roughness={0.2}
            />
          </mesh>

          {/* Micro-Bezel Outer Metallic Trim */}
          <mesh position={[0, 0, bodyDepth + 0.017]} castShadow>
            <boxGeometry args={[width + bezel * 2 + 0.008, height + bezel * 2 + 0.008, 0.005]} />
            <meshStandardMaterial
              color={isHighlighted ? '#64748b' : '#334155'}
              metalness={0.92}
              roughness={0.25}
            />
          </mesh>

          {/* OLED Screen Surface */}
          <mesh position={[0, 0, bodyDepth + 0.02]} castShadow receiveShadow>
            <boxGeometry args={[width, height, 0.006]} />
            {texture ? (
              <meshBasicMaterial
                key={texture.uuid}
                map={texture}
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial color="#070a11" />
            )}
          </mesh>

          {/* TV Power Indicator & IR Sensor */}
          <mesh position={[0, -height / 2 - bezel / 2, bodyDepth + 0.022]}>
            <boxGeometry args={[0.06, 0.012, 0.01]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Floating Soundbar Beneath TV */}
        <group position={[0, -height / 2 - 0.22, 0.075]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[soundbarW, soundbarH, soundbarD]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
          </mesh>
          <mesh position={[-soundbarW / 2 - 0.008, 0, 0]}>
            <boxGeometry args={[0.016, soundbarH + 0.004, soundbarD + 0.004]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[soundbarW / 2 + 0.008, 0, 0]}>
            <boxGeometry args={[0.016, soundbarH + 0.004, soundbarD + 0.004]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, soundbarD / 2 + 0.002]}>
            <circleGeometry args={[0.006, 16]} />
            <meshBasicMaterial color="#64748b" />
          </mesh>
        </group>

        {/* Wall Plaque Below Soundbar */}
        <group position={[0, -height / 2 - 0.44, 0.035]}>
          <mesh
            castShadow
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[1.00, 0.34, 0.018]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#030712'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh
            position={[0, 0, 0.011]}
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[0.96, 0.30]} />
            <meshBasicMaterial map={plaqueTexture} />
          </mesh>
        </group>
      </group>
    )
  }

  // 3. LAPTOP (MacBook Pro Style Aluminum Laptop on Minimalist Floating Console Shelf)
  if (displayType === 'laptop') {
    const screenW = width
    const screenH = height
    const baseW = Math.max(screenW * 1.04, 1.4)
    const baseD = Math.max(screenH * 0.9, 0.95)
    const baseH = 0.04
    const tiltAngle = 0.32 // ~18.3 degrees back from vertical

    const shelfW = baseW + 0.4
    const shelfD = baseD + 0.4
    const shelfH = 0.06

    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        {/* Floating Wall Console Shelf */}
        <group position={[0, -0.03, shelfD / 2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[shelfW, shelfH, shelfD]} />
            <meshStandardMaterial color="#111827" roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0, shelfD / 2 + 0.002]}>
            <boxGeometry args={[shelfW + 0.01, shelfH + 0.005, 0.008]} />
            <meshStandardMaterial color={isHighlighted ? '#64748b' : '#334155'} metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[-shelfW * 0.35, -0.22, -shelfD * 0.2]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.45, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[shelfW * 0.35, -0.22, -shelfD * 0.2]} rotation={[0.4, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.45, 0.04]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>

        {/* Interactive Laptop Object */}
        <group
          userData={{ interactableId: artwork.id }}
          position={[0, baseH / 2, baseD / 2 + 0.1]}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Laptop Aluminum Base Deck */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[baseW, baseH, baseD]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>

          {/* Keyboard & Trackpad Surface (Texture) */}
          <mesh position={[0, baseH / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[baseW * 0.94, baseD * 0.92]} />
            <meshStandardMaterial
              map={keyboardTexture}
              roughness={0.5}
              metalness={0.2}
            />
          </mesh>

          {/* Screen Hinge Cylinder */}
          <mesh position={[0, baseH / 2, -baseD / 2 + 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, baseW * 0.85, 16]} />
            <meshStandardMaterial color="#090d16" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Laptop Open Display Lid */}
          <group position={[0, baseH / 2, -baseD / 2 + 0.02]} rotation={[-tiltAngle, 0, 0]}>
            <mesh position={[0, screenH / 2, -0.015]} castShadow receiveShadow>
              <boxGeometry args={[screenW + 0.06, screenH + 0.06, 0.025]} />
              <meshStandardMaterial
                color="#0f172a"
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>

            <mesh position={[0, screenH / 2, 0.001]} receiveShadow>
              <planeGeometry args={[screenW, screenH]} />
              {texture ? (
                <meshBasicMaterial
                  key={texture.uuid}
                  map={texture}
                  toneMapped={false}
                  polygonOffset
                  polygonOffsetFactor={-1}
                  polygonOffsetUnits={-1}
                />
              ) : (
                <meshStandardMaterial color="#070b13" />
              )}
            </mesh>

            <mesh position={[0, screenH + 0.018, 0.004]}>
              <circleGeometry args={[0.008, 16]} />
              <meshBasicMaterial color="#047857" />
            </mesh>
          </group>
        </group>

        {/* Tech Plaque Below Console Shelf */}
        <group position={[0, -0.34, 0.035]}>
          <mesh
            castShadow
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[0.92, 0.315, 0.018]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#030712'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh
            position={[0, 0, 0.011]}
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[0.88, 0.275]} />
            <meshBasicMaterial map={plaqueTexture} />
          </mesh>
        </group>
      </group>
    )
  }

  // 3.1 STUDIO TABLET ON APPLE STORE DISPLAY STAND
  if (displayType === 'table_tablet' || displayType === 'table_laptop') {
    const aspect = artwork.aspectRatio || (width / height) || 1.2
    // Ergonomic tablet height on the counter stand
    const screenH = 0.54
    // Natural screen width matching exact artwork aspect ratio
    const screenW = Math.max(0.44, Math.min(0.82, screenH * aspect))
    // Sleek uniform 2cm aluminum bezel around the screen
    const tabletW = screenW + 0.04
    const tabletH = screenH + 0.04
    const tabletD = 0.012
    const tiltAngle = 0.38 // ~21.8° tilt back for optimal viewing from standing eye level

    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        {/* Brushed Aerospace Aluminum Stand Foot on Oak Table */}
        <group position={[0, 0, 0]}>
          {/* Base plate sitting flat on table surface */}
          <mesh position={[0, 0.006, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.012, 0.22]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>
          {/* Beveled edge border */}
          <mesh position={[0, 0.003, 0]}>
            <boxGeometry args={[0.27, 0.004, 0.23]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>

          {/* Cantilever Angled Riser Neck Arm */}
          <group position={[0, 0.012, -0.04]} rotation={[-tiltAngle * 0.75, 0, 0]}>
            <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.07, 0.30, 0.018]} />
              <meshStandardMaterial
                color={isHighlighted ? '#475569' : '#334155'}
                metalness={0.92}
                roughness={0.22}
              />
            </mesh>
            {/* Cable management pass-through portal */}
            <mesh position={[0, 0.14, 0]}>
              <torusGeometry args={[0.022, 0.005, 12, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.3} />
            </mesh>
          </group>

          {/* Magnetic Docking Puck behind tablet center */}
          <mesh position={[0, 0.28, -0.06]} rotation={[Math.PI / 2 - tiltAngle, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.012, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.95} roughness={0.2} />
          </mesh>
        </group>

        {/* Interactive Tablet Group (Screen & Bezel Tilted Back Ergonomically) */}
        <group
          userData={{ interactableId: artwork.id }}
          position={[0, 0.32, -0.04]}
          rotation={[-tiltAngle, 0, 0]}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Tablet Unibody Aluminum Rear Chassis */}
          <mesh position={[0, 0, -tabletD / 2]} castShadow receiveShadow>
            <boxGeometry args={[tabletW, tabletH, tabletD]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.96}
              roughness={0.18}
            />
          </mesh>

          {/* CNC Polished Chamfer Edge Perimeter */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[tabletW + 0.003, tabletH + 0.003, 0.004]} />
            <meshStandardMaterial
              color={isHighlighted ? '#94a3b8' : '#64748b'}
              metalness={0.95}
              roughness={0.25}
            />
          </mesh>

          {/* Front Glass Bezel */}
          <mesh position={[0, 0, 0.002]}>
            <boxGeometry args={[tabletW - 0.002, tabletH - 0.002, 0.002]} />
            <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.1} />
          </mesh>

          {/* High-Resolution Interactive Artwork Display (Anti-Glare Pure Digital) */}
          <mesh position={[0, 0, 0.005]} receiveShadow>
            <planeGeometry args={[screenW, screenH]} />
            {texture ? (
              <meshBasicMaterial
                key={texture.uuid}
                map={texture}
                toneMapped={false}
                polygonOffset
                polygonOffsetFactor={-1}
                polygonOffsetUnits={-1}
              />
            ) : (
              <meshStandardMaterial color="#070b13" />
            )}
          </mesh>

          {/* Front Camera Sensor Dot */}
          <mesh position={[0, screenH / 2 + 0.01, 0.005]}>
            <circleGeometry args={[0.004, 16]} />
            <meshBasicMaterial color="#047857" />
          </mesh>
        </group>

        {/* Museum Elevated Counter Stanchion / Large Spec Plaque (to the right of the tablet at eye level) */}
        <group position={[tabletW / 2 + 0.44, 0, 0]}>
          {/* Heavy Brushed Titanium Table Base Foot */}
          <mesh position={[0, 0.005, 0.02]} castShadow receiveShadow>
            <boxGeometry args={[0.24, 0.010, 0.16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.002, 0.02]}>
            <boxGeometry args={[0.25, 0.004, 0.17]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
          </mesh>

          {/* Cantilever Neck Arm (rising from table to tablet center height Y = 0.28m) */}
          <mesh position={[0, 0.14, -0.02]} rotation={[-tiltAngle * 0.75, 0, 0]} castShadow>
            <boxGeometry args={[0.045, 0.28, 0.014]} />
            <meshStandardMaterial
              color={isHighlighted ? '#475569' : '#334155'}
              metalness={0.92}
              roughness={0.22}
            />
          </mesh>

          {/* Elevated Plaque Unit — Tilted at -tiltAngle matching tablet viewing plane */}
          <group position={[0, 0.28, -0.06]} rotation={[-tiltAngle, 0, 0]}>
            {/* Magnetic Mounting Puck behind Plaque */}
            <mesh position={[0, 0, -0.012]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
            </mesh>

            {/* Chamfered Titanium Chassis Backing */}
            <mesh
              castShadow
              receiveShadow
              onClick={handleItemClick}
              onPointerOver={(e) => {
                e.stopPropagation()
                if (isNearest) {
                  setHovered(true)
                  document.body.style.cursor = 'pointer'
                }
              }}
              onPointerOut={() => {
                setHovered(false)
                document.body.style.cursor = 'auto'
              }}
            >
              <boxGeometry args={[0.80, 0.265, 0.018]} />
              <meshStandardMaterial
                color={isHighlighted ? '#1e293b' : '#0b1120'}
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>

            {/* Accent Rim Border */}
            <mesh position={[0, 0, -0.001]}>
              <boxGeometry args={[0.806, 0.271, 0.006]} />
              <meshStandardMaterial color={isHighlighted ? '#38bdf8' : '#334155'} metalness={0.9} roughness={0.3} />
            </mesh>

            {/* Plaque Canvas Face - Exact 3.2:1 Aspect Ratio (0.768 / 0.24 = 3.200) */}
            <mesh
              position={[0, 0, 0.01]}
              onClick={handleItemClick}
              onPointerOver={(e) => {
                e.stopPropagation()
                if (isNearest) {
                  setHovered(true)
                  document.body.style.cursor = 'pointer'
                }
              }}
              onPointerOut={() => {
                setHovered(false)
                document.body.style.cursor = 'auto'
              }}
            >
              <planeGeometry args={[0.768, 0.24]} />
              <meshBasicMaterial map={plaqueTexture} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    )
  }
  if (displayType === 'mobile_device') {
    const phoneWidth = width
    const phoneHeight = height
    const bodyDepth = 0.05
    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        {/* Interactive Click Group */}
        <group
          userData={{ interactableId: artwork.id }}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Titanium Smartphone Body */}
          <mesh position={[0, 0, bodyDepth / 2 + 0.01]} castShadow receiveShadow>
            <boxGeometry args={[phoneWidth + 0.08, phoneHeight + 0.14, bodyDepth]} />
            <meshStandardMaterial
              color={isHighlighted ? '#27272a' : '#18181b'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>

          {/* Smartphone Screen Surface (Screen: Pure, Glare-Free Digital Reproduction) */}
          <mesh position={[0, 0, bodyDepth + 0.012]} castShadow receiveShadow>
            <boxGeometry args={[phoneWidth, phoneHeight, 0.008]} />
            {texture ? (
              <meshBasicMaterial
                key={texture.uuid}
                map={texture}
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial color="#090d16" />
            )}
          </mesh>

          {/* Dynamic Island Pill Cutout on Top */}
          <mesh position={[0, phoneHeight / 2 - 0.06, bodyDepth + 0.018]}>
            <capsuleGeometry args={[0.02, 0.08, 8, 16]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>

        {/* Plaque */}
        <group position={[0, -phoneHeight / 2 - 0.24, 0.035]}>
          <mesh
            castShadow
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[0.92, 0.315, 0.018]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#030712'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh
            position={[0, 0, 0.011]}
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[0.88, 0.275]} />
            <meshBasicMaterial map={plaqueTexture} />
          </mesh>
        </group>
      </group>
    )
  }

  // 3. CINEMA SCREEN (Widescreen Floating Studio Panel for 3D/CGI Animations)
  if (displayType === 'cinema_screen') {
    const bezel = 0.025
    const bodyDepth = 0.035
    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        <group
          userData={{ interactableId: artwork.id }}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Matte Dark Gunmetal Chassis */}
          <mesh position={[0, 0, bodyDepth / 2 + 0.01]} castShadow receiveShadow>
            <boxGeometry args={[width + bezel * 2, height + bezel * 2, bodyDepth]} />
            <meshStandardMaterial color="#09090b" roughness={0.5} metalness={0.6} />
          </mesh>

          {/* Screen (Glare-Free Digital Reproduction / Video Reel) */}
          <mesh position={[0, 0, bodyDepth + 0.012]} castShadow receiveShadow>
            <boxGeometry args={[width, height, 0.008]} />
            {videoTexture || texture ? (
              <meshBasicMaterial
                key={(videoTexture || texture)!.uuid}
                map={videoTexture || texture}
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial color="#0a0a0a" />
            )}
          </mesh>

          {/* Video Cinema Status Indicator LED */}
          {artwork.videoUrl && (
            <mesh position={[0, -height / 2 - bezel / 2, bodyDepth + 0.013]}>
              <sphereGeometry args={[0.014, 16, 16]} />
              <meshBasicMaterial color={videoTexture ? '#38bdf8' : '#e11d48'} toneMapped={false} />
            </mesh>
          )}
        </group>

        {/* Plaque */}
        <group position={[0, -height / 2 - 0.26, 0.035]}>
          <mesh
            castShadow
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <boxGeometry args={[1.00, 0.34, 0.018]} />
            <meshStandardMaterial
              color={isHighlighted ? '#1e293b' : '#030712'}
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
          <mesh
            position={[0, 0, 0.011]}
            onClick={handleItemClick}
            onPointerOver={(e) => {
              e.stopPropagation()
              if (isNearest) {
                setHovered(true)
                document.body.style.cursor = 'pointer'
              }
            }}
            onPointerOut={() => {
              setHovered(false)
              document.body.style.cursor = 'auto'
            }}
          >
            <planeGeometry args={[0.96, 0.30]} />
            <meshBasicMaterial map={plaqueTexture} />
          </mesh>
        </group>
      </group>
    )
  }

  // 4. VIDEO WALL (Monumental Minimalist Manifesto & Identity Cartel for Gran Atrio Central)
  if (displayType === 'video_wall') {
    const frameBorder = 0.05
    const frameDepth = 0.04
    const activeTexture = videoTexture || landresCartelTexture || texture
    return (
      <group position={artwork.position} rotation={artwork.rotation}>
        <group
          userData={{ interactableId: artwork.id }}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          {/* Sleek Minimalist Dark Titanium Casing Frame */}
          <mesh position={[0, 0, frameDepth * 0.4]} castShadow receiveShadow>
            <boxGeometry args={[width + frameBorder * 2, height + frameBorder * 2, frameDepth * 0.7]} />
            <meshStandardMaterial color="#0f172a" roughness={0.22} metalness={0.92} />
          </mesh>

          {/* Architectural Cyan Reveal Accent Strip */}
          <mesh position={[0, 0, frameDepth * 0.58]}>
            <boxGeometry args={[width + 0.02, height + 0.02, 0.008]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.8} />
          </mesh>

          {/* High-DPI Minimalist Manifesto Cartel Surface */}
          <mesh position={[0, 0, frameDepth * 0.7]} castShadow receiveShadow>
            <boxGeometry args={[width, height, 0.02]} />
            {activeTexture ? (
              <meshBasicMaterial
                key={activeTexture.uuid}
                map={activeTexture}
                toneMapped={false}
              />
            ) : (
              <meshStandardMaterial color="#0f172a" />
            )}
          </mesh>
        </group>
      </group>
    )
  }

  // 5. CLASSIC FRAME (Fine Art Picture Frame for Graphic Design & Photo Editing)
  const frameBorder = 0.14
  const frameDepth = 0.10
  return (
    <group position={artwork.position} rotation={artwork.rotation}>
      <group
        userData={{ interactableId: artwork.id }}
        onClick={handleItemClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          if (isNearest) {
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        {/* Frame Backboard (dark smoked oak backing, safely inset within the gold frame channel) */}
        <mesh position={[0, 0, 0.015]} castShadow receiveShadow>
          <boxGeometry args={[width + frameBorder, height + frameBorder, 0.02]} />
          <meshStandardMaterial
            color="#292524"
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>

        {/* 4-Piece 3D Outer Molding Bars in Brushed Gold (Definitive outer casing, zero coplanar overlap) */}
        <mesh position={[0, height / 2 + frameBorder / 2, frameDepth * 0.5]} castShadow>
          <boxGeometry args={[width + frameBorder * 2, frameBorder, frameDepth]} />
          <meshStandardMaterial
            color={isHighlighted ? '#e5c158' : '#d4af37'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, -height / 2 - frameBorder / 2, frameDepth * 0.5]} castShadow>
          <boxGeometry args={[width + frameBorder * 2, frameBorder, frameDepth]} />
          <meshStandardMaterial
            color={isHighlighted ? '#e5c158' : '#d4af37'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[-width / 2 - frameBorder / 2, 0, frameDepth * 0.5]} castShadow>
          <boxGeometry args={[frameBorder, height, frameDepth]} />
          <meshStandardMaterial
            color={isHighlighted ? '#e5c158' : '#d4af37'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[width / 2 + frameBorder / 2, 0, frameDepth * 0.5]} castShadow>
          <boxGeometry args={[frameBorder, height, frameDepth]} />
          <meshStandardMaterial
            color={isHighlighted ? '#e5c158' : '#d4af37'}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* Ivory Museum Archival Mat Board (Passe-Partout) */}
        <mesh position={[0, 0, 0.038]} receiveShadow>
          <boxGeometry args={[width + 0.10, height + 0.10, 0.015]} />
          <meshStandardMaterial color="#faf7ee" roughness={0.95} />
        </mesh>

        {/* Canvas Surface - Crisp Anti-Glare Fine Art Matte Print with Pure Museum Fidelity */}
        <mesh position={[0, 0, 0.048]} castShadow receiveShadow>
          <boxGeometry args={[width, height, 0.015]} />
          {texture ? (
            <meshBasicMaterial
              key={texture.uuid}
              map={texture}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial color="#3f3f46" />
          )}
        </mesh>
      </group>

      {/* Museum Plaque with Physical Mount */}
      <group position={[0, -height / 2 - frameBorder - 0.22, frameDepth * 0.5]}>
        <mesh
          castShadow
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <boxGeometry args={[0.92, 0.315, 0.02]} />
          <meshStandardMaterial
            color={isHighlighted ? '#1e293b' : '#0b1120'}
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
        <mesh
          position={[0, 0, 0.012]}
          onClick={handleItemClick}
          onPointerOver={(e) => {
            e.stopPropagation()
            if (isNearest) {
              setHovered(true)
              document.body.style.cursor = 'pointer'
            }
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
        >
          <planeGeometry args={[0.88, 0.275]} />
          <meshBasicMaterial map={plaqueTexture} />
        </mesh>
      </group>

      {/* Museum Fine Art Picture Lamp in Brushed Brass */}
      <group position={[0, height / 2 + frameBorder, frameDepth * 0.6]}>
        {/* Frame Mount Bracket */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.18, 0.04, 0.04]} />
          <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
        </mesh>
        {/* Dual Cantilever Curved Arms extending forward */}
        {[-Math.min(width * 0.22, 0.35), Math.min(width * 0.22, 0.35)].map((armX, aIdx) => (
          <group key={aIdx} position={[armX, 0.02, 0]}>
            {/* Outward arm section */}
            <mesh position={[0, 0.08, 0.16]} rotation={[0.45, 0, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.36, 12]} />
              <meshStandardMaterial color="#d4af37" metalness={0.92} roughness={0.2} />
            </mesh>
          </group>
        ))}
        {/* Horizontal Cylindrical Reflector Hood Bar */}
        <group position={[0, 0.20, 0.30]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, Math.min(width * 0.75, 1.1), 16]} />
            <meshStandardMaterial color="#d4af37" metalness={0.94} roughness={0.18} />
          </mesh>
          {/* Decorative end caps */}
          {[-Math.min(width * 0.75, 1.1) / 2, Math.min(width * 0.75, 1.1) / 2].map((capX, cIdx) => (
            <mesh key={cIdx} position={[capX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.015, 16]} />
              <meshStandardMaterial color="#d4af37" metalness={0.96} roughness={0.15} />
            </mesh>
          ))}
          {/* Downward Warm Diffuser Glow Slit */}
          <mesh position={[0, -0.025, 0]}>
            <boxGeometry args={[Math.min(width * 0.72, 1.05), 0.004, 0.018]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
