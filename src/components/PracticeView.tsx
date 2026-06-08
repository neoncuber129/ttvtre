import { useEffect, useState } from 'react'
import type { DialogueLine } from '../types'
import { buildHint, getMaxHintLevel, hintLevelLabel } from '../utils/hints'

interface PracticeViewProps {
  lines: DialogueLine[]
  myRole: string
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  onChangeScript: () => void
  onChangeRole: () => void
}

function sameRole(a: string, b: string): boolean {
  return a.trim().toUpperCase() === b.trim().toUpperCase()
}

export function PracticeView({
  lines,
  myRole,
  currentIndex,
  onNext,
  onPrev,
  onChangeScript,
  onChangeRole,
}: PracticeViewProps) {
  const [hintLevel, setHintLevel] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const line = lines[currentIndex]
  const isMyTurn = sameRole(line.speaker, myRole)
  const isLast = currentIndex === lines.length - 1
  const progress = ((currentIndex + 1) / lines.length) * 100

  useEffect(() => {
    setHintLevel(0)
    setShowAnswer(false)
  }, [currentIndex, myRole])

  const handleNext = () => onNext()
  const handlePrev = () => onPrev()

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
          <button type="button" className="btn-ghost btn-compact" onClick={onChangeScript}>
            Đổi KB
          </button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={`practice-card ${isMyTurn ? 'my-turn' : 'partner-turn'}`}>
        <div className="turn-badge">
          {isMyTurn ? '🎭 Lượt bạn' : `👤 ${line.speaker}`}
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
            <div className="partner-label">Đáp án đầy đủ</div>
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
