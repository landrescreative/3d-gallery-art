import React, { useEffect, useRef, useState } from 'react'
import nipplejs from 'nipplejs'

// Global object to share joystick state with PlayerController
export const mobileControlsState = {
  moveVector: { x: 0, y: 0 }, // -1 to 1
  lookDelta: { x: 0, y: 0 },
  isTapping: false,
  tapPosition: null as { x: number, y: number } | null,
}

// Expose to window for debugging
if (typeof window !== 'undefined') {
  ;(window as any).__mobileControlsState = mobileControlsState
}

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  const hasCoarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
  return isMobileUA || (hasCoarse && hasTouch && window.innerWidth <= 1024)
}

export const MobileControls: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice)
  const joystickZoneRef = useRef<HTMLDivElement>(null)
  const lookZoneRef = useRef<HTMLDivElement>(null)
  const [isJoystickActive, setIsJoystickActive] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(isMobileDevice())
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile) return
    // Auto-hide guides after 7 seconds if no interaction
    const timer = setTimeout(() => {
      setHasInteracted(true)
    }, 7000)
    return () => clearTimeout(timer)
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) return
    // 1. Setup Joystick (Left side)
    const joystickZone = joystickZoneRef.current
    if (!joystickZone) return
    const manager = nipplejs.create({
      zone: joystickZone,
      mode: 'dynamic',
      color: '#ffffff',
      size: 110,
    })

    // Listen for quick taps on left zone as well
    let leftTouchStart = { x: 0, y: 0, time: 0 }
    const onLeftTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      leftTouchStart = { x: t.clientX, y: t.clientY, time: Date.now() }
    }
    const onLeftTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0]
      const dt = Date.now() - leftTouchStart.time
      const dist = Math.hypot(t.clientX - leftTouchStart.x, t.clientY - leftTouchStart.y)
      if (dt < 380 && dist < 24) {
        mobileControlsState.isTapping = true
        mobileControlsState.tapPosition = { x: t.clientX, y: t.clientY }
        window.dispatchEvent(
          new CustomEvent('canvas-mobile-tap', {
            detail: { x: t.clientX, y: t.clientY }
          })
        )
        setTimeout(() => {
          mobileControlsState.isTapping = false
          mobileControlsState.tapPosition = null
        }, 150)
      }
    }
    joystickZone.addEventListener('touchstart', onLeftTouchStart, { capture: true, passive: true })
    joystickZone.addEventListener('touchend', onLeftTouchEnd, { capture: true, passive: true })

    // @ts-ignore
    manager.on('start', () => {
      setIsJoystickActive(true)
      setHasInteracted(true)
    })

    // @ts-ignore
    manager.on('move', function(evt, data) {
      const actualData = data || (evt as any).data;
      if (!actualData || typeof actualData.distance !== 'number') return
      if (actualData.distance === 0 || !actualData.angle) {
        mobileControlsState.moveVector.x = 0
        mobileControlsState.moveVector.y = 0
        return
      }
      const distance = Math.min(actualData.distance, 55) / 55 // normalized 0 to 1
      mobileControlsState.moveVector.x = Math.cos(actualData.angle.radian) * distance
      mobileControlsState.moveVector.y = Math.sin(actualData.angle.radian) * distance
    })

    // @ts-ignore
    manager.on('end', () => {
      setIsJoystickActive(false)
      mobileControlsState.moveVector.x = 0
      mobileControlsState.moveVector.y = 0
    })

    // 2. Setup Look Zone (Right side)
    const lookZone = lookZoneRef.current
    if (!lookZone) return

    let rightTouchStart = { x: 0, y: 0, time: 0 }
    let lastTouch = { x: 0, y: 0 }
    let isDragging = false
    let isTap = false

    const onTouchStart = (e: TouchEvent) => {
      setHasInteracted(true)
      e.preventDefault() // prevent scrolling
      const touch = e.changedTouches[0]
      rightTouchStart = { x: touch.clientX, y: touch.clientY, time: Date.now() }
      lastTouch = { x: touch.clientX, y: touch.clientY }
      isDragging = true
      isTap = true
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - lastTouch.x
      const deltaY = touch.clientY - lastTouch.y

      const totalDist = Math.hypot(touch.clientX - rightTouchStart.x, touch.clientY - rightTouchStart.y)
      if (totalDist > 22) {
        isTap = false
      }

      mobileControlsState.lookDelta.x += deltaX
      mobileControlsState.lookDelta.y += deltaY

      lastTouch = { x: touch.clientX, y: touch.clientY }
    }

    const onTouchEnd = (e: TouchEvent) => {
      isDragging = false
      const touch = e.changedTouches[0]
      const dt = Date.now() - rightTouchStart.time
      const totalDist = Math.hypot(touch.clientX - rightTouchStart.x, touch.clientY - rightTouchStart.y)

      if (isTap && dt < 380 && totalDist < 25) {
        mobileControlsState.isTapping = true
        mobileControlsState.tapPosition = { x: touch.clientX, y: touch.clientY }
        window.dispatchEvent(
          new CustomEvent('canvas-mobile-tap', {
            detail: { x: touch.clientX, y: touch.clientY }
          })
        )
        setTimeout(() => {
          mobileControlsState.isTapping = false
          mobileControlsState.tapPosition = null
        }, 150)
      }
    }

    lookZone.addEventListener('touchstart', onTouchStart, { passive: false })
    lookZone.addEventListener('touchmove', onTouchMove, { passive: false })
    lookZone.addEventListener('touchend', onTouchEnd)
    lookZone.addEventListener('touchcancel', onTouchEnd)

    return () => {
      manager.destroy()
      joystickZone.removeEventListener('touchstart', onLeftTouchStart)
      joystickZone.removeEventListener('touchend', onLeftTouchEnd)
      lookZone.removeEventListener('touchstart', onTouchStart)
      lookZone.removeEventListener('touchmove', onTouchMove)
      lookZone.removeEventListener('touchend', onTouchEnd)
      lookZone.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [isMobile])

  if (!isMobile) return null

  return (
    <div 
      className="mobile-controls-container"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', // Let clicks pass through where there are no controls
        zIndex: 5, // Lower than TopNav (20) and HUD (10)
        display: 'flex'
      }}
    >
      {/* Left side: Joystick Zone */}
      <div 
        ref={joystickZoneRef} 
        style={{
          width: '50%', height: '100%',
          pointerEvents: 'auto',
          touchAction: 'none',
          position: 'relative'
        }}
      >
        {/* Luxury Idle Joystick Indicator */}
        <div className={`joystick-idle-guide ${isJoystickActive ? 'active' : ''}`}>
          <div className="joystick-idle-ring">
            <div className="joystick-idle-dot" />
          </div>
          <span className="joystick-idle-label">Mover</span>
        </div>
      </div>

      {/* Right side: Look Zone */}
      <div 
        ref={lookZoneRef} 
        style={{
          width: '50%', height: '100%',
          pointerEvents: 'auto',
          touchAction: 'none',
          position: 'relative'
        }}
      >
        {/* Subtle Look Guide */}
        <div className={`look-idle-guide ${hasInteracted ? 'hidden' : ''}`}>
          <div className="look-idle-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3 4 7l4 4"/>
              <path d="M4 7h16"/>
              <path d="m16 21 4-4-4-4"/>
              <path d="M20 17H4"/>
            </svg>
          </div>
          <span className="look-idle-label">Mirar</span>
        </div>
      </div>
    </div>
  )
}
