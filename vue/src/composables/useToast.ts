import { computed } from 'vue'
import { store } from '../store'
import type { ToastLevel } from '../types'

export function useToast() {
  function add(message: string, level: ToastLevel, options?: { title?: string; duration?: number }) {
    store.addToast({
      message,
      level,
      title: options?.title ?? null,
      duration: options?.duration ?? null,
    })
  }

  return {
    items: computed(() => store.items),
    config: computed(() => store.config),
    success: (message: string, options?: { title?: string; duration?: number }) => add(message, 'success', options),
    error: (message: string, options?: { title?: string; duration?: number }) => add(message, 'error', options),
    info: (message: string, options?: { title?: string; duration?: number }) => add(message, 'info', options),
    warning: (message: string, options?: { title?: string; duration?: number }) => add(message, 'warning', options),
    remove: (id: string) => store.removeToast(id),
    clear: () => store.clearToasts(),
  }
}
