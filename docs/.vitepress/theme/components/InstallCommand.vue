<script setup>
import { computed, ref } from 'vue'
import { packageManager } from '../composables/usePackageManager'

const props = defineProps({
  pkg: {
    type: [String, Array],
    required: true
  }
})

const copied = ref(false)

const packageList = computed(() =>
  Array.isArray(props.pkg) ? props.pkg.join(' ') : props.pkg
)

const command = computed(() => {
  switch (packageManager.value) {
    case 'yarn':
      return `yarn add ${packageList.value}`
    case 'npm':
      return `npm install ${packageList.value}`
    default:
      return `pnpm install ${packageList.value}`
  }
})

const copy = async () => {
  await navigator.clipboard.writeText(command.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <transition name="fade" mode="out-in">
    <div class="install-box" :key="command">
      <pre><code>{{ command }}</code></pre>

      <button class="copy-btn" @click="copy">
        {{ copied ? 'Copied ✓' : 'Copy' }}
      </button>
    </div>
  </transition>
</template>

<style scoped>
.install-box {
  position: relative;
  background: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 18px 20px;
  font-size: 0.95rem;
  font-family: var(--vp-font-family-mono);
  transition: all 0.2s ease;
}

.install-box:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-1) inset;
}

pre {
  margin: 0;
  background: transparent;
  overflow-x: auto;
}

code {
  background: transparent;
}

/* Copy Button */
.copy-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  border: none;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

/* Fade animation */
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