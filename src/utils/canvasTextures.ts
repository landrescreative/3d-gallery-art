import * as THREE from 'three'

// 1. Classic Warm European Travertine & Botticino Marble Museum Floor (Grand Atrium)
export function createMarbleFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Warm honed travertine / Botticino marble base tone (Louvre / Prado style)
  const baseGrad = ctx.createLinearGradient(0, 0, 1024, 1024)
  baseGrad.addColorStop(0, '#dfd7ca')
  baseGrad.addColorStop(0.5, '#e6dfd3')
  baseGrad.addColorStop(1, '#d9d0c2')
  ctx.fillStyle = baseGrad
  ctx.fillRect(0, 0, 1024, 1024)

  // Large-format classic museum stone slab joints (512x512)
  ctx.strokeStyle = '#c8bfae'
  ctx.lineWidth = 2.0
  for (let x = 0; x <= 1024; x += 512) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
  }
  for (let y = 0; y <= 1024; y += 512) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }

  // Soft natural travertine stone veining
  ctx.strokeStyle = 'rgba(180, 168, 150, 0.35)'
  ctx.lineWidth = 1.2
  for (let v = 0; v < 8; v++) {
    const startY = (v / 8) * 1024 + (Math.random() - 0.5) * 80
    ctx.beginPath()
    ctx.moveTo(0, startY)
    ctx.bezierCurveTo(
      300, startY + (Math.random() - 0.5) * 60,
      700, startY + (Math.random() - 0.5) * 60,
      1024, startY + (Math.random() - 0.5) * 80
    )
    ctx.stroke()
  }

  // Natural mineral specks (soft calcite and warm sand)
  for (let i = 0; i < 450; i++) {
    const px = Math.random() * 1024
    const py = Math.random() * 1024
    const isBright = Math.random() > 0.6
    ctx.fillStyle = isBright ? 'rgba(255, 255, 255, 0.45)' : 'rgba(150, 138, 120, 0.22)'
    ctx.fillRect(px, py, 1.5, 1.5)
  }

  // Soft natural perimeter shadow along slab perimeter
  const aoGrad = ctx.createLinearGradient(0, 0, 0, 1024)
  aoGrad.addColorStop(0, 'rgba(0,0,0,0.04)')
  aoGrad.addColorStop(0.5, 'rgba(0,0,0,0)')
  aoGrad.addColorStop(1, 'rgba(0,0,0,0.04)')
  ctx.fillStyle = aoGrad
  ctx.fillRect(0, 0, 1024, 1024)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 6)
  texture.anisotropy = 16
  return texture
}

// 1. Elegant Honed Museum Limestone Floor for UI/UX & Web Pavilion
export function createTechFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Warm honed architectural limestone slab base
  ctx.fillStyle = '#ded6c8'
  ctx.fillRect(0, 0, 1024, 1024)

  // Architectural stone tile grid (256x256 px)
  const tileSize = 256
  ctx.strokeStyle = '#c8bea9'
  ctx.lineWidth = 1.5

  for (let x = 0; x <= 1024; x += tileSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
  }
  for (let y = 0; y <= 1024; y += tileSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }

  // Natural warm stone stippling and micro-texture
  const imgData = ctx.getImageData(0, 0, 1024, 1024)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 5
    d[i] = Math.max(0, Math.min(255, d[i] + noise))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise * 0.95))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise * 0.85))
  }
  ctx.putImageData(imgData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 7)
  texture.anisotropy = 16
  return texture
}

// 2. High-End Scandinavian Natural Blonde Oak Herringbone Parquet Floor for Museum Gallery
export function createParquetFloorTexture(repeatX: number = 23, repeatY: number = 19): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Refined Scandinavian natural blonde museum oak base
  ctx.fillStyle = '#d4c1a5'
  ctx.fillRect(0, 0, 1024, 1024)

  // Herringbone / parquet wood planks with subtle satin tone variations
  const plankW = 64
  const plankH = 256
  const plankTones = ['#dbc8ad', '#cebaa0', '#e2d0b5', '#c8b499', '#d5c2a7']

  for (let y = 0; y < 1024; y += plankH) {
    for (let x = 0; x < 1024; x += plankW) {
      const toneIndex = Math.floor(Math.random() * plankTones.length)
      ctx.fillStyle = plankTones[toneIndex]
      ctx.fillRect(x + 1, y + 1, plankW - 2, plankH - 2)

      // Fine organic wood grain lines inside each plank
      ctx.strokeStyle = 'rgba(100, 75, 45, 0.08)'
      ctx.lineWidth = 1
      for (let g = 4; g < plankW; g += 10) {
        ctx.beginPath()
        ctx.moveTo(x + g, y + 1)
        ctx.lineTo(x + g + (Math.random() - 0.5) * 5, y + plankH - 1)
        ctx.stroke()
      }
    }
  }

  // Beveled plank seam lines in delicate warm walnut
  ctx.strokeStyle = '#b39d80'
  ctx.lineWidth = 1.5
  for (let x = 0; x <= 1024; x += plankW) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
  }
  for (let y = 0; y <= 1024; y += plankH) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(repeatX, repeatY)
  texture.anisotropy = 16
  return texture
}

// 3. Honed Museum Stone Slabs for 3D & Sculpture Pavilion
export function createObsidianFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Warm honed gallery stone base
  ctx.fillStyle = '#dbd3c5'
  ctx.fillRect(0, 0, 1024, 1024)

  // Large architectural gallery stone panels (512x512)
  ctx.strokeStyle = '#c0b6a3'
  ctx.lineWidth = 2
  ctx.strokeRect(0, 0, 512, 512)
  ctx.strokeRect(512, 0, 512, 512)
  ctx.strokeRect(0, 512, 512, 512)
  ctx.strokeRect(512, 512, 512, 512)

  // Natural marble flecks and quartz minerals
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024
    const y = Math.random() * 1024
    const isBright = Math.random() > 0.5
    ctx.fillStyle = isBright ? 'rgba(255, 255, 255, 0.4)' : 'rgba(140, 128, 112, 0.2)'
    ctx.fillRect(x, y, 1.5, 1.5)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 5)
  texture.anisotropy = 16
  return texture
}

// 4. Laptop Keyboard & Trackpad Procedural Texture
export function createLaptopKeyboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Space gray / dark aluminum deck
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, 512, 256)

  // Keyboard recess pocket
  ctx.fillStyle = '#070b13'
  ctx.fillRect(24, 18, 464, 138)
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1.5
  ctx.strokeRect(24, 18, 464, 138)

  // Draw 5 rows of backlit chiclet keys
  const rows = [
    { count: 14, h: 16, y: 24 }, // Function row
    { count: 14, h: 20, y: 44 }, // Numbers
    { count: 14, h: 20, y: 68 }, // QWERTY
    { count: 13, h: 20, y: 92 }, // ASDF
    { count: 12, h: 20, y: 116 }, // ZXCV & space
  ]

  rows.forEach((r, rowIdx) => {
    const keyW = (448 - (r.count - 1) * 4) / r.count
    for (let c = 0; c < r.count; c++) {
      let x = 32 + c * (keyW + 4)
      let w = keyW

      // Special spacebar row
      if (rowIdx === 4 && c === 4) {
        w = keyW * 3.8
      } else if (rowIdx === 4 && (c === 5 || c === 6)) {
        continue
      }

      // Key body
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(x, r.y, w, r.h)

      // Key subtle backlight edge
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'
      ctx.lineWidth = 1
      ctx.strokeRect(x, r.y, w, r.h)

      // Key center glyph dot/mark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
      ctx.fillRect(x + w / 2 - 2, r.y + r.h / 2 - 1, 4, 2)
    }
  })

  // Glass Trackpad
  ctx.fillStyle = '#111827'
  ctx.fillRect(160, 168, 192, 78)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(160, 168, 192, 78)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Modern Luminous Architectural Gallery Wall (Gran Atrio Central - Minimalist Gallery Off-White)
