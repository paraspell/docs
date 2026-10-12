<script setup>
import { computed } from 'vue'

// Renders the same markup VitePress generates for fenced code blocks, so the
// default theme styles it and its built-in copy button handler works on it.
const props = defineProps({
  lang: {
    type: String,
    default: 'sh'
  },
  // One array per line, each holding [text, token] pairs
  lines: {
    type: Array,
    required: true
  }
})

// Token colors of Shiki's github-light / github-dark themes (VitePress defaults)
const tokens = {
  plain: '--shiki-light:#24292E;--shiki-dark:#E1E4E8',
  keyword: '--shiki-light:#D73A49;--shiki-dark:#F97583',
  string: '--shiki-light:#032F62;--shiki-dark:#9ECBFF',
  command: '--shiki-light:#6F42C1;--shiki-dark:#B392F0',
  flag: '--shiki-light:#005CC5;--shiki-dark:#79B8FF'
}

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const html = computed(() =>
  props.lines
    .map(
      (line) =>
        `<span class="line">${line
          .map(([text, token]) => `<span style="${tokens[token] || tokens.plain}">${escape(text)}</span>`)
          .join('')}</span>`
    )
    .join('\n')
)
</script>

<template>
  <div :class="`language-${lang} vp-adaptive-theme`">
    <button title="Copy Code" class="copy"></button>
    <span class="lang">{{ lang }}</span>
    <pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code v-html="html"></code></pre>
  </div>
</template>
