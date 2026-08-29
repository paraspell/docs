import { ref, watch } from 'vue'

const STORAGE_KEY = 'api-preference'

const saved =
  typeof window !== 'undefined'
    ? localStorage.getItem(STORAGE_KEY)
    : null

export const apiVersion = ref(saved || 'papi')

watch(apiVersion, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, val)
  }
})