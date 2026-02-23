import React from 'react'
import { useToast } from '../hooks/useToast'
import { ToastItem } from './ToastItem'

const positionClassMap: Record<string, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
}

export function Toasts() {
  const { items, config, remove } = useToast()
  const positionClasses = positionClassMap[config.position] ?? positionClassMap['top-right']

  return (
    <div
      className={`pointer-events-none fixed z-50 flex w-full max-w-sm flex-col gap-3 ${positionClasses}`}
      aria-live="polite"
    >
      {items.map((item) => (
        <ToastItem key={item.id} toast={item} config={config} onRemove={remove} />
      ))}
    </div>
  )
}
