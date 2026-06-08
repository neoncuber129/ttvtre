import type { DialogueLine } from '../types'

export interface DefaultScript {
  title: string
  lines: DialogueLine[]
}

export async function loadDefaultScript(): Promise<DefaultScript> {
  const url = `${import.meta.env.BASE_URL}kich-ban.json`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Không tải được kịch bản có sẵn (${res.status}).`)
  }

  const data = (await res.json()) as DefaultScript

  if (!data.lines?.length) {
    throw new Error('Kịch bản có sẵn không có nội dung.')
  }

  return data
}
