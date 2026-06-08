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
}

export function isSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused
}

export function getVoiceLabelForSpeaker(speaker: string): string {
  return getVoiceLabel(speaker)
}

export async function speakLine(
  text: string,
  speaker: string,
  onEnd?: () => void,
): Promise<boolean> {
  if (!text.trim()) return false

  stopSpeaking()

  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, speaker }),
  })

  const data = (await res.json()) as { audioContent?: string; error?: string }
  if (!res.ok) {
    console.error(data.error ?? 'Google TTS thất bại')
    onEnd?.()
    return false
  }

  if (!data.audioContent) {
    onEnd?.()
    return false
  }

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

  try {
    await audio.play()
    return true
  } catch {
    currentAudio = null
    onEnd?.()
    return false
  }
}

export function hasVietnameseVoice(): boolean {
  return true
}
