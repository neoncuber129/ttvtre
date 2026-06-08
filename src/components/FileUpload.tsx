import { useRef, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  loading: boolean
  error: string | null
  onClearError?: () => void
  onUseDefault?: () => void
}

export function FileUpload({ onFileSelect, loading, error, onClearError, onUseDefault }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleFile = (file: File | undefined) => {
    if (!file) return
    onClearError?.()
    if (!file.name.match(/\.docx$/i)) {
      setLocalError('Chỉ hỗ trợ file .docx (Word).')
      return
    }
    setLocalError(null)
    onFileSelect(file)
  }

  return (
    <section className="card upload-card">
      <div className="card-icon">📄</div>
      <h2>Tải kịch bản khác</h2>
      <p className="muted">
        App đã có sẵn kịch bản Hải đoàn 18. Chỉ tải file mới nếu bạn muốn đổi kịch bản.
      </p>
      <div className="format-examples">
        <code>NAM: Kính thưa các đồng chí!</code>
        <code>NỮ: Lịch sử dân tộc Việt Nam...</code>
        <code>CẢ ĐỘI: Nguyện tuyệt đối trung thành...</code>
      </div>

      <div
        className={`dropzone ${dragOver ? 'drag-over' : ''} ${loading ? 'loading' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files[0])
        }}
        onClick={() => !loading && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <span>Đang đọc file...</span>
          </div>
        ) : (
          <>
            <span className="dropzone-icon">⬆️</span>
            <span>Kéo thả file .docx hoặc bấm để chọn</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {(error || localError) && (
        <p className="error-msg">{error || localError}</p>
      )}

      {onUseDefault && (
        <button type="button" className="btn-ghost btn-back-default" onClick={onUseDefault}>
          ← Dùng lại kịch bản Hải đoàn 18
        </button>
      )}
    </section>
  )
}
