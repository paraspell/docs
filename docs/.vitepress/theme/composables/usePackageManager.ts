import { ref, watch } from 'vue'

const STORAGE_KEY = 'pm-preference'

export const packageManager = ref('pnpm')

// Read after mount, not at module init, so the client's first render
// matches the prerendered HTML instead of jumping ahead of hydration.
export function loadSavedPackageManager() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    packageManager.value = saved
  }
}

watch(packageManager, (val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, val)
  }
})