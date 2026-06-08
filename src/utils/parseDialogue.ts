import type { DialogueLine } from '../types'

const SCRIPT_LINE = /^(NAM|NỮ|CẢ ĐỘI|CẢ HAI)\s*:\s*(.*)$/i

const GENERIC_LINE = /^(.+?)\s*:\s*(.+)$/

const BLOCKED_SPEAKER = /CHƯƠNG|KỊCH BẢN|^ĐƠN VỊ$|^CA MÚA/i

function normalizeSpeaker(raw: string): string {
  const s = raw.trim().replace(/\s+/g, ' ')
  const upper = s.toUpperCase()
  if (upper === 'NAM') return 'NAM'
  if (upper === 'NỮ') return 'NỮ'
  if (upper === 'CẢ ĐỘI') return 'CẢ ĐỘI'
  if (upper === 'CẢ HAI') return 'CẢ HAI'
  return s
}

function normalizeText(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

function cleanDialogueText(raw: string): string {
  let text = normalizeText(raw)
  text = text.replace(/^["“”']+|["“”']+$/g, '')
  return text.trim()
}

function isStageDirection(line: string): boolean {
  const t = line.trim()
  return /^\([^)]*\)$/.test(t) || /^\(.*\)$/.test(t)
}

function isBlockedSpeaker(speaker: string): boolean {
  return BLOCKED_SPEAKER.test(speaker) || speaker.length > 30
}

function tryParseLine(line: string): { speaker: string; text: string } | null {
  const trimmed = line.trim()
  if (!trimmed || isStageDirection(trimmed)) return null

  const scriptMatch = trimmed.match(SCRIPT_LINE)
  if (scriptMatch) {
    const text = cleanDialogueText(scriptMatch[2])
    if (text) return { speaker: normalizeSpeaker(scriptMatch[1]), text }
    return { speaker: normalizeSpeaker(scriptMatch[1]), text: '' }
  }

  const genericMatch = trimmed.match(GENERIC_LINE)
  if (genericMatch) {
    const speaker = normalizeSpeaker(genericMatch[1])
    const text = cleanDialogueText(genericMatch[2])
    if (!isBlockedSpeaker(speaker) && text && speaker.length <= 20) {
      return { speaker, text }
    }
  }

  return null
}

export function parseDialogue(rawText: string): DialogueLine[] {
  const lines = rawText.split(/\r?\n/)
  const result: DialogueLine[] = []
  let id = 0
  let lastSpeaker: string | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (isStageDirection(trimmed)) continue

    const parsed = tryParseLine(line)

    if (parsed) {
      if (parsed.text) {
        result.push({ id: id++, speaker: parsed.speaker, text: parsed.text })
        lastSpeaker = parsed.speaker
      } else {
        lastSpeaker = parsed.speaker
      }
      continue
    }

    if (lastSpeaker) {
      const last = result[result.length - 1]
      if (last) {
        last.text = `${last.text} ${normalizeText(trimmed)}`
      }
    }
  }

  return result
}

export function getUniqueSpeakers(lines: DialogueLine[]): string[] {
  const seen = new Set<string>()
  const speakers: string[] = []
  for (const line of lines) {
    if (!seen.has(line.speaker)) {
      seen.add(line.speaker)
      speakers.push(line.speaker)
    }
  }
  return speakers
}