export function createWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Pure contemporary gallery white plaster base
  ctx.fillStyle = '#fafafc'
  ctx.fillRect(0, 0, 512, 512)

  // Clean architectural formwork panel joints (minimalist reveals in light slate)
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1.0
  ctx.beginPath(); ctx.moveTo(0, 256); ctx.lineTo(512, 256); ctx.stroke()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, 257); ctx.lineTo(512, 257); ctx.stroke()

  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1.0
  ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 512); ctx.stroke()
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
  ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(257, 0); ctx.lineTo(257, 512); ctx.stroke()

  // Natural architectural micro-stippling noise (neutral plaster texture)
  const imgData = ctx.getImageData(0, 0, 512, 512)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 3
    d[i] = Math.max(0, Math.min(255, d[i] + noise))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  // Soft architectural Ambient Occlusion vertical gradient
  const aoGrad = ctx.createLinearGradient(0, 0, 0, 512)
  aoGrad.addColorStop(0, 'rgba(0, 0, 0, 0.035)')
  aoGrad.addColorStop(0.12, 'rgba(0, 0, 0, 0.0)')
  aoGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.0)')
  aoGrad.addColorStop(1, 'rgba(0, 0, 0, 0.045)')
  ctx.fillStyle = aoGrad
  ctx.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 2)
  return texture
}

// Minimalist Contemporary Gallery Wall (Pabellón UI/UX & Web - Crisp Light Mist)
export function createTechWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Modern architectural light mist plaster
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, 0, 512, 512)

  // Subtle architectural panel seam
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1.0
  ctx.beginPath()
  ctx.moveTo(256, 0)
  ctx.lineTo(256, 512)
  ctx.stroke()

  // Fine micro-stippling
  const imgData = ctx.getImageData(0, 0, 512, 512)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 3
    d[i] = Math.max(0, Math.min(255, d[i] + noise))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  // Soft Ambient Occlusion
  const aoGradTech = ctx.createLinearGradient(0, 0, 0, 512)
  aoGradTech.addColorStop(0, 'rgba(0, 0, 0, 0.035)')
  aoGradTech.addColorStop(0.12, 'rgba(0, 0, 0, 0.0)')
  aoGradTech.addColorStop(0.88, 'rgba(0, 0, 0, 0.0)')
  aoGradTech.addColorStop(1, 'rgba(0, 0, 0, 0.045)')
  ctx.fillStyle = aoGradTech
  ctx.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 2)
  return texture
}

// Minimalist Architectural Light Grey Plaster for 3D & Sculpture Pavilion
export function createStudio3DWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Contemporary light architectural concrete / gallery stone
  ctx.fillStyle = '#f3f4f6'
  ctx.fillRect(0, 0, 512, 512)

  // Minimalist architectural panel reveals (every 128px)
  for (let x = 64; x < 512; x += 128) {
    ctx.fillStyle = '#e5e7eb'
    ctx.fillRect(x, 0, 1.0, 512)
  }

  // Soft fine architectural stippling
  const imgData = ctx.getImageData(0, 0, 512, 512)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 3
    d[i] = Math.max(0, Math.min(255, d[i] + noise))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  // Soft Ambient Occlusion
  const aoGradStudio = ctx.createLinearGradient(0, 0, 0, 512)
  aoGradStudio.addColorStop(0, 'rgba(0, 0, 0, 0.035)')
  aoGradStudio.addColorStop(0.12, 'rgba(0, 0, 0, 0.0)')
  aoGradStudio.addColorStop(0.88, 'rgba(0, 0, 0, 0.0)')
  aoGradStudio.addColorStop(1, 'rgba(0, 0, 0, 0.045)')
  ctx.fillStyle = aoGradStudio
  ctx.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 2)
  return texture
}

// Minimalist White Cube Museum Plaster Wall (Galería de Diseño Gráfico)
export function createAtelierWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Pristine gallery white cube plaster base
  ctx.fillStyle = '#fafafa'
  ctx.fillRect(0, 0, 512, 512)

  // Subtle architectural shadow reveal groove
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1.0
  ctx.beginPath()
  ctx.moveTo(0, 256)
  ctx.lineTo(512, 256)
  ctx.stroke()

  // Fine architectural micro-stippling
  const imgData = ctx.getImageData(0, 0, 512, 512)
  const d = imgData.data
  for (let i = 0; i < d.length; i += 4) {
    const noise = (Math.random() - 0.5) * 3
    d[i] = Math.max(0, Math.min(255, d[i] + noise))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise))
  }
  ctx.putImageData(imgData, 0, 0)

  // Clean architectural Ambient Occlusion vertical gradient
  const aoGradAtelier = ctx.createLinearGradient(0, 0, 0, 512)
  aoGradAtelier.addColorStop(0, 'rgba(0, 0, 0, 0.035)')
  aoGradAtelier.addColorStop(0.12, 'rgba(0, 0, 0, 0.0)')
  aoGradAtelier.addColorStop(0.88, 'rgba(0, 0, 0, 0.0)')
  aoGradAtelier.addColorStop(1, 'rgba(0, 0, 0, 0.045)')
  ctx.fillStyle = aoGradAtelier
  ctx.fillRect(0, 0, 512, 512)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 2)
  return texture
}


// Procedural artwork fallback generator
export function createArtworkFallback(
  title: string,
  artist: string,
  c1: string,
  c2: string,
  aspectRatio: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  const width = 1024
  const height = Math.round(1024 / aspectRatio)
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Gradient background
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, c1)
  grad.addColorStop(0.5, '#1e1035')
  grad.addColorStop(1, c2)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Abstract geometric shapes
  for (let i = 0; i < 16; i++) {
    ctx.save()
    ctx.translate(Math.random() * width, Math.random() * height)
    ctx.rotate(Math.random() * Math.PI)
    ctx.fillStyle = `rgba(255, 255, 255, ${0.08 + Math.random() * 0.15})`
    ctx.fillRect(-80, -80, 160 + Math.random() * 120, 160 + Math.random() * 120)
    ctx.restore()
  }

  // Glowing orb
  const radGrad = ctx.createRadialGradient(width * 0.5, height * 0.5, 20, width * 0.5, height * 0.5, width * 0.4)
  radGrad.addColorStop(0, 'rgba(255, 215, 0, 0.4)')
  radGrad.addColorStop(0.5, 'rgba(255, 100, 150, 0.2)')
  radGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = radGrad
  ctx.beginPath()
  ctx.arc(width * 0.5, height * 0.5, width * 0.4, 0, Math.PI * 2)
  ctx.fill()

  // Fine title watermark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = 'bold 36px "Cinzel", serif'
  ctx.textAlign = 'center'
  ctx.fillText(title.toUpperCase(), width / 2, height - 70)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.font = '22px "Plus Jakarta Sans", sans-serif'
  ctx.fillText(artist, width / 2, height - 35)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Modern Minimalist Architectural Museum Portal Signage Texture
