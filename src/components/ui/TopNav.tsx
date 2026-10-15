import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Moon,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Square,
  ArrowRight,
  ArrowLeft,
  Activity,
  Sun,
  Sliders,
  Maximize,
  Minimize
} from 'lucide-react'
import { Artwork, Sculpture, LightingMode, GraphicsQuality } from '../../types/gallery'
import { audioManager } from '../../utils/audio'

interface TopNavProps {
  lightingMode: LightingMode
  onLightingChange: (mode: LightingMode) => void
  graphicsQuality: GraphicsQuality
  onGraphicsChange: (quality: GraphicsQuality) => void
  isTouring: boolean
  onToggleTour: () => void
  onNextTourItem: () => void
  onPrevTourItem?: () => void
  tourIndex: number
  totalTourItems: number
  currentTourItem?: Artwork | Sculpture | null
  showDebugPanel?: boolean
  onToggleDebugPanel?: () => void
}

export const TopNav: React.FC<TopNavProps> = ({
  lightingMode,
  onLightingChange,
  graphicsQuality,
  onGraphicsChange,
  isTouring,
  onToggleTour,
  onNextTourItem,
  onPrevTourItem,
  tourIndex,
  totalTourItems,
  currentTourItem,
  showDebugPanel,
  onToggleDebugPanel
}) => {
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState(() => audioManager.getIsPlaying())
  const [showHighQualityWarning, setShowHighQualityWarning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    return audioManager.subscribe((playing) => {
      setIsPlayingSoundscape(playing)
    })
  }, [])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      )
      setIsFullscreen(isFull)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [])

  const toggleSoundscape = () => {
    const playing = audioManager.toggleMute()
    setIsPlayingSoundscape(playing)
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        const root = document.documentElement
        if (root.requestFullscreen) {
          await root.requestFullscreen()
        } else if ((root as any).webkitRequestFullscreen) {
          await (root as any).webkitRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err)
    }
  }

  return (
    <>
      <header className="top-nav">
      {/* Brand */}
      <div className="nav-brand">
        <h1 className="brand-title">LANDRES <span className="brand-title-ext">CREATIVE</span></h1>
        <span className="brand-sub">Galería Virtual 3D</span>
      </div>

      {/* Center Controls: Guided Tour */}
      <div className="nav-center">
        <div className="tour-controls">
          <button
            className={`tour-btn ${isTouring ? 'active' : ''}`}
            onClick={onToggleTour}
          >
            {isTouring ? <Square size={13} /> : <Play size={13} />}
            <span>{isTouring ? 'Detener' : 'Tour Guiado'}</span>
          </button>


          {isTouring && (
            <div className="tour-stepper">
              {onPrevTourItem && (
                <button
                  className="nav-icon-btn stepper-btn"
                  onClick={onPrevTourItem}
                  title="Obra Anterior"
                >
                  <ArrowLeft size={14} />
                </button>
              )}
              <span className="tour-count">
                {tourIndex + 1} / {totalTourItems}
              </span>
              <button
                className="nav-icon-btn stepper-btn"
                onClick={onNextTourItem}
                title="Siguiente Obra"
              >
                <ArrowRight size={14} />
              </button>
              {currentTourItem && (
                <span className="tour-room-tag">
                  {'room' in currentTourItem && currentTourItem.room ? currentTourItem.room : 'Sala 3D, CGI & Escultura'}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Lighting, Audio, About */}
      <div className="nav-right">
        {/* Selector Modo Día / Modo Noche */}
        {(() => {
          const isNight = lightingMode === 'night' || lightingMode === 'dramatic'
          return (
            <div className="lighting-group" title="Modo de Iluminación">
              <button
                className={`lighting-tier-btn ${!isNight ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onLightingChange('gallery')
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Modo Día · Iluminación Natural de Galería"
                aria-label="Modo Día"
              >
                <Sun size={12} />
                <span className="tier-label">Día</span>
              </button>
              <button
                className={`lighting-tier-btn ${isNight ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onLightingChange('night')
                }}
                onMouseDown={(e) => e.stopPropagation()}
                title="Modo Noche · Iluminación Nocturna Íntima"
                aria-label="Modo Noche"
              >
                <Moon size={12} />
                <span className="tier-label">Noche</span>
              </button>
            </div>
          )
        })()}

        {/* 3 Graphics Quality Presets (Bajo / Medio / Alto) */}
        <div className="graphics-group" title="Ajuste de Calidad Gráfica & Rendimiento">
          <button
            className={`graphics-tier-btn ${graphicsQuality === 'bajo' ? 'active tier-bajo' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onGraphicsChange('bajo')
            }}
            onMouseDown={(e) => e.stopPropagation()}
            title="Calidad Baja · Para móvil o PCs poco exigentes (Máxima fluidez, sin sombras pesadas, 60 FPS)"
            aria-label="Gráficos Bajos (Móvil / Poco exigente)"
          >
            <Zap size={12} />
            <span className="tier-label">Bajo</span>
          </button>
          <button
            className={`graphics-tier-btn ${graphicsQuality === 'medio' ? 'active tier-medio' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onGraphicsChange('medio')
            }}
            onMouseDown={(e) => e.stopPropagation()}
            title="Calidad Media · Balance Óptimo (Sombras suaves, 60 FPS)"
            aria-label="Gráficos Medios"
          >
            <Activity size={12} />
            <span className="tier-label">Medio</span>
          </button>
          <button
            className={`graphics-tier-btn ${graphicsQuality === 'alto' ? 'active tier-alto' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              if (graphicsQuality !== 'alto') {
                setShowHighQualityWarning(true)
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            title="Calidad Alta · Máxima Fidelidad (Requiere GPU potente / buen dispositivo)"
            aria-label="Gráficos Altos"
          >
            <Sparkles size={12} />
            <span className="tier-label">Alto</span>
          </button>
        </div>

        <div className="nav-divider" />

        {/* Lo-Fi Background Music */}
        <button
          className={`nav-icon-btn music-btn ${isPlayingSoundscape ? 'sound-active' : ''}`}
          onClick={toggleSoundscape}
          title={isPlayingSoundscape ? 'Silenciar Música Lo-Fi' : 'Activar Música Lo-Fi de Fondo'}
          aria-label="Música Lo-Fi de Fondo"
        >
          {isPlayingSoundscape ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        {/* Pantalla Completa */}
        <button
          className={`nav-icon-btn fullscreen-btn ${isFullscreen ? 'sound-active' : ''}`}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Salir de Pantalla Completa [Esc]' : 'Modo Pantalla Completa'}
          aria-label="Pantalla Completa"
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>


        {/* Visual Calibration Debug Panel Toggle */}
        {onToggleDebugPanel && (
          <button
            className={`nav-icon-btn debug-btn ${showDebugPanel ? 'sound-active' : ''}`}
            onClick={onToggleDebugPanel}
            title="Calibrador Visual en Vivo [V]"
            aria-label="Calibrador Visual"
          >
            <Sliders size={15} />
          </button>
        )}
      </div>
    </header>

    {/* High Graphics Quality Confirmation Modal (Rendered outside header to escape pointer-events: none) */}
    {showHighQualityWarning && (
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          pointerEvents: 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          setShowHighQualityWarning(false)
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: '#0c0c0e',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
            color: '#f8fafc',
            textAlign: 'left',
            cursor: 'default',
            pointerEvents: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#facc15',
              flexShrink: 0
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
                Aviso de Rendimiento
              </h3>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Activación de Modo Gráfico Alto
              </span>
            </div>
          </div>

          <p style={{ fontSize: '13px', lineHeight: '1.55', color: '#cbd5e1', margin: '0 0 20px 0' }}>
            El modo de gráficos <strong>Alto</strong> activa sombras en tiempo real en resolución 2K, anti-aliasing completo y mayor fidelidad de renderizado.
            <br /><br />
            <strong style={{ color: '#facc15' }}>Necesitas un buen dispositivo</strong> (PC con tarjeta gráfica dedicada o procesador potente) para visualizar la galería de forma fluida y sin caídas de fotogramas.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowHighQualityWarning(false)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: '#e2e8f0',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                pointerEvents: 'auto'
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onGraphicsChange('alto')
                setShowHighQualityWarning(false)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#ffffff',
                border: 'none',
                color: '#09090b',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255,255,255,0.2)',
                pointerEvents: 'auto'
              }}
            >
              Activar Modo Alto
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)
}
