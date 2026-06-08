import { getGoogleVoiceName } from './voiceConfig'

export { getGoogleVoiceName, getVoiceLabel } from './voiceConfig'

export async function synthesizeGoogleSpeech(
  text: string,
  speaker: string,
  apiKey: string,
): Promise<string> {
  const voiceName = getGoogleVoiceName(speaker)

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'vi-VN',
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.95,
          pitch: 0,
        },
      }),
    },
  )

  const data = (await response.json()) as {
    audioContent?: string
    error?: { message?: string }
  }

  if (!response.ok) {
    throw new Error(data.error?.message ?? `Google TTS lỗi ${response.status}`)
  }

  if (!data.audioContent) {
    throw new Error('Google TTS không trả về audio')
  }

  return data.audioContent
}
