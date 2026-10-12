<script setup>
import { onMounted } from 'vue'
import SegmentedSwitch from './SegmentedSwitch.vue'
import { packageManager, loadSavedPackageManager } from '../composables/usePackageManager'

const options = ['pnpm', 'yarn', 'npm', 'bun'].map((pm) => ({ value: pm, label: pm }))

onMounted(loadSavedPackageManager)
</script>

<template>
  <SegmentedSwitch v-model="packageManager" :options="options" label="Package manager" />
</template>