export function createSignageTexture(title: string, subtitle?: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1536
  canvas.height = 384
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // 1. Sleek deep obsidian background with subtle vignette
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 384)
  bgGrad.addColorStop(0, '#0a0e17')
  bgGrad.addColorStop(1, '#05070b')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 1536, 384)

  // 2. Refined ultra-thin perimeter framing in titanium
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 2
  ctx.strokeRect(16, 16, 1504, 352)

  // 3. Top Architectural Badge / Dot
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.arc(768, 56, 3.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#64748b'
  ctx.font = '700 16px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '5px'
  ctx.fillText('MUSEO VIRTUAL · COLECCIÓN PERMANENTE', 768, 92)

  // 4. Main Room Title in pure white, clean geometric typography
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 58px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '4px'
  ctx.fillText(title.toUpperCase(), 768, subtitle ? 186 : 220)

  // 5. Minimalist hairline divider
  if (subtitle) {
    const divGrad = ctx.createLinearGradient(400, 0, 1136, 0)
    divGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)')
    divGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)')
    divGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)')
    ctx.strokeStyle = divGrad
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(400, 222)
    ctx.lineTo(1136, 222)
    ctx.stroke()

    // 6. Subtitle in soft crisp slate
    ctx.fillStyle = '#94a3b8'
    ctx.font = '600 24px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
    ctx.letterSpacing = '3px'
    ctx.fillText(subtitle.toUpperCase(), 768, 276)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true
  return texture
}

export interface MuseumPlaqueProps {
  title: string
  subtitle?: string
  medium?: string
  techStack?: string
  year?: string
  artist?: string
  url?: string
  category?: string
  type?: 'tech' | 'cinema' | 'sculpture' | 'graphic' | 'art'
}

// Unified Minimalist Obsidian Museum Exhibition Plaque Texture (Aspect Ratio 3.2:1 @ 1280x400)
// Designed in harmony with the minimalist room entrance signage (createSignageTexture)
export function createMuseumPlaqueTexture(props: MuseumPlaqueProps): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1280
  canvas.height = 400
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // 1. Sleek deep obsidian background with subtle vignette (unified with room entrance signs)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 400)
  bgGrad.addColorStop(0, '#0a0e17')
  bgGrad.addColorStop(1, '#05070b')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 1280, 400)

  // 2. Refined ultra-thin perimeter framing in titanium
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 2
  ctx.strokeRect(16, 16, 1248, 368)

  // 3. Top Architectural Badge / Dot & Category Tracking
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.arc(640, 48, 3.5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#64748b'
  ctx.font = '700 13px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '5px'
  const categoryText = (props.category || 'MUSEO VIRTUAL · COLECCIÓN PERMANENTE').toUpperCase()
  ctx.fillText(categoryText, 640, 80)

  // 4. Main Title Parsing & Rendering in pure white, clean geometric typography
  const rawTitle = props.title || ''
  const parts = rawTitle.split('·').map(s => s.trim())
  const mainTitle = parts[0] || rawTitle
  const titleSub = parts.slice(1).join(' · ') || props.subtitle || ''

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '3.5px'

  let titleFontSize = 46
  if (mainTitle.length > 34) titleFontSize = 32
  else if (mainTitle.length > 24) titleFontSize = 38
  ctx.font = `800 ${titleFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`

  const titleY = titleSub ? 152 : 176
  ctx.fillText(mainTitle.toUpperCase(), 640, titleY)

  // 5. Minimalist radiant hairline divider (tapering out to transparent)
  const divY = titleSub ? 192 : 216
  const divGrad = ctx.createLinearGradient(320, 0, 960, 0)
  divGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)')
  divGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)')
  divGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)')
  ctx.strokeStyle = divGrad
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(320, divY)
  ctx.lineTo(960, divY)
  ctx.stroke()

  // 6. Subtitle in soft crisp slate
  if (titleSub) {
    ctx.fillStyle = '#94a3b8'
    let subFontSize = 20
    if (titleSub.length > 45) subFontSize = 17
    ctx.font = `600 ${subFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`
    ctx.letterSpacing = '3px'
    ctx.textAlign = 'center'
    ctx.fillText(titleSub.toUpperCase(), 640, 238)
  }

  // 7. Disciplines / Tech Stack / Medium Metadata Line (clean text without heavy boxed pills)
  let metaText = ''
  if (props.techStack) {
    metaText = props.techStack
  } else if (props.medium) {
    metaText = props.medium
  } else if (props.artist) {
    metaText = `${props.artist} · ${props.year || '2025'}`
  } else {
    metaText = `COLECCIÓN DE AUTOR · ${props.year || '2025'}`
  }

  const metaY = titleSub ? 286 : 266
  ctx.fillStyle = '#38bdf8'
  let metaFontSize = 15
  if (metaText.length > 55) metaFontSize = 13
  ctx.font = `600 ${metaFontSize}px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif`
  ctx.letterSpacing = '2px'
  ctx.textAlign = 'center'
  ctx.fillText(metaText.toUpperCase(), 640, metaY)

  // 8. Subtle Minimalist Interactive Prompt at Bottom
  ctx.fillStyle = 'rgba(148, 163, 184, 0.55)'
  ctx.font = '600 12px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.letterSpacing = '3px'
  ctx.textAlign = 'center'
  ctx.fillText('✦ CLICK O ESPACIO PARA EXPLORAR ✦', 640, 350)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true
  texture.needsUpdate = true
  return texture
}

