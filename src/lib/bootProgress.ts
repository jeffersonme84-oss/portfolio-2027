// Progresso "humano" da fita K7 da tela de carregamento (0 → 1): acelera, hesita perto de 70%
// e dispara no fim. `raw` é o tempo decorrido dividido pela duração.
// Fica limitado a 0..1: no 1º quadro, o relógio do requestAnimationFrame pode vir um pouco antes
// do início, e um valor negativo virava NaN (erro "<circle> attribute r: NaN" no console).
export function bootProgress(raw: number) {
  const t = Math.min(1, Math.max(0, raw))
  if (t < 0.55) return 0.7 * (t / 0.55) ** 0.8
  if (t < 0.75) return 0.7 + 0.06 * ((t - 0.55) / 0.2)
  return 0.76 + 0.24 * (1 - (1 - (t - 0.75) / 0.25) ** 3)
}
