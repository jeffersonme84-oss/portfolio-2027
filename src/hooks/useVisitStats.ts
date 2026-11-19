import { useEffect, useState } from 'react'
import { subscribeVisits, type VisitStats } from '@/lib/visits'

// Total de visitas e pessoas online (src/lib/visits.ts).
export function useVisitStats() {
  const [stats, setStats] = useState<VisitStats>({ status: 'loading' })
  useEffect(() => subscribeVisits(setStats), [])
  return stats
}
