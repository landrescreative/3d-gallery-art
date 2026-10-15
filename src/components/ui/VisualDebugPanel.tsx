import React, { useState, useCallback, useEffect } from 'react'
import {
  Sliders,
  Sun,
  Moon,
  Copy,
  Check,
  RotateCcw,
  Eye,
  Layers,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  CloudSun,
  Camera,
  Compass,
  Palette
} from 'lucide-react'
import { VisualConfig } from '../../types/visualSettings'
import {
  HDRI_OPTIONS,
  PRESETS_MAP,
  formatConfigForAntigravity,
  DEFAULT_VISUAL_CONFIG
} from '../../data/visualPresets'

interface VisualDebugPanelProps {
  config: VisualConfig
  onChange: (config: VisualConfig) => void
  onReset: () => void
  isOpen: boolean
  onClose: () => void
}

type TabType = 'presets' | 'hdri' | 'sun' | 'ambient' | 'fog_cam' | 'materials'

export const VisualDebugPanel: React.FC<VisualDebugPanelProps> = ({
  config,
  onChange,
  onReset,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('presets')
  const [isMinimized, setIsMinimized] = useState(false)
  const [copiedType, setCopiedType] = useState<'prompt' | 'json' | null>(null)

  // Exit pointer lock when panel opens so the cursor is free
  useEffect(() => {
    if (isOpen && document.pointerLockElement) {
      try {
        document.exitPointerLock()
      } catch {}
    }
  }, [isOpen])

  // Helper to update specific fields and mark preset as 'personalizado' unless explicitly selecting preset
  const updateField = useCallback(
    <K extends keyof VisualConfig>(key: K, value: VisualConfig[K]) => {
      onChange({
        ...config,
        [key]: value,
        activePreset: 'personalizado'
      })
    },
    [config, onChange]
  )

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESETS_MAP[presetKey]
    if (preset) {
      onChange({ ...preset })
    }
  }

  const handleCopyPrompt = async () => {
    try {
      const text = formatConfigForAntigravity(config)
      await navigator.clipboard.writeText(text)
      setCopiedType('prompt')
      setTimeout(() => setCopiedType(null), 2500)
    } catch (err) {
      console.warn('Error al copiar al portapapeles', err)
    }
  }

  const handleCopyJson = async () => {
    try {
      const text = JSON.stringify(config, null, 2)
      await navigator.clipboard.writeText(text)
      setCopiedType('json')
      setTimeout(() => setCopiedType(null), 2500)
    } catch (err) {
      console.warn('Error al copiar al portapapeles', err)
    }
  }

  if (!isOpen) return null

  // Stop pointer events propagation to prevent canvas lock or player movement
  const stopEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation()
  }

  return (
    <aside
      className={`visual-debug-panel ${isMinimized ? 'minimized' : ''}`}
      onClick={stopEvent}
      onMouseDown={stopEvent}
      onKeyDown={stopEvent}
      role="region"
      aria-label="Panel de Ajustes de Iluminación y Render"
    >
      {/* Header */}
      <div className="debug-header">
        <div className="debug-title-wrap">
          <Sliders size={16} className="debug-icon-accent" />
          <h2 className="debug-title">Ajustes Visuales & Luces</h2>
          <span className="debug-preset-badge">
            {config.activePreset === 'personalizado'
              ? 'Personalizado'
              : config.activePreset.toUpperCase()}
          </span>
        </div>

        <div className="debug-header-actions">
          <button
            className={`debug-header-btn ${copiedType === 'prompt' ? 'copied' : ''}`}
            onClick={handleCopyPrompt}
            title="Copiar ajustes formateados para Antigravity"
          >
            {copiedType === 'prompt' ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedType === 'prompt' ? '¡Copiado!' : 'Copiar'}</span>
          </button>

          <button
            className="debug-header-icon-btn"
            onClick={() => setIsMinimized((prev) => !prev)}
            title={isMinimized ? 'Expandir Panel' : 'Minimizar a Barra Rápida'}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>

          <button
            className="debug-header-icon-btn close-btn"
            onClick={onClose}
            title="Cerrar Panel (V)"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Minimized Quick Bar */}
      {isMinimized ? (
        <div className="debug-minimized-bar">
          <div className="quick-field">
            <span className="quick-label">Preset:</span>
            <select
              value={config.activePreset}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="debug-select compact"
            >
              <option value="noche">Noche Minimalista</option>
              <option value="galeria">Galería Luminosa</option>
              <option value="atardecer">Atardecer Dorado</option>
              <option value="ciudad">Ciudad Moderna</option>
              <option value="nordico">Estudio Nórdico</option>
              {config.activePreset === 'personalizado' && (
                <option value="personalizado">Personalizado</option>
              )}
            </select>
          </div>

          <div className="quick-field">
            <span className="quick-label">Sol: {config.sunIntensity.toFixed(1)}</span>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={config.sunIntensity}
              onChange={(e) => updateField('sunIntensity', parseFloat(e.target.value))}
            />
          </div>

          <div className="quick-field">
            <span className="quick-label">HDRI Rot: {Math.round(config.hdriRotationY)}°</span>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={config.hdriRotationY}
              onChange={(e) => updateField('hdriRotationY', parseFloat(e.target.value))}
            />
          </div>

          <div className="quick-field">
            <span className="quick-label">Exposición: {config.exposure.toFixed(2)}</span>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={config.exposure}
              onChange={(e) => updateField('exposure', parseFloat(e.target.value))}
            />
          </div>

          <button
            className={`debug-btn-primary compact ${copiedType === 'prompt' ? 'copied' : ''}`}
            onClick={handleCopyPrompt}
          >
            {copiedType === 'prompt' ? <Check size={13} /> : <Copy size={13} />}
            <span>Copiar para AI</span>
          </button>
        </div>
      ) : (
        /* Full Expanded Panel */
        <>
          {/* Navigation Tabs */}
          <nav className="debug-tabs">
            <button
              className={`debug-tab ${activeTab === 'presets' ? 'active' : ''}`}
              onClick={() => setActiveTab('presets')}
            >
              <Sparkles size={13} />
              <span>Presets</span>
            </button>
            <button
              className={`debug-tab ${activeTab === 'hdri' ? 'active' : ''}`}
              onClick={() => setActiveTab('hdri')}
            >
              <Compass size={13} />
              <span>HDRI</span>
            </button>
            <button
              className={`debug-tab ${activeTab === 'sun' ? 'active' : ''}`}
              onClick={() => setActiveTab('sun')}
            >
              <Sun size={13} />
              <span>Sol</span>
            </button>
            <button
              className={`debug-tab ${activeTab === 'ambient' ? 'active' : ''}`}
              onClick={() => setActiveTab('ambient')}
            >
              <Layers size={13} />
              <span>Ambiente</span>
            </button>
            <button
              className={`debug-tab ${activeTab === 'fog_cam' ? 'active' : ''}`}
              onClick={() => setActiveTab('fog_cam')}
            >
              <Camera size={13} />
              <span>Cámara/Niebla</span>
            </button>
            <button
              className={`debug-tab ${activeTab === 'materials' ? 'active' : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              <Palette size={13} />
              <span>Materiales</span>
            </button>
          </nav>

          {/* Tab Content Body */}
          <div className="debug-body">
            {/* 1. PRESETS TAB */}
            {activeTab === 'presets' && (
              <div className="debug-tab-content">
                <p className="debug-section-desc">
                  Selecciona una atmósfera predefinida o modifícala libremente en las demás pestañas:
                </p>

                <div className="presets-grid">
                  <button
                    className={`preset-card ${config.activePreset === 'noche' ? 'active' : ''}`}
                    onClick={() => handleApplyPreset('noche')}
                  >
                    <div className="preset-card-header">
                      <Moon size={16} />
                      <span className="preset-name">Noche Minimalista</span>
                    </div>
                    <span className="preset-desc">
                      Cielo estrellado, luna sutil, iluminación arquitectónica tenue y elegante.
                    </span>
                  </button>

                  <button
                    className={`preset-card ${config.activePreset === 'galeria' ? 'active' : ''}`}
                    onClick={() => handleApplyPreset('galeria')}
                  >
                    <div className="preset-card-header">
                      <Sun size={16} />
                      <span className="preset-name">Galería Luminosa</span>
                    </div>
                    <span className="preset-desc">
                      Luz natural radiante, vista al parque, tonos blancos neutros de museo.
                    </span>
                  </button>

                  <button
                    className={`preset-card ${config.activePreset === 'atardecer' ? 'active' : ''}`}
                    onClick={() => handleApplyPreset('atardecer')}
                  >
                    <div className="preset-card-header">
                      <CloudSun size={16} />
                      <span className="preset-name">Atardecer Dorado</span>
                    </div>
                    <span className="preset-desc">
                      Golden hour cálido, sol rasante ambarino y reflejos dorados en el piso.
                    </span>
                  </button>

                  <button
                    className={`preset-card ${config.activePreset === 'ciudad' ? 'active' : ''}`}
                    onClick={() => handleApplyPreset('ciudad')}
                  >
                    <div className="preset-card-header">
                      <Compass size={16} />
                      <span className="preset-name">Ciudad Moderna</span>
                    </div>
                    <span className="preset-desc">
                      Vista urbana a rascacielos y atmósfera contemporánea refinada.
                    </span>
                  </button>

                  <button
                    className={`preset-card ${config.activePreset === 'nordico' ? 'active' : ''}`}
                    onClick={() => handleApplyPreset('nordico')}
                  >
                    <div className="preset-card-header">
                      <Sparkles size={16} />
                      <span className="preset-name">Estudio Nórdico</span>
                    </div>
                    <span className="preset-desc">
                      Tonos fríos desaturados, blanco suave, contraste nítido y balance escandinavo.
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. HDRI & ENVIRONMENT TAB */}
            {activeTab === 'hdri' && (
              <div className="debug-tab-content">
                <div className="debug-control-group">
                  <label className="debug-label">Mapa de Entorno HDRI (360° IBL):</label>
                  <select
                    value={config.hdriPath}
                    onChange={(e) => updateField('hdriPath', e.target.value)}
                    className="debug-select"
                  >
                    {HDRI_OPTIONS.map((opt) => (
                      <option key={opt.path} value={opt.path}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Rotación del HDRI (Horizonte):</label>
                    <span className="debug-val">{Math.round(config.hdriRotationY)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={config.hdriRotationY}
                    onChange={(e) => updateField('hdriRotationY', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                  <div className="slider-ticks">
                    <button
                      className="tick-btn"
                      onClick={() => updateField('hdriRotationY', 0)}
                    >
                      0° (Norte)
                    </button>
                    <button
                      className="tick-btn"
                      onClick={() => updateField('hdriRotationY', 153)}
                    >
                      153° (Ventanal Sur)
                    </button>
                    <button
                      className="tick-btn"
                      onClick={() => updateField('hdriRotationY', 270)}
                    >
                      270° (Oeste)
                    </button>
                  </div>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Intensidad Reflejos IBL (Objetos y Piso):</label>
                    <span className="debug-val">{config.hdriIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="2.5"
                    step="0.05"
                    value={config.hdriIntensity}
                    onChange={(e) => updateField('hdriIntensity', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Intensidad Fondo Exterior (Cielo):</label>
                    <span className="debug-val">{config.hdriBackgroundIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="2.5"
                    step="0.05"
                    value={config.hdriBackgroundIntensity}
                    onChange={(e) =>
                      updateField('hdriBackgroundIntensity', parseFloat(e.target.value))
                    }
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Desenfoque del Fondo (Bokeh):</label>
                    <span className="debug-val">{(config.hdriBlur * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.8"
                    step="0.02"
                    value={config.hdriBlur}
                    onChange={(e) => updateField('hdriBlur', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group inline-toggle">
                  <label className="debug-label">Mostrar Cielo de Fondo:</label>
                  <input
                    type="checkbox"
                    checked={config.showBackground}
                    onChange={(e) => updateField('showBackground', e.target.checked)}
                    className="debug-checkbox"
                  />
                </div>
              </div>
            )}

            {/* 3. SUN & SHADOWS TAB */}
            {activeTab === 'sun' && (
              <div className="debug-tab-content">
                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Intensidad Luz Solar Principal:</label>
                    <span className="debug-val">{config.sunIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="5.0"
                    step="0.1"
                    value={config.sunIntensity}
                    onChange={(e) => updateField('sunIntensity', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group color-row">
                  <label className="debug-label">Color de Luz Solar:</label>
                  <div className="color-picker-wrap">
                    <input
                      type="color"
                      value={config.sunColor}
                      onChange={(e) => updateField('sunColor', e.target.value)}
                      className="debug-color-input"
                    />
                    <span className="debug-color-code">{config.sunColor}</span>
                  </div>
                </div>

                <div className="debug-section-separator">
                  <span>Posición del Sol en el Espacio (X, Y, Z)</span>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Posición X (Este - Oeste):</label>
                    <span className="debug-val">{config.sunPosX.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="25"
                    step="0.5"
                    value={config.sunPosX}
                    onChange={(e) => updateField('sunPosX', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Altura Y (Ángulo Solar):</label>
                    <span className="debug-val">{config.sunPosY.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="0.5"
                    value={config.sunPosY}
                    onChange={(e) => updateField('sunPosY', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Posición Z (Norte - Sur):</label>
                    <span className="debug-val">{config.sunPosZ.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range"
                    min="-25"
                    max="35"
                    step="0.5"
                    value={config.sunPosZ}
                    onChange={(e) => updateField('sunPosZ', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                  <span className="field-hint">
                    +26m proyecta luz solar a través del nuevo ventanal de cristal del ala sur.
                  </span>
                </div>

                <div className="debug-control-group inline-toggle">
                  <label className="debug-label">Proyectar Sombras en Tiempo Real:</label>
                  <input
                    type="checkbox"
                    checked={config.castShadow}
                    onChange={(e) => updateField('castShadow', e.target.checked)}
                    className="debug-checkbox"
                  />
                </div>
              </div>
            )}

            {/* 4. AMBIENT & ROOMS TAB */}
            {activeTab === 'ambient' && (
              <div className="debug-tab-content">
                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Intensidad Luz Ambiental:</label>
                    <span className="debug-val">{config.ambientIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.5"
                    step="0.02"
                    value={config.ambientIntensity}
                    onChange={(e) => updateField('ambientIntensity', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group color-row">
                  <label className="debug-label">Color Luz Ambiental:</label>
                  <div className="color-picker-wrap">
                    <input
                      type="color"
                      value={config.ambientColor}
                      onChange={(e) => updateField('ambientColor', e.target.value)}
                      className="debug-color-input"
                    />
                    <span className="debug-color-code">{config.ambientColor}</span>
                  </div>
                </div>

                <div className="debug-section-separator">
                  <span>Rebote Hemisférico (Cielo & Suelo)</span>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Intensidad Hemisférica:</label>
                    <span className="debug-val">{config.hemiIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.2"
                    step="0.02"
                    value={config.hemiIntensity}
                    onChange={(e) => updateField('hemiIntensity', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group color-row">
                  <label className="debug-label">Color de Rebote Suelo:</label>
                  <div className="color-picker-wrap">
                    <input
                      type="color"
                      value={config.hemiGroundColor}
                      onChange={(e) => updateField('hemiGroundColor', e.target.value)}
                      className="debug-color-input"
                    />
                    <span className="debug-color-code">{config.hemiGroundColor}</span>
                  </div>
                </div>

                <div className="debug-section-separator">
                  <span>Luces Interiores de Galería & Salas</span>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Relleno Luminoso de Techos (Point Lights):</label>
                    <span className="debug-val">{config.fillIntensity.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="2.5"
                    step="0.05"
                    value={config.fillIntensity}
                    onChange={(e) => updateField('fillIntensity', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Tragaluz Sala 3D & Escultura:</label>
                    <span className="debug-val">{config.skylight3DIntensity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="3.0"
                    step="0.1"
                    value={config.skylight3DIntensity}
                    onChange={(e) =>
                      updateField('skylight3DIntensity', parseFloat(e.target.value))
                    }
                    className="debug-slider"
                  />
                </div>
              </div>
            )}

            {/* 5. FOG & CAMERA TAB */}
            {activeTab === 'fog_cam' && (
              <div className="debug-tab-content">
                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Exposición del Render (Exposure):</label>
                    <span className="debug-val">{config.exposure.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.2"
                    step="0.02"
                    value={config.exposure}
                    onChange={(e) => updateField('exposure', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                  <span className="field-hint">
                    Ajusta el brillo global cinematográfico con mapeo de tonos ACES Filmic.
                  </span>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Campo de Visión (Cámara FOV):</label>
                    <span className="debug-val">{Math.round(config.fov)}°</span>
                  </div>
                  <input
                    type="range"
                    min="55"
                    max="90"
                    step="1"
                    value={config.fov}
                    onChange={(e) => updateField('fov', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-section-separator">
                  <span>Atmósfera & Niebla Interior</span>
                </div>

                <div className="debug-control-group inline-toggle">
                  <label className="debug-label">Activar Niebla de Profundidad:</label>
                  <input
                    type="checkbox"
                    checked={config.fogEnabled}
                    onChange={(e) => updateField('fogEnabled', e.target.checked)}
                    className="debug-checkbox"
                  />
                </div>

                {config.fogEnabled && (
                  <>
                    <div className="debug-control-group color-row">
                      <label className="debug-label">Color de la Niebla:</label>
                      <div className="color-picker-wrap">
                        <input
                          type="color"
                          value={config.fogColor}
                          onChange={(e) => updateField('fogColor', e.target.value)}
                          className="debug-color-input"
                        />
                        <span className="debug-color-code">{config.fogColor}</span>
                      </div>
                    </div>

                    <div className="debug-control-group">
                      <div className="debug-label-row">
                        <label className="debug-label">Distancia Inicial de Niebla (Near):</label>
                        <span className="debug-val">{Math.round(config.fogNear)}m</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        step="2"
                        value={config.fogNear}
                        onChange={(e) => updateField('fogNear', parseFloat(e.target.value))}
                        className="debug-slider"
                      />
                    </div>

                    <div className="debug-control-group">
                      <div className="debug-label-row">
                        <label className="debug-label">Distancia Final de Niebla (Far):</label>
                        <span className="debug-val">{Math.round(config.fogFar)}m</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="220"
                        step="5"
                        value={config.fogFar}
                        onChange={(e) => updateField('fogFar', parseFloat(e.target.value))}
                        className="debug-slider"
                      />
                      <span className="field-hint">
                        Valores &gt; 120m permiten ver con total nitidez el horizonte exterior.
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 6. PBR MATERIALS TAB */}
            {activeTab === 'materials' && (
              <div className="debug-tab-content">
                <div className="debug-section-separator">
                  <span>Piso de Parquet de Madera Escandinavo</span>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Rugosidad del Piso (Roughness):</label>
                    <span className="debug-val">{config.floorRoughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.04"
                    max="0.65"
                    step="0.02"
                    value={config.floorRoughness}
                    onChange={(e) => updateField('floorRoughness', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                  <span className="field-hint">
                    Menor rugosidad = mayor reflejo especular tipo barniz brillante / espejo.
                  </span>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Metalicidad del Piso (Fresnel Sheen):</label>
                    <span className="debug-val">{config.floorMetalness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.30"
                    step="0.01"
                    value={config.floorMetalness}
                    onChange={(e) => updateField('floorMetalness', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                </div>

                <div className="debug-section-separator">
                  <span>Muro Cortina de Cristal & Balustradas</span>
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Transmisión del Cristal (Transparencia):</label>
                    <span className="debug-val">{(config.glassTransmission * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.02"
                    value={config.glassTransmission}
                    onChange={(e) =>
                      updateField('glassTransmission', parseFloat(e.target.value))
                    }
                    className="debug-slider"
                  />
                </div>

                <div className="debug-control-group">
                  <div className="debug-label-row">
                    <label className="debug-label">Rugosidad del Cristal:</label>
                    <span className="debug-val">{config.glassRoughness.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.20"
                    step="0.01"
                    value={config.glassRoughness}
                    onChange={(e) => updateField('glassRoughness', parseFloat(e.target.value))}
                    className="debug-slider"
                  />
                  <span className="field-hint">
                    0.00 = cristal totalmente pulido, 0.15 = cristal esmerilado mate.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <footer className="debug-footer">
            <div className="debug-footer-actions">
              <button
                className={`debug-btn-primary ${copiedType === 'prompt' ? 'copied' : ''}`}
                onClick={handleCopyPrompt}
                title="Copia los parámetros con el prompt listo para pegarlo al asistente"
              >
                {copiedType === 'prompt' ? <Check size={14} /> : <Copy size={14} />}
                <span>
                  {copiedType === 'prompt' ? '¡Copiado para el Chat!' : 'Copiar para Antigravity'}
                </span>
              </button>

              <button
                className={`debug-btn-secondary ${copiedType === 'json' ? 'copied' : ''}`}
                onClick={handleCopyJson}
                title="Copiar solo el objeto JSON"
              >
                <span>{copiedType === 'json' ? 'JSON Copiado' : 'Copiar JSON'}</span>
              </button>

              <button
                className="debug-btn-reset"
                onClick={onReset}
                title="Restablecer todos los ajustes a los valores por defecto"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>
          </footer>
        </>
      )}
    </aside>
  )
}
