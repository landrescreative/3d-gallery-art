import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { ARTWORKS, SCULPTURES } from './data/artworks'
import { Artwork, Sculpture, LightingMode, GraphicsQuality } from './types/gallery'
import { VisualConfig } from './types/visualSettings'
import { DEFAULT_VISUAL_CONFIG, PRESET_NOCHE, PRESET_GALERIA } from './data/visualPresets'
import { GalleryScene } from './components/3d/GalleryScene'
import { TopNav } from './components/ui/TopNav'
import { HUD } from './components/ui/HUD'
import { InspectModal } from './components/ui/InspectModal'
import { MobileControls } from './components/ui/MobileControls'
import { VisualDebugPanel } from './components/ui/VisualDebugPanel'
import { Preloader } from './components/ui/Preloader'
import { audioManager } from './utils/audio'

const isMobileDevice = typeof window !== 'undefined' && (
  'ontouchstart' in window || 
  navigator.maxTouchPoints > 0 || 
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
)

export const App: React.FC = () => {
  const [nearestItem, setNearestItem] = useState<Artwork | Sculpture | null>(null)
  const [selectedItem, setSelectedItem] = useState<Artwork | Sculpture | null>(null)
  const [lightingMode, setLightingMode] = useState<LightingMode>('gallery')
  
  // Visual & Lighting Debug Configuration (persisted to localStorage)
  const [visualConfig, setVisualConfig] = useState<VisualConfig>(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('gallery_visual_debug_config') : null
      if (saved) {
        const parsed = JSON.parse(saved)
        if (isMobileDevice) {
          if (parsed.hdriPath?.includes('_4k.hdr') || parsed.hdriPath === '/textures/park_scenic_1k.hdr') {
            parsed.hdriPath = '/textures/park_scenic_2k.hdr'
          }
        } else {
          if (parsed.hdriPath === '/textures/park_scenic_1k.hdr') {
            parsed.hdriPath = '/textures/park_scenic_4k.hdr'
          }
        }
        if (parsed.fov === 80) {
          parsed.fov = 70
        }
        return parsed
      }
    } catch {}
    if (isMobileDevice) {
      return {
        ...DEFAULT_VISUAL_CONFIG,
        hdriPath: '/textures/park_scenic_2k.hdr'
      }
    }
    return DEFAULT_VISUAL_CONFIG
  })

  const [showVisualDebug, setShowVisualDebug] = useState(false)

  const handleVisualConfigChange = useCallback((newConfig: VisualConfig) => {
    setVisualConfig(newConfig)
    try {
      localStorage.setItem('gallery_visual_debug_config', JSON.stringify(newConfig))
    } catch {}
  }, [])

  const handleVisualConfigReset = useCallback(() => {
    setVisualConfig(DEFAULT_VISUAL_CONFIG)
    try {
      localStorage.removeItem('gallery_visual_debug_config')
    } catch {}
  }, [])

  // Sync lightingMode toggle with visualConfig presets
  const handleLightingChange = useCallback((mode: LightingMode) => {
    setLightingMode(mode)
    if (mode === 'dramatic' || mode === 'night') {
      handleVisualConfigChange(PRESET_NOCHE)
    } else if (mode === 'gallery') {
      handleVisualConfigChange(PRESET_GALERIA)
    }
  }, [handleVisualConfigChange])

  // Graphics Quality Preset: mobile strictly defaults to 'bajo' for maximum performance
  const [graphicsQuality, setGraphicsQuality] = useState<GraphicsQuality>(() => {
    if (isMobileDevice) {
      return 'bajo'
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('gallery_graphics_quality') as GraphicsQuality | null : null
    if (saved === 'bajo' || saved === 'medio' || saved === 'alto') {
      return saved
    }
    return 'medio' // Balanced 60fps desktop default
  })

  const [teleportTarget, setTeleportTarget] = useState<[number, number, number] | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  // Toggle debug panel with 'V' shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.code === 'KeyV') {
        setShowVisualDebug((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const [isSwitchingGraphics, setIsSwitchingGraphics] = useState(false)
  const [switchingText, setSwitchingText] = useState('')

  const handleGraphicsChange = useCallback((quality: GraphicsQuality) => {
    if (quality === graphicsQuality) return

    const titles: Record<GraphicsQuality, string> = {
      bajo: 'Activando Modo Bajo · Máxima Fluidez 60 FPS',
      medio: 'Activando Modo Medio · Balance Óptimo',
      alto: 'Activando Modo Alto · Sombras 2K y MSAA'
    }

    setSwitchingText(titles[quality] || 'Cambiando modo gráfico...')
    setIsSwitchingGraphics(true)

    setGraphicsQuality(quality)
    try {
      localStorage.setItem('gallery_graphics_quality', quality)
    } catch {
      // Ignore storage errors
    }
  }, [graphicsQuality])

  const handleSwitchComplete = useCallback(() => {
    setIsSwitchingGraphics(false)
  }, [])


  // Guided Tour State
  const [isTouring, setIsTouring] = useState(false)
  const [tourIndex, setTourIndex] = useState(0)

  // Combined tour items list strictly organized room by room for smooth cinematic transitions
  // Only original creations by Landres Creative (no generic decorative procedural shapes)
  const tourItems = useMemo<(Artwork | Sculpture)[]>(() => {
    // ------------------------------------------------------------------------
    // SALA 1: Galería de Diseño Gráfico & Edición de Foto (Ala Oeste)
    // Recorrido fluido: Muro Sur -> Muro Oeste -> Muro Norte
    // ------------------------------------------------------------------------
    const graphicOrder = [
      'reflejos-poster',            // Pared Sur
      'pringles-publicidad',        // Pared Oeste
      'edicion-foto-matriciales',   // Pared Oeste
      'collage-bauhaus',            // Pared Norte
      'portada-disco-weezer'        // Pared Norte
    ]
    const graphicItems = graphicOrder
      .map(id => ARTWORKS.find(a => a.id === id))
      .filter(Boolean) as (Artwork | Sculpture)[]

    // ------------------------------------------------------------------------
    // SALA 2: Sala 3D, CGI & Escultura (Ala Norte)
    // Flujo espacial continuo: Columnata oeste -> Muro oeste -> Fondo Norte & Mesa central -> Columnata este & Muro este
    // ------------------------------------------------------------------------
    const threeDOrder = [
      'sculpture-art-toy-conejo',     // Pedestal Oeste (Z = -11)
      'sculpture-skincare-crema',     // Pedestal Oeste (Z = -13.5)
      'sculpture-aforeaventura-1',    // Pedestal Oeste (Z = -16)
      'asustar-esta-canon',           // Pared Oeste (Z = -16)
      'sculpture-aforeaventura-2',    // Pedestal Oeste (Z = -20.5)
      'casa-tonala',                  // Pantalla Norte (X = -7.5)
      'the-old-man',                  // Pantalla Central Norte (X = 0)
      'sculpture-maqueta-house-toon', // Mesa Arquitectónica Central (Z = -21.5)
      'reflejos-vfx',                 // Pantalla Norte (X = +7.5)
      'sculpture-aforeaventura-4',    // Pedestal Este (Z = -20.5)
      'sculpture-aforeaventura-3',    // Pedestal Este (Z = -16)
      'inartiva-studio',              // Pared Este (Z = -16)
      'sculpture-inartiva-chibi'      // Pedestal Este (Z = -11)
    ]
    const threeDItems = threeDOrder
      .map(id => (SCULPTURES.find(s => s.id === id) || ARTWORKS.find(a => a.id === id)))
      .filter(Boolean) as (Artwork | Sculpture)[]

    // ------------------------------------------------------------------------
    // SALA 3: Pabellón de UI/UX, Web & Plataformas (Ala Este)
    // Recorrido perimetral: Muro Norte -> Muro Este -> Muro Sur -> Mesas Interactivas Centrales
    // ------------------------------------------------------------------------
    const uiWebOrder = [
      'romero-motor',         // Muro Norte (X = 9.5)
      'remedy-pain-spine',    // Muro Norte (X = 14)
      'lifescozul-biotech',   // Muro Norte (X = 18.5)
      'next-era',             // Muro Este (Z = -5)
      'dra-neus-munoz',       // Muro Este (Z = 0)
      'autoimport-de',        // Muro Este (Z = 5)
      'analista-seo',         // Muro Sur (X = 18.5)
      'scoop-doggy',          // Muro Sur (X = 14)
      'vivavia',              // Muro Sur (X = 9.5)
      'powerkick-web',        // Mesa Central (Workstation 3D WebGL)
      'naxine',               // Mesa Central (Workstation SaaS Marketplace)
      'art-of-flavors',       // Mesa Central (Workstation Luxury Culinary)
      'veravitalize'          // Mesa Central (Workstation Cosmética Botánica)
    ]
    const uiWebItems = uiWebOrder
      .map(id => ARTWORKS.find(a => a.id === id))
      .filter(Boolean) as (Artwork | Sculpture)[]

    return [...graphicItems, ...threeDItems, ...uiWebItems]
  }, [])

  const lastClosedTime = React.useRef(0)

  const handleSelect = useCallback((item: Artwork | Sculpture) => {
    // Prevent opening modal for purely decorative sculptures or if recently closed
    if (Date.now() - lastClosedTime.current < 450) {
      return
    }
    if ('isDecorative' in item && item.isDecorative) {
      return
    }
    if (isTouring) {
      setIsTouring(false)
      audioManager.stopSpeaking()
    }
    setSelectedItem(item)
  }, [isTouring])

  const handleCloseInspect = useCallback(() => {
    lastClosedTime.current = Date.now()
    setSelectedItem(null)
    if (!isMobileDevice) {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        try {
          canvas.requestPointerLock()
        } catch {}
      }
    }
  }, [])

  const handleTeleport = useCallback((position: [number, number, number]) => {
    if (isTouring) {
      setIsTouring(false)
      audioManager.stopSpeaking()
    }
    setTeleportTarget(position)
  }, [isTouring])

  const handleTeleportComplete = useCallback(() => {
    setTeleportTarget(null)
  }, [])

  const handleToggleTour = useCallback(() => {
    setIsTouring((prev) => {
      const next = !prev
      if (!next) {
        audioManager.stopSpeaking()
        setTeleportTarget([0, 1.7, 5])
      }
      return next
    })
    setTourIndex(0)
  }, [])

  const handleNextTourItem = useCallback(() => {
    audioManager.stopSpeaking()
    setTourIndex((prev) => (prev + 1) % tourItems.length)
  }, [tourItems.length])

  const handlePrevTourItem = useCallback(() => {
    audioManager.stopSpeaking()
    setTourIndex((prev) => (prev - 1 + tourItems.length) % tourItems.length)
  }, [tourItems.length])

  const handleTourItemReached = useCallback((_item: Artwork | Sculpture) => {
    // Optional: hook for analytics or subtitle toast
  }, [])

  // Cancel tour, speech, and return to spawn point on ESC
  useEffect(() => {
    if (!isTouring) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setIsTouring(false)
        audioManager.stopSpeaking()
        setTeleportTarget([0, 1.7, 5])
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isTouring])

  // Sync pointer lock state globally
  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsLocked(!!document.pointerLockElement)
    }
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    return () => document.removeEventListener('pointerlockchange', handlePointerLockChange)
  }, [])

  const handleRequestPointerLock = useCallback((e?: React.MouseEvent) => {
    if (e && e.button !== 0) return
    if (e) {
      const target = e.target as HTMLElement
      // Pointer lock should strictly ONLY be requested when clicking directly on the 3D canvas!
      if (target.tagName !== 'CANVAS') {
        return
      }
    }
    const canvas = document.querySelector('canvas')
    if (canvas && !selectedItem && !showVisualDebug) {
      canvas.requestPointerLock()
    }
  }, [selectedItem, showVisualDebug])

  return (
    <>
      <main className="canvas-wrap" onClick={handleRequestPointerLock}>
      {/* 3D Scene */}
      <GalleryScene
        artworks={ARTWORKS}
        sculptures={SCULPTURES}
        nearestItem={nearestItem}
        onNearestChange={setNearestItem}
        onSelect={handleSelect}
        lightingMode={lightingMode}
        graphicsQuality={graphicsQuality}
        visualConfig={visualConfig}
        isDebugging={showVisualDebug}
        teleportTarget={teleportTarget}
        onTeleportComplete={handleTeleportComplete}
        isInspecting={selectedItem !== null}
        isTouring={isTouring}
        tourIndex={tourIndex}
        tourItems={tourItems}
        onTourItemReached={handleTourItemReached}
      />

      {/* Top Header Navigation */}
      <TopNav
        lightingMode={lightingMode}
        onLightingChange={handleLightingChange}
        graphicsQuality={graphicsQuality}
        onGraphicsChange={handleGraphicsChange}
        isTouring={isTouring}
        onToggleTour={handleToggleTour}
        onNextTourItem={handleNextTourItem}
        onPrevTourItem={handlePrevTourItem}
        tourIndex={tourIndex}
        totalTourItems={tourItems.length}
        currentTourItem={tourItems[tourIndex]}
        showDebugPanel={showVisualDebug}
        onToggleDebugPanel={() => setShowVisualDebug((prev) => !prev)}
      />

      {/* Reticle, HUD and Controls */}
      <HUD
        nearestItem={nearestItem}
        onInspect={handleSelect}
        isLocked={isLocked}
        onRequestPointerLock={handleRequestPointerLock}
        isTouring={isTouring}
        isInspecting={selectedItem !== null}
        currentTourItem={tourItems[tourIndex]}
      />

      {/* Artwork / Sculpture Inspect Modal */}
      {selectedItem && (
        <InspectModal item={selectedItem} onClose={handleCloseInspect} />
      )}

      {/* Real-time Visual & Lighting Debug Panel */}
      <VisualDebugPanel
        config={visualConfig}
        onChange={handleVisualConfigChange}
        onReset={handleVisualConfigReset}
        isOpen={showVisualDebug}
        onClose={() => setShowVisualDebug(false)}
      />

      {/* Mobile Touch Controls Overlay */}
      {!selectedItem && !isTouring && <MobileControls />}
    </main>

    {/* Modern Minimalist Preloader (Initial load & mode switching) */}
    <Preloader
      isSwitching={isSwitchingGraphics}
      switchTitle={switchingText}
      onSwitchComplete={handleSwitchComplete}
    />
  </>
)
}
export default App
