import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { Artwork, Sculpture } from '../../types/gallery'
import { useZoomState, zoomManager } from '../../utils/zoomState'

// Right-click mouse icon highlighting the right button
const RightClickMouseIcon: React.FC<{ size?: number; active?: boolean }> = ({
  size = 18,
  active = false
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    {/* Mouse Body Shell */}
    <rect
      x="5"
      y="2"
      width="14"
      height="20"
      rx="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Horizontal divider under the buttons */}
    <line
      x1="5"
      y1="9.5"
      x2="19"
      y2="9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Vertical divider between left and right buttons */}
    <line
      x1="12"
      y1="2"
      x2="12"
      y2="9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Right Click Button Quadrant - highlighted */}
    <path
      d="M12 2.5 H12 C15.866 2.5 18.5 5.134 18.5 9.5 H12 V2.5 Z"
      fill={active ? '#ffffff' : 'currentColor'}
      fillOpacity={active ? 1.0 : 0.65}
    />
  </svg>
)

interface HUDProps {
  nearestItem: Artwork | Sculpture | null
  onInspect: (item: Artwork | Sculpture) => void
  isLocked: boolean
  onRequestPointerLock: () => void
  isTouring: boolean
  isInspecting?: boolean
  currentTourItem?: Artwork | Sculpture | null
}

export const HUD: React.FC<HUDProps> = ({
  nearestItem,
  onInspect,
  isLocked,
  onRequestPointerLock,
  isTouring,
  isInspecting = false,
  currentTourItem
}) => {
  const isMobile = typeof window !== 'undefined' && (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 || 
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  )
  const isZoomed = useZoomState()
  const [isBadgeCollapsed, setIsBadgeCollapsed] = useState(false)

  return (
    <div className="hud-container">
      {/* Tour Audio Guide Subtitle Overlay */}
      {isTouring && currentTourItem && (
        <div
          className="hud-tour-card"
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(9, 9, 11, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '14px',
            padding: '12px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
            maxWidth: 'min(92vw, 680px)',
            textAlign: 'center',
            zIndex: 35,
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff', fontWeight: 700 }}>
              {'room' in currentTourItem && currentTourItem.room ? currentTourItem.room : 'Sala 3D, CGI & Escultura'}
            </span>
            <span style={{ fontSize: '10px', color: '#64748b' }}>•</span>
            <span style={{ fontSize: '10px', color: '#cbd5e1' }}>{currentTourItem.year}</span>
          </div>
          <strong style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 600 }}>{currentTourItem.title}</strong>
          <span style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.45', marginTop: '2px' }}>
            {currentTourItem.curatorNotes}
          </span>
          <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', letterSpacing: '0.04em' }}>
            {isMobile ? 'Toca "Detener" arriba para salir del recorrido' : 'Presiona [ESC] o "Detener" para salir del recorrido guiado'}
          </span>
        </div>
      )}
      {/* Optical Scope / Focus Frame Overlay when Zoom is active (clean lens brackets without text) */}
      {isZoomed && !isTouring && !isInspecting && (
        <div className="hud-optic-overlay">
          <div className="optic-vignette" />
          <div className="optic-frame">
            <div className="optic-bracket top-left" />
            <div className="optic-bracket top-right" />
            <div className="optic-bracket bottom-left" />
            <div className="optic-bracket bottom-right" />
          </div>
        </div>
      )}

      {/* Center Reticle / Crosshair */}
      {!isTouring && !isInspecting && (
        <div className={`hud-reticle ${nearestItem ? 'active' : ''} ${isZoomed ? 'zoomed' : ''}`}>
          <div className="reticle-dot" />
        </div>
      )}

      {/* Proximity Interaction Prompt Luxury Museum Banner */}
      {nearestItem && !isTouring && !isInspecting && (
        <div
          className="hud-proximity-card"
          onClick={() => onInspect(nearestItem)}
          role="button"
          tabIndex={0}
          title="Haz clic o presiona E para inspeccionar obra"
        >
          <div className="hud-proximity-glow" />
          {nearestItem.imageUrl && (
            <div className="hud-proximity-thumb">
              <img src={nearestItem.imageUrl} alt={nearestItem.title} />
            </div>
          )}
          <div className="hud-proximity-content">
            <div className="hud-proximity-tag">
              <span className="room-label">
                {'room' in nearestItem && nearestItem.room ? nearestItem.room : 'Sala 3D, CGI & Escultura'}
              </span>
              {nearestItem.year && <span className="year-label">• {nearestItem.year}</span>}
            </div>
            <strong className="hud-proximity-title">{nearestItem.title}</strong>
            <span className="hud-proximity-sub">{nearestItem.medium}</span>
          </div>
          <div className="hud-proximity-action">
            <span className="hud-keycap">{isMobile ? 'TAP' : 'E'}</span>
            <span className="hud-action-text">{isMobile ? 'Ver Obra' : 'Inspeccionar'}</span>
          </div>
        </div>
      )}

      {/* Floating Optical Zoom Button (Interactive for desktop and mobile) */}
      {!isTouring && !isInspecting && (
        <button
          className={`hud-zoom-btn ${isZoomed ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            zoomManager.toggleZoom()
          }}
          title={isMobile ? "Zoom Óptico 2×" : "Zoom Óptico (Click Derecho / Z)"}
          aria-label="Alternar Zoom Óptico"
        >
          <RightClickMouseIcon size={18} active={isZoomed} />
          <span className="zoom-text">{isZoomed ? 'Zoom 2×' : 'Zoom'}</span>
        </button>
      )}

      {/* Pointer Lock Hint when cursor is free and not in tour mode or inspecting, hidden if nearestItem is active to avoid overlap */}
      {!isLocked && !isTouring && !isMobile && !isInspecting && !nearestItem && (
        <div className="hud-lock-notice" onClick={onRequestPointerLock}>
          Haz click en la pantalla para explorar
        </div>
      )}

      {/* Bottom-left Controls Badge */}
      {!isMobile && (
        <div className={`hud-controls-badge ${isBadgeCollapsed ? 'collapsed' : ''}`}>
          <div className="controls-badge-header">
            <span className="controls-badge-title">Controles</span>
            <button
              className="badge-toggle-btn"
              onClick={() => setIsBadgeCollapsed((prev) => !prev)}
              title={isBadgeCollapsed ? "Mostrar controles" : "Ocultar controles"}
              aria-label="Alternar barra de controles"
            >
              {isBadgeCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
          {!isBadgeCollapsed && (
            <div className="controls-badge-grid">
              <div className="controls-row">
                <span className="key-tag">WASD</span>
                <span className="desc-text">Moverse</span>
              </div>
              <div className="controls-row">
                <span className="key-tag">Shift</span>
                <span className="desc-text">Correr</span>
              </div>
              <div className="controls-row">
                <span className="key-tag">Mouse</span>
                <span className="desc-text">Mirar</span>
              </div>
              <div className="controls-row">
                <span className="key-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <RightClickMouseIcon size={12} active={isZoomed} /> Der / Z
                </span>
                <span className="desc-text">Zoom 2×</span>
              </div>
              <div className="controls-row">
                <span className="key-tag key-highlight">E</span>
                <span className="desc-text">Inspeccionar</span>
              </div>
              <div className="controls-row">
                <span className="key-tag">H</span>
                <span className="desc-text">Ayuda</span>
              </div>
              <div className="controls-row">
                <span className="key-tag">ESC</span>
                <span className="desc-text">Menú</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

