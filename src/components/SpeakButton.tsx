import { useEffect, useState } from 'react'
import {
  getVoiceLabelForSpeaker,
  isSpeaking,
  speakLine,
  stopSpeaking,
} from '../utils/speech'

interface SpeakButtonProps {
  text: string
  speaker: string
  label?: string
  compact?: boolean
}

export function SpeakButton({ text, speaker, label, compact }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (speaking || loading) stopSpeaking()
    }
  }, [speaking, loading])

  const handleClick = async () => {
    if (isSpeaking() || speaking) {
      stopSpeaking()
      setSpeaking(false)
      setLoading(false)
      return
    }

    setLoading(true)
    const ok = await speakLine(text, speaker, () => {
      setSpeaking(false)
      setLoading(false)
    })
    setLoading(false)
    if (ok) setSpeaking(true)
  }

  return (
    <button
      type="button"
      className={`btn-speak ${speaking ? 'speaking' : ''} ${compact ? 'btn-speak-compact' : ''}`}
      onClick={handleClick}
      disabled={loading}
      aria-label={speaking ? 'Dừng đọc' : getVoiceLabelForSpeaker(speaker)}
      title={getVoiceLabelForSpeaker(speaker)}
    >
      {loading ? '⏳' : speaking ? '⏹ Dừng' : `🔊 ${label ?? 'Đọc'}`}
    </button>
  )
}
