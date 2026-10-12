<script setup>
import { computed } from 'vue'
import CodeSnippet from './CodeSnippet.vue'
import { packageManager } from '../composables/usePackageManager'

const props = defineProps({
  pkg: {
    type: [String, Array],
    required: true
  }
})

const commands = {
  pnpm: ['pnpm', 'add'],
  yarn: ['yarn', 'add'],
  npm: ['npm', 'install'],
  bun: ['bun', 'add']
}

const lines = computed(() => {
  const [bin, sub] = commands[packageManager.value] || commands.pnpm
  const packages = Array.isArray(props.pkg) ? props.pkg : props.pkg.trim().split(/\s+/)
  return [[[bin, 'command'], [` ${sub}`, 'string'], ...packages.map((p) => [` ${p}`, 'string'])]]
})
</script>

<template>
  <CodeSnippet lang="sh" :lines="lines" />
</template>
