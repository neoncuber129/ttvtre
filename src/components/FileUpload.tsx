import { useRef, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  loading: boolean
  error: string | null
  onClearError?: () => void
}

export function FileUpload({ onFileSelect, loading, error, onClearError }: FileUploadProps) {
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
      <h2>Tải file Word lên</h2>
      <p className="muted">
        App tự nhận diện lời thoại theo từng người. Định dạng mỗi dòng:
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
    </section>
  )
}
