<script setup>
import { packageManager } from '../composables/usePackageManager'

const options = ['pnpm', 'yarn', 'npm']
</script>

<template>
  <div class="pm-wrapper">
    <div class="pm-toggle">
      <div
        class="pm-indicator"
        :style="{
          transform: `translateX(${options.indexOf(packageManager) * 100}%)`
        }"
      />
      <button
        v-for="pm in options"
        :key="pm"
        :class="{ active: packageManager === pm }"
        @click="packageManager = pm"
      >
        {{ pm }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.pm-wrapper {
  margin: 24px 0 32px;
}

.pm-toggle {
  position: relative;
  display: inline-flex;
  background: var(--vp-c-bg-soft);
  border-radius: 999px;
  padding: 4px;
  overflow: hidden;
}

button {
  position: relative;
  z-index: 2;
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 20px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

button.active {
  color: white;
}

.pm-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 3);
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    #5d5c5c,
    #787878
  );
  transition: transform 0.25s cubic-bezier(.4,.0,.2,1);
}
</style>