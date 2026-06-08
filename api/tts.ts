import type { VercelRequest, VercelResponse } from '@vercel/node'
import { synthesizeGoogleSpeech } from '../shared/googleTts'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'Chưa cấu hình GOOGLE_TTS_API_KEY trên Vercel',
    })
  }

  const { text, speaker } = req.body as { text?: string; speaker?: string }

  if (!text?.trim() || !speaker?.trim()) {
    return res.status(400).json({ error: 'Thiếu text hoặc speaker' })
  }

  try {
    const audioContent = await synthesizeGoogleSpeech(text, speaker, apiKey)
    return res.status(200).json({ audioContent })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lỗi Google TTS'
    return res.status(500).json({ error: message })
  }
}
