// Estado da tela de carregamento (BootLoader). Enquanto ela está na tela, a Home espera:
// as animações de entrada ficam pausadas (classe `boot-active` no <html>) e a digitação do nome
// e os números só começam quando o carregamento termina.

import { isReducedMotion } from '@/lib/motion'

export const BOOT_STORAGE_KEY = 'boot-seen'

const listeners = new Set<() => void>()

function shouldBoot() {
  if (isReducedMotion()) return false
  if (!['/', '/index.html'].includes(window.location.pathname)) return false
  try {
    // Só na primeira visita.
    return localStorage.getItem(BOOT_STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

let booting = shouldBoot()
// Número da "sessão" da tela: muda a cada replay, para o BootLoader montar uma nova.
let run = booting ? 1 : 0
if (booting) document.documentElement.classList.add('boot-active')

export function isBooting() {
  return booting
}

export function getBootRun() {
  return run
}

// Toca a tela de carregamento de novo (clique na marca DEFT. da Home). Não faz nada com
// animações reduzidas ou se ela já estiver na tela.
export function replayBoot() {
  if (booting || isReducedMotion()) return false
  booting = true
  run += 1
  document.documentElement.classList.add('boot-active')
  listeners.forEach((listener) => listener())
  return true
}

export function finishBoot() {
  if (!booting) return
  booting = false
  document.documentElement.classList.remove('boot-active')
  try {
    localStorage.setItem(BOOT_STORAGE_KEY, '1')
  } catch {
    // Sem storage: aparece de novo na próxima visita.
  }
  listeners.forEach((listener) => listener())
}

export function subscribeBoot(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
