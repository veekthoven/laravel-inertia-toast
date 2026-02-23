import React, { createContext, useCallback, useEffect, useReducer, useRef } from 'react'
import { router, usePage } from '@inertiajs/react'
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

export interface ToastContextValue {
  items: ToastItem[]
  config: ToastConfig
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
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

  const page = usePage()
  const configRef = useRef(mergedConfig)
  configRef.current = mergedConfig

  useEffect(() => {
    const removeListener = router.on('finish', () => {
      const toasts = (page.props as Record<string, unknown>)[
        configRef.current.propKey
      ] as ToastMessage[] | null | undefined

      if (toasts && Array.isArray(toasts)) {
        toasts.forEach((toast) => {
          dispatch({ type: 'ADD', payload: toast })
        })
      }
    })

    return removeListener
  }, [page.props])

  const add = useCallback((message: string, level: ToastLevel, duration?: number) => {
    dispatch({
      type: 'ADD',
      payload: { message, level, duration: duration ?? null },
    })
  }, [])

  const value: ToastContextValue = {
    items: state.items,
    config: state.config,
    success: useCallback((msg, dur) => add(msg, 'success', dur), [add]),
    error: useCallback((msg, dur) => add(msg, 'error', dur), [add]),
    info: useCallback((msg, dur) => add(msg, 'info', dur), [add]),
    warning: useCallback((msg, dur) => add(msg, 'warning', dur), [add]),
    remove: useCallback((id: string) => dispatch({ type: 'REMOVE', payload: id }), []),
    clear: useCallback(() => dispatch({ type: 'CLEAR' }), []),
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
