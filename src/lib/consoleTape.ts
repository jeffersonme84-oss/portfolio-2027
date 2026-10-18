let printed = false

// Easter egg no console do navegador: uma fita K7 em ASCII com recado para recrutadores.
export function printConsoleTape(message: string, link: string) {
  if (printed) return
  printed = true
  const tape = [
    ' ________________________________',
    '|  ____________________________  |',
    '| |  JME · SIDE A · C-60       | |',
    '| |____________________________| |',
    '|     __                 __      |',
    '|    /  \\   ________    /  \\     |',
    '|    \\__/  |________|   \\__/     |',
    '|________________________________|',
  ].join('\n')
  console.log(`%c${tape}`, 'font-family: monospace; color: #ff3d14')
  console.log(`%c${message}%c\n${link}`, 'font-weight: bold', 'font-weight: normal')
}
