import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

type KineticMatrixProps = {
  className?: string
  // Elemento que recebe a interação do ponteiro (o canvas tem pointer-events: none).
  // Sem ele, usa o pai do canvas.
  interactionRef?: React.RefObject<HTMLElement | null>
}

// z: profundidade (0,3 = fundo, 1 = frente), usada na paralaxe 3D do ponteiro.
type Node = { x: number; y: number; z: number; phase: number; dx: number; dy: number }
type Pulse = { edge: number; t: number; speed: number; color: string }
type Wave = { x: number; y: number; radius: number; life: number }
type Palette = { line: string; node: string; accent: string; blue: string }

// Azul dos detalhes da foto da Home; o resto vem dos tokens do tema.
const BLUE = '#3b82f6'

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement)
  const foreground = styles.getPropertyValue('--foreground').trim() || '#111111'
  const accent = styles.getPropertyValue('--accent').trim() || '#ff3d14'
  return { line: foreground, node: foreground, accent, blue: BLUE }
}

// Malha de nós em camadas de profundidade, com pulsos de dados, ondas de impacto e
// paralaxe 3D que acompanha o ponteiro. Canvas transparente (alpha), atrás do conteúdo,
// sem bloquear cliques. Com reduced motion, nada se move sozinho: só as reações ao
// ponteiro (iniciadas pelo usuário) continuam.
export function KineticMatrix({ className, interactionRef }: KineticMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()
  const { resolved: theme } = useTheme()
  // Estado mutável compartilhado com o loop, sem recriar a animação a cada render.
  const state = useRef({ palette: null as Palette | null, redraw: () => {} })

  // Cores acompanham o tema do site (classe .dark), não só o prefers-color-scheme.
  useEffect(() => {
    state.current.palette = readPalette()
    state.current.redraw()
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return
    const target = interactionRef?.current ?? canvas.parentElement
    const shared = state.current
    shared.palette ??= readPalette()

    const mobile = window.matchMedia('(max-width: 767px)').matches
    const spacing = mobile ? 110 : 88
    const maxPulses = mobile ? 4 : 10
    const frameInterval = mobile ? 1000 / 30 : 0 // 30 fps no celular
    const linkDistance = spacing * 1.55

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let edges: [number, number][] = []
    let pulses: Pulse[] = []
    let waves: Wave[] = []
    const pointer = { x: -9999, y: -9999, active: false }
    const parallax = { x: 0, y: 0 }
    let frame = 0
    let lastFrame = 0
    let lastSpawn = 0
    let visible = true
    let ready = false

    // Tamanho vem do ResizeObserver (sem forçar reflow durante o carregamento).
    function build(nextWidth: number, nextHeight: number) {
      width = nextWidth
      height = nextHeight
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Grade com leve desvio: distribuição uniforme sem parecer mecânica.
      nodes = []
      const cols = Math.ceil(width / spacing) + 1
      const rows = Math.ceil(height / spacing) + 1
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          nodes.push({
            x: col * spacing + (Math.random() - 0.5) * spacing * 0.5,
            y: row * spacing + (Math.random() - 0.5) * spacing * 0.5,
            z: 0.3 + Math.random() * 0.7,
            phase: Math.random() * Math.PI * 2,
            dx: 0,
            dy: 0,
          })
        }
      }
      // Conexões calculadas uma vez por tamanho de tela.
      edges = []
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const distance = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)
          if (distance < linkDistance) edges.push([a, b])
        }
      }
      pulses = []
    }

    function position(node: Node, time: number) {
      const drift = reducedMotion ? 0 : 3
      // Paralaxe: nós da frente (z alto) se deslocam mais que os do fundo.
      const depth = 46 * node.z
      return {
        x: node.x + Math.sin(time / 1800 + node.phase) * drift + node.dx - parallax.x * depth,
        y: node.y + Math.cos(time / 2100 + node.phase) * drift + node.dy - parallax.y * depth,
      }
    }

    // Movimento pendente (ponteiro, ondas ou paralaxe voltando ao centro)?
    function settling() {
      if (pointer.active || waves.length) return true
      if (Math.abs(parallax.x) > 0.002 || Math.abs(parallax.y) > 0.002) return true
      return nodes.some((node) => Math.abs(node.dx) > 0.05 || Math.abs(node.dy) > 0.05)
    }

    function draw(time: number) {
      const palette = shared.palette!
      ctx!.clearRect(0, 0, width, height) // sem pintar fundo: o cinza do site aparece

      // Paralaxe 3D: a malha "gira" suavemente na direção oposta ao ponteiro.
      const goalX = pointer.active ? (pointer.x - width / 2) / width : 0
      const goalY = pointer.active ? (pointer.y - height / 2) / height : 0
      parallax.x += (goalX - parallax.x) * 0.08
      parallax.y += (goalY - parallax.y) * 0.08

      // Ponteiro e ondas empurram os nós.
      for (const node of nodes) {
        let tx = 0
        let ty = 0
        if (pointer.active) {
          const dist = Math.hypot(node.x - pointer.x, node.y - pointer.y)
          if (dist < 170 && dist > 0) {
            const force = (1 - dist / 170) * 22 * node.z
            tx += ((node.x - pointer.x) / dist) * force
            ty += ((node.y - pointer.y) / dist) * force
          }
        }
        for (const wave of waves) {
          const dist = Math.hypot(node.x - wave.x, node.y - wave.y)
          const band = Math.abs(dist - wave.radius)
          if (band < 40 && dist > 0) {
            const force = (1 - band / 40) * 16 * wave.life * node.z
            tx += ((node.x - wave.x) / dist) * force
            ty += ((node.y - wave.y) / dist) * force
          }
        }
        node.dx += (tx - node.dx) * 0.12
        node.dy += (ty - node.dy) * 0.12
      }

      const points = nodes.map((node) => position(node, time))

      ctx!.lineWidth = 1
      ctx!.strokeStyle = palette.line
      ctx!.globalAlpha = 0.13
      ctx!.beginPath()
      for (const [a, b] of edges) {
        ctx!.moveTo(points[a].x, points[a].y)
        ctx!.lineTo(points[b].x, points[b].y)
      }
      ctx!.stroke()

      // Linhas próximas ao ponteiro ganham destaque.
      if (pointer.active) {
        ctx!.strokeStyle = palette.accent
        ctx!.globalAlpha = 0.55
        ctx!.beginPath()
        for (const [a, b] of edges) {
          const mx = (points[a].x + points[b].x) / 2
          const my = (points[a].y + points[b].y) / 2
          if (Math.hypot(mx - pointer.x, my - pointer.y) < 130) {
            ctx!.moveTo(points[a].x, points[a].y)
            ctx!.lineTo(points[b].x, points[b].y)
          }
        }
        ctx!.stroke()
      }

      // Nós da frente maiores e mais opacos: sensação de profundidade.
      ctx!.fillStyle = palette.node
      points.forEach((point, index) => {
        const z = nodes[index].z
        const size = 1 + z * 2.2
        ctx!.globalAlpha = 0.12 + 0.3 * z
        ctx!.fillRect(point.x - size / 2, point.y - size / 2, size, size)
      })

      // Pulsos de dados correndo pelas conexões.
      for (const pulse of pulses) {
        const [a, b] = edges[pulse.edge]
        const x = points[a].x + (points[b].x - points[a].x) * pulse.t
        const y = points[a].y + (points[b].y - points[a].y) * pulse.t
        ctx!.fillStyle = pulse.color
        ctx!.globalAlpha = 0.85 * Math.sin(Math.PI * pulse.t)
        ctx!.beginPath()
        ctx!.arc(x, y, 2.2, 0, Math.PI * 2)
        ctx!.fill()
      }

      for (const wave of waves) {
        ctx!.strokeStyle = palette.accent
        ctx!.globalAlpha = 0.25 * wave.life
        ctx!.beginPath()
        ctx!.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2)
        ctx!.stroke()
      }
      ctx!.globalAlpha = 1
    }

    function step(time: number) {
      frame = requestAnimationFrame(step)
      if (frameInterval && time - lastFrame < frameInterval) return
      const delta = Math.min(time - (lastFrame || time), 64)
      lastFrame = time

      if (!reducedMotion && edges.length && pulses.length < maxPulses && time - lastSpawn > 420) {
        lastSpawn = time
        const palette = shared.palette!
        const colors = [palette.accent, palette.blue, palette.node]
        pulses.push({
          edge: Math.floor(Math.random() * edges.length),
          t: 0,
          speed: 0.0006 + Math.random() * 0.0008,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
      pulses = pulses.filter((pulse) => (pulse.t += pulse.speed * delta) < 1)
      waves = waves.filter((wave) => {
        wave.radius += delta * 0.35
        wave.life -= delta * 0.0012
        return wave.life > 0
      })
      draw(time)
      // Com reduced motion, o loop só existe enquanto houver reação ao ponteiro.
      if (reducedMotion && !settling()) stop()
    }

    // Liga o loop para responder ao ponteiro (também com reduced motion).
    function kick() {
      if (frame || !visible || document.hidden) return
      lastFrame = 0
      frame = requestAnimationFrame(step)
    }

    function start() {
      if (reducedMotion || !ready || frame || !visible || document.hidden) return
      lastFrame = 0
      frame = requestAnimationFrame(step)
    }

    function stop() {
      cancelAnimationFrame(frame)
      frame = 0
    }

    // Com reduced motion: um quadro estático, redesenhado só em resize e troca de tema.
    shared.redraw = () => {
      if (reducedMotion || !frame) draw(performance.now())
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      const rect = canvas!.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
      kick()
    }
    function onPointerLeave() {
      pointer.active = false
      kick()
    }
    function onPointerDown(event: PointerEvent) {
      // Cliques em links, botões e campos seguem normais, sem onda.
      if ((event.target as Element).closest('a, button, input, textarea, [role]')) return
      const rect = canvas!.getBoundingClientRect()
      if (waves.length < 3) {
        waves.push({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          radius: 0,
          life: 1,
        })
        kick()
      }
    }
    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      build(entry.contentRect.width, entry.contentRect.height)
      draw(performance.now())
    })
    resizeObserver.observe(canvas)

    // A animação só começa depois do carregamento, com o navegador ocioso:
    // não disputa CPU com o primeiro paint, a imagem principal e a digitação do nome.
    let idle = 0
    function onReady() {
      const schedule =
        window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 200))
      idle = schedule(() => {
        ready = true
        start()
      })
    }
    if (document.readyState === 'complete') onReady()
    else window.addEventListener('load', onReady, { once: true })

    // Pausa quando a Home sai da tela.
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    intersection.observe(canvas)

    document.addEventListener('visibilitychange', onVisibility)
    if (target) {
      target.addEventListener('pointermove', onPointerMove)
      target.addEventListener('pointerleave', onPointerLeave)
      target.addEventListener('pointerdown', onPointerDown)
    }
    start()

    return () => {
      stop()
      window.removeEventListener('load', onReady)
      window.cancelIdleCallback?.(idle)
      window.clearTimeout(idle)
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      target?.removeEventListener('pointermove', onPointerMove)
      target?.removeEventListener('pointerleave', onPointerLeave)
      target?.removeEventListener('pointerdown', onPointerDown)
      shared.redraw = () => {}
    }
  }, [reducedMotion, interactionRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 size-full', className)}
    />
  )
}
