import { useEffect, useState } from 'react'
import type { DialogueLine } from '../types'
import { SpeakButton } from './SpeakButton'
import { ToggleSwitch } from './ToggleSwitch'
import { buildHint, getMaxHintLevel, hintLevelLabel } from '../utils/hints'
import { speakLine, stopSpeaking } from '../utils/speech'

interface PracticeViewProps {
  lines: DialogueLine[]
  myRole: string
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  onChangeRole: () => void
  onPreview: () => void
}

const AUTO_PLAY_KEY = 'autoPlayPartner'

function sameRole(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase()
}

function loadAutoPlayPreference(): boolean {
  try {
    const saved = localStorage.getItem(AUTO_PLAY_KEY)
    if (saved === null) return false
    return saved === 'true'
  } catch {
    return false
  }
}

export function PracticeView({
  lines,
  myRole,
  currentIndex,
  onNext,
  onPrev,
  onChangeRole,
  onPreview,
}: PracticeViewProps) {
  const [hintLevel, setHintLevel] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [autoPlayPartner, setAutoPlayPartner] = useState(loadAutoPlayPreference)

  const line = lines[currentIndex]
  const isMyTurn = sameRole(line.speaker, myRole)
  const isLast = currentIndex === lines.length - 1
  const progress = ((currentIndex + 1) / lines.length) * 100

  useEffect(() => {
    setHintLevel(0)
    setShowAnswer(false)
    stopSpeaking()

    if (!isMyTurn && autoPlayPartner) {
      const timer = setTimeout(() => {
        speakLine(line.text, line.speaker)
      }, 300)
      return () => {
        clearTimeout(timer)
        stopSpeaking()
      }
    }
  }, [currentIndex, myRole, isMyTurn, autoPlayPartner, line.text, line.speaker])

  const handleAutoPlayChange = (enabled: boolean) => {
    setAutoPlayPartner(enabled)
    try {
      localStorage.setItem(AUTO_PLAY_KEY, String(enabled))
    } catch {
      /* ignore */
    }
    if (!enabled) stopSpeaking()
  }

  const handleNext = () => {
    stopSpeaking()
    onNext()
  }

  const handlePrev = () => {
    stopSpeaking()
    onPrev()
  }

  return (
    <section className="practice-wrap">
      <div className="practice-header">
        <div className="practice-top">
          <button type="button" className="btn-ghost btn-compact" onClick={onChangeRole}>
            Đổi vai
          </button>
          <div className="progress-info">
            <span className="progress-count">
              {currentIndex + 1} / {lines.length}
            </span>
            <span className="my-role-tag">Vai: {myRole}</span>
          </div>
          <button type="button" className="btn-ghost btn-compact" onClick={onPreview}>
            Kịch bản
          </button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <ToggleSwitch
          label="Tự đọc vai khác"
          checked={autoPlayPartner}
          onChange={handleAutoPlayChange}
        />
      </div>

      <div className={`practice-card ${isMyTurn ? 'my-turn' : 'partner-turn'}`}>
        <div className="turn-row">
          <div className="turn-badge">
            {isMyTurn ? '🎭 Lượt bạn' : `👤 ${line.speaker}`}
          </div>
          <SpeakButton text={line.text} speaker={line.speaker} compact />
        </div>

        {isMyTurn ? (
          <>
            <div className="dialogue-text dialogue-hint">
              {showAnswer ? line.text : buildHint(line.text, hintLevel)}
            </div>

            <div className="hint-section">
              <div className="hint-meta">
                Gợi ý: {hintLevelLabel(showAnswer ? getMaxHintLevel() : hintLevel)}
              </div>
              <div className="practice-actions">
                <button
                  type="button"
                  className="btn-secondary btn-touch"
                  disabled={hintLevel <= 0 && !showAnswer}
                  onClick={() => {
                    setShowAnswer(false)
                    setHintLevel((l) => Math.max(0, l - 1))
                  }}
                >
                  Ít hơn
                </button>
                <button
                  type="button"
                  className="btn-secondary btn-touch"
                  disabled={showAnswer || hintLevel >= getMaxHintLevel()}
                  onClick={() => setHintLevel((l) => Math.min(getMaxHintLevel(), l + 1))}
                >
                  Gợi ý thêm
                </button>
                <button
                  type="button"
                  className="btn-primary btn-touch btn-reveal"
                  disabled={showAnswer}
                  onClick={() => setShowAnswer(true)}
                >
                  Hiện đáp án
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="dialogue-text dialogue-full">{line.text}</div>
            <div className="partner-label">
              Đáp án đầy đủ
              {autoPlayPartner
                ? ` · ${line.speaker === 'NỮ' || line.speaker === 'CẢ HAI' ? 'Giọng nữ' : 'Giọng nam'} (tự đọc)`
                : ' · Bấm 🔊 Đọc để nghe'}
            </div>
          </>
        )}
      </div>

      <div className="practice-bottom">
        <button
          type="button"
          className="btn-ghost btn-touch"
          disabled={currentIndex === 0}
          onClick={handlePrev}
        >
          ← Trước
        </button>
        <button
          type="button"
          className="btn-primary btn-touch btn-next"
          onClick={handleNext}
        >
          {isLast ? 'Học lại' : 'Chuyển →'}
        </button>
      </div>
    </section>
  )
}
