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
      return 'bg-green-50 text-green-800'
    case 'error':
      return 'bg-red-50 text-red-800'
    case 'warning':
      return 'bg-yellow-50 text-yellow-800'
    case 'info':
    default:
      return 'bg-blue-50 text-blue-800'
  }
})

const iconClasses = computed(() => {
  switch (props.toast.level) {
    case 'success':
      return 'bg-green-100 text-green-500'
    case 'error':
      return 'bg-rose-100 text-rose-500'
    case 'warning':
      return 'bg-yellow-100 text-yellow-500'
    case 'info':
      return 'bg-blue-100 text-blue-500'
    default:
      return 'bg-blue-100 text-blue-500'
  }
})
</script>

<template>
  <div
    class="flex items-center rounded-lg bg-white p-4 text-gray-500 shadow min-w-96"
    role="alert"
  >
    <div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" :class="iconClasses">
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

    <div class="ml-3 text-sm font-normal">{{ toast.message }}</div>

    <button
      type="button"
      class="ml-auto inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
      @click="emit('remove', toast.id)"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
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
</template>
