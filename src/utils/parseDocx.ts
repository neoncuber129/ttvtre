import mammoth from 'mammoth'
import { parseDialogue } from './parseDialogue'
import type { DialogueLine } from '../types'

export async function parseDocxFile(file: File): Promise<DialogueLine[]> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const text = result.value.trim()

  if (!text) {
    throw new Error('File Word không có nội dung văn bản.')
  }

  const lines = parseDialogue(text)
  if (lines.length === 0) {
    throw new Error(
      'Không nhận diện được lời thoại. Mỗi dòng cần định dạng: "Tên: nội dung" hoặc "Tên - nội dung".',
    )
  }

  return lines
}
