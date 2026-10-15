export type LightingMode = 'gallery' | 'noon' | 'warm' | 'studio' | 'nordic' | 'dramatic' | 'cyberpunk' | 'night'
export type GraphicsQuality = 'bajo' | 'medio' | 'alto'

export interface Artwork {
  id: string
  title: string
  artist: string
  year: string
  period: string
  medium: string
  dimensions: string
  description: string
  curatorNotes: string
  imageUrl: string
  galleryImages?: string[]
  fallbackColor1: string
  fallbackColor2: string
  aspectRatio: number // width / height
  position: [number, number, number]
  rotation: [number, number, number]
  room: string
  size: [number, number] // [width, height] in 3D world units
  displayType?: 'classic_frame' | 'tech_monitor' | 'smart_tv' | 'laptop' | 'table_laptop' | 'table_tablet' | 'mobile_device' | 'cinema_screen' | 'video_wall' | 'floating_browser' | 'responsive_kiosk' | 'titanium_phone'
  url?: string
  videoUrl?: string
  techStack?: string
  mobileImageUrl?: string
}

export interface Sculpture {
  id: string
  title: string
  artist: string
  year: string
  period?: string
  medium: string
  dimensions?: string
  description: string
  curatorNotes: string
  type: 'torus_knot' | 'crystal_poly' | 'golden_helix' | 'kinetic_particles' | 'custom_model'
  position: [number, number, number]
  pedestalHeight: number
  primaryColor: string
  accentColor: string
  imageUrl?: string
  galleryImages?: string[]
  modelUrl?: string
  modelScale?: number
  modelOffset?: [number, number, number]
  rotationSpeed?: number
  matcapStyle?: 'clay' | 'wax' | 'ceramic' | 'metallic' | 'neon_dark' | 'default'
  pedestalWidth?: number
  pedestalDepth?: number
  displayStyle?: 'standard_pedestal' | 'architectural_table'
  isDecorative?: boolean
}

export interface RoomWing {
  id: string
  name: string
  subtitle: string
  position: [number, number, number]
  color: string
}
