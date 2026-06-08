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

function getVietnameseVoices(): SpeechSynthesisVoice[] {
  return loadVoices().filter(
    (v) => v.lang === 'vi-VN' || v.lang.startsWith('vi'),
  )
}

function scoreMaleVoice(name: string): number {
  const n = name.toLowerCase()
  let score = 0

  if (/namminh|nam minh/.test(n)) score += 100
  if (/\bmale\b/.test(n)) score += 90
  if (/\bman\b/.test(n)) score += 80
  if (/\bnam\b/.test(n) && !/vietnam|viet nam/.test(n)) score += 70

  if (/\bfemale\b|\bwoman\b/.test(n)) score -= 80
  if (/\ban\b|hoai|hoài|linh|my an|zira/.test(n)) score -= 60

  return score
}

function scoreFemaleVoice(name: string): number {
  const n = name.toLowerCase()
  let score = 0

  if (/\ban\b/.test(n) && /microsoft|online|natural/.test(n)) score += 100
  if (/\bfemale\b/.test(n)) score += 90
  if (/\bwoman\b/.test(n)) score += 80
  if (/hoai|hoài|linh|my|nữ| nu /.test(n)) score += 60

  if (/namminh|nam minh|\bmale\b|\bman\b/.test(n)) score -= 80
  if (/\bnam\b/.test(n) && !/vietnam|viet nam/.test(n)) score -= 60

  return score
}

function pickVoiceByGender(gender: 'male' | 'female'): SpeechSynthesisVoice | null {
  const voices = getVietnameseVoices()
  if (voices.length === 0) return null

  const scoreFn = gender === 'male' ? scoreMaleVoice : scoreFemaleVoice
  const ranked = voices
    .map((v) => ({ voice: v, score: scoreFn(v.name) + (v.localService ? 2 : 0) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (ranked.length > 0) return ranked[0].voice
  return voices[0] ?? null
}

function getTargetGender(speaker: string): 'male' | 'female' {
  const role = speaker.trim().toUpperCase()
  if (role === 'NỮ' || role === 'CẢ HAI') return 'female'
  return 'male'
}

function resolveSpeech(speaker: string): {
  voice: SpeechSynthesisVoice | null
  pitch: number
  rate: number
} {
  const gender = getTargetGender(speaker)
  const voice = pickVoiceByGender(gender)
  const scoreFn = gender === 'male' ? scoreMaleVoice : scoreFemaleVoice
  const usedGenderVoice = voice ? scoreFn(voice.name) > 0 : false

  if (usedGenderVoice) {
    return {
      voice,
      pitch: 1,
      rate: gender === 'female' ? 1.0 : 0.95,
    }
  }

  if (gender === 'female') {
    return { voice, pitch: 1.28, rate: 1.02 }
  }

  return { voice, pitch: 0.72, rate: 0.92 }
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
}

export function isSpeaking(): boolean {
  if (!isSpeechSupported()) return false
  return window.speechSynthesis.speaking
}

export function getVoiceLabelForSpeaker(speaker: string): string {
  const gender = getTargetGender(speaker)
  const voice = pickVoiceByGender(gender)
  if (!voice) return gender === 'male' ? 'Giọng nam' : 'Giọng nữ'
  return `${gender === 'male' ? 'Giọng nam' : 'Giọng nữ'}: ${voice.name}`
}

function speakWithConfig(
  text: string,
  speaker: string,
  onEnd?: () => void,
): boolean {
  const { voice, pitch, rate } = resolveSpeech(speaker)
  const utterance = new SpeechSynthesisUtterance(text)

  utterance.lang = voice?.lang ?? 'vi-VN'
  if (voice) utterance.voice = voice
  utterance.pitch = pitch
  utterance.rate = rate

  if (onEnd) {
    utterance.onend = () => onEnd()
    utterance.onerror = () => onEnd()
  }

  window.speechSynthesis.speak(utterance)
  return true
}

export function speakLine(
  text: string,
  speaker: string,
  onEnd?: () => void,
): boolean {
  if (!isSpeechSupported() || !text.trim()) return false

  stopSpeaking()

  if (getVietnameseVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      speakWithConfig(text, speaker, onEnd)
    }
    return true
  }

  return speakWithConfig(text, speaker, onEnd)
}

export function hasVietnameseVoice(): boolean {
  return getVietnameseVoices().length > 0
}
