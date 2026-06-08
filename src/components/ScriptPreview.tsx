import type { DialogueLine } from '../types'
import { SpeakButton } from './SpeakButton'

interface ScriptPreviewProps {
  lines: DialogueLine[]
  scriptTitle: string | null
  selectedRole: string | null
  onBack: () => void
}

function isMyLine(speaker: string, role: string | null): boolean {
  if (!role) return false
  return speaker.trim().toUpperCase() === role.trim().toUpperCase()
}

export function ScriptPreview({
  lines,
  scriptTitle,
  selectedRole,
  onBack,
}: ScriptPreviewProps) {
  return (
    <section className="script-preview">
      <header className="script-preview-header">
        <button type="button" className="btn-back" onClick={onBack}>
          ← Quay lại
        </button>
        <div className="script-preview-title">
          <h2>{scriptTitle ?? 'Kịch bản'}</h2>
          <span className="badge">{lines.length} câu</span>
        </div>
      </header>

      <ol className="script-preview-list">
        {lines.map((line, index) => (
          <li
            key={line.id}
            className={`script-preview-item ${isMyLine(line.speaker, selectedRole) ? 'mine' : ''}`}
          >
            <span className="script-line-num">{index + 1}</span>
            <div className="script-line-body">
              <div className="script-line-top">
                <span className="script-speaker">{line.speaker}</span>
                <SpeakButton text={line.text} speaker={line.speaker} compact label="Nghe" />
              </div>
              <p className="script-text">{line.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
