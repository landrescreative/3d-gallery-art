// Procedural Web Audio API soundscape generator with adaptive room acoustics & surface-aware footsteps
export type SurfaceType = 'stone' | 'wood' | 'tech' | 'cyber'
export type GalleryRoomId = 'atrium' | '3d' | 'graphic' | 'ui_ux'

const ROOM_FREQUENCIES: Record<GalleryRoomId, number[]> = {
  // Grand Atrio Central: Ethereal Cmaj9 / peaceful expansive cathedral
  atrium: [65.41, 130.81, 196.00, 246.94, 329.63],
  // Sala 3D & Escultura: Deep mystical D minor / resonant gallery
  '3d': [73.42, 146.83, 220.00, 261.63, 349.23],
  // Galería de Diseño Gráfico: Warm Scandinavian Fmaj7 / organic acoustic
  graphic: [87.31, 174.61, 261.63, 329.63, 392.00],
  // Pabellón UI/UX & Web: Clean modern digital Emaj9 / crystal tones
  ui_ux: [82.41, 164.81, 246.94, 311.13, 370.00]
}

class AudioManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isPlaying: boolean = true // Active by default
  private isMuted: boolean = false
  private oscillators: OscillatorNode[] = []
  private activeRoom: GalleryRoomId = 'atrium'
  private stepCooldown: boolean = false
  private footstepToggle: boolean = false // Alternate left/right foot gait
  private lofiAudio: HTMLAudioElement | null = null
  private baseVolume: number = 0.12 // Low soothing lofi background volume
  private isPrewarmed: boolean = false
  private stateListeners: Set<(playing: boolean) => void> = new Set()

  constructor() {
    this.setupAutoplayUnlock()
  }

  private setupAutoplayUnlock() {
    if (typeof window === 'undefined') return
    const unlock = () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)

      this.warmup()
      if (this.isPlaying && !this.isMuted && this.lofiAudio) {
        this.lofiAudio.volume = this.baseVolume
        const p = this.lofiAudio.play()
        if (p) {
          p.then(() => {
            this.notifyStateChange()
          }).catch(() => {})
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
    }
    window.addEventListener('pointerdown', unlock, { once: true, passive: true })
    window.addEventListener('keydown', unlock, { once: true, passive: true })
    window.addEventListener('touchstart', unlock, { once: true, passive: true })
  }

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.stateListeners.add(listener)
    listener(this.isPlaying && !this.isMuted)
    return () => this.stateListeners.delete(listener)
  }

  private notifyStateChange() {
    const active = this.isPlaying && !this.isMuted
    this.stateListeners.forEach((l) => l(active))
  }

  public warmup() {
    if (typeof window === 'undefined' || this.isPrewarmed) return
    this.isPrewarmed = true
    try {
      if (!this.lofiAudio) {
        const audio = new Audio('/audio/lofi-study.mp3')
        audio.loop = true
        audio.preload = 'auto'
        audio.volume = this.baseVolume
        this.lofiAudio = audio
      }
    } catch (e) {}
  }

  public init() {
    this.warmup()
    if (this.ctx) return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime)
      this.masterGain.connect(this.ctx.destination)
    } catch (e) {}
  }

  public toggleMute(): boolean {
    this.warmup()

    if (this.isMuted || !this.isPlaying) {
      // Unmute: resume music and footsteps
      this.isMuted = false
      this.isPlaying = true
      if (this.lofiAudio) {
        this.lofiAudio.volume = this.baseVolume
        const playPromise = this.lofiAudio.play()
        if (playPromise) {
          playPromise.catch(() => {})
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {})
      }
    } else {
      // Mute: pause music and silence footsteps
      this.isMuted = true
      this.isPlaying = false
      if (this.lofiAudio) {
        this.lofiAudio.pause()
      }
    }
    this.notifyStateChange()
    return !this.isMuted
  }

  public getIsPlaying(): boolean {
    return this.isPlaying && !this.isMuted
  }

  // Adaptive Room Ambient Chords (Seamless glide transitions)
  public setRoom(room: GalleryRoomId) {
    if (this.activeRoom === room) return
    this.activeRoom = room

    if (!this.isPlaying || !this.ctx || this.oscillators.length === 0) return

    const freqs = ROOM_FREQUENCIES[room] || ROOM_FREQUENCIES.atrium
    const now = this.ctx.currentTime

    // Smoothly portamento frequency of each harmonic voice
    this.oscillators.forEach((osc, idx) => {
      // Half are carrier oscillators, half are LFOs
      if (idx < freqs.length) {
        const targetFreq = freqs[idx]
        osc.frequency.setTargetAtTime(targetFreq, now, 1.8)
      }
    })
  }

  private startAmbient() {
    if (!this.ctx || !this.masterGain) return
    this.stopAmbient()

    const freqs = ROOM_FREQUENCIES[this.activeRoom] || ROOM_FREQUENCIES.atrium

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return
      const osc = this.ctx.createOscillator()
      const filter = this.ctx.createBiquadFilter()
      const oscGain = this.ctx.createGain()

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(400 + idx * 110, this.ctx.currentTime)

      oscGain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx.currentTime)

      // Slow breathing LFO modulation
      const lfo = this.ctx.createOscillator()
      const lfoGain = this.ctx.createGain()
      lfo.frequency.setValueAtTime(0.08 + idx * 0.04, this.ctx.currentTime)
      lfoGain.gain.setValueAtTime(1.8, this.ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      osc.connect(filter)
      filter.connect(oscGain)
      oscGain.connect(this.masterGain)

      osc.start()
      this.oscillators.push(osc)
    })
  }

  private stopAmbient() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop()
        osc.disconnect()
      } catch (e) {}
    })
    this.oscillators = []
  }

  // Water sounds removed: museum now features peaceful acoustic architecture
  public updateWaterProximity(_distance?: number) {
    // No-op
  }

  // 3.1 Procedural Surface-Aware Footsteps
  // - stone: crisp heel impact with brief reverberant hall body
  // - wood: warm, damped Scandinavian parquet clack
  // - tech: clean, subtle tactile click of microcement tiles
  // - cyber: soft sub-bass pulse with synthetic springiness
  public playFootstep(surface: SurfaceType = 'stone') {
    if (this.isMuted || !this.isPlaying) return
    this.init()
    if (!this.ctx || this.stepCooldown) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    this.stepCooldown = true
    setTimeout(() => {
      this.stepCooldown = false
    }, 360)

    try {
      const now = this.ctx.currentTime
      this.footstepToggle = !this.footstepToggle
      const pitchOffset = (Math.random() - 0.5) * 6 + (this.footstepToggle ? 4 : -4)

      switch (surface) {
        case 'wood': {
          // Warm muted parquet
          const osc1 = this.ctx.createOscillator()
          const osc2 = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          const filter = this.ctx.createBiquadFilter()

          osc1.type = 'triangle'
          osc1.frequency.setValueAtTime(140 + pitchOffset, now)
          osc1.frequency.exponentialRampToValueAtTime(55, now + 0.06)

          osc2.type = 'sine'
          osc2.frequency.setValueAtTime(95 + pitchOffset, now)
          osc2.frequency.exponentialRampToValueAtTime(45, now + 0.08)

          filter.type = 'lowpass'
          filter.frequency.setValueAtTime(320, now)

          gain.gain.setValueAtTime(0.045, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07)

          osc1.connect(filter)
          osc2.connect(filter)
          filter.connect(gain)
          gain.connect(this.ctx.destination)

          osc1.start(now)
          osc2.start(now)
          osc1.stop(now + 0.08)
          osc2.stop(now + 0.08)
          break
        }

        case 'tech': {
          // Clean modern microcement click
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          const filter = this.ctx.createBiquadFilter()

          osc.type = 'square'
          osc.frequency.setValueAtTime(360 + pitchOffset, now)
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.04)

          filter.type = 'bandpass'
          filter.frequency.setValueAtTime(480, now)
          filter.Q.setValueAtTime(2.0, now)

          gain.gain.setValueAtTime(0.025, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

          osc.connect(filter)
          filter.connect(gain)
          gain.connect(this.ctx.destination)

          osc.start(now)
          osc.stop(now + 0.05)
          break
        }

        case 'cyber': {
          // Sub-bass bounce & tactile synth click
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          const filter = this.ctx.createBiquadFilter()

          osc.type = 'sine'
          osc.frequency.setValueAtTime(110 + pitchOffset, now)
          osc.frequency.exponentialRampToValueAtTime(36, now + 0.11)

          filter.type = 'lowpass'
          filter.frequency.setValueAtTime(240, now)

          gain.gain.setValueAtTime(0.06, now)
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

          osc.connect(filter)
          filter.connect(gain)
          gain.connect(this.ctx.destination)

          osc.start(now)
          osc.stop(now + 0.13)
          break
        }

        case 'stone':
        default: {
          // Polished marble & basalt heel strike + hollow resonance
          const oscStrike = this.ctx.createOscillator()
          const oscBody = this.ctx.createOscillator()
          const gainStrike = this.ctx.createGain()
          const gainBody = this.ctx.createGain()
          const filter = this.ctx.createBiquadFilter()

          oscStrike.type = 'triangle'
          oscStrike.frequency.setValueAtTime(320 + pitchOffset, now)
          oscStrike.frequency.exponentialRampToValueAtTime(75, now + 0.05)

          oscBody.type = 'sine'
          oscBody.frequency.setValueAtTime(80 + pitchOffset, now)
          oscBody.frequency.exponentialRampToValueAtTime(38, now + 0.13)

          filter.type = 'lowpass'
          filter.frequency.setValueAtTime(280, now)

          gainStrike.gain.setValueAtTime(0.04, now)
          gainStrike.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

          gainBody.gain.setValueAtTime(0.03, now)
          gainBody.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)

          oscStrike.connect(filter)
          oscBody.connect(gainBody)
          filter.connect(gainStrike)

          gainStrike.connect(this.ctx.destination)
          gainBody.connect(this.ctx.destination)

          oscStrike.start(now)
          oscBody.start(now)
          oscStrike.stop(now + 0.06)
          oscBody.stop(now + 0.14)
          break
        }
      }
    } catch (e) {}
  }

  // Voice narration using SpeechSynthesis
  private currentUtterance: SpeechSynthesisUtterance | null = null

  public speakCuratorGuide(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    this.stopSpeaking()

    // Clean text of brackets or technical annotations
    const cleanText = text.replace(/\[.*?\]/g, '').trim()
    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'es-ES'
    utterance.rate = 0.95
    utterance.pitch = 1.0

    // Select the best natural Spanish voice available on device
    try {
      const voices = window.speechSynthesis.getVoices()
      const spanishVoice = voices.find(v => (v.lang === 'es-ES' || v.lang === 'es-MX' || v.lang.startsWith('es')) && !v.name.includes('eSpeak')) ||
                           voices.find(v => v.lang.startsWith('es'))
      if (spanishVoice) {
        utterance.voice = spanishVoice
      }
    } catch {}

    this.currentUtterance = utterance

    // Duck lofi music volume while narrator speaks
    if (this.lofiAudio && this.isPlaying) {
      this.lofiAudio.volume = 0.08
    }

    const restoreVolume = () => {
      if (this.lofiAudio && this.isPlaying) {
        this.lofiAudio.volume = this.baseVolume
      }
    }

    utterance.onend = () => {
      this.currentUtterance = null
      restoreVolume()
      onEnd?.()
    }
    utterance.onerror = () => {
      this.currentUtterance = null
      restoreVolume()
    }

    try {
      window.speechSynthesis.speak(utterance)
    } catch (e) {
      restoreVolume()
    }
  }

  public stopSpeaking() {
    if (this.lofiAudio && this.isPlaying) {
      this.lofiAudio.volume = this.baseVolume
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (this.currentUtterance) {
          this.currentUtterance.onend = null
          this.currentUtterance.onerror = null
          this.currentUtterance = null
        }
        window.speechSynthesis.cancel()
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel()
        }
      } catch (e) {}
    }
  }

  // Optical camera lens servo zoom sound (mechanical whir + tactile lens stop)
  public playCameraZoom(isZoomIn: boolean = true) {
    try {
      this.init()
      if (!this.ctx) return
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }

      const now = this.ctx.currentTime
      const duration = 0.20

      // 1. Servo motor whir: dual harmonic sweep mimicking an optical lens motor
      const osc1 = this.ctx.createOscillator()
      const osc2 = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const filter = this.ctx.createBiquadFilter()

      osc1.type = 'triangle'
      osc2.type = 'sawtooth'

      const startFreq = isZoomIn ? 260 : 420
      const endFreq = isZoomIn ? 440 : 230

      osc1.frequency.setValueAtTime(startFreq, now)
      osc1.frequency.exponentialRampToValueAtTime(endFreq, now + duration)

      osc2.frequency.setValueAtTime(startFreq * 1.5, now)
      osc2.frequency.exponentialRampToValueAtTime(endFreq * 1.5, now + duration)

      // Bandpass filter for camera barrel acoustic resonance
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(isZoomIn ? 800 : 650, now)
      filter.frequency.exponentialRampToValueAtTime(isZoomIn ? 1150 : 580, now + duration)
      filter.Q.setValueAtTime(2.4, now)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(0.038, now + 0.03)
      gain.gain.setValueAtTime(0.038, now + duration - 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      osc1.connect(filter)
      osc2.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + duration + 0.01)
      osc2.stop(now + duration + 0.01)

      // 2. Micro tactile lens lock click at end of zoom transition
      const clickOsc = this.ctx.createOscillator()
      const clickGain = this.ctx.createGain()
      const clickFilter = this.ctx.createBiquadFilter()

      clickOsc.type = 'sine'
      clickOsc.frequency.setValueAtTime(isZoomIn ? 840 : 620, now + duration - 0.02)
      clickOsc.frequency.exponentialRampToValueAtTime(140, now + duration + 0.03)

      clickFilter.type = 'highpass'
      clickFilter.frequency.setValueAtTime(450, now + duration - 0.02)

      clickGain.gain.setValueAtTime(0.0001, now + duration - 0.02)
      clickGain.gain.linearRampToValueAtTime(0.024, now + duration - 0.01)
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.035)

      clickOsc.connect(clickFilter)
      clickFilter.connect(clickGain)
      clickGain.connect(this.ctx.destination)

      clickOsc.start(now + duration - 0.02)
      clickOsc.stop(now + duration + 0.04)
    } catch (e) {}
  }

  // Crisp tactile button click sound for interactive console actuators
  public playHapticClick() {
    this.init()
    if (!this.ctx) return

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }

      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(820, now)
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.04)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.linearRampToValueAtTime(0.04, now + 0.005)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.05)
    } catch (e) {}
  }
}

export const audioManager = new AudioManager()

// Pre-warm audio in background on first load to prevent click stutter
if (typeof window !== 'undefined') {
  setTimeout(() => {
    audioManager.warmup()
  }, 1000)
}
