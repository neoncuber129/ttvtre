import { useState } from 'react'
import type { DialogueLine } from '../types'
import { buildHint, getMaxHintLevel, hintLevelLabel } from '../utils/hints'

interface PracticeViewProps {
  lines: DialogueLine[]
  myRole: string
  currentIndex: number
  onNext: () => void
  onPrev: () => void
  onRestart: () => void
  onChangeRole: () => void
}

export function PracticeView({
  lines,
  myRole,
  currentIndex,
  onNext,
  onPrev,
  onRestart,
  onChangeRole,
}: PracticeViewProps) {
  const [hintLevel, setHintLevel] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const line = lines[currentIndex]
  const isMyTurn = line.speaker === myRole
  const isLast = currentIndex === lines.length - 1
  const progress = ((currentIndex + 1) / lines.length) * 100

  const handleNext = () => {
    setHintLevel(0)
    setShowAnswer(false)
    onNext()
  }

  const handlePrev = () => {
    setHintLevel(0)
    setShowAnswer(false)
    onPrev()
  }

  const displayText = showAnswer ? line.text : buildHint(line.text, hintLevel)

  return (
    <section className="practice-wrap">
      <div className="practice-top">
        <button type="button" className="btn-ghost" onClick={onChangeRole}>
          Đổi vai
        </button>
        <div className="progress-info">
          <span>
            Câu {currentIndex + 1} / {lines.length}
          </span>
          <span className="my-role-tag">Vai bạn: {myRole}</span>
        </div>
        <button type="button" className="btn-ghost" onClick={onRestart}>
          Tải file mới
        </button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className={`practice-card ${isMyTurn ? 'my-turn' : 'partner-turn'}`}>
        <div className="turn-badge">
          {isMyTurn ? '🎭 Lượt của bạn' : `👤 Lượt của ${line.speaker}`}
        </div>

        <div className="speaker-label">{line.speaker}</div>

        <div className="dialogue-text">
          {displayText}
        </div>

        <div className="hint-meta">
          Gợi ý: {hintLevelLabel(showAnswer ? getMaxHintLevel() : hintLevel)}
        </div>

        <div className="practice-actions">
          <button
            type="button"
            className="btn-secondary"
            disabled={hintLevel <= 0 && !showAnswer}
            onClick={() => {
              setShowAnswer(false)
              setHintLevel((l) => Math.max(0, l - 1))
            }}
          >
            Ít gợi ý hơn
          </button>

          <button
            type="button"
            className="btn-secondary"
            disabled={showAnswer}
            onClick={() => {
              if (hintLevel >= getMaxHintLevel()) {
                setShowAnswer(true)
              } else {
                setHintLevel((l) => Math.min(getMaxHintLevel(), l + 1))
              }
            }}
          >
            {hintLevel >= getMaxHintLevel() && !showAnswer ? 'Hiện đáp án' : 'Gợi ý thêm'}
          </button>
        </div>
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="btn-ghost"
          disabled={currentIndex === 0}
          onClick={handlePrev}
        >
          ← Câu trước
        </button>

        <button
          type="button"
          className="btn-primary btn-large"
          onClick={handleNext}
        >
          {isLast ? 'Học lại từ đầu' : 'Chuyển →'}
        </button>
      </div>

      {!isMyTurn && (
        <p className="partner-note">
          Đây là câu của <strong>{line.speaker}</strong> — học để biết khi nào bạn vào lời.
        </p>
      )}
    </section>
  )
}
