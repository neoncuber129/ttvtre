export function getGoogleVoiceName(speaker: string): string {
  const role = speaker.trim().toUpperCase()
  if (role === 'NỮ' || role === 'CẢ HAI') {
    return 'vi-VN-Neural2-A'
  }
  return 'vi-VN-Neural2-D'
}

export function getVoiceLabel(speaker: string): string {
  const role = speaker.trim().toUpperCase()
  if (role === 'NỮ' || role === 'CẢ HAI') {
    return 'Google TTS · Giọng nữ (Neural2-A)'
  }
  return 'Google TTS · Giọng nam (Neural2-D)'
}
