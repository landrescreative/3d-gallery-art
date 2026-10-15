import { VisualConfig, HdriOption } from '../types/visualSettings'

export const HDRI_OPTIONS: HdriOption[] = [
  {
    label: 'Parque Escénico Natural (Ultra HD 4K)',
    path: '/textures/park_scenic_4k.hdr',
    description: 'Máxima resolución 4K: cielo nítido, nubes y paisaje detallado'
  },
  {
    label: 'Parque Escénico Natural (HD 2K)',
    path: '/textures/park_scenic_2k.hdr',
    description: 'Resolución 2K balanceada: rápida carga y excelente nitidez'
  },
  {
    label: 'Cielo Azul & Horizonte Despejado (Ultra HD 4K)',
    path: '/textures/clear_sky_4k.hdr',
    description: 'Cielo abierto azul brillante con horizonte panorámico 4K'
  },
  {
    label: 'Cielo Nocturno Estrellado',
    path: '/textures/dikhololo_night_1k.hdr',
    description: 'Noche despejada con luna y estrellas sutiles'
  },
  {
    label: 'Amanecer / Atardecer Dorado',
    path: '/textures/spruit_sunrise_1k.hdr',
    description: 'Luz cálida rasante, tonos ámbar y dorados'
  },
  {
    label: 'Edificios & Arquitectura Moderna',
    path: '/textures/modern_buildings_1k.hdr',
    description: 'Skyline contemporáneo y reflejos urbanos'
  }
]

