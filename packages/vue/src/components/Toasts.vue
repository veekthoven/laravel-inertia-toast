<script setup lang="ts">
import { computed } from 'vue'
import ToastItem from './ToastItem.vue'
import { store } from '../store'

const positionClasses = computed(() => {
  switch (store.config.position) {
    case 'top-left':
      return 'top-4 left-4 items-start'
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2 items-center'
    case 'bottom-right':
      return 'bottom-4 right-4 items-end'
    case 'bottom-left':
      return 'bottom-4 left-4 items-start'
    case 'bottom-center':
      return 'bottom-4 left-1/2 -translate-x-1/2 items-center'
    case 'top-right':
    default:
      return 'top-4 right-4 items-end'
  }
})

const isBottom = computed(() => store.config.position.startsWith('bottom'))

const enterFrom = computed(() => {
  const pos = store.config.position
  if (pos.endsWith('left')) return '-translate-x-full opacity-0'
  if (pos.endsWith('center')) return (isBottom.value ? 'translate-y-full' : '-translate-y-full') + ' opacity-0'
  return 'translate-x-full opacity-0'
})

const leaveTo = computed(() => enterFrom.value)

function remove(id: string) {
  store.removeToast(id)
}
</script>

<template>
  <TransitionGroup
    tag="div"
    :enter-from-class="enterFrom"
    enter-active-class="transition duration-300 ease-out"
    leave-active-class="transition duration-200 ease-in"
    :leave-to-class="leaveTo"
    class="pointer-events-none fixed z-50 flex w-full max-w-sm flex-col gap-3"
    :class="positionClasses"
  >
    <ToastItem
      v-for="item in store.items"
      :key="item.id"
      :toast="item"
      @remove="remove"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>
    </ToastItem>
  </TransitionGroup>
</template>
