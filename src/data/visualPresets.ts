import { VisualConfig, HdriOption, PresetKey } from '../types/visualSettings'
import { LightingMode } from '../types/gallery'

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
  },
  {
    label: 'Crepúsculo & Ocaso Carmesí (Venecia)',
    path: '/textures/venice_sunset_1k.hdr',
    description: 'Atardecer veneciano con tonos magenta, violeta y dorados profundos'
  },
  {
    label: 'Noche Ártica & Cielo Despejado',
    path: '/textures/moonless_golf_1k.hdr',
    description: 'Noche nórdica profunda con tenue resplandor celeste en el horizonte'
  },
  {
    label: 'Paisaje de Otoño Dorado',
    path: '/textures/autumn_field_1k.hdr',
    description: 'Campos dorados otoñales con iluminación cálida y atmósfera envolvente'
  },
  {
    label: 'Estudio Fotográfico Minimalista',
    path: '/textures/studio_small_08_1k.hdr',
    description: 'Reflexiones de estudio neutro 5500K para máxima fidelidad y contraste'
  }
]

export const PRESET_GALERIA: VisualConfig = {
  activePreset: 'galeria',
  hdriPath: '/textures/park_scenic_4k.hdr',
  hdriIntensity: 0.70,
  hdriBackgroundIntensity: 1.0,
  hdriRotationY: 153,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.70,
  sunColor: '#ffffff',
  sunPosX: 4,
  sunPosY: 16,
  sunPosZ: 26,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.46,
  ambientColor: '#ffffff',
  hemiIntensity: 0.42,
  hemiSkyColor: '#f8fafc',
  hemiGroundColor: '#cbd5e1',

  fillIntensity: 1.25,
  skylight3DIntensity: 1.8,
  roomLightColor: '#ffffff',
  atriumColor: '#ffffff',
  graphicColor: '#ffffff',
  uiWebColor: '#ffffff',
  threeDColor: '#ffffff',

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

export const PRESET_MEDIODIA: VisualConfig = {
  activePreset: 'mediodia',
  hdriPath: '/textures/clear_sky_4k.hdr',
  hdriIntensity: 0.85,
  hdriBackgroundIntensity: 1.15,
  hdriRotationY: 60,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 3.20,
  sunColor: '#fffdf5',
  sunPosX: 2,
  sunPosY: 24,
  sunPosZ: 14,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.48,
  ambientColor: '#e0f2fe',
  hemiIntensity: 0.45,
  hemiSkyColor: '#bae6fd',
  hemiGroundColor: '#94a3b8',

  fillIntensity: 1.30,
  skylight3DIntensity: 2.30,
  roomLightColor: '#f0f9ff',
  atriumColor: '#fffdf7',
  graphicColor: '#f8fafc',
  uiWebColor: '#f0f9ff',
  threeDColor: '#e0f2fe',

  fogEnabled: true,
  fogColor: '#e0f2fe',
  fogNear: 55,
  fogFar: 180,

  exposure: 1.15,
  fov: 70,

  floorRoughness: 0.18,
  floorMetalness: 0.06,
  glassTransmission: 0.96,
  glassRoughness: 0.02,
  wallRoughness: 0.85
}

export const PRESET_ATARDECER: VisualConfig = {
  activePreset: 'atardecer',
  hdriPath: '/textures/spruit_sunrise_1k.hdr',
  hdriIntensity: 0.75,
  hdriBackgroundIntensity: 1.15,
  hdriRotationY: 215,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.80,
  sunColor: '#f59e0b',
  sunPosX: 14,
  sunPosY: 9,
  sunPosZ: 24,
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
  atriumColor: '#fed7aa',
  graphicColor: '#fef3c7',
  uiWebColor: '#fde68a',
  threeDColor: '#fed7aa',

  fogEnabled: true,
  fogColor: '#2d1508',
  fogNear: 38,
  fogFar: 135,

  exposure: 1.12,
  fov: 70,

  floorRoughness: 0.16,
  floorMetalness: 0.06,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_NOCHE: VisualConfig = {
  activePreset: 'noche',
  hdriPath: '/textures/dikhololo_night_1k.hdr',
  hdriIntensity: 0.22,
  hdriBackgroundIntensity: 1.40,
  hdriRotationY: 190,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 0.30,
  sunColor: '#93c5fd',
  sunPosX: 4,
  sunPosY: 16,
  sunPosZ: -18,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.06,
  ambientColor: '#090d16',
  hemiIntensity: 0.09,
  hemiSkyColor: '#1e293b',
  hemiGroundColor: '#020617',

  fillIntensity: 0.45,
  skylight3DIntensity: 0.25,
  roomLightColor: '#fff1d6',
  atriumColor: '#fff1d6',
  graphicColor: '#fef3c7',
  uiWebColor: '#e0f2fe',
  threeDColor: '#f8fafc',

  fogEnabled: true,
  fogColor: '#030508',
  fogNear: 28,
  fogFar: 95,

  exposure: 0.72,
  fov: 70,

  floorRoughness: 0.20,
  floorMetalness: 0.05,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_CIUDAD: VisualConfig = {
  activePreset: 'ciudad',
  hdriPath: '/textures/modern_buildings_1k.hdr',
  hdriIntensity: 0.72,
  hdriBackgroundIntensity: 1.10,
  hdriRotationY: 135,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.65,
  sunColor: '#f8fafc',
  sunPosX: -8,
  sunPosY: 18,
  sunPosZ: 22,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.44,
  ambientColor: '#e2e8f0',
  hemiIntensity: 0.38,
  hemiSkyColor: '#cbd5e1',
  hemiGroundColor: '#334155',

  fillIntensity: 1.15,
  skylight3DIntensity: 1.7,
  roomLightColor: '#f1f5f9',
  atriumColor: '#f1f5f9',
  graphicColor: '#e2e8f0',
  uiWebColor: '#38bdf8',
  threeDColor: '#f8fafc',

  fogEnabled: true,
  fogColor: '#1e293b',
  fogNear: 46,
  fogFar: 145,

  exposure: 1.08,
  fov: 70,

  floorRoughness: 0.19,
  floorMetalness: 0.07,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_CYBERPUNK: VisualConfig = {
  activePreset: 'cyberpunk',
  hdriPath: '/textures/modern_buildings_1k.hdr',
  hdriIntensity: 0.38,
  hdriBackgroundIntensity: 1.25,
  hdriRotationY: 280,
  hdriBlur: 0.02,
  showBackground: true,

  sunIntensity: 0.65,
  sunColor: '#06b6d4',
  sunPosX: -12,
  sunPosY: 14,
  sunPosZ: 20,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.14,
  ambientColor: '#1e1035',
  hemiIntensity: 0.25,
  hemiSkyColor: '#a855f7',
  hemiGroundColor: '#020617',

  fillIntensity: 1.40,
  skylight3DIntensity: 1.10,
  roomLightColor: '#f43f5e',
  atriumColor: '#a855f7',
  graphicColor: '#f43f5e',
  uiWebColor: '#06b6d4',
  threeDColor: '#38bdf8',

  fogEnabled: true,
  fogColor: '#0c0517',
  fogNear: 24,
  fogFar: 85,

  exposure: 0.88,
  fov: 70,

  floorRoughness: 0.14,
  floorMetalness: 0.12,
  glassTransmission: 0.96,
  glassRoughness: 0.02,
  wallRoughness: 0.85
}

export const PRESET_NORDICO: VisualConfig = {
  activePreset: 'nordico',
  hdriPath: '/textures/park_scenic_2k.hdr',
  hdriIntensity: 0.55,
  hdriBackgroundIntensity: 0.95,
  hdriRotationY: 153,
  hdriBlur: 0.04,
  showBackground: true,

  sunIntensity: 2.10,
  sunColor: '#e2e8f0',
  sunPosX: 3,
  sunPosY: 19,
  sunPosZ: 24,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.46,
  ambientColor: '#f1f5f9',
  hemiIntensity: 0.40,
  hemiSkyColor: '#f8fafc',
  hemiGroundColor: '#94a3b8',

  fillIntensity: 1.05,
  skylight3DIntensity: 1.45,
  roomLightColor: '#f8fafc',
  atriumColor: '#f8fafc',
  graphicColor: '#f1f5f9',
  uiWebColor: '#e2e8f0',
  threeDColor: '#f1f5f9',

  fogEnabled: true,
  fogColor: '#e2e8f0',
  fogNear: 48,
  fogFar: 145,

  exposure: 1.05,
  fov: 70,

  floorRoughness: 0.24,
  floorMetalness: 0.03,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_DRAMATICO: VisualConfig = {
  activePreset: 'dramatico',
  hdriPath: '/textures/dikhololo_night_1k.hdr',
  hdriIntensity: 0.14,
  hdriBackgroundIntensity: 1.10,
  hdriRotationY: 190,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.90,
  sunColor: '#fef08a',
  sunPosX: 8,
  sunPosY: 14,
  sunPosZ: 18,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.05,
  ambientColor: '#0a0a0c',
  hemiIntensity: 0.08,
  hemiSkyColor: '#18181b',
  hemiGroundColor: '#030303',

  fillIntensity: 0.50,
  skylight3DIntensity: 0.70,
  roomLightColor: '#fef08a',
  atriumColor: '#fbbf24',
  graphicColor: '#f59e0b',
  uiWebColor: '#93c5fd',
  threeDColor: '#fde047',

  fogEnabled: true,
  fogColor: '#050507',
  fogNear: 22,
  fogFar: 75,

  exposure: 0.82,
  fov: 70,

  floorRoughness: 0.22,
  floorMetalness: 0.04,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_ESTUDIO: VisualConfig = {
  activePreset: 'estudio',
  hdriPath: '/textures/modern_buildings_1k.hdr',
  hdriIntensity: 0.78,
  hdriBackgroundIntensity: 1.0,
  hdriRotationY: 90,
  hdriBlur: 0.08,
  showBackground: true,

  sunIntensity: 2.40,
  sunColor: '#ffffff',
  sunPosX: 0,
  sunPosY: 20,
  sunPosZ: 20,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.50,
  ambientColor: '#ffffff',
  hemiIntensity: 0.42,
  hemiSkyColor: '#ffffff',
  hemiGroundColor: '#cbd5e1',

  fillIntensity: 1.35,
  skylight3DIntensity: 1.90,
  roomLightColor: '#ffffff',
  atriumColor: '#ffffff',
  graphicColor: '#ffffff',
  uiWebColor: '#ffffff',
  threeDColor: '#ffffff',

  fogEnabled: true,
  fogColor: '#f8fafc',
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

export const PRESET_CREPUSCULO: VisualConfig = {
  activePreset: 'crepusculo',
  hdriPath: '/textures/venice_sunset_1k.hdr',
  hdriIntensity: 0.85,
  hdriBackgroundIntensity: 1.25,
  hdriRotationY: 260,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.90,
  sunColor: '#f43f5e',
  sunPosX: 16,
  sunPosY: 7,
  sunPosZ: 22,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.35,
  ambientColor: '#2e1065',
  hemiIntensity: 0.35,
  hemiSkyColor: '#db2777',
  hemiGroundColor: '#4c0519',

  fillIntensity: 1.20,
  skylight3DIntensity: 1.60,
  roomLightColor: '#fda4af',
  atriumColor: '#f43f5e',
  graphicColor: '#fb7185',
  uiWebColor: '#ec4899',
  threeDColor: '#e11d48',

  fogEnabled: true,
  fogColor: '#1e0521',
  fogNear: 35,
  fogFar: 125,

  exposure: 1.06,
  fov: 70,

  floorRoughness: 0.15,
  floorMetalness: 0.08,
  glassTransmission: 0.96,
  glassRoughness: 0.02,
  wallRoughness: 0.85
}

export const PRESET_AURORA: VisualConfig = {
  activePreset: 'aurora',
  hdriPath: '/textures/moonless_golf_1k.hdr',
  hdriIntensity: 0.40,
  hdriBackgroundIntensity: 1.30,
  hdriRotationY: 75,
  hdriBlur: 0.02,
  showBackground: true,

  sunIntensity: 0.45,
  sunColor: '#38bdf8',
  sunPosX: 5,
  sunPosY: 18,
  sunPosZ: -20,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.12,
  ambientColor: '#022c22',
  hemiIntensity: 0.28,
  hemiSkyColor: '#10b981',
  hemiGroundColor: '#021c17',

  fillIntensity: 0.85,
  skylight3DIntensity: 0.80,
  roomLightColor: '#34d399',
  atriumColor: '#10b981',
  graphicColor: '#2dd4bf',
  uiWebColor: '#06b6d4',
  threeDColor: '#34d399',

  fogEnabled: true,
  fogColor: '#021814',
  fogNear: 25,
  fogFar: 90,

  exposure: 0.84,
  fov: 70,

  floorRoughness: 0.18,
  floorMetalness: 0.10,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_OTONO: VisualConfig = {
  activePreset: 'otono',
  hdriPath: '/textures/autumn_field_1k.hdr',
  hdriIntensity: 0.80,
  hdriBackgroundIntensity: 1.10,
  hdriRotationY: 185,
  hdriBlur: 0.0,
  showBackground: true,

  sunIntensity: 2.85,
  sunColor: '#f59e0b',
  sunPosX: 10,
  sunPosY: 14,
  sunPosZ: 20,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.42,
  ambientColor: '#fef3c7',
  hemiIntensity: 0.40,
  hemiSkyColor: '#fed7aa',
  hemiGroundColor: '#78350f',

  fillIntensity: 1.25,
  skylight3DIntensity: 1.75,
  roomLightColor: '#fde68a',
  atriumColor: '#fed7aa',
  graphicColor: '#f59e0b',
  uiWebColor: '#fbbf24',
  threeDColor: '#d97706',

  fogEnabled: true,
  fogColor: '#2e1406',
  fogNear: 42,
  fogFar: 140,

  exposure: 1.10,
  fov: 70,

  floorRoughness: 0.17,
  floorMetalness: 0.05,
  glassTransmission: 0.96,
  glassRoughness: 0.03,
  wallRoughness: 0.85
}

export const PRESET_NOIR: VisualConfig = {
  activePreset: 'noir',
  hdriPath: '/textures/studio_small_08_1k.hdr',
  hdriIntensity: 0.60,
  hdriBackgroundIntensity: 0.85,
  hdriRotationY: 45,
  hdriBlur: 0.05,
  showBackground: true,

  sunIntensity: 3.10,
  sunColor: '#ffffff',
  sunPosX: -6,
  sunPosY: 22,
  sunPosZ: 18,
  castShadow: true,
  shadowBias: -0.0003,

  ambientIntensity: 0.08,
  ambientColor: '#000000',
  hemiIntensity: 0.18,
  hemiSkyColor: '#f8fafc',
  hemiGroundColor: '#000000',

  fillIntensity: 0.95,
  skylight3DIntensity: 1.40,
  roomLightColor: '#ffffff',
  atriumColor: '#ffffff',
  graphicColor: '#ffffff',
  uiWebColor: '#ffffff',
  threeDColor: '#ffffff',

  fogEnabled: true,
  fogColor: '#09090b',
  fogNear: 35,
  fogFar: 110,

  exposure: 0.96,
  fov: 70,

  floorRoughness: 0.12,
  floorMetalness: 0.10,
  glassTransmission: 0.96,
  glassRoughness: 0.02,
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
  atriumColor: '#ffffff',
  graphicColor: '#f1f5f9',
  uiWebColor: '#f1f5f9',
  threeDColor: '#f1f5f9',

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

export const LIGHTING_CONFIGS: Record<LightingMode, VisualConfig> = {
  gallery: PRESET_GALERIA,
  noon: PRESET_MEDIODIA,
  warm: PRESET_ATARDECER,
  night: PRESET_NOCHE,
  city: PRESET_CIUDAD,
  cyberpunk: PRESET_CYBERPUNK,
  nordic: PRESET_NORDICO,
  dramatic: PRESET_DRAMATICO,
  studio: PRESET_ESTUDIO,
  sunset_crimson: PRESET_CREPUSCULO,
  aurora: PRESET_AURORA,
  autumn: PRESET_OTONO,
  noir: PRESET_NOIR
}

export const VISUAL_PRESETS: Record<string, VisualConfig> = {
  galeria: PRESET_GALERIA,
  mediodia: PRESET_MEDIODIA,
  atardecer: PRESET_ATARDECER,
  noche: PRESET_NOCHE,
  ciudad: PRESET_CIUDAD,
  cyberpunk: PRESET_CYBERPUNK,
  nordico: PRESET_NORDICO,
  dramatico: PRESET_DRAMATICO,
  estudio: PRESET_ESTUDIO,
  crepusculo: PRESET_CREPUSCULO,
  aurora: PRESET_AURORA,
  otono: PRESET_OTONO,
  noir: PRESET_NOIR,
  personalizado: USER_PREFERRED_CONFIG
}

export const PRESETS_MAP: Record<string, VisualConfig> = VISUAL_PRESETS

export const DEFAULT_VISUAL_CONFIG = USER_PREFERRED_CONFIG

export interface LightingModeMeta {
  id: LightingMode
  presetKey: PresetKey
  label: string
  shortLabel: string
  subtitle: string
  description: string
  hdriName: string
  iconName: 'Sun' | 'SunMedium' | 'Sunset' | 'Moon' | 'Building2' | 'Zap' | 'Cloud' | 'Eye' | 'Camera' | 'Flame' | 'Sparkles' | 'Leaf' | 'Contrast'
}

export const LIGHTING_MODES_INFO: LightingModeMeta[] = [
  {
    id: 'gallery',
    presetKey: 'galeria',
    label: 'Galería Luminosa',
    shortLabel: 'Día',
    subtitle: 'Luz natural diurna · HDRI Parque',
    description: 'Iluminación diurna balanceada de museo con tonos neutros y vista panorámica al parque.',
    hdriName: 'Parque Natural 4K',
    iconName: 'Sun'
  },
  {
    id: 'noon',
    presetKey: 'mediodia',
    label: 'Mediodía Radiante',
    shortLabel: 'Mediodía',
    subtitle: 'Cielo abierto brillante · HDRI Clear Sky',
    description: 'Sol cenital radiante, sombras nítidas de alto impacto y horizonte despejado.',
    hdriName: 'Cielo Despejado 4K',
    iconName: 'SunMedium'
  },
  {
    id: 'warm',
    presetKey: 'atardecer',
    label: 'Atardecer Dorado',
    shortLabel: 'Atardecer',
    subtitle: 'Golden hour ámbar · HDRI Spruit Sunrise',
    description: 'Luz rasante cálida de atardecer con destellos dorados en el piso de roble.',
    hdriName: 'Amanecer / Ocaso 1K',
    iconName: 'Sunset'
  },
  {
    id: 'night',
    presetKey: 'noche',
    label: 'Noche Estrellada',
    shortLabel: 'Noche',
    subtitle: 'Luz de luna y estrellas · HDRI Dikhololo Night',
    description: 'Cielo estrellado con luna suave y focos arquitectónicos cálidos interiores.',
    hdriName: 'Noche Estrellada 1K',
    iconName: 'Moon'
  },
  {
    id: 'city',
    presetKey: 'ciudad',
    label: 'Ciudad Moderna',
    shortLabel: 'Ciudad',
    subtitle: 'Skyline metropolitano · HDRI Edificios',
    description: 'Reflejos de rascacielos contemporáneos con luz neutra y sobria de gran metrópoli.',
    hdriName: 'Arquitectura Moderna 1K',
    iconName: 'Building2'
  },
  {
    id: 'cyberpunk',
    presetKey: 'cyberpunk',
    label: 'Cyberpunk Neón',
    shortLabel: 'Cyberpunk',
    subtitle: 'Neón cian y magenta · Estética Synthwave',
    description: 'Ambiente nocturno futurista con luces perimetrales cian, magenta y suelo ultrarreflectante.',
    hdriName: 'Skyline Neón 1K',
    iconName: 'Zap'
  },
  {
    id: 'nordic',
    presetKey: 'nordico',
    label: 'Estudio Nórdico',
    shortLabel: 'Nórdico',
    subtitle: 'Luz escandinava difusa · Minimalista',
    description: 'Luz suave desaturada con atmósfera brumosa, acabados mate y serenidad nórdica.',
    hdriName: 'Parque Escénico 2K',
    iconName: 'Cloud'
  },
  {
    id: 'dramatic',
    presetKey: 'dramatico',
    label: 'Claroscuro Teatral',
    shortLabel: 'Dramático',
    subtitle: 'Alto contraste teatral · Enfoque en Obras',
    description: 'Sombras profundas de claroscuro con iluminación focal directa sobre cada escultura y cuadro.',
    hdriName: 'Noche Dikhololo 1K',
    iconName: 'Eye'
  },
  {
    id: 'studio',
    presetKey: 'estudio',
    label: 'Estudio PBR Neutral',
    shortLabel: 'Estudio',
    subtitle: 'Luz neutra 5500K · Máxima Fidelidad PBR',
    description: 'Calibración fotográfica blanca pura 5500K sin dominantes de color para inspección de arte.',
    hdriName: 'Edificios Modernos 1K',
    iconName: 'Camera'
  },
  {
    id: 'sunset_crimson',
    presetKey: 'crepusculo',
    label: 'Crepúsculo Carmesí',
    shortLabel: 'Crepúsculo',
    subtitle: 'Ocaso veneciano · HDRI Venice Sunset',
    description: 'Atardecer dramático con luz rasante magenta y reflejos de agua en tonos carmesí y violeta.',
    hdriName: 'Venecia Ocaso 1K',
    iconName: 'Flame'
  },
  {
    id: 'aurora',
    presetKey: 'aurora',
    label: 'Aurora Boreal',
    shortLabel: 'Aurora',
    subtitle: 'Noche nórdica celeste · HDRI Moonless Golf',
    description: 'Noche ártica envolvente con resplandor esmeralda y cian en tragaluces y horizontes.',
    hdriName: 'Noche Ártica 1K',
    iconName: 'Sparkles'
  },
  {
    id: 'autumn',
    presetKey: 'otono',
    label: 'Otoño Dorado',
    shortLabel: 'Otoño',
    subtitle: 'Follaje cálido y ámbar · HDRI Autumn Field',
    description: 'Atmósfera rústica y acogedora con sol bajo dorado, tonos terracota y calidez otoñal.',
    hdriName: 'Campo Otoñal 1K',
    iconName: 'Leaf'
  },
  {
    id: 'noir',
    presetKey: 'noir',
    label: 'Galería Noir',
    shortLabel: 'Noir',
    subtitle: 'Monocromo editorial · HDRI Minimal Studio',
    description: 'Estética arquitectónica monocromática de alto contraste, negros profundos y luces de museo plata.',
    hdriName: 'Estudio Minimalista 1K',
    iconName: 'Contrast'
  }
]

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
