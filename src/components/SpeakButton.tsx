import { useEffect, useState } from 'react'
import { isSpeaking, isSpeechSupported, speakLine, stopSpeaking } from '../utils/speech'

interface SpeakButtonProps {
  text: string
  speaker: string
  label?: string
  compact?: boolean
}

export function SpeakButton({ text, speaker, label, compact }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const supported = isSpeechSupported()

  useEffect(() => {
    return () => {
      if (speaking) stopSpeaking()
    }
  }, [speaking])

  if (!supported) return null

  const handleClick = () => {
    if (isSpeaking()) {
      stopSpeaking()
      setSpeaking(false)
      return
    }

    const ok = speakLine(text, speaker, () => setSpeaking(false))
    if (ok) setSpeaking(true)
  }

  return (
    <button
      type="button"
      className={`btn-speak ${speaking ? 'speaking' : ''} ${compact ? 'btn-speak-compact' : ''}`}
      onClick={handleClick}
      aria-label={speaking ? 'Dừng đọc' : 'Đọc thoại'}
    >
      {speaking ? '⏹ Dừng' : `🔊 ${label ?? 'Đọc'}`}
    </button>
  )
}
