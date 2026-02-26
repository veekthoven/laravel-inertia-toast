import { useEffect, useRef, useState, useCallback } from 'react'
import type { ToastItem as ToastItemType, ToastConfig } from '../types'

interface ToastItemProps {
  toast: ToastItemType
  config: ToastConfig
  position: string
  onRemove: (id: string) => void
}

const iconClasses: Record<string, string> = {
  success: 'bg-green-100 text-green-500',
  error: 'bg-rose-100 text-rose-500',
  warning: 'bg-yellow-100 text-yellow-500',
  info: 'bg-blue-100 text-blue-500',
}

function SuccessIcon() {
  return (
    <svg
        className="size-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg
        className="size-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
        className="size-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
  )
}

function LevelIcon({ level }: { level: string }) {
  switch (level) {
    case 'success':
      return <SuccessIcon />
    case 'error':
      return <ErrorIcon />
    case 'warning':
      return <WarningIcon />
    default:
      return <InfoIcon />
  }
}

function getHiddenTranslateClass(position: string): string {
  if (position.includes('right')) return 'translate-x-full'
  if (position.includes('left')) return '-translate-x-full'
  if (position.startsWith('top')) return '-translate-y-full'
  return 'translate-y-full'
}

export function ToastItem({ toast, config, position, onRemove }: ToastItemProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [visible, setVisible] = useState(false)
  const duration = toast.duration ?? config.duration

  const triggerExit = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setVisible(false)
  }, [])

  // Enter animation on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  // Auto-dismiss timer
  useEffect(() => {
    if (duration > 0) {
      timerRef.current = setTimeout(triggerExit, duration)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [duration, triggerExit])

  const hiddenTranslate = getHiddenTranslateClass(position)
  const transitionClasses = visible
    ? 'opacity-100 translate-x-0 translate-y-0 duration-300 ease-out'
    : `opacity-0 ${hiddenTranslate} duration-200 ease-in`

  return (
    <div
      className={`flex items-center rounded-lg bg-white p-4 text-gray-500 shadow min-w-96 transition ${transitionClasses}`}
      role="alert"
      onTransitionEnd={() => {
        if (!visible) onRemove(toast.id)
      }}
    >
      <div
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconClasses[toast.level] ?? iconClasses.info}`}
      >
        <LevelIcon level={toast.level} />
      </div>

      <div className="ml-3 text-sm font-normal">{toast.message}</div>

      <button
        type="button"
        className="ml-auto inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
        onClick={triggerExit}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>

        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  )
}
