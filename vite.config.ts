import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { synthesizeGoogleSpeech } from './shared/googleTts'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

function ttsDevApiPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'tts-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        const send = (status: number, payload: unknown) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }

        if (!apiKey) {
          send(500, { error: 'Thiếu GOOGLE_TTS_API_KEY trong .env.local' })
          return
        }

        try {
          const raw = await readBody(req)
          const { text, speaker } = JSON.parse(raw) as {
            text?: string
            speaker?: string
          }

          if (!text?.trim() || !speaker?.trim()) {
            send(400, { error: 'Thiếu text hoặc speaker' })
            return
          }

          const audioContent = await synthesizeGoogleSpeech(text, speaker, apiKey)
          send(200, { audioContent })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Lỗi Google TTS'
          send(500, { error: message })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), ttsDevApiPlugin(env.GOOGLE_TTS_API_KEY)],
    base: process.env.VITE_BASE_PATH || '/',
  }
})
