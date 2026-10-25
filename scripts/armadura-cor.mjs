// Tratamento de cor da cena da Home (armadura): só cor e tom, nunca geometria.
// Uso: node scripts/armadura-cor.mjs
// A partir de public/images/hero/home-cena-2496.webp, gera o retrato da Home
// (public/images/hero/retrato-armadura-{480,960}.webp) na variante A "aço natural":
// azuis dessaturados, metal neutro, realces levemente quentes. A variante B "âmbar"
// (LEDs no tom do acento) entra só na comparação em docs/comparacoes/.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SRC = 'public/images/hero/home-cena-2496.webp'
const OUT_DIR = 'docs/comparacoes'

function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return [h * 60, s, l]
}

function hslToRgb(h, s, l) {
  if (s === 0) return [l, l, l]
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const t = (x) => {
    let v = x
    if (v < 0) v += 1
    if (v > 1) v -= 1
    if (v < 1 / 6) return p + (q - p) * 6 * v
    if (v < 1 / 2) return q
    if (v < 2 / 3) return p + (q - p) * (2 / 3 - v) * 6
    return p
  }
  const hk = h / 360
  return [t(hk + 1 / 3), t(hk), t(hk - 1 / 3)]
}

// Peso suave (0–1) para matizes azuis (≈ 185°–245°), com bordas graduais.
function blueWeight(h) {
  if (h < 170 || h > 260) return 0
  if (h < 185) return (h - 170) / 15
  if (h > 245) return (260 - h) / 15
  return 1
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function grade(data, amber) {
  const out = Buffer.alloc(data.length)
  for (let i = 0; i < data.length; i += 3) {
    let [h, s, l] = rgbToHsl(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255)
    const blue = blueWeight(h)
    // Saturação geral −18%; azuis perdem mais (até −55%) e viram aço neutro.
    // LEDs: pixels azuis claros e saturados (medidos antes de dessaturar).
    const led = amber ? blue * smooth(0.35, 0.7, l) * smooth(0.15, 0.35, s) : 0
    s *= 0.82 * (1 - 0.55 * blue)
    let [r, g, b] = hslToRgb(h, s, l)
    if (led > 0) {
      // Mistura em RGB com um âmbar puxado do acento (matiz 16°): não passa pelo magenta.
      const [ar, ag, ab] = hslToRgb(16, 0.9, Math.min(0.62, l))
      r += (ar - r) * led * 0.85
      g += (ag - g) * led * 0.85
      b += (ab - b) * led * 0.85
    }
    // Realces levemente quentes (acima de 70% de luminância), sombras intactas.
    const warm = smooth(0.6, 0.9, l)
    r = Math.min(1, r * (1 + 0.045 * warm))
    b = b * (1 - 0.03 * warm)
    // Contraste local suave em curva S, centrada no meio-tom.
    const curve = (v) =>
      v + 0.06 * Math.sin((v - 0.5) * Math.PI) * (1 - Math.abs(v - 0.5) * 2) * 0.9
    out[i] = Math.round(curve(r) * 255)
    out[i + 1] = Math.round(curve(g) * 255)
    out[i + 2] = Math.round(curve(b) * 255)
  }
  return out
}

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const raw = { raw: { width: info.width, height: info.height, channels: 3 } }

mkdirSync(OUT_DIR, { recursive: true })
const variants = { natural: grade(data, false), ambar: grade(data, true) }

// Retrato 4:5 da variante natural, enquadrado na figura (usado na Home como cartão emoldurado).
const portrait = { left: 1080, top: 414, width: 1000, height: 1250 }
for (const width of [960, 480]) {
  await sharp(variants.natural, raw)
    .extract(portrait)
    .resize({ width })
    .webp({ quality: 82 })
    .toFile(`public/images/hero/retrato-armadura-${width}.webp`)
}

// Comparação: recorte da figura (lado direito), original | A | B, com faixa de rótulo.
const crop = { left: 1000, top: 520, width: 1180, height: 1144 }
const tile = 620
const tileH = Math.round((tile * crop.height) / crop.width)
const pieces = await Promise.all(
  [data, variants.natural, variants.ambar].map((buf) =>
    sharp(buf, raw).extract(crop).resize({ width: tile }).png().toBuffer(),
  ),
)
const labels = ['ANTES · original', 'A · aço natural', 'B · LEDs âmbar']
const label = (text) =>
  Buffer.from(
    `<svg width="${tile}" height="56"><rect width="100%" height="100%" fill="#0d0d0d"/><text x="20" y="36" font-family="Arial" font-size="24" font-weight="700" fill="#f2f2f2">${text}</text></svg>`,
  )
await sharp({
  create: { width: tile * 3 + 40, height: tileH + 56, channels: 3, background: '#0d0d0d' },
})
  .composite(
    pieces.flatMap((input, i) => [
      { input, left: i * (tile + 20), top: 56 },
      { input: label(labels[i]), left: i * (tile + 20), top: 0 },
    ]),
  )
  .webp({ quality: 88 })
  .toFile(`${OUT_DIR}/armadura-antes-depois.webp`)

console.log('ok', info.width, info.height)
