import { useScrollY } from '@/hooks/useScrollY'

// Seção que cruza o meio da tela, para destacar o link ativo do menu.
// Recalcula a cada scroll lendo o DOM atual (não guarda referências antigas).
export function useActiveSection(ids: readonly string[]) {
  useScrollY()
  const middle = window.innerHeight / 2
  let active = ids[0]
  for (const id of ids) {
    const element = document.getElementById(id)
    if (element && element.getBoundingClientRect().top <= middle) active = id
  }
  return active
}
