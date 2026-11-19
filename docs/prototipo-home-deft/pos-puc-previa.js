// Prévia (só para aprovação): Home com 4ª linha "Pós PUC" + contatos em ícones (proposta C) e o
// Sobre com a pós da PUC-Campinas + PUCPR. Requer dock-propostas-v2.js carregado antes.
// Uso: previaHome(locale) | previaSobre()
window.previaHome = function previaHome() {
  window.deftProto2('C')
  const rows = [...document.querySelectorAll('.deft-row')]
  document.querySelectorAll('.proto3').forEach((el) => el.remove())
  const stage = document.querySelector('.deft-stage')
  // Uma tampa só para a coluna de destaques (as 3 linhas da arte ficam embaixo).
  const patch = document.createElement('div')
  patch.className = 'deft-patch proto3'
  Object.assign(patch.style, { left: '1082px', top: '503px', width: '266px', height: '200px' })
  rows[0].closest('ul').before(patch)
  const ul = rows[0].closest('ul')
  if (rows.length === 3) {
    const li = rows[2].closest('li').cloneNode(true)
    ul.append(li)
  }
  const all = [...document.querySelectorAll('.deft-row')]
  all.forEach((row, i) => Object.assign(row.style, { top: `${506 + i * 48}px`, height: '44px' }))
  const last = all[3]
  last.querySelector('b').textContent = '03'
  const span = last.querySelector('span')
  span.firstChild.textContent = 'PUC-Campinas + PUCPR'
  span.querySelector('small').textContent = 'Pós: Arquitetura, Dados e Cyber.'
  const css = document.createElement('style')
  css.className = 'proto3'
  css.textContent = `.deft-row{display:grid!important;grid-template-columns:58px minmax(0,1fr) 16px!important;
    align-items:center;border-top:1px solid var(--deft-line);padding-top:4px}
    .deft-row b{font-size:31px!important}.deft-row span{font-size:14.5px!important;white-space:nowrap}`
  document.head.append(css)
  void stage
}

window.previaSobre = function previaSobre() {
  const bio = document.querySelector('#sobre .lg\\:col-span-7 p:last-child')
  if (bio) {
    bio.innerHTML =
      '<strong class="font-semibold">Sou Jefferson, Forward Deployed Engineer em São Paulo</strong>, formado em Desenvolvimento de Software Multiplataforma pela Fatec Zona Sul e pós-graduando em <strong class="font-semibold">Arquitetura de Software, Ciência de Dados e Cybersecurity</strong> na PUC-Campinas e na PUCPR. Trabalho entre o cliente e o código: entendo o problema de quem vai usar, construo a solução com Java, Node.js, Python, SQL, AWS e IA e coloco em produção. Da liderança de vendas e da psicologia trago escuta, negociação e visão de negócio.'
  }
  const tags = document.querySelectorAll('#sobre ul.mt-3 li')
  if (tags[2]) tags[2].textContent = 'Pós · Arquitetura · Dados · Cyber'
  const item = [...document.querySelectorAll('#sobre ol button')].find((b) =>
    b.textContent.includes('Pós-graduação'),
  )
  item?.click()
  setTimeout(() => {
    const spans = item.querySelectorAll('span > span')
    if (spans[0]) spans[0].textContent = 'Pós: Arquitetura de Software, Dados e Cyber'
    if (spans[1]) spans[1].textContent = 'PUC-Campinas + PUCPR'
    const art = document.getElementById('trajetoria-detalhe')
    art.querySelector('h3').textContent = 'Arquitetura de Software, Ciência de Dados e Cybersecurity'
    const ps = art.querySelectorAll('.vcr-text p')
    ps[0].textContent = 'Pós-graduação · 2025 →'
    ps[1].textContent = 'PUC-Campinas + PUCPR · lato sensu'
    ps[2].textContent =
      'Pós-graduação lato sensu na PUC-Campinas e na PUCPR, iniciada em novembro de 2025, em três frentes: Arquitetura de Software, para desenhar sistemas que escalam; Ciência de Dados, para decidir com base em dados; e Cybersecurity, para proteger o que vai para produção. É a base técnica do trabalho de FDE.'
  }, 300)
}
