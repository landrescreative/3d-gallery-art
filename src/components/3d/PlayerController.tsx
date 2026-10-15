import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Artwork, Sculpture } from '../../types/gallery'
import { audioManager, SurfaceType, GalleryRoomId } from '../../utils/audio'
import { mobileControlsState } from '../ui/MobileControls'
import { zoomManager } from '../../utils/zoomState'

interface PlayerControllerProps {
  artworks: Artwork[]
  sculptures: Sculpture[]
  onNearestChange: (item: Artwork | Sculpture | null) => void
  onInspect: (item: Artwork | Sculpture) => void
  teleportTarget: [number, number, number] | null
  onTeleportComplete: () => void
  isInspecting: boolean
  isTouring: boolean
  isDebugging?: boolean
}

// Collision definitions
// Ergonomic player collision radius (calibrated for 2.0-5.0m doorways and realistic human clearance)
const PLAYER_RADIUS = 0.40

// All interior furniture, pedestals, display tables, and viewing benches as AABB colliders
const BOX_OBSTACLES = [
  // 1. Modern Architectural Display Table in UI/UX Pavilion [14.0, 0, -0.5] (2.4m wide x 5.0m long)
  { minX: 12.8, maxX: 15.2, minZ: -3.0, maxZ: 2.0 },

  // 2. Museum viewing benches
  // Atrium side benches [-4.2, 2.0] and [4.2, 2.0]
  { minX: -5.3, maxX: -3.1, minZ: 1.6, maxZ: 2.4 },
  { minX: 3.1, maxX: 5.3, minZ: 1.6, maxZ: 2.4 },
  // Atrium South wall viewing benches [-4.8, 7.4] and [4.8, 7.4]
  { minX: -6.0, maxX: -3.6, minZ: 7.0, maxZ: 7.8 },
  { minX: 3.6, maxX: 6.0, minZ: 7.0, maxZ: 7.8 },
  // Sala 3D central viewing bench [0, -16]
  { minX: -1.4, maxX: 1.4, minZ: -16.5, maxZ: -15.5 },

  // 3. Pedestals
  // Torus Knot [0, 0]
  { minX: -0.6, maxX: 0.6, minZ: -0.6, maxZ: 0.6 },
  // Golden Helix [-14.0, -0.5] (Graphic Gallery center)
  { minX: -14.6, maxX: -13.4, minZ: -1.1, maxZ: 0.1 },
  // Kinetic Vortex [0, -21]
  { minX: -0.6, maxX: 0.6, minZ: -21.6, maxZ: -20.4 },
  // Art Toy Conejo [-5.8, -12.5]
  { minX: -6.4, maxX: -5.2, minZ: -13.1, maxZ: -11.9 },
  // Inartiva Chibi [5.8, -12.5]
  { minX: 5.2, maxX: 6.4, minZ: -13.1, maxZ: -11.9 },
  // AforeAventura 1 [-6, -16]
  { minX: -6.6, maxX: -5.4, minZ: -16.6, maxZ: -15.4 },
  // AforeAventura 2 [-6, -20.5]
  { minX: -6.6, maxX: -5.4, minZ: -21.1, maxZ: -19.9 },
  // AforeAventura 3 [6, -16]
  { minX: 5.4, maxX: 6.6, minZ: -16.6, maxZ: -15.4 },
  // AforeAventura 4 [6, -20.5]
  { minX: 5.4, maxX: 6.6, minZ: -21.1, maxZ: -19.9 },
  // Architectural Maqueta Display Table [0, -21.5]
  { minX: -1.3, maxX: 1.3, minZ: -22.5, maxZ: -20.5 },
  // VeraVitalize Skincare Crema [-9.5, -13.5]
  { minX: -10.1, maxX: -8.9, minZ: -14.1, maxZ: -12.9 }
]

