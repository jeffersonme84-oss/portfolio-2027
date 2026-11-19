import { getSupabase } from '@/lib/supabase'

// Contador de visitas da Home (deck K7).
// - total: função register_visit do Supabase (migration 20261119120000_site_visits.sql). Cada
//   navegador soma 1 por dia; nas outras cargas só lê o total.
// - online: Realtime Presence (quantas abas estão com o site aberto agora). Não usa tabela.
// Sem as variáveis VITE_SUPABASE_*, o contador fica desligado ('off') e a Home mostra o link do
// projeto em destaque no lugar. Em `pnpm dev` sem env, entra um modo demonstração para ver o visual.

export type VisitStats =
  | { status: 'loading' }
  | { status: 'off' }
  | { status: 'ready'; total: number; online: number; demo: boolean }

type Listener = (stats: VisitStats) => void

const DAY_KEY = 'visit-day'
let stats: VisitStats = { status: 'loading' }
let started = false
const listeners = new Set<Listener>()

function emit(next: VisitStats) {
  stats = next
  listeners.forEach((listener) => listener(stats))
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function shouldCount() {
  try {
    if (localStorage.getItem(DAY_KEY) === today()) return false
    localStorage.setItem(DAY_KEY, today())
    return true
  } catch {
    return false
  }
}

async function start() {
  const supabasePromise = getSupabase()
  if (!supabasePromise) {
    if (import.meta.env.DEV) emit({ status: 'ready', total: 1284, online: 3, demo: true })
    else emit({ status: 'off' })
    return
  }

  try {
    const supabase = await supabasePromise
    const counted = shouldCount()
    const { data, error } = await supabase.rpc('register_visit', { count_it: counted })
    if (error) throw error
    let total = Number(data) || 0
    let online = 1
    emit({ status: 'ready', total, online, demo: false })

    // Presença: cada aba aberta é uma chave; o total online é a quantidade de chaves.
    const myKey = crypto.randomUUID()
    const joinedAt = Date.now()
    const channel = supabase.channel('site-presence', {
      config: { presence: { key: myKey } },
    })
    channel
      .on('presence', { event: 'sync' }, () => {
        online = Math.max(1, Object.keys(channel.presenceState()).length)
        emit({ status: 'ready', total, online, demo: false })
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // Visitante novo (contado no banco) chegou depois desta aba: o contador avança na hora.
        // Ignora a própria aba e quem já estava online antes.
        if (key === myKey) return
        if (newPresences.some((p) => p.fresh === true && Number(p.at) > joinedAt)) {
          total += 1
          emit({ status: 'ready', total, online, demo: false })
        }
      })
      .subscribe((state) => {
        // `fresh`: esta aba somou uma visita no banco (os outros avançam o número junto).
        if (state === 'SUBSCRIBED') void channel.track({ fresh: counted, at: Date.now() })
      })
  } catch {
    emit({ status: 'off' })
  }
}

export function subscribeVisits(listener: Listener) {
  listeners.add(listener)
  listener(stats)
  if (!started) {
    started = true
    // Depois da primeira pintura, para não pesar o carregamento da Home.
    const run = () => void start()
    if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 2500 })
    else setTimeout(run, 1200)
  }
  return () => {
    listeners.delete(listener)
  }
}
