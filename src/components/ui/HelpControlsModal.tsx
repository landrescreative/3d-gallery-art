import React, { useEffect, useState } from 'react'
import {
  X,
  HelpCircle,
  Monitor,
  Smartphone,
  Eye,
  Sliders,
  Sparkles,
  Volume2,
  Compass,
  Zap
} from 'lucide-react'

interface HelpControlsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpControlsModal: React.FC<HelpControlsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="help-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="help-modal-header">
          <div className="help-header-brand">
            <div className="help-header-icon">
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 id="help-modal-title" className="help-modal-title">
                Guía de Navegación & Controles
              </h2>
              <p className="help-modal-sub">
                Aprende a desplazarte e interactuar con el Museo Virtual 3D
              </p>
            </div>
          </div>
          <button
            className="directory-close-btn"
            onClick={onClose}
            title="Cerrar ventana [ESC]"
            aria-label="Cerrar ventana"
          >
            <span className="close-key-hint">ESC / H</span>
            <X size={16} />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="help-tabs-row">
          <button
            className={`help-tab-btn ${activeTab === 'desktop' ? 'active' : ''}`}
            onClick={() => setActiveTab('desktop')}
          >
            <Monitor size={15} />
            <span>Computadora (Teclado & Mouse)</span>
          </button>
          <button
            className={`help-tab-btn ${activeTab === 'mobile' ? 'active' : ''}`}
            onClick={() => setActiveTab('mobile')}
          >
            <Smartphone size={15} />
            <span>Móvil & Pantalla Táctil</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'desktop' ? (
          <div className="help-content-desktop">
            <div className="help-grid-controls">
              {/* Movement */}
              <div className="help-control-card">
                <div className="help-key-cluster">
                  <span className="help-kbd">W</span>
                  <div className="help-kbd-row">
                    <span className="help-kbd">A</span>
                    <span className="help-kbd">S</span>
                    <span className="help-kbd">D</span>
                  </div>
                </div>
                <div className="help-card-info">
                  <strong>Moverse por la Galería</strong>
                  <p>Camina fluidamente en cualquier dirección por todo el museo.</p>
                </div>
              </div>

              {/* Look */}
              <div className="help-control-card">
                <div className="help-mouse-icon">
                  <div className="mouse-wheel" />
                </div>
                <div className="help-card-info">
                  <strong>Mirar en 360°</strong>
                  <p>Mueve el mouse para rotar la vista. Haz clic en la pantalla para activar el puntero inmersivo.</p>
                </div>
              </div>

              {/* Run */}
              <div className="help-control-card">
                <div className="help-key-single">
                  <span className="help-kbd kbd-wide">Shift</span>
                </div>
                <div className="help-card-info">
                  <strong>Correr</strong>
                  <p>Mantén presionado mientras caminas para duplicar la velocidad de desplazamiento.</p>
                </div>
              </div>

              {/* Inspect */}
              <div className="help-control-card">
                <div className="help-key-single">
                  <span className="help-kbd kbd-glow">E</span>
                </div>
                <div className="help-card-info">
                  <strong>Inspeccionar Obra / Escultura</strong>
                  <p>Acércate a cualquier cuadro o pedestal y presiona E para abrir su dossier de arte y visor 3D.</p>
                </div>
              </div>

              {/* Optical Zoom */}
              <div className="help-control-card">
                <div className="help-key-cluster">
                  <span className="help-kbd">Click Der</span>
                  <span className="help-kbd">Z</span>
                </div>
                <div className="help-card-info">
                  <strong>Zoom Óptico 2×</strong>
                  <p>Aumenta el detalle para apreciar texturas PBR, pinceladas y acabados en alta definición.</p>
                </div>
              </div>


              {/* Visual Calibrator */}
              <div className="help-control-card">
                <div className="help-key-single">
                  <span className="help-kbd">V</span>
                </div>
                <div className="help-card-info">
                  <strong>Calibrador Visual</strong>
                  <p>Abre el panel en vivo para ajustar sol, sombras, niebla volumétrica y HDRI.</p>
                </div>
              </div>

              {/* Free Cursor */}
              <div className="help-control-card">
                <div className="help-key-single">
                  <span className="help-kbd kbd-wide">ESC</span>
                </div>
                <div className="help-card-info">
                  <strong>Liberar Cursor / Cerrar</strong>
                  <p>Libera el cursor para usar los menús o cerrar cualquier ventana emergente.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="help-content-mobile">
            <div className="help-mobile-features">
              <div className="help-mobile-card">
                <div className="help-mobile-badge">Zona Izquierda</div>
                <strong>Joystick Virtual Táctil</strong>
                <p>Toca y arrastra en la mitad izquierda de la pantalla para caminar en cualquier dirección con suavidad analógica.</p>
              </div>

              <div className="help-mobile-card">
                <div className="help-mobile-badge">Zona Derecha</div>
                <strong>Panel Táctil de Giro</strong>
                <p>Desliza un dedo por la mitad derecha de la pantalla para rotar la cámara y mirar a tu alrededor libremente.</p>
              </div>

              <div className="help-mobile-card">
                <div className="help-mobile-badge">Toque Directo</div>
                <strong>Inspección Rápida</strong>
                <p>Acércate a un cuadro o modelo 3D y toca el botón flotante "TAP" en pantalla para abrir su información.</p>
              </div>

              <div className="help-mobile-card">
                <div className="help-mobile-badge">Botón Inferior</div>
                <strong>Zoom Óptico 2×</strong>
                <p>Presiona el botón "Zoom" en la esquina inferior derecha para enfocar los detalles de la obra.</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights Footer */}
        <div className="help-features-footer">
          <div className="help-feature-pill">
            <Sparkles size={14} />
            <span>Tour Guiado con Audioguía en Español</span>
          </div>
          <div className="help-feature-pill">
            <Volume2 size={14} />
            <span>Música Lo-Fi de Fondo Adaptativa</span>
          </div>
          <div className="help-feature-pill">
            <Zap size={14} />
            <span>3 Modos Gráficos Optimizados a 60 FPS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