// Architectural monolithic columns
const PILLARS = [
  { x: -4.5, z: 3, radius: 0.4 },
  { x: 4.5, z: 3, radius: 0.4 },
  { x: -4.5, z: -3, radius: 0.4 },
  { x: 4.5, z: -3, radius: 0.4 },
  { x: -8.5, z: -11, radius: 0.4 },
  { x: 8.5, z: -11, radius: 0.4 },
  { x: -8.5, z: -21, radius: 0.4 },
  { x: 8.5, z: -21, radius: 0.4 }
]

/**
 * Exact geometric collision solver matching GalleryArchitecture room blueprints:
 * Eliminates misplaced invisible walls inside Graphic Gallery, UI/UX, and hallway.
 */
function isColliding(x: number, z: number): boolean {
  // 1. Check circular architectural columns
  for (const p of PILLARS) {
    const dx = x - p.x
    const dz = z - p.z
    const combinedRadius = p.radius + PLAYER_RADIUS
    if (dx * dx + dz * dz < combinedRadius * combinedRadius) {
      return true
    }
  }

  // 2. Check interior furniture & pedestal obstacles
  for (const box of BOX_OBSTACLES) {
    if (
      x >= box.minX - PLAYER_RADIUS &&
      x <= box.maxX + PLAYER_RADIUS &&
      z >= box.minZ - PLAYER_RADIUS &&
      z <= box.maxZ + PLAYER_RADIUS
    ) {
      return true
    }
  }

  // 3. Zone A: Sala 3D, CGI & Escultura (Z <= -9.0)
  if (z <= -9.0) {
    // Outer boundaries of Sala 3D (X in [-13.8, 13.8], Z in [-25.8, -9.0])
    if (x < -13.8 + PLAYER_RADIUS || x > 13.8 - PLAYER_RADIUS || z < -25.8 + PLAYER_RADIUS) {
      return true
    }
    // South wall of Sala 3D flanking the portal at Z = -9 (portal opening is [-3.5, 3.5])
    if (z >= -9.0 - 0.2 - PLAYER_RADIUS) {
      if (x < -3.5 + PLAYER_RADIUS || x > 3.5 - PLAYER_RADIUS) {
        return true
      }
    }
    return false
  }

  // 4. Zone B: Main Gallery Floor (-9.0 < z <= 8.0: Atrium, Graphic Gallery, UI/UX Pavilion)
  // Outer lateral boundaries: West wall at X = -20.8, East wall at X = 20.8
  if (x < -20.8 + PLAYER_RADIUS || x > 20.8 - PLAYER_RADIUS) {
    return true
  }

  // South wall along Z = 8.0 (Solid continuous wall across Atrium, Graphic, UI/UX)
  if (z >= 8.0 - 0.2 - PLAYER_RADIUS) {
    return true
  }

  // North boundary walls along Z = -9.0 for Graphic Gallery (X < -7) and UI/UX (X > 7)
  if (z <= -9.0 + 0.2 + PLAYER_RADIUS) {
    if (x < -7.0 || x > 7.0) {
      return true
    }
  }

  // North Hallway connecting Atrium to Sala 3D (-9.0 < z < -6.0)
  if (z < -6.0) {
    // Solid core wall between Graphic Gallery (X <= -7) and Central Hallway (X >= -3.5)
    if (x > -7.0 - PLAYER_RADIUS && x < -3.5 + PLAYER_RADIUS) {
      return true
    }
    // Solid core wall between Central Hallway (X <= 3.5) and UI/UX Pavilion (X >= 7.0)
    if (x > 3.5 - PLAYER_RADIUS && x < 7.0 + PLAYER_RADIUS) {
      return true
    }
  }

  // North divider wall at Z = -6.0 (between Atrium and Central Hallway)
  if (z >= -6.0 - 0.2 - PLAYER_RADIUS && z <= -6.0 + 0.2 + PLAYER_RADIUS) {
    // Wall flanks the 7m portal: exists between [-7.0, -3.5] and [3.5, 7.0]
    if ((x >= -7.0 && x <= -3.5 + PLAYER_RADIUS) || (x >= 3.5 - PLAYER_RADIUS && x <= 7.0)) {
      return true
    }
  }

  // Internal Dividers along X = -7.0 (Graphic Gallery) and X = 7.0 (UI/UX Pavilion)
  // These walls have open portals between Z = -2.5 and Z = 2.5
  if (z > 2.5 - PLAYER_RADIUS || z < -2.5 + PLAYER_RADIUS) {
    // West divider wall along X = -7.0
    if (x >= -7.0 - 0.2 - PLAYER_RADIUS && x <= -7.0 + 0.2 + PLAYER_RADIUS) {
      return true
    }
    // East divider wall along X = 7.0
    if (x >= 7.0 - 0.2 - PLAYER_RADIUS && x <= 7.0 + 0.2 + PLAYER_RADIUS) {
      return true
    }
  }

  return false
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  artworks,
  sculptures,
  onNearestChange,
  onInspect,
  teleportTarget,
  onTeleportComplete,
  isInspecting,
  isTouring,
  isDebugging = false
}) => {
  const { camera, gl, scene } = useThree()

  // Keys state
  const keys = useRef<{ [key: string]: boolean }>({})
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const isLocked = useRef(false)
  const bobTimer = useRef(0)
  const raycastTimer = useRef(0)
  const nearestItemRef = useRef<Artwork | Sculpture | null>(null)

  // Desired player eye height
  const eyeHeight = 1.7

  const raycaster = React.useMemo(() => new THREE.Raycaster(), [])
  const center = React.useMemo(() => new THREE.Vector2(0, 0), [])
  const isFovInitialized = useRef(false)

  const isFirstMoveAfterLock = useRef(false)

  // Setup initial camera position and force base FOV immediately (no initial lerp / warp)
  useEffect(() => {
    camera.position.set(0, eyeHeight, 5)
    euler.current.setFromQuaternion(camera.quaternion)
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 70
      camera.updateProjectionMatrix()
    }
    isFovInitialized.current = true
    zoomManager.setZoom(false)
  }, [camera])

  // Handle pointer lock
  useEffect(() => {
    const canvas = gl.domElement

    const onPointerLockChange = () => {
      const locked = !!document.pointerLockElement
      isLocked.current = locked
      if (locked) {
        isFirstMoveAfterLock.current = true
      } else {
        // Clear all keys and disable zoom when escaping
        keys.current = {}
        zoomManager.setZoom(false)
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!isLocked.current || isInspecting || isTouring || isDebugging) return

      // Smoothly absorb any anomalous initial pointer-lock coordinate jump
      if (isFirstMoveAfterLock.current) {
        isFirstMoveAfterLock.current = false
        if (Math.abs(event.movementX) > 40 || Math.abs(event.movementY) > 40) {
          return
        }
      }

      const movementX = event.movementX || 0
      const movementY = event.movementY || 0

      // Scale sensitivity down when zoomed in for precision aiming
      const baseFov = 70
      const currentFov = (camera as THREE.PerspectiveCamera).fov || baseFov
      const fovFactor = Math.min(1.0, currentFov / baseFov)

      euler.current.y -= movementX * 0.0022 * fovFactor
      euler.current.x -= movementY * 0.0022 * fovFactor

      // Clamp pitch (-85deg to +85deg)
      euler.current.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, euler.current.x))

      camera.quaternion.setFromEuler(euler.current)
    }

    const tryInspect = () => {
      if (isInspecting || isTouring || isDebugging || zoomManager.isZoomed || !nearestItemRef.current) return
      onInspect(nearestItemRef.current)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore keys if user is typing into input, textarea, or select
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return
      }

      keys.current[e.code] = true
      if (e.code === 'KeyE' || e.code === 'Enter') {
        tryInspect()
      } else if (e.code === 'KeyZ') {
        // Key Z toggles optical zoom
        zoomManager.toggleZoom()
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      // Right Click (button 2) holds zoom
      if (e.button === 2) {
        e.preventDefault()
        zoomManager.setZoom(true)
        return
      }

      // Left Click (button 0): Only inspect if pointer is ALREADY locked in-game and not zooming
      if (document.pointerLockElement === canvas && e.button === 0 && !zoomManager.isZoomed) {
        tryInspect()
      }
    }

    const onMouseUp = (e: MouseEvent) => {
      // Right Click release releases zoom
      if (e.button === 2) {
        e.preventDefault()
        zoomManager.setZoom(false)
      }
    }

    const onContextMenu = (e: MouseEvent) => {
      // Prevent browser context menu on right click to allow clean zoom
      e.preventDefault()
    }

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }

    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove, { passive: false })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [gl, camera, isInspecting, isTouring, onInspect])

  // Exit pointer lock if inspecting or touring
  useEffect(() => {
    if ((isInspecting || isTouring) && document.pointerLockElement) {
      document.exitPointerLock()
    }
  }, [isInspecting, isTouring])

  // When exiting guided tour, reliably return player to spawn point in Grand Atrium
  const wasTouringRef = useRef(isTouring)
  useEffect(() => {
    if (wasTouringRef.current && !isTouring) {
      camera.position.set(0, eyeHeight, 5)
      euler.current.set(0, 0, 0)
      camera.quaternion.setFromEuler(euler.current)
    }
    wasTouringRef.current = isTouring
  }, [isTouring, camera])

  // Teleport animation
  useEffect(() => {
    if (teleportTarget) {
      const targetPos = new THREE.Vector3(...teleportTarget)
      targetPos.y = eyeHeight
      camera.position.copy(targetPos)

      // Orient gaze naturally towards the focus of each room
      if (targetPos.x < -7) {
        // Graphic Design: Look West into the gallery
        euler.current.set(0, Math.PI / 2, 0)
      } else if (targetPos.x > 7) {
        // UI/UX Pavilion: Look East into the pavilion
        euler.current.set(0, -Math.PI / 2, 0)
      } else {
        // Atrium or Sala 3D: Look North down the grand hall
        euler.current.set(0, 0, 0)
      }
      camera.quaternion.setFromEuler(euler.current)

      onTeleportComplete()
    }
  }, [teleportTarget, camera, onTeleportComplete])

  // Main frame loop
  useFrame((state, delta) => {
    // Force R3F pointer to center when locked so hover events work correctly!
    if (isLocked.current) {
      state.pointer.set(0, 0)
    }

    // Handle mobile look delta
    if (mobileControlsState.lookDelta.x !== 0 || mobileControlsState.lookDelta.y !== 0) {
      euler.current.y -= mobileControlsState.lookDelta.x * 0.003
      euler.current.x -= mobileControlsState.lookDelta.y * 0.003
      euler.current.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, euler.current.x))
      camera.quaternion.setFromEuler(euler.current)
      
      mobileControlsState.lookDelta.x = 0
      mobileControlsState.lookDelta.y = 0
    }

    // Handle mobile tap to inspect
    if (mobileControlsState.isTapping && nearestItemRef.current && !isInspecting) {
      onInspect(nearestItemRef.current)
      mobileControlsState.isTapping = false
    }

    // Smooth Camera Optical Zoom Interpolation (2x Optic Zoom: 70deg -> 35deg)
    const baseFov = 70
    if (!isFovInitialized.current) {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = baseFov
        camera.updateProjectionMatrix()
      }
      isFovInitialized.current = true
    } else {
      const isZoomed = zoomManager.isZoomed && !isInspecting && !isTouring
      const targetFov = isZoomed ? 35 : baseFov
      if (camera instanceof THREE.PerspectiveCamera) {
        if (Math.abs(camera.fov - targetFov) > 0.05) {
          camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 14)
          camera.updateProjectionMatrix()
        }
      }
    }

    if (isInspecting || isTouring || isDebugging) return

    // Movement calculation
    const moveSpeed = (keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? 6.5 : 3.8) * delta
    const moveVector = new THREE.Vector3()

    if (keys.current['KeyW'] || keys.current['ArrowUp']) moveVector.z -= 1
    if (keys.current['KeyS'] || keys.current['ArrowDown']) moveVector.z += 1
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveVector.x -= 1
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveVector.x += 1

    // Add mobile joystick vector
    moveVector.x += mobileControlsState.moveVector.x
    moveVector.z -= mobileControlsState.moveVector.y // -y because joystick up is positive y, but in 3D world forward is -z

    const isMoving = moveVector.lengthSq() > 0

    if (isMoving) {
      moveVector.normalize()

      // Convert local movement to world space direction
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, euler.current.y, 0))
      const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, euler.current.y, 0))

      const worldMovement = new THREE.Vector3()
        .addScaledVector(forward, -moveVector.z * moveSpeed)
        .addScaledVector(right, moveVector.x * moveSpeed)

      // Axis-separated sliding collision resolution
      let curX = camera.position.x
      let curZ = camera.position.z

      const targetX = curX + worldMovement.x
      const targetZ = curZ + worldMovement.z

      // 1. Try combined movement
      if (!isColliding(targetX, targetZ)) {
        camera.position.x = targetX
        camera.position.z = targetZ
      } else {
        // 2. Slide on X axis
        if (!isColliding(targetX, curZ)) {
          camera.position.x = targetX
        }
        // 3. Slide on Z axis
        if (!isColliding(curX, targetZ)) {
          camera.position.z = targetZ
        }
      }

      // All rooms feature authentic hardwood museum flooring
      const surface: SurfaceType = 'wood'

      // Footsteps sound tuned to surface material
      audioManager.playFootstep(surface)

      // Head bobbing
      bobTimer.current += delta * 10
      camera.position.y = eyeHeight + Math.sin(bobTimer.current) * 0.035
    } else {
      // Smooth return to resting eye height
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, eyeHeight, delta * 6)
    }

    // Adaptive Room Acoustic Resonance
    let currentRoom: GalleryRoomId = 'atrium'
    if (camera.position.x < -7.0) {
      currentRoom = 'graphic'
    } else if (camera.position.x > 7.0) {
      currentRoom = 'ui_ux'
    } else if (camera.position.z < -6.0) {
      currentRoom = '3d'
    } else {
      currentRoom = 'atrium'
    }
    audioManager.setRoom(currentRoom)

    // Interaction check: Look for item in crosshair within 4.5m
    // Throttled to 10 FPS (every 100ms) and spatial distance pre-filtered to eliminate frame spikes
    raycastTimer.current += delta
    if (raycastTimer.current > 0.1) {
      raycastTimer.current = 0
      let lookedAtItem: Artwork | Sculpture | null = null

      const px = camera.position.x
      const pz = camera.position.z

      // Proximity check: Only run scene raycast if player is within 5.0m of at least one item
      const hasItemNearby = artworks.some(a => {
        const dx = px - a.position[0]
        const dz = pz - a.position[2]
        return dx * dx + dz * dz < 25
      }) || sculptures.some(s => {
        const dx = px - s.position[0]
        const dz = pz - s.position[2]
        return dx * dx + dz * dz < 25
      })

      if (hasItemNearby) {
        raycaster.setFromCamera(center, camera)
        const intersects = raycaster.intersectObjects(scene.children, true)
        
        for (const hit of intersects) {
          if (hit.distance > 4.5) break
          
          // Traverse up to find interactableId (since it might be on a parent group)
          let current: THREE.Object3D | null = hit.object
          let id: string | undefined = undefined
          
          while (current) {
            if (current.userData?.interactableId) {
              id = current.userData.interactableId
              break
            }
            current = current.parent
          }

          if (id) {
            lookedAtItem = artworks.find(a => a.id === id) || sculptures.find(s => s.id === id) || null
            break
          }
        }
      }

      if (lookedAtItem !== nearestItemRef.current) {
        nearestItemRef.current = lookedAtItem
        onNearestChange(lookedAtItem)
      }
    }
  })

  return null
}
