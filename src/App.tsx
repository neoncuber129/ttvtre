import { useMemo, useState } from 'react'
import { FileUpload } from './components/FileUpload'
import { PracticeView } from './components/PracticeView'
import { RoleSelect } from './components/RoleSelect'
import type { AppStep, DialogueLine } from './types'
import { getUniqueSpeakers } from './utils/parseDialogue'
import { parseDocxFile } from './utils/parseDocx'
import './App.css'

function App() {
  const [step, setStep] = useState<AppStep>('upload')
  const [lines, setLines] = useState<DialogueLine[]>([])
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const speakers = useMemo(() => getUniqueSpeakers(lines), [lines])

  const handleFileSelect = async (file: File) => {
    setLoading(true)
    setError(null)
    try {
      const parsed = await parseDocxFile(file)
      setLines(parsed)
      setSelectedRole(null)
      setCurrentIndex(0)
      setStep('select-role')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đọc được file.')
    } finally {
      setLoading(false)
    }
  }

  const resetAll = () => {
    setStep('upload')
    setLines([])
    setSelectedRole(null)
    setCurrentIndex(0)
    setError(null)
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-glow" />
        <h1>Hỗ Trợ Học Thuộc</h1>
        <p>Tải kịch bản Word → chọn vai → luyện từng câu với gợi ý thông minh</p>
      </header>

      <main className="main">
        {step === 'upload' && (
          <FileUpload
            onFileSelect={handleFileSelect}
            loading={loading}
            error={error}
            onClearError={() => setError(null)}
          />
        )}

        {step === 'select-role' && (
          <RoleSelect
            lines={lines}
            speakers={speakers}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            onStart={() => {
              setCurrentIndex(0)
              setStep('practice')
            }}
            onBack={resetAll}
          />
        )}

        {step === 'practice' && selectedRole && (
          <PracticeView
            lines={lines}
            myRole={selectedRole}
            currentIndex={currentIndex}
            onNext={() => {
              if (currentIndex >= lines.length - 1) {
                setCurrentIndex(0)
              } else {
                setCurrentIndex((i) => i + 1)
              }
            }}
            onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            onRestart={resetAll}
            onChangeRole={() => setStep('select-role')}
          />
        )}
      </main>

      <footer className="footer">
        Hỗ trợ file .docx · Tự nhận diện Nam, Nữ hoặc tên nhân vật bất kỳ
      </footer>
    </div>
  )
}

export default App
