export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

let voicesCache: SpeechSynthesisVoice[] = []

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) voicesCache = voices
  return voicesCache
}

if (isSpeechSupported()) {
  loadVoices()
  window.speechSynthesis.onvoiceschanged = () => loadVoices()
}

function pickVietnameseVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices()
  return (
    voices.find((v) => v.lang === 'vi-VN') ??
    voices.find((v) => v.lang.startsWith('vi')) ??
    voices.find((v) => v.name.toLowerCase().includes('vietnam')) ??
    null
  )
}

export function getSpeechStyle(speaker: string): { pitch: number; rate: number } {
  const role = speaker.trim().toUpperCase()
  if (role === 'NAM') return { pitch: 0.82, rate: 0.95 }
  if (role === 'NỮ') return { pitch: 1.12, rate: 1.0 }
  return { pitch: 1.0, rate: 0.9 }
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false
  return window.speechSynthesis.speaking
}

export function speakLine(
  text: string,
  speaker: string,
  onEnd?: () => void,
): boolean {
  if (!isSpeechSupported() || !text.trim()) return false

  stopSpeaking()

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVietnameseVoice()
  const style = getSpeechStyle(speaker)

  utterance.lang = voice?.lang ?? 'vi-VN'
  if (voice) utterance.voice = voice
  utterance.pitch = style.pitch
  utterance.rate = style.rate

  if (onEnd) {
    utterance.onend = () => onEnd()
    utterance.onerror = () => onEnd()
  }

  window.speechSynthesis.speak(utterance)
  return true
}

export function hasVietnameseVoice(): boolean {
  return pickVietnameseVoice() !== null
}
