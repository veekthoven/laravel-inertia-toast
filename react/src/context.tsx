import React, { createContext, useCallback, useEffect, useReducer, useRef } from 'react'
import { router } from '@inertiajs/react'
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

interface ToastState {
  items: ToastItem[]
  config: ToastConfig
}

type ToastAction =
  | { type: 'ADD'; payload: ToastMessage }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' }

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD': {
      const item: ToastItem = {
        ...action.payload,
        id: generateId(),
      }
      const items = [item, ...state.items].slice(0, state.config.maxVisible)
      return { ...state, items }
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export interface ToastOptions {
  title?: string
  duration?: number
}

export interface ToastContextValue {
  items: ToastItem[]
  config: ToastConfig
  success: (message: string, options?: ToastOptions) => void
  error: (message: string, options?: ToastOptions) => void
  info: (message: string, options?: ToastOptions) => void
  warning: (message: string, options?: ToastOptions) => void
  remove: (id: string) => void
  clear: () => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export interface ToastProviderProps {
  children: React.ReactNode
  config?: Partial<ToastConfig>
}

export function ToastProvider({ children, config: configOverrides }: ToastProviderProps) {
  const mergedConfig = { ...defaultConfig, ...configOverrides }
  const [state, dispatch] = useReducer(toastReducer, {
    items: [],
    config: mergedConfig,
  })

  const configRef = useRef(mergedConfig)
  configRef.current = mergedConfig

  useEffect(() => {
    const removeListener = router.on('flash', (event) => {
      const toasts = (event.detail.flash as Record<string, unknown>)[
        configRef.current.propKey
      ] as ToastMessage[] | null | undefined

      if (toasts && Array.isArray(toasts)) {
        toasts.forEach((toast) => {
          dispatch({ type: 'ADD', payload: toast })
        })
      }
    })

    return removeListener
  }, [])

  const add = useCallback((message: string, level: ToastLevel, options?: ToastOptions) => {
    dispatch({
      type: 'ADD',
      payload: { message, level, title: options?.title ?? null, duration: options?.duration ?? null },
    })
  }, [])

  const value: ToastContextValue = {
    items: state.items,
    config: state.config,
    success: useCallback((msg, opts) => add(msg, 'success', opts), [add]),
    error: useCallback((msg, opts) => add(msg, 'error', opts), [add]),
    info: useCallback((msg, opts) => add(msg, 'info', opts), [add]),
    warning: useCallback((msg, opts) => add(msg, 'warning', opts), [add]),
    remove: useCallback((id: string) => dispatch({ type: 'REMOVE', payload: id }), []),
    clear: useCallback(() => dispatch({ type: 'CLEAR' }), []),
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
