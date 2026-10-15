import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Artwork, Sculpture } from '../../types/gallery'
import { audioManager } from '../../utils/audio'

interface CinematicTourProps {
  isTouring: boolean
  currentIndex: number
  items: (Artwork | Sculpture)[]
  onItemReached: (item: Artwork | Sculpture) => void
}

export const CinematicTour: React.FC<CinematicTourProps> = ({
  isTouring,
  currentIndex,
  items,
  onItemReached
}) => {
  const { camera } = useThree()
  const currentTargetPos = useRef(new THREE.Vector3())
  const currentLookAtPos = useRef(new THREE.Vector3())
  const hasSpokenRef = useRef<number>(-1)

  // Stop speech immediately whenever tour stops or component unmounts
  useEffect(() => {
    if (!isTouring) {
      audioManager.stopSpeaking()
      hasSpokenRef.current = -1
    }
    return () => {
      audioManager.stopSpeaking()
    }
  }, [isTouring])

  useEffect(() => {
    if (!isTouring || items.length === 0) return

    const item = items[currentIndex]
    if (!item) return

    // Calculate viewing spot in front of the piece
    const pos = item.position
    const lookAtHeight = 'pedestalHeight' in item ? (item.pedestalHeight + 0.65) : pos[1]
    const lookAt = new THREE.Vector3(pos[0], lookAtHeight, pos[2])

    const isTableDevice = 'displayType' in item && (item.displayType === 'table_tablet' || item.displayType === 'table_laptop')
    const viewDist = isTableDevice ? 1.9 : 3.2
    let viewOffset = new THREE.Vector3(0, 0, viewDist)
    if ('rotation' in item) {
      // It's an artwork on a wall or table: position in front based on rotation
      const rotY = item.rotation[1]
      viewOffset = new THREE.Vector3(Math.sin(rotY) * viewDist, 0, Math.cos(rotY) * viewDist)
    } else {
      // Sculpture: position camera safely inside the unobstructed central walkway
      if (pos[2] < -8) {
        if (Math.abs(pos[0]) < 1.0) {
          // Centered architectural table: view comfortably from South
          viewOffset = new THREE.Vector3(0, 0.4, 2.6)
        } else {
          // Pedestals on West (pos[0] < 0) or East (pos[0] > 0):
          // Place camera in the wide central aisle (X ~ ±3.0) facing the pedestal
          const xDir = pos[0] < 0 ? 1 : -1
          viewOffset = new THREE.Vector3(xDir * 2.8, 0.35, 0.0)
        }
      } else {
        // Grand Atrio central sculpture
        viewOffset = new THREE.Vector3(0, 0.4, 3.2)
      }
    }

    currentTargetPos.current.set(lookAt.x + viewOffset.x, 1.7, lookAt.z + viewOffset.z)
    currentLookAtPos.current.copy(lookAt)

    // Trigger audio guide commentary if index changed
    if (hasSpokenRef.current !== currentIndex) {
      hasSpokenRef.current = currentIndex
      onItemReached(item)
      audioManager.stopSpeaking()
      audioManager.speakCuratorGuide(`${item.title}, por ${item.artist}. ${item.curatorNotes}`)
    }

    return () => {
      audioManager.stopSpeaking()
    }
  }, [isTouring, currentIndex, items, onItemReached])

  useFrame((_, delta) => {
    if (!isTouring) return

    // Smoothly glide camera position
    camera.position.lerp(currentTargetPos.current, delta * 2.2)

    // Smoothly interpolate camera lookAt direction
    const currentRot = camera.quaternion.clone()
    camera.lookAt(currentLookAtPos.current)
    const targetRot = camera.quaternion.clone()
    camera.quaternion.copy(currentRot).slerp(targetRot, delta * 3.0)
  })

  return null
}
