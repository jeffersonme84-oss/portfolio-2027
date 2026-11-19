import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Foto da Home em "código do Matrix" (pedido do Jefferson, 2026-11-19). Ao passar o mouse, só
// um círculo em volta do cursor vira código; rolar para cima na foto transforma a imagem toda
// e rolar para baixo volta ao normal. Só dentro do contorno da foto dele na arte (OUTLINE,
// coordenadas da cena 1376 × 768); o brilho de cada letra vem da própria foto. A arte não é
// alterada: é um canvas por cima dela. Só desenha com o mouse na foto; desligado com
// animações reduzidas.

const BOX = { x: 540, y: 100, w: 380, h: 668 }

// Contorno aproximado do Jefferson na arte (gorro → ombro direito → luva → calça → ombro esquerdo).
const OUTLINE: [number, number][] = [
  [775, 140],
  [800, 112],
  [835, 110],
  [852, 140],
  [856, 200],
  [860, 260],
  [870, 330],
  [885, 400],
  [892, 460],
  [902, 520],
  [905, 580],
  [895, 640],
  [870, 650],
  [835, 625],
  [830, 768],
  [600, 768],
  [598, 640],
  [560, 560],
  [552, 470],
  [560, 400],
  [595, 310],
  [660, 250],
  [715, 232],
  [745, 210],
]

const CELL = 10
const TRAIL = 16
const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜ0123456789:.=*+<>'
const DPR = 2
const LENS = 78 // raio da lente que segue o mouse (px da cena)
const FULL = 780 // raio que cobre a foto toda
const EDGE = 24 // borda suave da lente

type Props = {
  src: string
  // Elemento que dispara o efeito (a área clicável da foto).
  targetRef: RefObject<HTMLElement | null>
}

