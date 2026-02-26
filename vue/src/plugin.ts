import type { Plugin } from 'vue'
import { router } from '@inertiajs/vue3'
import type { ToastConfig, ToastMessage } from './types'
import { store } from './store'

export interface InertiaToastOptions extends Partial<ToastConfig> {}

export const InertiaToast: Plugin = {
  install(_app, options: InertiaToastOptions = {}) {
    if (options) {
      store.configure(options)
    }

    if (typeof window === 'undefined') {
      return
    }

    router.on('flash', (event) => {
      const toasts = (event.detail.flash as Record<string, unknown>)[
        store.config.propKey
      ] as ToastMessage[] | null | undefined

      if (toasts && Array.isArray(toasts)) {
        toasts.forEach((toast) => {
          store.addToast(toast)
        })
      }
    })
  },
}
