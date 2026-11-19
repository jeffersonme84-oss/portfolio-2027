// Protótipo (só para prévia): injeta as propostas A e B da barra de contatos na Home real.
// Uso no console da Home (desktop): deftProto('A') | deftProto('B') | deftProto(null)
window.deftProto = function deftProto(variant) {
  const stage = document.querySelector('.deft-stage')
  const dock = document.querySelector('.deft-dock')
  const deck = document.querySelector('.deft-deck')
  const dockPatch = document.querySelector('.deft-patch.is-dock')
  document.querySelectorAll('.proto-dock').forEach((el) => el.remove())
  document.getElementById('proto-dock-css')?.remove()
  dock.style.visibility = ''
  if (dockPatch) dockPatch.style.visibility = ''
  if (deck) Object.assign(deck.style, { left: '24px', top: '732px', zIndex: '' })
  deck?.classList.remove('proto-on-dark')
  if (!variant) return

  const links = [...dock.querySelectorAll('a')].map((a) => ({
    href: a.href,
    icon: a.querySelector('svg')?.outerHTML ?? '',
    label: a.childNodes[1]?.textContent?.trim() || a.textContent.trim(),
  }))
  const css = document.createElement('style')
  css.id = 'proto-dock-css'
  css.textContent = `
  .proto-dock{position:absolute;z-index:6;font-family:"JetBrains Mono Variable",ui-monospace,monospace}
  .proto-dock a{display:inline-flex;align-items:center;gap:.55em;text-decoration:none}
  .proto-dock svg{width:14px;height:14px;flex:none}
  /* A · tarja editorial: faixa preta de ponta a ponta, como rodapé de pôster */
  .proto-a{left:0;top:712px;width:1376px;height:56px;background:#111;color:#f2efe9;
    display:flex;align-items:center;padding:0 28px;gap:0;border-top:2px solid #d42a20}
  .proto-a .lbl{font-size:10px;letter-spacing:.22em;color:#8d8a84;margin-right:26px;text-transform:uppercase}
  .proto-a a{color:#f2efe9;font-size:12px;letter-spacing:.16em;text-transform:uppercase;
    padding:0 22px;height:22px;border-left:1px solid #2e2e2b}
  .proto-a a:first-of-type{border-left:0;padding-left:0}
  .proto-a a .arr{color:#d42a20;font-size:13px}
  .proto-a a.is-wa .dot{width:7px;height:7px;border-radius:50%;background:#d42a20;box-shadow:0 0 0 3px rgb(212 42 32/.25)}
  .proto-a .sp{flex:1}
  .proto-a .slot{width:262px;height:30px}
  .deft-deck.proto-on-dark .deck-labels{color:#f2efe9}
  .deft-deck.proto-on-dark .deck-demo{display:none}
  /* B · painel do deck K7: mesmo material do contador, teclas de aparelho */
  .proto-b{left:346px;top:711px;width:684px;height:55px;border-radius:12px;justify-content:center;
    background:linear-gradient(180deg,#2a2a27,#151513);box-shadow:0 18px 30px -18px rgb(0 0 0/.55),inset 0 1px 0 rgb(255 255 255/.08);
    display:flex;align-items:center;gap:8px;padding:0 10px}
  .proto-b .lbl{font-size:9px;letter-spacing:.2em;color:#9a978f;line-height:1.25;text-transform:uppercase;padding:0 8px 0 4px}
  .proto-b .lbl b{display:block;color:#ff5a40;font-weight:700}
  .proto-b a{height:36px;padding:0 18px;border-radius:7px;border:1px solid #3a3a36;
    background:linear-gradient(180deg,#34342f,#1f1f1c);box-shadow:0 2px 0 #000;color:#e8e4dc;
    font-size:11px;letter-spacing:.14em;text-transform:uppercase}
  .proto-b a.is-wa{background:linear-gradient(180deg,#e0382b,#b11f16);border-color:#e0382b;color:#fff}
  .proto-b .leds{margin-left:auto;display:flex;gap:5px;padding-right:6px}
  .proto-b .leds i{width:6px;height:6px;border-radius:50%;background:#3a3a36}
  .proto-b .leds i:first-child{background:#ff5a40;box-shadow:0 0 6px #ff5a40}
  `
  document.head.append(css)
  dock.style.visibility = 'hidden'
  if (dockPatch) dockPatch.style.visibility = 'hidden'

  const el = document.createElement('div')
  el.className = `proto-dock proto-${variant.toLowerCase()}`
  const names = ['WhatsApp', 'LinkedIn', 'GitHub', 'E-mail']
  if (variant === 'A') {
    el.innerHTML =
      `<span class="lbl">Contato</span>` +
      links
        .map(
          (l, i) =>
            `<a href="${l.href}" class="${i === 0 ? 'is-wa' : ''}">${i === 0 ? '<span class="dot"></span>' : ''}${names[i]} <span class="arr">↗</span></a>`,
        )
        .join('') +
      `<span class="sp"></span><span class="slot"></span>`
    stage.append(el)
    // Contador dentro da faixa, à direita.
    if (deck) Object.assign(deck.style, { left: `${1376 - 28 - 262}px`, top: '725px' })
    if (deck) Object.assign(deck.style, { zIndex: '7' })
    deck?.classList.add('proto-on-dark')
  } else {
    el.innerHTML =
      `<span class="lbl">Ch ▸<b>Contato</b></span>` +
      links
        .map((l, i) => `<a href="${l.href}" class="${i === 0 ? 'is-wa' : ''}">${l.icon}${names[i]}</a>`)
        .join('') +
      `<span class="leds"><i></i><i></i><i></i></span>`
    stage.append(el)
    // Contador no canto inferior direito, alinhado à coluna de destaques.
    if (deck) Object.assign(deck.style, { left: `${1376 - 34 - 262}px`, top: '724px' })
  }
}
