import { ref, watch } from 'vue'

const STORAGE_KEY = 'pm-preference'

const saved =
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY)
    : null

export const packageManager = ref(saved || 'pnpm')

watch(packageManager, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, val)
  }
})