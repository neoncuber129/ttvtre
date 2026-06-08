const MAX_HINT_LEVEL = 4

export function getMaxHintLevel(): number {
  return MAX_HINT_LEVEL
}

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

export function buildHint(text: string, level: number): string {
  const words = splitWords(text)
  if (words.length === 0) return '...'

  const clamped = Math.min(Math.max(level, 0), MAX_HINT_LEVEL)

  if (clamped >= MAX_HINT_LEVEL) return text
  if (clamped === 0) return words[0] + '...'

  const ratio = clamped / MAX_HINT_LEVEL
  const count = Math.max(1, Math.ceil(words.length * ratio))
  const shown = words.slice(0, count).join(' ')
  const hiddenCount = words.length - count

  if (hiddenCount <= 0) return text
  return `${shown} ${'• '.repeat(Math.min(hiddenCount, 8)).trim()}`
}

export function hintLevelLabel(level: number): string {
  const labels = ['Rất ít', 'Một phần', 'Nhiều hơn', 'Gần đủ', 'Đầy đủ']
  return labels[Math.min(level, labels.length - 1)]
}