// Modern Minimalist Monumental Identity & Manifesto Cartel for Landres Creative Virtual Portfolio
export function createLandresPortfolioCartelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // 1. Sleek deep obsidian background with subtle vignette
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024)
  bgGrad.addColorStop(0, '#090d16')
  bgGrad.addColorStop(0.5, '#06080e')
  bgGrad.addColorStop(1, '#030508')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 2048, 1024)

  // 2. Refined ultra-thin perimeter framing in titanium
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 3
  ctx.strokeRect(32, 32, 1984, 960)

  // Subtle inner accent border
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)'
  ctx.lineWidth = 1
  ctx.strokeRect(40, 40, 1968, 944)

  // 3. Top Architectural Badge / Dot
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.arc(1024, 110, 6, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#64748b'
  ctx.font = '700 24px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '6px'
  ctx.fillText('MUSEO VIRTUAL · ARQUITECTURA DIGITAL & EXHIBICIÓN 3D', 1024, 160)

  // 4. Main Brand Title
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 96px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.letterSpacing = '8px'
  ctx.fillText('LANDRES CREATIVE', 1024, 280)

  // 5. Subtitle
  ctx.fillStyle = '#38bdf8'
  ctx.font = '700 40px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.letterSpacing = '7px'
  ctx.fillText('VIRTUAL PORTFOLIO MUSEUM', 1024, 350)

  // 6. Radiant gradient divider line
  const divGrad = ctx.createLinearGradient(400, 0, 1648, 0)
  divGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)')
  divGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.55)')
  divGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)')
  ctx.strokeStyle = divGrad
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(400, 400)
  ctx.lineTo(1648, 400)
  ctx.stroke()

  // 7. Disciplines / Sub-headings
  ctx.fillStyle = '#94a3b8'
  ctx.font = '600 28px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.letterSpacing = '5px'
  ctx.fillText('DIRECCIÓN DE ARTE · MODELADO 3D · DISEÑO UI/UX · INGENIERÍA INTERACTIVA', 1024, 470)

  // 8. Manifesto Paragraph
  ctx.fillStyle = '#cbd5e1'
  ctx.font = '500 24px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.letterSpacing = '2px'
  ctx.fillText('Espacio tridimensional inmersivo concebido para la convergencia del arte digital contemporáneo,', 1024, 545)
  ctx.fillText('el diseño de experiencias interactivas y la arquitectura de software de alto rendimiento.', 1024, 590)

  // 9. Pavilion Directory Pills (3 Wings)
  const pavilions = [
    { name: 'SALA 3D & ESCULTURA', code: 'NORTE', color: '#38bdf8' },
    { name: 'DISEÑO GRÁFICO & FOTO', code: 'OESTE', color: '#fb923c' },
    { name: 'UI/UX & PRODUCTO', code: 'ESTE', color: '#a855f7' }
  ]

  const pillWidth = 460
  const pillHeight = 72
  const pillSpacing = 40
  const totalW = pavilions.length * pillWidth + (pavilions.length - 1) * pillSpacing
  const startX = (2048 - totalW) / 2
  const pillY = 675

  pavilions.forEach((pav, i) => {
    const px = startX + i * (pillWidth + pillSpacing)

    // Pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
    ctx.beginPath()
    ctx.roundRect(px, pillY, pillWidth, pillHeight, 10)
    ctx.fill()

    // Pill border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Indicator dot
    ctx.fillStyle = pav.color
    ctx.beginPath()
    ctx.arc(px + 28, pillY + pillHeight / 2, 4.5, 0, Math.PI * 2)
    ctx.fill()

    // Title
    ctx.fillStyle = '#f8fafc'
    ctx.font = '700 18px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'left'
    ctx.letterSpacing = '2px'
    ctx.fillText(pav.name, px + 48, pillY + 44)

    // Code badge
    ctx.fillStyle = '#64748b'
    ctx.font = '700 14px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'right'
    ctx.letterSpacing = '2px'
    ctx.fillText(pav.code, px + pillWidth - 20, pillY + 44)
  })

  // 10. Footer Metadata
  ctx.fillStyle = '#475569'
  ctx.font = '700 18px "Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '4px'
  ctx.fillText('COLECCIÓN DIGITAL PERMANENTE · LANDRES CREATIVE STUDIO · WEBGL & THREE.JS', 1024, 860)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 16
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.generateMipmaps = true
  return texture
}

