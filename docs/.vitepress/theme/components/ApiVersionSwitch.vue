<script setup>
import { apiVersion } from '../composables/useApiVersion'

const options = ['papi', 'pjs']
</script>

<template>
  <div class="api-wrapper">
    <div class="api-toggle">
      <div
        class="api-indicator"
        :style="{
          transform: `translateX(${options.indexOf(apiVersion) * 100}%)`
        }"
      />
      <button
        v-for="opt in options"
        :key="opt"
        :class="{ active: apiVersion === opt }"
        @click="apiVersion = opt"
      >
        {{ opt.toUpperCase() }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.api-wrapper {
  margin: 20px 0 24px;
}

.api-toggle {
  position: relative;
  display: inline-flex;
  background: rgba(230, 0, 122, 0.08);
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
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

button.active {
  color: white;
  font-weight: 600;
}

.api-indicator {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 2);
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    #E6007A,
    #B1005A
  );
  transition: transform 0.25s cubic-bezier(.4,.0,.2,1);
}
</style>