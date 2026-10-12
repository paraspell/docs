<script setup>
import { computed } from 'vue'
import CodeSnippet from './CodeSnippet.vue'
import { apiVersion } from '../composables/useApiVersion'

const props = defineProps({
  names: {
    type: Array,
    required: true
  }
})

const packages = {
  papi: '@paraspell/sdk',
  pjs: '@paraspell/sdk-pjs',
  dedot: '@paraspell/sdk-dedot'
}

const lines = computed(() => [
  [['import', 'keyword'], [' {', 'plain']],
  ...props.names.map((name, i) => [[`  ${name}${i < props.names.length - 1 ? ',' : ''}`, 'plain']]),
  [['} ', 'plain'], ['from', 'keyword'], [` '${packages[apiVersion.value] || packages.papi}'`, 'string']]
])
</script>

<template>
  <CodeSnippet lang="ts" :lines="lines" />
</template>
