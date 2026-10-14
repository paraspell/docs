<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const props = defineProps({
  // { poster: { dark, light }, sources: { dark: [url, ...], light: [url, ...] } }; later sources are fallbacks
  video: {
    type: Object,
    required: true
  }
})

const { isDark } = useData()

const theme = computed(() => (isDark.value ? 'dark' : 'light'))
const poster = computed(() => withBase(props.video.poster[theme.value]))
const sources = computed(() => props.video.sources[theme.value])
</script>

<template>
  <div class="HomeMedia">
    <!-- keyed by theme so the browser reloads the video when the theme is toggled -->
    <video :key="theme" controls playsinline preload="none" :poster="poster">
      <source v-for="src in sources" :key="src" :src="src" type="video/mp4" />
    </video>
  </div>
</template>

<style scoped>
.HomeMedia {
  overflow: hidden;
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  aspect-ratio: 16 / 9;
  background-color: var(--vp-c-bg-soft);
}

.HomeMedia video {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
