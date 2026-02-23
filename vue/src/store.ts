import { reactive } from 'vue'
import type { ToastConfig, ToastItem, ToastLevel, ToastMessage } from './types'

let counter = 0

function generateId(): string {
  return `toast-${++counter}-${Date.now()}`
}

const defaultConfig: ToastConfig = {
  duration: 5000,
  position: 'top-right',
  maxVisible: 5,
  propKey: 'toasts',
}

interface ToastStore {
  items: ToastItem[]
  config: ToastConfig
  addToast(toast: ToastMessage): void
  removeToast(id: string): void
  clearToasts(): void
  configure(options: Partial<ToastConfig>): void
}

export const store: ToastStore = reactive({
  items: [] as ToastItem[],
  config: { ...defaultConfig },

  addToast(toast: ToastMessage) {
    const item: ToastItem = {
      ...toast,
      id: generateId(),
    }

    this.items.unshift(item)

    if (this.items.length > this.config.maxVisible) {
      this.items.pop()
    }
  },

  removeToast(id: string) {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  },

  clearToasts() {
    this.items.splice(0, this.items.length)
  },

  configure(options: Partial<ToastConfig>) {
    Object.assign(this.config, options)
  },
})
