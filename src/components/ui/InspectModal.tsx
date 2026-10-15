import React, { useState, useEffect, useCallback } from 'react'
import {
  X,
  Play,
  Square,
  ExternalLink,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Film
} from 'lucide-react'
import { Artwork, Sculpture } from '../../types/gallery'
import { audioManager } from '../../utils/audio'
import { StudioOrbitInspector } from './StudioOrbitInspector'

interface InspectModalProps {
  item: Artwork | Sculpture | null
  onClose: () => void
}

export const InspectModal: React.FC<InspectModalProps> = ({ item, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [isVisualExpanded, setIsVisualExpanded] = useState(false)

  // Re-acquire pointer lock immediately on close so camera control resumes without extra click
  const handleClose = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    audioManager.stopSpeaking()
    const canvas = document.querySelector('canvas')
    if (canvas && !('ontouchstart' in window)) {
      try {
        canvas.requestPointerLock()
      } catch {}
    }
    onClose()
  }, [onClose])

  const isArtwork = item ? !('type' in item) : false
  const artwork = isArtwork ? (item as Artwork) : null
  const allImages = item ? (item.galleryImages && item.galleryImages.length > 0 
    ? item.galleryImages 
    : (item.imageUrl ? [item.imageUrl] : [])) : []
  const hasImages = allImages.length > 0

  useEffect(() => {
    setIsPlayingAudio(false)
    setActiveImageIdx(0)
    setIsVisualExpanded(false)

    // Free system cursor so the user can freely interact with the dossier
    if (document.pointerLockElement) {
      try {
        document.exitPointerLock()
      } catch {}
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle fullscreen / expanded view on F
      if (e.code === 'KeyF') {
        e.preventDefault()
        setIsVisualExpanded(prev => !prev)
        return
      }

      // Step between gallery images on ArrowLeft / ArrowRight
      if (allImages.length > 1) {
        if (e.code === 'ArrowRight') {
          e.preventDefault()
          setActiveImageIdx(prev => (prev + 1) % allImages.length)
          return
        }
        if (e.code === 'ArrowLeft') {
          e.preventDefault()
          setActiveImageIdx(prev => (prev - 1 + allImages.length) % allImages.length)
          return
        }
      }

      // Instant seamless dismiss on E, ESC, Enter, Space, or any movement key (W, A, S, D)
      if (
        e.code === 'KeyE' ||
        e.code === 'Escape' ||
        e.code === 'Enter' ||
        e.code === 'Space' ||
        e.code === 'KeyW' ||
        e.code === 'KeyA' ||
        e.code === 'KeyS' ||
        e.code === 'KeyD'
      ) {
        handleClose(e as any)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      audioManager.stopSpeaking()
    }
  }, [handleClose, allImages.length])

  if (!item) return null

  const tags: string[] = []
  if (isArtwork && artwork) {
    if (artwork.room) tags.push(artwork.room)
    if (artwork.period) tags.push(artwork.period)
  } else {
    tags.push('Sala 3D & Escultura')
    tags.push('Modelo 3D Interactivo')
  }

  const toggleAudioGuide = () => {
    if (isPlayingAudio) {
      audioManager.stopSpeaking()
      setIsPlayingAudio(false)
    } else {
      setIsPlayingAudio(true)
      const narration = `${item.title}, creada por ${item.artist} en el año ${item.year}. ${item.description}`
      audioManager.speakCuratorGuide(narration, () => {
        setIsPlayingAudio(false)
      })
    }
  }

  return (
    <div className="inspect-drawer-backdrop" onClick={handleClose}>
      <div className={`inspect-modal ${isVisualExpanded ? 'visual-expanded' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Mobile Tactile Grab Handle */}
        <div className="mobile-sheet-handle" />

        {/* Top Floating Modal Action Controls */}
        <div className="modal-actions">
          <button
            className="expand-btn"
            onClick={() => setIsVisualExpanded(!isVisualExpanded)}
            title={isVisualExpanded ? 'Restaurar panel dividido [F]' : 'Expandir visor a tamaño completo [F]'}
          >
            <span className="close-key-hint">F</span>
            {isVisualExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button className="close-btn" onClick={handleClose} title="Cerrar y reanudar exploración [E / ESC]">
            <span className="close-key-hint">ESC / E</span>
            <X size={15} />
          </button>
        </div>

        {/* Visual Presentation (3D Orbit for sculptures, high-res gallery / video for artworks) */}
        <div className="modal-visual">
          {!isArtwork ? (
            <StudioOrbitInspector sculpture={item as Sculpture} />
          ) : hasImages ? (
            <div className="image-gallery-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '12px', gap: '8px', boxSizing: 'border-box' }}>
              <div className="main-image-wrapper" style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '8px', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {artwork?.videoUrl && activeImageIdx === 0 ? (
                  <video
                    src={artwork.videoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    onPlay={() => {
                      audioManager.stopSpeaking()
                      setIsPlayingAudio(false)
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                  />
                ) : (
                  <img
                    src={allImages[activeImageIdx]}
                    alt={`${item.title} - vista ${activeImageIdx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}

                {/* Video Badge */}
                {artwork?.videoUrl && activeImageIdx === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(14, 165, 233, 0.88)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  >
                    <Film size={12} />
                    <span>REEL DE VIDEO 3D / MOTION</span>
                  </div>
                )}

                {/* Multi-image indicators and navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    {/* Image Counter Badge (when not showing video badge) */}
                    {(!artwork?.videoUrl || activeImageIdx !== 0) && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'rgba(0, 0, 0, 0.70)',
                          backdropFilter: 'blur(8px)',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.74rem',
                          color: '#ffffff',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          pointerEvents: 'none',
                          zIndex: 10
                        }}
                      >
                        {activeImageIdx + 1} / {allImages.length}
                      </div>
                    )}

                    {/* Prev Image Arrow */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length)
                      }}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s ease'
                      }}
                      title="Imagen Anterior (Flecha Izquierda)"
                      aria-label="Imagen Anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    {/* Next Image Arrow */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImageIdx((prev) => (prev + 1) % allImages.length)
                      }}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        borderRadius: '50%',
                        width: '38px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        transition: 'all 0.2s ease'
                      }}
                      title="Siguiente Imagen (Flecha Derecha)"
                      aria-label="Siguiente Imagen"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="gallery-thumbnails" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {allImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      style={{
                        position: 'relative',
                        width: '52px', height: '52px', flexShrink: 0,
                        border: idx === activeImageIdx ? '2px solid #38bdf8' : '2px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px', overflow: 'hidden', padding: 0, cursor: 'pointer',
                        background: '#111111'
                      }}
                      title={idx === 0 && artwork?.videoUrl ? 'Ver Reel de Video' : `Ver Imagen ${idx + 1}`}
                    >
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`thumbnail ${idx + 1}`} />
                      {idx === 0 && artwork?.videoUrl && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0, 0, 0, 0.45)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#38bdf8'
                        }}>
                          <Film size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="sculpture-visual-placeholder">
              <span style={{ color: '#888888', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Exhibición de Galería
              </span>
            </div>
          )}
        </div>

        {/* Dossier Information Content */}
        <div className="modal-content">
          <h2 className="title">{item.title}</h2>
          <h3 className="artist">
            {item.medium} {item.year ? `· ${item.year}` : ''}
          </h3>

          <div className="tags-container">
            {tags.map((tag, idx) => (
              <span key={idx} className="tag-badge">
                {tag}
              </span>
            ))}
          </div>

          {/* Technical Metadata Chips */}
          {(item.dimensions || (artwork && artwork.techStack)) && (
            <div className="meta-specs-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '8px 0 14px 0', fontSize: '0.78rem' }}>
              {item.dimensions && (
                <span style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}>
                  📐 {item.dimensions}
                </span>
              )}
              {artwork?.techStack && (
                <span style={{ background: 'rgba(56,189,248,0.12)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(56,189,248,0.25)' }}>
                  ⚡ {artwork.techStack}
                </span>
              )}
            </div>
          )}

          {/* Description & Curator Notes */}
          <div className="description-section">
            <p>{item.description}</p>
            {artwork?.curatorNotes && (
              <p style={{ marginTop: '10px', color: '#a0a0a0', fontStyle: 'italic', fontSize: '0.82rem', borderLeft: '2px solid #ffffff', paddingLeft: '10px' }}>
                {artwork.curatorNotes}
              </p>
            )}
          </div>

          {/* External Action Button (Web Project or YouTube Video) */}
          {artwork?.url && (
            <a
              href={artwork.url}
              target="_blank"
              rel="noopener noreferrer"
              className="visit-site-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: artwork.url.includes('youtu') 
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.22), rgba(185, 28, 28, 0.28))'
                  : 'linear-gradient(135deg, rgba(56, 189, 248, 0.16), rgba(99, 102, 241, 0.16))',
                border: artwork.url.includes('youtu')
                  ? '1px solid rgba(239, 68, 68, 0.55)'
                  : '1px solid rgba(56, 189, 248, 0.45)',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.03em',
                padding: '10px 18px',
                borderRadius: '8px',
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '12px',
                transition: 'all 0.2s ease'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <span>{artwork.url.includes('youtu') ? 'Ver Cortometraje en YouTube' : 'Visitar Proyecto Web en Vivo'}</span>
              <ExternalLink size={16} />
            </a>
          )}

          {/* Contact / Inquire Action Button */}
          <a
            href={`mailto:contacto@landrescreative.com?subject=Consulta%20desde%20Museo%20Virtual%203D%20-%20${encodeURIComponent(item.title)}`}
            className="contact-agency-btn"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#cbd5e1',
              textDecoration: 'none',
              fontSize: '0.78rem',
              padding: '9px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              transition: 'all 0.2s ease',
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            <Mail size={14} />
            <span>Consultar o Desarrollar Proyecto con Landres Creative</span>
          </a>

          {/* Audio Guide Player Bar */}
          <div className="audio-guide-box">
            <div className="guide-info">
              <div>
                <strong>Audioguía del Museo</strong>
                <span className="guide-sub">Escuchar narración del curador</span>
              </div>
            </div>
            <button
              className={`audio-play-btn ${isPlayingAudio ? 'playing' : ''}`}
              onClick={toggleAudioGuide}
              title={isPlayingAudio ? 'Detener Audioguía' : 'Reproducir Audioguía'}
            >
              {isPlayingAudio ? <Square size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
            </button>
          </div>

          {/* Actions Footer */}
          <div className="modal-footer">
            <button className="done-btn" onClick={handleClose}>
              <span>Continuar Explorando</span>
              <span className="btn-key-badge">E</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
