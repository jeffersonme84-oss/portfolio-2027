import { useEffect, useState } from 'react'

// Hora atual no fuso informado, formatada no idioma ativo. Atualiza a cada 15 s.
export function useClock(timeZone: string, locale: string) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(timer)
  }, [])

  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', timeZone }).format(now)
}
