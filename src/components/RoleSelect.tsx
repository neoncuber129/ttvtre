import type { DialogueLine } from '../types'

interface RoleSelectProps {
  lines: DialogueLine[]
  speakers: string[]
  selectedRole: string | null
  onSelectRole: (role: string) => void
  onStart: () => void
  onBack: () => void
}

export function RoleSelect({
  lines,
  speakers,
  selectedRole,
  onSelectRole,
  onStart,
  onBack,
}: RoleSelectProps) {
  const countBySpeaker = speakers.map((speaker) => ({
    speaker,
    count: lines.filter((l) => l.speaker === speaker).length,
  }))

  return (
    <section className="card">
      <div className="card-header-row">
        <button type="button" className="btn-ghost" onClick={onBack}>
          ← Quay lại
        </button>
        <span className="badge">{lines.length} câu</span>
      </div>

      <h2>Chọn vai của bạn</h2>
      <p className="muted">
        App sẽ gợi ý khi đến lượt vai bạn. Các câu của người khác cũng có gợi ý để bạn học phản hồi.
      </p>

      <div className="role-grid">
        {countBySpeaker.map(({ speaker, count }) => (
          <button
            key={speaker}
            type="button"
            className={`role-card ${selectedRole === speaker ? 'selected' : ''}`}
            onClick={() => onSelectRole(speaker)}
          >
            <span className="role-avatar">
              {speaker.charAt(0).toUpperCase()}
            </span>
            <span className="role-name">{speaker}</span>
            <span className="role-count">{count} câu</span>
          </button>
        ))}
      </div>

      <details className="preview-details">
        <summary>Xem trước kịch bản</summary>
        <ol className="preview-list">
          {lines.map((line) => (
            <li key={line.id} className={selectedRole === line.speaker ? 'mine' : ''}>
              <strong>{line.speaker}:</strong> {line.text}
            </li>
          ))}
        </ol>
      </details>

      <button
        type="button"
        className="btn-primary btn-large"
        disabled={!selectedRole}
        onClick={onStart}
      >
        Bắt đầu học thuộc
      </button>
    </section>
  )
}
