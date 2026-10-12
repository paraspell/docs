<script setup>
import { computed } from 'vue'

const props = defineProps({
  // [{ value, label }]
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const model = defineModel({ type: String, required: true })

const index = computed(() =>
  Math.max(0, props.options.findIndex((opt) => opt.value === model.value))
)
</script>

<template>
  <div
    class="segmented-switch"
    role="group"
    :aria-label="label"
    :style="{ '--count': options.length, '--index': index }"
  >
    <span class="indicator" aria-hidden="true" />
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      :class="{ active: model === opt.value }"
      :aria-pressed="model === opt.value"
      @click="model = opt.value"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented-switch {
  position: relative;
  display: inline-grid;
  grid-template-columns: repeat(var(--count), 1fr);
  margin: 16px 0 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 3px;
  background-color: var(--vp-c-bg-alt);
}

.indicator {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc((100% - 6px) / var(--count));
  border-radius: 7px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px var(--vp-c-divider);
  transform: translateX(calc(var(--index) * 100%));
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .indicator {
  background-color: var(--vp-c-default-soft);
  box-shadow: none;
}

button {
  position: relative;
  z-index: 1;
  border-radius: 7px;
  padding: 6px 18px;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  transition: color 0.2s ease;
}

button:hover {
  color: var(--vp-c-text-1);
}

button.active {
  color: var(--vp-c-brand-1);
}

button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}
</style>
