import { useState, useEffect } from 'react'
import { audioManager } from './audio'

type ZoomListener = (isZoomed: boolean) => void

class ZoomController {
  private _isZoomed = false
  private listeners: Set<ZoomListener> = new Set()

  get isZoomed(): boolean {
    return this._isZoomed
  }

  setZoom(val: boolean) {
    if (this._isZoomed !== val) {
      this._isZoomed = val
      audioManager.playCameraZoom(val)
      this.listeners.forEach((cb) => cb(this._isZoomed))
    }
  }

  toggleZoom() {
    this.setZoom(!this._isZoomed)
  }

  subscribe(listener: ZoomListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }
}

export const zoomManager = new ZoomController()

export function useZoomState(): boolean {
  const [isZoomed, setIsZoomed] = useState(zoomManager.isZoomed)

  useEffect(() => {
    return zoomManager.subscribe((val) => {
      setIsZoomed(val)
    })
  }, [])

  return isZoomed
}