// Procedural soft radial contact shadow texture for grounding pedestals and round objects
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)')
  grad.addColorStop(0.35, 'rgba(0, 0, 0, 0.38)')
  grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.12)')
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Procedural soft rectangular contact shadow texture for benches and display tables
export function createRectContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Draw soft blurred rounded rectangle
  const cx = 256
  const cy = 128
  const rw = 210
  const rh = 90

  for (let r = 35; r >= 0; r -= 2) {
    const alpha = (1 - r / 35) * 0.45
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.1})`
    ctx.beginPath()
    ctx.roundRect(cx - rw / 2 - r, cy - rh / 2 - r, rw + r * 2, rh + r * 2, 24 + r)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

// Refined Scandinavian Natural Blonde Oak Floor for Playroom & South Pavilion


// 13. Monumental Classic Versailles Wooden Marquetry Rosette for Grand Atrium Center
export function createAtriumMedallionTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const cx = 512
  const cy = 512

  // Transparent background
  ctx.clearRect(0, 0, 1024, 1024)

  // Outer Scandinavian blonde oak foundation disc
  ctx.beginPath()
  ctx.arc(cx, cy, 480, 0, Math.PI * 2)
  ctx.fillStyle = '#d4c1a5'
  ctx.fill()

  // Outer slate/walnut inlay rim
  ctx.lineWidth = 12
  ctx.strokeStyle = '#1e293b'
  ctx.stroke()

  // Inner titanium ring
  ctx.beginPath()
  ctx.arc(cx, cy, 450, 0, Math.PI * 2)
  ctx.lineWidth = 4
  ctx.strokeStyle = '#475569'
  ctx.stroke()

  // 16-point inlaid star points (alternating blonde oak, smoked walnut and titanium inlays)
  const numPoints = 16
  const rOuter = 440
  const rInner = 280

  for (let i = 0; i < numPoints; i++) {
    const angle1 = (i / numPoints) * Math.PI * 2
    const angleMid = ((i + 0.5) / numPoints) * Math.PI * 2
    const angle2 = ((i + 1) / numPoints) * Math.PI * 2

    // Half point (light blonde oak)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angle1) * rInner, cy + Math.sin(angle1) * rInner)
    ctx.lineTo(cx + Math.cos(angleMid) * rOuter, cy + Math.sin(angleMid) * rOuter)
    ctx.closePath()
    ctx.fillStyle = i % 2 === 0 ? '#e2d0b5' : '#cebaa0'
    ctx.fill()

    // Half point (smoked slate/walnut & titanium accent)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(angleMid) * rOuter, cy + Math.sin(angleMid) * rOuter)
    ctx.lineTo(cx + Math.cos(angle2) * rInner, cy + Math.sin(angle2) * rInner)
    ctx.closePath()
    ctx.fillStyle = i % 4 === 0 ? '#475569' : '#1e293b'
    ctx.fill()
  }

  // Inner decorative ring in slate
  ctx.beginPath()
  ctx.arc(cx, cy, 276, 0, Math.PI * 2)
  ctx.lineWidth = 6
  ctx.strokeStyle = '#1e293b'
  ctx.stroke()

  // Center rosette circle in natural blonde oak (under the Torus pedestal)
  ctx.beginPath()
  ctx.arc(cx, cy, 250, 0, Math.PI * 2)
  ctx.fillStyle = '#d4c1a5'
  ctx.fill()

  // Compass cardinal marks in dark slate
  const cardinals = [
    { label: 'N', a: -Math.PI / 2 },
    { label: 'E', a: 0 },
    { label: 'S', a: Math.PI / 2 },
    { label: 'W', a: Math.PI }
  ]
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#1e293b'
  cardinals.forEach(({ label, a }) => {
    const tx = cx + Math.cos(a) * 360
    const ty = cy + Math.sin(a) * 360
    ctx.fillText(label, tx, ty)
  })

  // Center radial inlays
  for (let j = 0; j < 8; j++) {
    const a = (j / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a) * 230, cy + Math.sin(a) * 230)
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)'
    ctx.lineWidth = 2.0
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 16
  return texture
}

// 14. Modern macOS / Arc Browser Window Header Bar
export function createBrowserBarTexture(title: string, url: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 110
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  // Frosted dark glass header bar
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, 1024, 110)

  // Bottom subtle border line
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, 108)
  ctx.lineTo(1024, 108)
  ctx.stroke()

  // 1. macOS Traffic Lights
  const dots = [
    { x: 38, color: '#ef4444' }, // Close
    { x: 68, color: '#eab308' }, // Minimize
    { x: 98, color: '#22c55e' }  // Expand
  ]
  dots.forEach(({ x, color }) => {
    ctx.beginPath()
    ctx.arc(x, 55, 9, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  })

  // 2. Active Tab Pill
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(135, 18, 250, 74, [10, 10, 0, 0])
  } else {
    ctx.rect(135, 18, 250, 74)
  }
  ctx.fill()

  // Tab Favicon dot
  ctx.beginPath()
  ctx.arc(160, 55, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#38bdf8'
  ctx.fill()

  // Tab Title
  ctx.fillStyle = '#f8fafc'
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(title.slice(0, 16), 178, 55)

  // 3. Centered URL Pill Address Bar
  const urlBoxX = 410
  const urlBoxW = 490
  ctx.fillStyle = '#090d16'
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(urlBoxX, 22, urlBoxW, 66, 33)
  } else {
    ctx.rect(urlBoxX, 22, urlBoxW, 66)
  }
  ctx.fill()
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // SSL Lock icon
  ctx.fillStyle = '#22c55e'
  ctx.font = '18px sans-serif'
  ctx.fillText('🔒', urlBoxX + 18, 55)

  // URL text
  ctx.fillStyle = '#94a3b8'
  ctx.font = '500 18px monospace'
  ctx.fillText(url.slice(0, 36), urlBoxX + 50, 55)

  // 4. Right status badge
  ctx.fillStyle = 'rgba(56, 189, 248, 0.16)'
  ctx.beginPath()
  if (ctx.roundRect) {
    ctx.roundRect(920, 28, 80, 54, 8)
  } else {
    ctx.rect(920, 28, 80, 54)
  }
  ctx.fill()
  ctx.fillStyle = '#38bdf8'
  ctx.font = 'bold 16px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('LIVE', 960, 55)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 16
  return texture
}

export type MatcapStyle = 'clay' | 'wax' | 'ceramic' | 'metallic' | 'neon_dark' | 'default'

export interface MatcapPreset {
  id: string
  name: string
  label: string
  primaryColor: string
  accentColor: string
  style: MatcapStyle
  description: string
  colorBadge: string
}

export const SCULPTURE_MATCAP_PRESETS: MatcapPreset[] = [
  {
    id: 'toon-neon',
    name: 'Toon Neón & Azul Obsidiana',
    label: 'Toon Neón',
    primaryColor: '#030712',
    accentColor: '#00e5ff',
    style: 'neon_dark',
    description: 'Estética cel-shading anime dark con bordes luminosos de neón eléctrico',
    colorBadge: '#00e5ff'
  },
  {
    id: 'jade-celadon',
    name: 'Jade Celadón & Cerámica Esmaltada',
    label: 'Jade Celadón',
    primaryColor: '#2b6e5d',
    accentColor: '#9fe0d0',
    style: 'ceramic',
    description: 'Porcelana fina vitrificada y jade oriental esmaltado con reflejo pulido',
    colorBadge: '#3b8672'
  },
  {
    id: 'clay-brown',
    name: 'Arcilla Café & Masa de Modelar',
    label: 'Arcilla Café',
    primaryColor: '#6d3f22',
    accentColor: '#d19870',
    style: 'clay',
    description: 'Acabado en arcilla café tradicional de modelado y plastilina escultórica',
    colorBadge: '#7a4727'
  },
  {
    id: 'wax-red',
    name: 'Cera Roja ZBrush (Red Wax)',
    label: 'Cera Roja',
    primaryColor: '#8a2b25',
    accentColor: '#f28b73',
    style: 'wax',
    description: 'Cera roja clásica de escultura digital y prototipado 3D de alta definición',
    colorBadge: '#9e322b'
  },
  {
    id: 'bronze-gold',
    name: 'Bronce Antiguo & Pátina Oro',
    label: 'Bronce & Oro',
    primaryColor: '#45351a',
    accentColor: '#d4af37',
    style: 'metallic',
    description: 'Bronce de fundición artística con pátina de museo y reflejos dorados',
    colorBadge: '#9e7b2d'
  },
  {
    id: 'graphite-slate',
    name: 'Grafito & Pizarra Volcánica',
    label: 'Grafito',
    primaryColor: '#252a33',
    accentColor: '#94a3b8',
    style: 'default',
    description: 'Piedra volcánica contemporánea y grafito mate satinado',
    colorBadge: '#3e4654'
  }
]

/**
 * Procedural Dynamic MatCap (Material Capture) Spherical Texture Generator.
 * Creates a high-fidelity 512x512 spherical studio lighting map with:
 * - Dynamic color shifting based on viewing angles & Fresnel curves
 * - Authentic material response (Arcilla/Masa café, Cera Roja, Jade Celadón, Bronce Oro)
 * - Studio key light and cool fill light
 * - Calibrated specular highlights and rim lighting
 */
export function createDynamicMatcapTexture(
  primaryColor: string,
  accentColor: string,
  style: MatcapStyle = 'default'
): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.CanvasTexture(canvas)

  const imgData = ctx.createImageData(size, size)
  const data = imgData.data

  // Parse hex colors to normalized [0, 1] RGB
  const parseHex = (hex: string): [number, number, number] => {
    const c = new THREE.Color(hex)
    return [c.r, c.g, c.b]
  }

  const [pr, pg, pb] = parseHex(primaryColor)
  const [ar, ag, ab] = parseHex(accentColor)

  // Key light direction (upper-right front)
  const L1x = 0.42, L1y = 0.62, L1z = 0.66
  const len1 = Math.sqrt(L1x * L1x + L1y * L1y + L1z * L1z)
  const l1x = L1x / len1, l1y = L1y / len1, l1z = L1z / len1

  // Fill light direction (lower-left front)
  const L2x = -0.52, L2y = -0.32, L2z = 0.50
  const len2 = Math.sqrt(L2x * L2x + L2y * L2y + L2z * L2z)
  const l2x = L2x / len2, l2y = L2y / len2, l2z = L2z / len2

  // Specular halfway vector (V = 0, 0, 1)
  const H1x = l1x, H1y = l1y, H1z = l1z + 1.0
  const lenH = Math.sqrt(H1x * H1x + H1y * H1y + H1z * H1z)
  const h1x = H1x / lenH, h1y = H1y / lenH, h1z = H1z / lenH

  const radius = size * 0.485
  const center = size * 0.5

  for (let y = 0; y < size; y++) {
    const py = (center - y) / radius
    for (let x = 0; x < size; x++) {
      const px = (x - center) / radius
      const r2 = px * px + py * py
      const idx = (y * size + x) * 4

      if (r2 > 1.0) {
        // Outside the sphere: soft anti-aliased edge or zero alpha
        const dist = Math.sqrt(r2)
        if (dist <= 1.03) {
          const edgeAlpha = Math.max(0, 1 - (dist - 1.0) / 0.03)
          data[idx] = Math.round(ar * 255 * 0.4)
          data[idx + 1] = Math.round(ag * 255 * 0.4)
          data[idx + 2] = Math.round(ab * 255 * 0.4)
          data[idx + 3] = Math.round(edgeAlpha * 255)
        } else {
          data[idx + 3] = 0
        }
        continue
      }

      const pz = Math.sqrt(1.0 - r2)

      // Diffuse terms
      let dotL1 = Math.max(0, px * l1x + py * l1y + pz * l1z)
      let dotL2 = Math.max(0, px * l2x + py * l2y + pz * l2z)

      // Specular parameters customized per material
      const dotH = Math.max(0, px * h1x + py * h1y + pz * h1z)
      let specTight = 0
      let specSoft = 0
      let rim = 0
      let specR = 1.0, specG = 1.0, specB = 1.0

      if (style === 'clay') {
        // Warm velvety matte/satin clay with soft cream highlight & crevice AO
        dotL1 = dotL1 * 0.88 + 0.12 // softer wrap like clay subsurface
        specTight = Math.pow(dotH, 18) * 0.42
        specSoft = Math.pow(dotH, 6) * 0.22
        rim = Math.pow(1.0 - pz, 2.6) * 0.72
        specR = 1.0; specG = 0.94; specB = 0.86 // warm cream specular
      } else if (style === 'wax') {
        // Translucent ZBrush Red Wax with rich rim scatter
        specTight = Math.pow(dotH, 34) * 1.15
        specSoft = Math.pow(dotH, 10) * 0.38
        rim = Math.pow(1.0 - pz, 1.85) * 1.35
      } else if (style === 'ceramic') {
        // Glossy glazed porcelain / polished jade
        specTight = Math.pow(dotH, 54) * 1.45
        specSoft = Math.pow(dotH, 14) * 0.32
        rim = Math.pow(1.0 - pz, 2.2) * 1.18
      } else if (style === 'metallic') {
        // Antique cast bronze with warm golden specular
        specTight = Math.pow(dotH, 60) * 1.55
        specSoft = Math.pow(dotH, 12) * 0.40
        rim = Math.pow(1.0 - pz, 2.0) * 1.40
        specR = 1.0; specG = 0.92; specB = 0.75
      } else if (style === 'neon_dark') {
        // Dark Obsidian Toon Shader with High-Intensity Neon Rim Glow
        dotL1 = Math.pow(dotL1, 2.2) * 0.4
        dotL2 = dotL2 * 0.2
        specTight = Math.pow(dotH, 50) * 1.6
        specSoft = Math.pow(dotH, 12) * 0.35
        rim = Math.pow(1.0 - pz, 1.7) * 2.6 + Math.pow(1.0 - pz, 4.0) * 1.8
        specR = ar; specG = ag; specB = ab // Specular shines with accent neon color
      } else {
        // Default dynamic pearlescent
        specTight = Math.pow(dotH, 42) * 1.30
        specSoft = Math.pow(dotH, 12) * 0.35
        rim = Math.pow(1.0 - pz, 2.2) * 1.25
      }

      const fresnel = Math.pow(1.0 - pz, 2.2)
      const iridShift = Math.sin(fresnel * Math.PI * 1.5 + py * 0.8) * 0.5 + 0.5
      const mixRatio = Math.min(1, fresnel * 0.65 + iridShift * 0.35)

      const cr = pr * (1 - mixRatio) + ar * mixRatio
      const cg = pg * (1 - mixRatio) + ag * mixRatio
      const cb = pb * (1 - mixRatio) + ab * mixRatio

      // Ambient cavity curvature
      const aoMult = style === 'clay' ? 0.82 : 0.78
      const aoBase = style === 'clay' ? 0.26 : 0.22
      const ao = aoBase + aoMult * Math.sqrt(Math.max(0, py * 0.5 + 0.5))

      // Combine lighting passes
      let r = 0, g = 0, b = 0
      if (style === 'neon_dark') {
        // Stylized anime dark toon: Deep dark core with luminous electric neon rim
        const neonFresnel = Math.min(1.0, Math.pow(1.0 - pz, 1.8) * 1.6)
        r = (pr * (1.0 - neonFresnel) * 0.4 + dotL1 * pr * 0.3 + ar * neonFresnel * 1.6 + (specTight + specSoft) * specR * 1.5)
        g = (pg * (1.0 - neonFresnel) * 0.4 + dotL1 * pg * 0.3 + ag * neonFresnel * 1.6 + (specTight + specSoft) * specG * 1.5)
        b = (pb * (1.0 - neonFresnel) * 0.4 + dotL1 * pb * 0.3 + ab * neonFresnel * 1.6 + (specTight + specSoft) * specB * 1.5)
      } else {
        r = (0.12 * pr + dotL1 * cr * 1.15 + dotL2 * ar * 0.35 + rim * ar * 0.95 + (specTight + specSoft) * specR * 1.4) * ao
        g = (0.12 * pg + dotL1 * cg * 1.15 + dotL2 * ag * 0.35 + rim * ag * 0.95 + (specTight + specSoft) * specG * 1.4) * ao
        b = (0.12 * pb + dotL1 * cb * 1.15 + dotL2 * ab * 0.35 + rim * ab * 0.95 + (specTight + specSoft) * specB * 1.4) * ao
      }

      // Anti-aliasing near sphere border (r2 near 1.0)
      let alpha = 1.0
      if (r2 > 0.96) {
        alpha = Math.max(0, Math.min(1, (1.0 - r2) / 0.04))
      }

      data[idx] = Math.min(255, Math.max(0, Math.round(r * 255)))
      data[idx + 1] = Math.min(255, Math.max(0, Math.round(g * 255)))
      data[idx + 2] = Math.min(255, Math.max(0, Math.round(b * 255)))
      data[idx + 3] = Math.round(alpha * 255)
    }
  }

  ctx.putImageData(imgData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

const matcapCache = new Map<string, THREE.CanvasTexture>()
export function getOrCreateDynamicMatcap(
  primaryColor: string,
  accentColor: string,
  style: MatcapStyle = 'default'
): THREE.CanvasTexture {
  const key = `${primaryColor}_${accentColor}_${style}`
  let tex = matcapCache.get(key)
  if (!tex) {
    tex = createDynamicMatcapTexture(primaryColor, accentColor, style)
    matcapCache.set(key, tex)
  }
  return tex
}

let toonGradientMapCache: THREE.CanvasTexture | null = null

export function getOrCreateToonGradientMap(): THREE.CanvasTexture {
  if (toonGradientMapCache) return toonGradientMapCache

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 4
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // 5-Tone Elaborate Studio Anime Cel-Shading Ramp:
    // 0 to 45px (0.00 - 0.09): Deep ambient occlusion / crevice tone (#343746)
    // 45 to 135px (0.09 - 0.26): Cool atmospheric shadow tone (#64748b)
    // 135 to 250px (0.26 - 0.49): Soft transition half-tone (#94a3b8)
    // 250 to 420px (0.49 - 0.82): Warm direct diffuse lit tone (#e2e8f0)
    // 420 to 512px (0.82 - 1.00): Crisp key sunlight / specular apex (#ffffff)
    ctx.fillStyle = '#343746'
    ctx.fillRect(0, 0, 45, 4)
    ctx.fillStyle = '#64748b'
    ctx.fillRect(45, 0, 90, 4)
    ctx.fillStyle = '#94a3b8'
    ctx.fillRect(135, 0, 115, 4)
    ctx.fillStyle = '#e2e8f0'
    ctx.fillRect(250, 0, 170, 4)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(420, 0, 92, 4)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  toonGradientMapCache = tex
  return tex
}

let stylizedWoodTextureCache: THREE.CanvasTexture | null = null

export function getOrCreateStylizedWoodTexture(): THREE.CanvasTexture {
  if (stylizedWoodTextureCache) return stylizedWoodTextureCache

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Warm cedar undertone
    ctx.fillStyle = '#b45309'
    ctx.fillRect(0, 0, 512, 512)

    // Stylized plank grooves and wood grain striations
    for (let x = 0; x < 512; x += 64) {
      ctx.fillStyle = 'rgba(67, 20, 7, 0.45)'
      ctx.fillRect(x, 0, 3, 512)
      ctx.fillStyle = 'rgba(254, 215, 170, 0.28)'
      ctx.fillRect(x + 3, 0, 2, 512)
    }

    // Organic grain lines
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.22)'
    ctx.lineWidth = 1.8
    for (let i = 0; i < 30; i++) {
      const y = (i * 18) % 512
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.bezierCurveTo(170, y + 8, 340, y - 8, 512, y + 4)
      ctx.stroke()
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 4)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  stylizedWoodTextureCache = tex
  return tex
}

let stylizedRoofTextureCache: THREE.CanvasTexture | null = null

export function getOrCreateStylizedRoofTexture(): THREE.CanvasTexture {
  if (stylizedRoofTextureCache) return stylizedRoofTextureCache

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Rich mint-cyan base
    ctx.fillStyle = '#4ade80'
    ctx.fillRect(0, 0, 512, 512)

    // Scalloped roof tile rows
    const rowH = 32
    for (let y = 0; y < 512; y += rowH) {
      ctx.fillStyle = 'rgba(15, 76, 56, 0.35)'
      ctx.fillRect(0, y, 512, 2.5)
      ctx.fillStyle = 'rgba(209, 250, 229, 0.40)'
      ctx.fillRect(0, y + 2.5, 512, 2)

      const offset = (Math.floor(y / rowH) % 2) * 24
      for (let x = offset; x < 512; x += 48) {
        ctx.fillStyle = 'rgba(15, 76, 56, 0.25)'
        ctx.fillRect(x, y, 2, rowH)
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(5, 5)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  stylizedRoofTextureCache = tex
  return tex
}

let seaWaterTextureCache: THREE.CanvasTexture | null = null

export function getOrCreateSeaWaterTexture(): THREE.CanvasTexture {
  if (seaWaterTextureCache) return seaWaterTextureCache

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    // Deep gradient from oceanic sapphire to sunlit turquoise
    const grad = ctx.createLinearGradient(0, 0, 512, 512)
    grad.addColorStop(0, '#0284c7')
    grad.addColorStop(0.5, '#0369a1')
    grad.addColorStop(1, '#0f766e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)

    // Stylized surface caustics & organic wave rings with bright foam crests
    for (let i = 0; i < 75; i++) {
      const cx = (i * 53) % 512
      const cy = (i * 79) % 512
      const rx = 16 + (i % 7) * 8
      const ry = 7 + (i % 5) * 6
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate((i * 0.42) % Math.PI)
      
      // Outer bright caustic ring
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.55)'
      ctx.lineWidth = 3.0
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      ctx.stroke()

      // Inner cyan glow ring
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.40)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.ellipse(0, 0, rx * 0.7, ry * 0.7, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 4)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  seaWaterTextureCache = tex
  return tex
}

/**
 * Attaches multi-pass shader injections (Fresnel rim lighting, warm specular glints, cool shadow tint)
 * to a MeshToonMaterial to create an elaborate, high-end studio cel shader.
 */
function attachMultiPassToonShader(
  mat: THREE.MeshToonMaterial,
  config: {
    rimColor?: string
    rimIntensity?: number
    specularGlance?: boolean
  } = {}
) {
  const rimHex = config.rimColor || '#fef08a'
  const rimIntensity = config.rimIntensity ?? 0.38
  const hasSpec = config.specularGlance ?? true

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: new THREE.Color(rimHex) }
    shader.uniforms.uRimIntensity = { value: rimIntensity }

    // Vertex: inject varying for view direction & world normal
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec3 vToonViewDir;
      varying vec3 vToonWorldNorm;
      `
    )

    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `
      #include <worldpos_vertex>
      vToonWorldNorm = normalize(mat3(modelMatrix) * normal);
      vec4 wPos = modelMatrix * vec4(transformed, 1.0);
      vToonViewDir = normalize(cameraPosition - wPos.xyz);
      `
    )

    // Fragment: inject Fresnel rim light & anime specular pass
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform vec3 uRimColor;
      uniform float uRimIntensity;
      varying vec3 vToonViewDir;
      varying vec3 vToonWorldNorm;
      `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      // 1. Fresnel Silhouette Rim Lighting Pass (Luz de contorno anime)
      vec3 vd = normalize(vToonViewDir);
      vec3 vn = normalize(vToonWorldNorm);
      float rimDot = 1.0 - max(dot(vd, vn), 0.0);
      float rim = smoothstep(0.62, 0.95, pow(rimDot, 2.8)) * uRimIntensity;
      gl_FragColor.rgb += uRimColor * rim;

      ${hasSpec ? `
      // 2. Stepped Anime Specular Pass (Brillo especular escalonado)
      vec3 sunDir = normalize(vec3(0.35, 0.85, 0.45));
      vec3 halfVec = normalize(sunDir + vd);
      float spec = step(0.94, max(dot(vn, halfVec), 0.0)) * 0.28;
      gl_FragColor.rgb += vec3(1.0, 0.98, 0.92) * spec;
      ` : ''}

      // 3. Atmospheric Sky Shadow Bounce (Enriquece las sombras con tinte cielo sutil)
      float lightFacing = max(dot(vn, vec3(0.0, 1.0, 0.0)), 0.0);
      gl_FragColor.rgb += vec3(0.03, 0.05, 0.08) * (1.0 - lightFacing);
      `
    )
  }
}

