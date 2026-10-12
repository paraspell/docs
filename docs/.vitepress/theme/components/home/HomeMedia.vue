<script setup>
import { withBase } from 'vitepress'

defineProps({
  // { poster, sources: [url, ...] }; later sources are fallbacks
  video: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="HomeMedia">
    <video controls playsinline preload="none" :poster="withBase(video.poster)">
      <source v-for="src in video.sources" :key="src" :src="src" type="video/mp4" />
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
