import { getVoiceLabel } from '../../shared/voiceConfig'

let currentAudio: HTMLAudioElement | null = null

export function isSpeechSupported(): boolean {
  return true
}

export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeaking(): boolean {
  if (currentAudio && !currentAudio.paused) return true
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking
  }
  return false
}

export function getVoiceLabelForSpeaker(speaker: string): string {
  return getVoiceLabel(speaker)
}

async function speakViaGoogle(
  text: string,
  speaker: string,
  onEnd?: () => void,
): Promise<boolean> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, speaker }),
  })

  const data = (await res.json()) as { audioContent?: string; error?: string }
  if (!res.ok) {
    throw new Error(data.error ?? 'Google TTS thất bại')
  }

  if (!data.audioContent) return false

  const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)
  currentAudio = audio

  audio.onended = () => {
    currentAudio = null
    onEnd?.()
  }
  audio.onerror = () => {
    currentAudio = null
    onEnd?.()
  }

  await audio.play()
  return true
}

function speakViaBrowser(
  text: string,
  speaker: string,
  onEnd?: () => void,
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false
  }

  const role = speaker.trim().toUpperCase()
  const isFemale = role === 'NỮ' || role === 'CẢ HAI'
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'vi-VN'
  utterance.pitch = isFemale ? 1.2 : 0.75
  utterance.rate = 0.95

  if (onEnd) {
    utterance.onend = () => onEnd()
    utterance.onerror = () => onEnd()
  }

  window.speechSynthesis.speak(utterance)
  return true
}

export async function speakLine(
  text: string,
  speaker: string,
  onEnd?: () => void,
): Promise<boolean> {
  if (!text.trim()) return false

  stopSpeaking()

  try {
    return await speakViaGoogle(text, speaker, onEnd)
  } catch {
    return speakViaBrowser(text, speaker, onEnd)
  }
}

export function hasVietnameseVoice(): boolean {
  return true
}