export function MatrixPortrait({ src, targetRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef.current
    if (!canvas || !target || reduced) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = BOX.w * DPR
    canvas.height = BOX.h * DPR
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

    const cols = Math.ceil(BOX.w / CELL)
    const rows = Math.ceil(BOX.h / CELL)
    const outline = new Path2D()
    OUTLINE.forEach(([x, y], i) =>
      i ? outline.lineTo(x - BOX.x, y - BOX.y) : outline.moveTo(x - BOX.x, y - BOX.y),
    )
    outline.closePath()

    // Células dentro do contorno (isPointInPath usa coordenadas do canvas, já com o DPR).
    const inside = new Uint8Array(cols * rows)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c * CELL + CELL / 2) * DPR
        const y = (r * CELL + CELL / 2) * DPR
        inside[r * cols + c] = ctx.isPointInPath(outline, x, y) ? 1 : 0
      }
    }

    // Brilho da foto em cada célula, normalizado dentro do contorno (roupa preta não some).
    let light: Float32Array | null = null
    const image = new Image()
    image.src = src
    image.onload = () => {
      const sample = document.createElement('canvas')
      sample.width = cols
      sample.height = rows
      const sctx = sample.getContext('2d', { willReadFrequently: true })
      if (!sctx) return
      sctx.drawImage(image, BOX.x, BOX.y, BOX.w, BOX.h, 0, 0, cols, rows)
      const data = sctx.getImageData(0, 0, cols, rows).data
      const values = new Float32Array(cols * rows)
      const seen: number[] = []
      for (let i = 0; i < values.length; i++) {
        // Brilho perceptivo + um pouco do vermelho (a jaqueta precisa aparecer).
        const v = (0.45 * data[i * 4] + 0.45 * data[i * 4 + 1] + 0.1 * data[i * 4 + 2]) / 255
        values[i] = v
        if (inside[i]) seen.push(v)
      }
      // Normaliza entre os percentis 5 e 95 (reflexos pequenos não achatam o resto).
      seen.sort((a, b) => a - b)
      const min = seen[Math.floor(seen.length * 0.05)] ?? 0
      const max = seen[Math.floor(seen.length * 0.95)] ?? 1
      const range = Math.max(0.05, max - min)
      for (let i = 0; i < values.length; i++) {
        values[i] = Math.min(1, Math.max(0, (values[i] - min) / range)) ** 0.6
      }
      light = values
    }

    const glyph = Uint8Array.from({ length: cols * rows }, () =>
      Math.floor(Math.random() * GLYPHS.length),
    )
    const drops = Float32Array.from({ length: cols }, () => Math.random() * -rows)
    const speeds = Float32Array.from({ length: cols }, () => 0.25 + Math.random() * 0.45)

    // Dois estados: "lente" (só um círculo em volta do mouse vira código) e "tudo"
    // (rolar para cima na foto transforma a imagem inteira; para baixo, volta ao normal).
    let lens = 0
    let lensGoal = 0
    let full = 0
    let fullGoal = 0
    let frame = 0
    let last = 0
    const mouse = { x: BOX.w / 2, y: BOX.h / 3 }
    const center = { ...mouse }

    const draw = (now: number) => {
      frame = 0
      const dt = Math.min(64, last ? now - last : 16)
      last = now
      const k = Math.min(1, dt / 140)
      lens += (lensGoal - lens) * k
      full += (fullGoal - full) * Math.min(1, dt / 260)
      if (Math.abs(lensGoal - lens) < 0.004) lens = lensGoal
      if (Math.abs(fullGoal - full) < 0.002) full = fullGoal
      // A lente segue o mouse com um leve atraso.
      center.x += (mouse.x - center.x) * Math.min(1, dt / 70)
      center.y += (mouse.y - center.y) * Math.min(1, dt / 70)

      const radius = Math.max(LENS * lens, FULL * full)
      ctx.clearRect(0, 0, BOX.w, BOX.h)
      if (radius > 1 && light) {
        ctx.save()
        ctx.clip(outline)
        // Fundo escuro com borda suave (some na borda do círculo).
        const fade = ctx.createRadialGradient(
          center.x,
          center.y,
          Math.max(0, radius - EDGE),
          center.x,
          center.y,
          radius,
        )
        fade.addColorStop(0, 'rgb(1 8 3 / 0.94)')
        fade.addColorStop(1, 'rgb(1 8 3 / 0)')
        ctx.fillStyle = fade
        ctx.fillRect(0, 0, BOX.w, BOX.h)
        ctx.font = `${CELL + 1}px "JetBrains Mono Variable", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        for (let c = 0; c < cols; c++) {
          drops[c] += (speeds[c] * dt) / 16
          if (drops[c] - TRAIL > rows) drops[c] = Math.random() * -12
          const x = c * CELL + CELL / 2
          const dx = x - center.x
          if (Math.abs(dx) > radius) continue
          const head = drops[c]
          for (let r = 0; r < rows; r++) {
            const i = r * cols + c
            if (!inside[i]) continue
            const y = r * CELL + CELL / 2
            const dist = Math.hypot(dx, y - center.y)
            if (dist > radius) continue
            const edge = Math.min(1, (radius - dist) / EDGE)
            const behind = head - r
            const trail = behind >= 0 && behind < TRAIL ? 1 - behind / TRAIL : 0
            const alpha = Math.min(1, 0.14 + light[i] * 0.86 + trail * 0.45) * edge
            if (alpha < 0.08) continue
            if (Math.random() < 0.015) glyph[i] = Math.floor(Math.random() * GLYPHS.length)
            ctx.globalAlpha = alpha
            ctx.fillStyle = behind >= 0 && behind < 1 ? '#d8ffe2' : '#00ff46'
            ctx.fillText(GLYPHS[glyph[i]], x, y)
          }
        }
        ctx.restore()
        ctx.globalAlpha = 1
      }
      if (lens > 0 || full > 0 || lensGoal > 0 || fullGoal > 0) frame = requestAnimationFrame(draw)
      else last = 0
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const toLocal = (event: PointerEvent | WheelEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * BOX.w
      mouse.y = ((event.clientY - rect.top) / rect.height) * BOX.h
    }
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      toLocal(event)
      if (lens === 0) Object.assign(center, mouse)
      lensGoal = 1
      wake()
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      toLocal(event)
      wake()
    }
    const onLeave = () => {
      lensGoal = 0
      fullGoal = 0
      wake()
    }
    // Rolar para cima: a foto toda vira código. Para baixo: volta ao normal. Só "segura" a
    // rolagem da página quando muda o estado; com a foto normal, rolar para baixo rola a página.
    const onWheel = (event: WheelEvent) => {
      const up = event.deltaY < 0
      if (up === (fullGoal === 1)) return
      event.preventDefault()
      event.stopPropagation()
      toLocal(event)
      fullGoal = up ? 1 : 0
      wake()
    }
    target.addEventListener('pointerenter', onEnter)
    target.addEventListener('pointermove', onMove)
    target.addEventListener('pointerleave', onLeave)
    target.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      cancelAnimationFrame(frame)
      image.onload = null
      target.removeEventListener('pointerenter', onEnter)
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerleave', onLeave)
      target.removeEventListener('wheel', onWheel)
      ctx.clearRect(0, 0, BOX.w, BOX.h)
    }
  }, [src, targetRef, reduced])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="deft-matrix"
      style={{ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h }}
    />
  )
}
