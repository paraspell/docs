<script setup>
import { onMounted } from 'vue'
import SegmentedSwitch from './SegmentedSwitch.vue'
import { apiVersion, loadSavedApiVersion } from '../composables/useApiVersion'

const options = [
  { value: 'papi', label: 'PAPI' },
  { value: 'pjs', label: 'PJS' },
  { value: 'dedot', label: 'Dedot' }
]

onMounted(loadSavedApiVersion)
</script>

<template>
  <SegmentedSwitch v-model="apiVersion" :options="options" label="SDK client" />
</template>
