<script setup>
import { computed } from 'vue'
import { apiVersion } from '../composables/useApiVersion'

const importCode = computed(() => {
  const base =
    apiVersion.value === 'pjs'
      ? '@paraspell/sdk-pjs'
      : '@paraspell/sdk'

  return `import {
  getDefaultPallet,
  getSupportedPallets,
  getPalletIndex,
  SUPPORTED_PALLETS,
  getNativeAssetsPallet,
  getOtherAssetsPallets
} from '${base}'`
})
</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="import-box" :key="importCode">
      <pre><code>{{ importCode }}</code></pre>
    </div>
  </transition>
</template>

<style scoped>
.import-box {
  background: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 18px 20px;
  font-family: var(--vp-font-family-mono);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>