import { ref, watch } from 'vue'

const STORAGE_KEY = 'api-preference'

export const apiVersion = ref('papi')

// Read after mount, not at module init, so the client's first render
// matches the prerendered HTML instead of jumping ahead of hydration.
export function loadSavedApiVersion() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    apiVersion.value = saved
  }
}

watch(apiVersion, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, val)
  }
})
