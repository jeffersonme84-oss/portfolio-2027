// Protótipo v2 (só para prévia): barras de contato menores e presas ao layout da Home.
// A base da foto se dissolve na cor do fundo (esconde a pílula desenhada na arte).
// Uso no console da Home (desktop): deftProto2('C') | deftProto2('D') | deftProto2(null)
window.deftProto2 = function deftProto2(variant) {
  const stage = document.querySelector('.deft-stage')
  const dock = document.querySelector('.deft-dock')
  const deck = document.querySelector('.deft-deck')
  const dockPatch = document.querySelector('.deft-patch.is-dock')
  document.querySelectorAll('.proto2').forEach((el) => el.remove())
  document.getElementById('proto2-css')?.remove()
  dock.style.visibility = ''
  if (dockPatch) dockPatch.style.visibility = ''
  if (deck) Object.assign(deck.style, { left: '24px', top: '732px' })
  if (!variant) return

  // Ícones de LinkedIn, GitHub e e-mail (no site real: react-icons/si e lucide-react).
  const svg = (body, fill = true) =>
    `<svg viewBox="0 0 24 24" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${body}</svg>`
  const extra = [
    null,
    svg(
      '<path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z"/>',
    ),
    `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`,
    svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>', false),
  ]
  const links = [...dock.querySelectorAll('a')].map((a, i) => ({
    href: a.href,
    icon: a.querySelector('svg')?.outerHTML ?? extra[i] ?? '',
  }))
  const names = ['WhatsApp', 'LinkedIn', 'GitHub', 'E-mail']
  const css = document.createElement('style')
  css.id = 'proto2-css'
  css.textContent = `
  .proto2{position:absolute;z-index:6}
  .proto2-fade{left:330px;top:672px;width:716px;height:96px;pointer-events:none;
    background:linear-gradient(180deg,transparent 0%,var(--deft-bg) 44%)}
  .proto2-fade-r{left:1056px;top:684px;width:320px;height:84px;pointer-events:none;
    background:linear-gradient(180deg,transparent 0%,var(--deft-bg) 30%)}
  .proto2 a{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}
  .proto2 svg{flex:none}
  /* C · ícones redondos na base da foto */
  .proto2-c{left:612px;top:722px;width:240px;display:flex;align-items:center;justify-content:center;gap:10px}
  .proto2-c a{width:34px;height:34px;border-radius:50%;border:1px solid var(--deft-line-2);color:var(--deft-text)}
  .proto2-c a svg{width:15px;height:15px}
  .proto2-c a.is-wa{background:#d42a20;border-color:#d42a20;color:#fff}
  /* D · rodapé simétrico: contatos à esquerda, contador à direita, linha fina unindo */
  .proto2-rule{left:28px;top:716px;width:1320px;height:1px;background:var(--deft-line);z-index:8}
  .proto2-d{left:28px;top:731px;display:flex;align-items:center;gap:18px;
    font:500 13px/1 "Inter Variable",system-ui,sans-serif;color:var(--deft-soft)}
  .proto2-d a{gap:7px;color:inherit}
  .proto2-d a svg{width:14px;height:14px}
  .proto2-d a.is-wa{color:var(--deft-role)}
  .proto2-d .sep{width:3px;height:3px;border-radius:50%;background:var(--deft-line-2)}
  `
  document.head.append(css)
  dock.style.visibility = 'hidden'
  if (dockPatch) dockPatch.style.visibility = 'hidden'

  const fade = document.createElement('div')
  fade.className = 'proto2 proto2-fade'
  stage.append(fade)
  const fadeR = document.createElement('div')
  fadeR.className = 'proto2 proto2-fade-r'
  stage.append(fadeR)
  if (deck) deck.style.zIndex = '7'
  if (deck) Object.assign(deck.style, { left: `${1376 - 34 - 262}px`, top: '727px' })

  const el = document.createElement('div')
  if (variant === 'C') {
    el.className = 'proto2 proto2-c'
    el.innerHTML = links
      .map(
        (l, i) =>
          `<a href="${l.href}" class="${i === 0 ? 'is-wa' : ''}" aria-label="${names[i]}">${l.icon}</a>`,
      )
      .join('')
    stage.append(el)
  } else {
    const rule = document.createElement('div')
    rule.className = 'proto2 proto2-rule'
    stage.append(rule)
    el.className = 'proto2 proto2-d'
    el.innerHTML = links
      .map(
        (l, i) =>
          `${i ? '<span class="sep"></span>' : ''}<a href="${l.href}" class="${i === 0 ? 'is-wa' : ''}">${l.icon}${names[i]}</a>`,
      )
      .join('')
    stage.append(el)
  }
}
