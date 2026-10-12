<script setup>
import { computed } from 'vue'
import CodeSnippet from './CodeSnippet.vue'
import { packageManager } from '../composables/usePackageManager'

const props = defineProps({
  pkg: {
    type: String,
    required: true
  },
  args: {
    type: String,
    default: ''
  }
})

const runners = {
  pnpm: ['pnpm', 'dlx'],
  yarn: ['yarn', 'dlx'],
  npm: ['npx'],
  bun: ['bunx']
}

const lines = computed(() => {
  const [bin, ...sub] = runners[packageManager.value] || runners.pnpm
  const args = props.args.trim() ? props.args.trim().split(/\s+/) : []
  return [[
    [bin, 'command'],
    ...sub.map((s) => [` ${s}`, 'string']),
    [` ${props.pkg}`, 'string'],
    ...args.map((a) => [` ${a}`, a.startsWith('-') ? 'flag' : 'string'])
  ]]
})
</script>

<template>
  <CodeSnippet lang="sh" :lines="lines" />
</template>