/**
 * Applies an elaborate, multi-pass cel-shaded toon shader to the coastal pier diorama:
 * - 5-band stepped lighting ramp (ambient occlusion, cool shadow, mid-tone, diffuse sun, specular apex)
 * - View-dependent Fresnel silhouette rim lighting
 * - Stepped anime specular glints
 * - Custom stylized wood and tile textures
 * - Multi-depth tropical ocean water with caustics and specular gloss
 */
export function applyHouseToonMaterials(scene: THREE.Object3D) {
  const gradientMap = getOrCreateToonGradientMap()
  const waterMap = getOrCreateSeaWaterTexture()
  const woodMap = getOrCreateStylizedWoodTexture()
  const roofMap = getOrCreateStylizedRoofTexture()

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true

      const processMat = (mat: THREE.Material): THREE.Material => {
        const matName = mat.name || ''

        // Inverted hull outline mesh: Hiding this eliminates the black occlusion shell completely!
        if (matName === 'Material.002') {
          mesh.visible = false
          return mat
        }

        // Stylized aquatic sea water plane with caustics, depth gloss, and soft transparency
        if (matName === 'Sea Water') {
          return new THREE.MeshStandardMaterial({
            color: '#0284c7',
            map: waterMap,
            roughness: 0.06,
            metalness: 0.18,
            transparent: true,
            opacity: 0.92,
            side: THREE.DoubleSide
          })
        }

        // Multi-Pass Cel-Shaded Materials with Rim Lighting & Custom Texture Injections:
        if (matName === 'Techo') {
          // Mint-cyan glazed ceramic roof with scalloped tile details and golden sun rim
          const roofMat = new THREE.MeshToonMaterial({
            color: '#34d399',
            map: roofMap,
            gradientMap: gradientMap,
            side: THREE.DoubleSide
          })
          attachMultiPassToonShader(roofMat, { rimColor: '#ecfdf5', rimIntensity: 0.42, specularGlance: true })
          return roofMat
        }

        if (matName === 'Madera') {
          // Weathered coastal cedar / teak dock wood with plank grain and warm rim
          const woodMat = new THREE.MeshToonMaterial({
            color: '#c25e2e',
            map: woodMap,
            gradientMap: gradientMap,
            side: THREE.DoubleSide
          })
          attachMultiPassToonShader(woodMat, { rimColor: '#fed7aa', rimIntensity: 0.36, specularGlance: true })
          return woodMat
        }

        if (matName === 'roofRed.001') {
          // Vibrant crimson market stall awning
          const redMat = new THREE.MeshToonMaterial({
            color: '#e11d48',
            gradientMap: gradientMap,
            side: THREE.DoubleSide
          })
          attachMultiPassToonShader(redMat, { rimColor: '#fecdd3', rimIntensity: 0.35, specularGlance: false })
          return redMat
        }

        if (matName === 'Arena') {
          // Warm golden Mediterranean beach sand
          const sandMat = new THREE.MeshToonMaterial({
            color: '#fde047',
            gradientMap: gradientMap,
            side: THREE.DoubleSide
          })
          attachMultiPassToonShader(sandMat, { rimColor: '#fef08a', rimIntensity: 0.25, specularGlance: false })
          return sandMat
        }

        if (matName === 'pASTO') {
          // Lush Ghibli coastal grass embankment
          const grassMat = new THREE.MeshToonMaterial({
            color: '#22c55e',
            gradientMap: gradientMap,
            side: THREE.DoubleSide
          })
          attachMultiPassToonShader(grassMat, { rimColor: '#bbf7d0', rimIntensity: 0.32, specularGlance: false })
          return grassMat
        }

        if (matName === 'Concreto') {
          // Warm whitewashed seaside cottage walls
          const wallMat = new THREE.MeshToonMaterial({
            color: '#f8fafc',
            gradientMap: gradientMap,
            side: THREE.DoubleSide
          })
          attachMultiPassToonShader(wallMat, { rimColor: '#ffffff', rimIntensity: 0.30, specularGlance: false })
          return wallMat
        }

        // Generic fallback material
        let fallbackColor = '#e2e8f0'
        if ((mat as THREE.MeshStandardMaterial).color) {
          fallbackColor = '#' + (mat as THREE.MeshStandardMaterial).color.getHexString()
        }

        const genericToon = new THREE.MeshToonMaterial({
          color: fallbackColor,
          gradientMap: gradientMap,
          side: THREE.DoubleSide
        })
        attachMultiPassToonShader(genericToon, { rimColor: '#ffffff', rimIntensity: 0.28, specularGlance: false })
        return genericToon
      }

      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map(processMat)
      } else if (mesh.material) {
        mesh.material = processMat(mesh.material)
      }
    }
  })
}

