export interface DialogueLine {
  id: number
  speaker: string
  text: string
}

export type AppStep = 'upload' | 'select-role' | 'practice'
