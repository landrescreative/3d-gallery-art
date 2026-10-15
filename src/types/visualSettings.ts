export interface VisualConfig {
  activePreset: 'noche' | 'galeria' | 'atardecer' | 'ciudad' | 'nordico' | 'personalizado'

  // HDRI & Entorno
  hdriPath: string
  hdriIntensity: number
  hdriBackgroundIntensity: number
  hdriRotationY: number // En grados (0 - 360)
  hdriBlur: number // 0 - 1
  showBackground: boolean

  // Luz Solar Direccional
  sunIntensity: number
  sunColor: string
  sunPosX: number
  sunPosY: number
  sunPosZ: number
  castShadow: boolean
  shadowBias: number

  // Iluminación Ambiental y Hemisférica
  ambientIntensity: number
  ambientColor: string
  hemiIntensity: number
  hemiSkyColor: string
  hemiGroundColor: string

  // Luces de Sala / Interior
  fillIntensity: number
  skylight3DIntensity: number
  roomLightColor: string

  // Atmósfera & Niebla
  fogEnabled: boolean
  fogColor: string
  fogNear: number
  fogFar: number

  // Cámara & Renderizador
  exposure: number
  fov: number

  // Materiales PBR
  floorRoughness: number
  floorMetalness: number
  glassTransmission: number
  glassRoughness: number
  wallRoughness: number
}

export interface HdriOption {
  label: string
  path: string
  description: string
}