// Cached textures for VeraVitalize Skincare Crema
let cachedCremaEtiqueta: THREE.Texture | null = null
let cachedCremaDiffuse: THREE.Texture | null = null
let cachedCremaTape: THREE.Texture | null = null

export function getOrCreateCremaTextures() {
  const loader = new THREE.TextureLoader()
  if (!cachedCremaEtiqueta) {
    cachedCremaEtiqueta = loader.load('/models/textures/etiqueta.png')
    cachedCremaEtiqueta.colorSpace = THREE.SRGBColorSpace
  }
  if (!cachedCremaDiffuse) {
    cachedCremaDiffuse = loader.load('/models/textures/cream_diffuse.png')
    cachedCremaDiffuse.colorSpace = THREE.SRGBColorSpace
  }
  if (!cachedCremaTape) {
    cachedCremaTape = loader.load('/models/textures/Aloe-vera-product-tape.jpg')
    cachedCremaTape.colorSpace = THREE.SRGBColorSpace
  }
  return {
    etiqueta: cachedCremaEtiqueta,
    cream: cachedCremaDiffuse,
    tape: cachedCremaTape
  }
}

/**
 * Applies authentic cosmetic skincare materials to the VeraVitalize Crema 3D model:
 * - 'bottle': Semi-transparent frosted container with a fresh aloe-mint green tint,
 *             retaining the printed product label texture and letting the interior cream softly show through.
 * - 'cream': Voluptuous inner cosmetic cream body with authentic swirled aloe-green and white cream textures.
 * - 'tape': Screw-top jar cap with the original printed botanical aloe graphics and satin metallic finish.
 */
