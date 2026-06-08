import { useEffect, useMemo, useState } from 'react'
import { FileUpload } from './components/FileUpload'
import { LoadingScreen } from './components/LoadingScreen'
import { PracticeView } from './components/PracticeView'
import { RoleSelect } from './components/RoleSelect'
import type { AppStep, DialogueLine } from './types'
import { getUniqueSpeakers } from './utils/parseDialogue'
import { loadDefaultScript } from './utils/loadDefaultScript'
import { parseDocxFile } from './utils/parseDocx'
import './App.css'

function App() {
  const [step, setStep] = useState<AppStep>('loading')
  const [lines, setLines] = useState<DialogueLine[]>([])
  const [scriptTitle, setScriptTitle] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const speakers = useMemo(() => getUniqueSpeakers(lines), [lines])

  const applyScript = (title: string, parsed: DialogueLine[]) => {
    setLines(parsed)
    setScriptTitle(title)
    setSelectedRole(null)
    setCurrentIndex(0)
    setError(null)
    setStep('select-role')
  }

  const loadBuiltInScript = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await loadDefaultScript()
      applyScript(data.title, data.lines)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được kịch bản.')
      setStep('upload')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBuiltInScript()
  }, [])

  const handleFileSelect = async (file: File) => {
    setLoading(true)
    setError(null)
    try {
      const parsed = await parseDocxFile(file)
      applyScript(file.name.replace(/\.docx$/i, ''), parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đọc được file.')
    } finally {
      setLoading(false)
    }
  }

  const resetToDefault = () => {
    setStep('loading')
    loadBuiltInScript()
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-glow" />
        <h1>Hỗ Trợ Học Thuộc</h1>
        <p>
          {scriptTitle
            ? `Kịch bản: ${scriptTitle}`
            : 'Chọn vai → luyện từng câu với gợi ý thông minh'}
        </p>
      </header>

      <main className="main">
        {step === 'loading' && <LoadingScreen />}

        {step === 'upload' && (
          <FileUpload
            onFileSelect={handleFileSelect}
            loading={loading}
            error={error}
            onClearError={() => setError(null)}
            onUseDefault={resetToDefault}
          />
        )}

        {step === 'select-role' && (
          <RoleSelect
            lines={lines}
            speakers={speakers}
            selectedRole={selectedRole}
            scriptTitle={scriptTitle}
            onSelectRole={setSelectedRole}
            onStart={() => {
              setCurrentIndex(0)
              setStep('practice')
            }}
            onUploadOther={() => setStep('upload')}
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
            onRestart={resetToDefault}
            onChangeRole={() => setStep('select-role')}
          />
        )}
      </main>

      <footer className="footer">
        Kịch bản Hải đoàn 18 có sẵn · Có thể tải file .docx khác nếu cần
      </footer>
    </div>
  )
}

export default App
