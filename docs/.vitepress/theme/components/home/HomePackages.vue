<script setup>
import { VPLink } from 'vitepress/theme'
import Icon from '../Icon.vue'

defineProps({
  // [{ name, tag, details, docs, source }]
  items: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="HomePackages">
    <div class="grid">
      <div v-for="pkg in items" :key="pkg.name" class="package">
        <div v-if="pkg.tag" class="tag">{{ pkg.tag }}</div>
        <div class="name">{{ pkg.name }}</div>
        <div class="details">{{ pkg.details }}</div>
        <div class="links">
          <VPLink v-if="pkg.docs" class="link" :href="pkg.docs" no-icon>
            <Icon name="book" /> Docs
          </VPLink>
          <VPLink v-if="pkg.source" class="link" :href="pkg.source" no-icon>
            <Icon name="github" /> Source
          </VPLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.HomePackages {
  container-type: inline-size;
  margin: 20px 0;
}

.grid {
  display: grid;
  gap: 12px;
}

@container (min-width: 460px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 700px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.package {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px 18px 12px;
}

.tag {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 16px;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
}

.name {
  margin-top: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  color: var(--vp-c-text-1);
  overflow-wrap: anywhere;
}

.details {
  flex-grow: 1;
  margin-top: 6px;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

.links {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 10px;
}

.HomePackages .link {
  --icon-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.HomePackages .link:hover {
  color: var(--vp-c-brand-1);
}
</style>