export const PRESET_NOCHE: VisualConfig = {
  activePreset: 'noche',
  hdriPath: '/textures/dikhololo_night_1k.hdr',
  hdriIntensity: 0.18,
  hdriBackgroundIntensity: 1.35,
  hdriRotationY: 190,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 0.25,
  sunColor: '#93c5fd',
  sunPosX: 4,
  sunPosY: 15,
  sunPosZ: 26,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.05,
  ambientColor: '#090d16',
  hemiIntensity: 0.08,
  hemiSkyColor: '#1e293b',
  hemiGroundColor: '#020617',

  fillIntensity: 0.35,
  skylight3DIntensity: 0.15,
  roomLightColor: '#cbd5e1',

  fogEnabled: true,
  fogColor: '#030508',
  fogNear: 28,
  fogFar: 95,

  exposure: 0.65,
  fov: 70,

  floorRoughness: 0.20,
  floorMetalness: 0.05,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_GALERIA: VisualConfig = {
  activePreset: 'galeria',
  hdriPath: '/textures/park_scenic_1k.hdr',
  hdriIntensity: 0.70,
  hdriBackgroundIntensity: 1.0,
  hdriRotationY: 153,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.80,
  sunColor: '#ffffff',
  sunPosX: 4,
  sunPosY: 16,
  sunPosZ: 26,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.48,
  ambientColor: '#ffffff',
  hemiIntensity: 0.42,
  hemiSkyColor: '#f8fafc',
  hemiGroundColor: '#cbd5e1',

  fillIntensity: 1.25,
  skylight3DIntensity: 1.8,
  roomLightColor: '#ffffff',

  fogEnabled: true,
  fogColor: '#f1f5f9',
  fogNear: 50,
  fogFar: 160,

  exposure: 1.10,
  fov: 70,

  floorRoughness: 0.20,
  floorMetalness: 0.05,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_ATARDECER: VisualConfig = {
  activePreset: 'atardecer',
  hdriPath: '/textures/spruit_sunrise_1k.hdr',
  hdriIntensity: 0.65,
  hdriBackgroundIntensity: 1.0,
  hdriRotationY: 200,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.60,
  sunColor: '#fbbf24',
  sunPosX: 6,
  sunPosY: 13,
  sunPosZ: 25,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.40,
  ambientColor: '#fef3c7',
  hemiIntensity: 0.38,
  hemiSkyColor: '#fed7aa',
  hemiGroundColor: '#7c2d12',

  fillIntensity: 1.15,
  skylight3DIntensity: 1.6,
  roomLightColor: '#fef3c7',

  fogEnabled: true,
  fogColor: '#2d1508',
  fogNear: 40,
  fogFar: 135,

  exposure: 1.12,
  fov: 70,

  floorRoughness: 0.18,
  floorMetalness: 0.06,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_CIUDAD: VisualConfig = {
  activePreset: 'ciudad',
  hdriPath: '/textures/modern_buildings_1k.hdr',
  hdriIntensity: 0.60,
  hdriBackgroundIntensity: 1.0,
  hdriRotationY: 120,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.50,
  sunColor: '#f8fafc',
  sunPosX: -4,
  sunPosY: 17,
  sunPosZ: 25,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.42,
  ambientColor: '#e2e8f0',
  hemiIntensity: 0.35,
  hemiSkyColor: '#cbd5e1',
  hemiGroundColor: '#334155',

  fillIntensity: 1.0,
  skylight3DIntensity: 1.5,
  roomLightColor: '#f1f5f9',

  fogEnabled: true,
  fogColor: '#1e293b',
  fogNear: 45,
  fogFar: 140,

  exposure: 1.08,
  fov: 70,

  floorRoughness: 0.20,
  floorMetalness: 0.05,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_NORDICO: VisualConfig = {
  activePreset: 'nordico',
  hdriPath: '/textures/park_scenic_1k.hdr',
  hdriIntensity: 0.50,
  hdriBackgroundIntensity: 0.9,
  hdriRotationY: 153,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.10,
  sunColor: '#e2e8f0',
  sunPosX: 3,
  sunPosY: 18,
  sunPosZ: 24,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.45,
  ambientColor: '#f1f5f9',
  hemiIntensity: 0.38,
  hemiSkyColor: '#f8fafc',
  hemiGroundColor: '#94a3b8',

  fillIntensity: 1.0,
  skylight3DIntensity: 1.4,
  roomLightColor: '#f1f5f9',

  fogEnabled: true,
  fogColor: '#e2e8f0',
  fogNear: 50,
  fogFar: 150,

  exposure: 1.05,
  fov: 70,

  floorRoughness: 0.20,
  floorMetalness: 0.05,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const USER_PREFERRED_CONFIG: VisualConfig = {
  activePreset: 'personalizado',
  hdriPath: '/textures/park_scenic_4k.hdr',
  hdriIntensity: 0.70,
  hdriBackgroundIntensity: 0.95,
  hdriRotationY: 138,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.00,
  sunColor: '#e2e8f0',
  sunPosX: 18.5,
  sunPosY: 11.5,
  sunPosZ: 22.5,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.10,
  ambientColor: '#ffffff',
  hemiIntensity: 0.30,
  hemiSkyColor: '#f8fafc',
  hemiGroundColor: '#94a3b8',

  fillIntensity: 1.0,
  skylight3DIntensity: 1.0,
  roomLightColor: '#f1f5f9',

  fogEnabled: true,
  fogColor: '#e2e8f0',
  fogNear: 48,
  fogFar: 150,

  exposure: 0.74,
  fov: 70,

  floorRoughness: 0.20,
  floorMetalness: 0.05,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESETS_MAP: Record<string, VisualConfig> = {
  personalizado: USER_PREFERRED_CONFIG,
  noche: PRESET_NOCHE,
  galeria: PRESET_GALERIA,
  atardecer: PRESET_ATARDECER,
  ciudad: PRESET_CIUDAD,
  nordico: PRESET_NORDICO
}

export const DEFAULT_VISUAL_CONFIG = USER_PREFERRED_CONFIG

export function formatConfigForAntigravity(config: VisualConfig): string {
  return `### Ajustes de Iluminación y Entorno Visual Seleccionados:
- **Preset:** ${config.activePreset}
- **HDRI:** ${config.hdriPath} (Intensidad Entorno: ${config.hdriIntensity.toFixed(2)}, Fondo: ${config.hdriBackgroundIntensity.toFixed(2)}, Rotación: ${config.hdriRotationY}°)
- **Sol Principal:** Intensidad: ${config.sunIntensity.toFixed(2)}, Color: ${config.sunColor}, Posición: [${config.sunPosX.toFixed(1)}, ${config.sunPosY.toFixed(1)}, ${config.sunPosZ.toFixed(1)}]
- **Ambiente & Hemisferio:** Ambiente: ${config.ambientIntensity.toFixed(2)} (${config.ambientColor}), Cielo: ${config.hemiSkyColor}, Suelo: ${config.hemiGroundColor} (${config.hemiIntensity.toFixed(2)})
- **Luces de Sala:** Relleno Techo: ${config.fillIntensity.toFixed(2)}x, Tragaluz 3D: ${config.skylight3DIntensity.toFixed(2)}
- **Niebla & Atmósfera:** ${config.fogEnabled ? `Activa, Color: ${config.fogColor}, Rango: ${config.fogNear}m - ${config.fogFar}m` : 'Desactivada'}
- **Cámara & Exposición:** Exposición: ${config.exposure.toFixed(2)}, FOV: ${config.fov}°
- **Materiales PBR:** Piso (Rugosidad: ${config.floorRoughness.toFixed(2)}, Metalicidad: ${config.floorMetalness.toFixed(2)}), Cristal (Transmisión: ${config.glassTransmission.toFixed(2)}, Rugosidad: ${config.glassRoughness.toFixed(2)})

\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\``
}
