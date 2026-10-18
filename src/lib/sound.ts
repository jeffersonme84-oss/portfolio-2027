// Sons opcionais dos easter eggs, sintetizados com WebAudio (sem arquivos de áudio).
// Desligados por padrão; nunca tocam sem uma interação do usuário.

export type SoundKind = 'click' | 'play' | 'rewind' | 'needle'

const STORAGE_KEY = 'sound'
const listeners = new Set<() => void>()
let enabled = readEnabled()
let context: AudioContext | null = null

function readEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

export function isSoundEnabled() {
  return enabled
}

export function setSoundEnabled(next: boolean) {
  enabled = next
  try {
    localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
  } catch {
    // Sem storage: vale só para esta sessão.
  }
  listeners.forEach((listener) => listener())
  if (next) playSound('click')
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function noiseBuffer(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function burst(ctx: AudioContext, at: number, seconds: number, volume: number, frequency: number) {
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(ctx, seconds)
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = frequency
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, at)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds)
  source.connect(filter).connect(gain).connect(ctx.destination)
  source.start(at)
}

export function playSound(kind: SoundKind) {
  if (!enabled) return
  context ??= new AudioContext()
  const ctx = context
  const now = ctx.currentTime

  switch (kind) {
    case 'click':
      burst(ctx, now, 0.03, 0.25, 2500)
      break
    case 'play':
      // Tecla mecânica do deck: dois cliques curtos.
      burst(ctx, now, 0.035, 0.3, 1800)
      burst(ctx, now + 0.07, 0.05, 0.2, 900)
      break
    case 'rewind': {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.5)
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.04, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.55)
      break
    }
    case 'needle':
      // Agulha pousando no vinil: estalo + chiado.
      burst(ctx, now, 0.02, 0.35, 3000)
      burst(ctx, now + 0.03, 0.4, 0.05, 6000)
      break
  }
}
