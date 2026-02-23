<script setup lang="ts">
import { onMounted, computed } from 'vue'
import type { ToastItem } from '../types'
import { store } from '../store'

const props = defineProps<{
  toast: ToastItem
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()

const duration = computed(() => props.toast.duration ?? store.config.duration)

onMounted(() => {
  if (duration.value > 0) {
    setTimeout(() => emit('remove', props.toast.id), duration.value)
  }
})

const levelClasses = computed(() => {
  switch (props.toast.level) {
    case 'success':
      return 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'error':
      return 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'info':
    default:
      return 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  }
})

const iconClasses = computed(() => {
  switch (props.toast.level) {
    case 'success':
      return 'text-green-500 dark:text-green-400'
    case 'error':
      return 'text-red-500 dark:text-red-400'
    case 'warning':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'info':
    default:
      return 'text-blue-500 dark:text-blue-400'
  }
})
</script>

<template>
  <div
    class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5"
    :class="levelClasses"
    role="alert"
  >
    <div class="p-4">
      <div class="flex items-start">
        <div class="shrink-0" :class="iconClasses">
          <slot name="icon">
            <!-- Success: checkmark circle -->
            <svg
              v-if="toast.level === 'success'"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Error: x circle -->
            <svg
              v-else-if="toast.level === 'error'"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Warning: exclamation triangle -->
            <svg
              v-else-if="toast.level === 'warning'"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Info: information circle -->
            <svg v-else class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clip-rule="evenodd"
              />
            </svg>
          </slot>
        </div>
        <div class="ml-3 w-0 flex-1">
          <p class="text-sm font-medium">
            {{ toast.message }}
          </p>
        </div>
        <div class="ml-4 flex shrink-0">
          <button
            type="button"
            class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="iconClasses"
            @click="emit('remove', toast.id)"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
