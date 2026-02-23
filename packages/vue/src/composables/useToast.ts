import { computed } from 'vue'
import { store } from '../store'
import type { ToastLevel } from '../types'

export function useToast() {
  function add(message: string, level: ToastLevel, duration?: number) {
    store.addToast({
      message,
      level,
      duration: duration ?? null,
    })
  }

  return {
    items: computed(() => store.items),
    config: computed(() => store.config),
    success: (message: string, duration?: number) => add(message, 'success', duration),
    error: (message: string, duration?: number) => add(message, 'error', duration),
    info: (message: string, duration?: number) => add(message, 'info', duration),
    warning: (message: string, duration?: number) => add(message, 'warning', duration),
    remove: (id: string) => store.removeToast(id),
    clear: () => store.clearToasts(),
  }
}
