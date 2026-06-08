export interface DialogueLine {
  id: number
  speaker: string
  text: string
}

export type AppStep = 'loading' | 'upload' | 'select-role' | 'practice'
