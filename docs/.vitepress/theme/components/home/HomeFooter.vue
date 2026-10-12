<script setup>
import { VPLink } from 'vitepress/theme'
import Icon from '../Icon.vue'

defineProps({
  // { title, alt, light, dark }: logo variants for light and dark backgrounds
  supporters: {
    type: Object,
    required: true
  },
  // { title, items: [{ icon, text, link }] }
  contact: Object
})
</script>

<template>
  <div class="HomeFooter">
    <div class="label">{{ supporters.title }}</div>
    <img class="logo light" :src="supporters.light" :alt="supporters.alt" />
    <img class="logo dark" :src="supporters.dark" :alt="supporters.alt" />

    <div v-if="contact" class="contact">
      <span class="contact-title">{{ contact.title }}</span>
      <VPLink v-for="item in contact.items" :key="item.link" class="contact-link" :href="item.link" no-icon>
        <Icon :name="item.icon" />
        {{ item.text }}
      </VPLink>
    </div>
  </div>
</template>

<style scoped>
.HomeFooter {
  margin-top: 64px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 40px;
  text-align: center;
}

.label {
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 20px;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.logo {
  display: inline-block;
  width: 100%;
  max-width: 440px;
}

.logo.dark,
.dark .logo.light {
  display: none;
}

.dark .logo.dark {
  display: inline-block;
}

.contact {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 4px 20px;
  margin-top: 32px;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-3);
}

.HomeFooter .contact-link {
  --icon-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.HomeFooter .contact-link:hover {
  color: var(--vp-c-brand-1);
}
</style>
