export type ToastLevel = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  message: string
  level: ToastLevel
  duration: number | null
}

export interface ToastItem extends ToastMessage {
  id: string
}

export interface ToastConfig {
  duration: number
  position: string
  maxVisible: number
  propKey: string
}
