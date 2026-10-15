import React, { useState, useEffect, useRef } from 'react'
import { useProgress } from '@react-three/drei'

interface PreloaderProps {
  isSwitching?: boolean
  switchTitle?: string
  onSwitchComplete?: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({
  isSwitching = false,
  switchTitle,
  onSwitchComplete
}) => {
  const { active, progress } = useProgress()
  const [initialProgress, setInitialProgress] = useState(0)
  const [initialFading, setInitialFading] = useState(false)
  const [initialDone, setInitialDone] = useState(false)
  const initialTargetRef = useRef(0)

  // Switch transition states
  const [switchProgress, setSwitchProgress] = useState(0)
  const [switchFading, setSwitchFading] = useState(false)

  // Track initial load progress
  useEffect(() => {
    initialTargetRef.current = Math.max(progress, initialTargetRef.current)
  }, [progress])

  // Smooth lerp for initial load
  useEffect(() => {
    if (initialDone) return
    let animId: number
    const animate = () => {
      setInitialProgress((prev) => {
        const target = initialTargetRef.current
        if (prev >= 100) return 100
        const diff = target - prev
        const step = Math.max(0.5, diff * 0.15)
        return Math.min(target, prev + step)
      })
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [initialDone])

  // Auto fade-out for initial load
  useEffect(() => {
    if (initialDone) return
    if (initialProgress >= 99.5 || (!active && progress === 100)) {
      const timer = setTimeout(() => {
        setInitialFading(true)
        setTimeout(() => {
          setInitialDone(true)
        }, 750)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [initialProgress, active, progress, initialDone])

  // Initial safety fallback (max 4.5s)
  useEffect(() => {
    if (initialDone) return
    const safety = setTimeout(() => {
      initialTargetRef.current = 100
      setInitialProgress(100)
    }, 4500)
    return () => clearTimeout(safety)
  }, [initialDone])

  // Handle Graphics Mode Switch Transition
  useEffect(() => {
    if (!isSwitching) {
      setSwitchProgress(0)
      setSwitchFading(false)
      return
    }

    setSwitchProgress(0)
    setSwitchFading(false)

    const startTime = performance.now()
    const duration = 500 // 500ms progress sweep
    let animId: number

    const step = (now: number) => {
      const elapsed = now - startTime
      const p = Math.min(100, (elapsed / duration) * 100)
      setSwitchProgress(p)

      if (p < 100) {
        animId = requestAnimationFrame(step)
      } else {
        // Hold 100% briefly then fade out
        setTimeout(() => {
          setSwitchFading(true)
          setTimeout(() => {
            if (onSwitchComplete) onSwitchComplete()
          }, 450)
        }, 150)
      }
    }

    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [isSwitching, onSwitchComplete])

  // If neither initial load nor switching is active, render nothing
  if (initialDone && !isSwitching) return null

  // Determine current active mode
  const activeFading = isSwitching ? switchFading : initialFading
  const activeProgress = isSwitching ? switchProgress : initialProgress
  const rounded = Math.min(100, Math.round(activeProgress))
  const displaySubtitle = isSwitching ? (switchTitle || 'Recalibrando motor gráfico...') : null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        opacity: activeFading ? 0 : 1,
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: activeFading ? 'none' : 'auto',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px'
        }}
      >
        {/* Minimalist Title */}
        <h1
          style={{
            fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.35em',
            color: '#ffffff',
            textTransform: 'uppercase',
            margin: 0
          }}
        >
          Landres Creative
        </h1>

        {/* Dynamic Mode Switch Subtitle */}
        {displaySubtitle && (
          <span
            style={{
              fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.15em',
              color: '#94a3b8',
              textTransform: 'uppercase',
              margin: '-4px 0 0 0'
            }}
          >
            {displaySubtitle}
          </span>
        )}

        {/* Minimalist 1px Progress Line */}
        <div
          style={{
            width: '160px',
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${rounded}%`,
              backgroundColor: '#ffffff',
              transition: isSwitching ? 'none' : 'width 0.1s ease-out'
            }}
          />
        </div>

        {/* Minimalist Tabular Percentage */}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#666666',
            letterSpacing: '0.12em',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {rounded}%
        </span>
      </div>
    </div>
  )
}
export default Preloader