export function applySkinCareCremaMaterials(scene: THREE.Object3D) {
  const textures = getOrCreateCremaTextures()

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true

      const name = (mesh.name || '').toLowerCase()
      const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
      const origMap = (origMat as THREE.MeshStandardMaterial)?.map || null

      if (name.includes('bottle')) {
        // Semi-transparent frosted acrylic/glass jar with greenish tint
        const bottleMap = origMap || textures.etiqueta
        if (bottleMap) bottleMap.colorSpace = THREE.SRGBColorSpace

        mesh.material = new THREE.MeshPhysicalMaterial({
          map: bottleMap,
          color: new THREE.Color('#99f6e4'), // Soft luminous aloe mint tone
          roughness: 0.16,                   // Frosted cosmetic container finish
          transmission: 0.68,                // Translucency allowing the inner cream to softly be seen
          thickness: 0.85,                   // Refraction optical depth
          ior: 1.48,                         // Cosmetic acrylic / glass IOR
          transparent: true,
          opacity: 0.85,                     // Substantial volume while preserving transparency
          reflectivity: 0.85,
          clearcoat: 0.7,
          clearcoatRoughness: 0.12,
          side: THREE.DoubleSide,
          depthWrite: false,                 // Eliminates z-fighting with inner cream
        })
        mesh.renderOrder = 10                // Render on top of inner cream
      } else if (name.includes('cream')) {
        // Inner cream contents (visible through the semi-transparent jar walls)
        const creamMap = origMap || textures.cream
        if (creamMap) creamMap.colorSpace = THREE.SRGBColorSpace

        mesh.material = new THREE.MeshStandardMaterial({
          map: creamMap,
          color: new THREE.Color('#ffffff'),
          roughness: 0.22,
          metalness: 0.0,
          side: THREE.DoubleSide,
          depthWrite: true,
        })
        mesh.renderOrder = 1                 // Render first
      } else if (name.includes('tape')) {
        // Cap with botanical print and satin finish
        const tapeMap = origMap || textures.tape
        if (tapeMap) tapeMap.colorSpace = THREE.SRGBColorSpace

        mesh.material = new THREE.MeshStandardMaterial({
          map: tapeMap,
          color: new THREE.Color('#ffffff'),
          roughness: 0.28,
          metalness: 0.22,
          side: THREE.DoubleSide,
          depthWrite: true,
        })
        mesh.renderOrder = 5
      }
    }
  })
}

