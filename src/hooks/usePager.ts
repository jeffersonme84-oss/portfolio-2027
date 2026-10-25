import { useState } from 'react'

// Paginação simples para as seções caberem em uma tela: devolve só os itens da página atual.
// Se a quantidade por página mudar (ex.: celular → desktop), a página é ajustada ao novo total.
export function usePager<T>(items: readonly T[], perPage: number) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(items.length / perPage))
  const current = Math.min(page, pages - 1)

  return {
    page: current,
    pages,
    items: items.slice(current * perPage, current * perPage + perPage),
    offset: current * perPage,
    goTo: (next: number) => setPage(Math.max(0, Math.min(pages - 1, next))),
  }
}
