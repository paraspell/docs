<script setup>
import { computed } from 'vue'
import { VPLink } from 'vitepress/theme'
import Icon from './Icon.vue'

const props = defineProps({
  // [{ title, details, link, icon, badge, meta, id }]; only title and link are required
  items: {
    type: Array,
    required: true
  },
  // 'grid', 'list' (one card per row) or 'inline' (compact cards sized to their content)
  layout: {
    type: String,
    default: 'grid'
  },
  // Maximum columns in the grid layout (2 or 3); picked automatically when unset
  columns: Number
})

// Pick a column count that leaves no card alone on its row where possible
const columns = computed(() => {
  if (props.columns && props.layout !== 'list') return props.columns
  const count = props.items.length
  if (props.layout === 'list' || count === 1) return 1
  if (count % 3 === 0) return 3
  return count % 2 === 0 ? 2 : 3
})

const isExternal = (link) => /^[a-z]+:/i.test(link)
const isGitHub = (link) => link.startsWith('https://github.com/')
</script>

<template>
  <div class="LinkCards" :class="`is-${layout}`">
    <div class="grid" :class="`cols-${columns}`">
      <VPLink
        v-for="item in items"
        :id="item.id"
        :key="item.link"
        class="card"
        :class="{ 'has-icon': item.icon }"
        :href="item.link"
        no-icon
      >
        <Icon v-if="item.icon" class="icon" :name="item.icon" />
        <div class="body">
          <div class="head">
            <p class="title">{{ item.title }}</p>
            <span v-if="item.badge" class="badge">{{ item.badge }}</span>
            <Icon class="arrow" :name="isExternal(item.link) ? 'arrow-up-right' : 'arrow-right'" />
          </div>
          <p v-if="item.details" class="details">{{ item.details }}</p>
          <p v-if="item.meta" class="meta">
            <Icon v-if="isGitHub(item.link)" name="github" />
            {{ item.meta }}
          </p>
        </div>
      </VPLink>
    </div>
  </div>
</template>

<style scoped>
.LinkCards {
  container-type: inline-size;
  margin: 20px 0;
}

.grid {
  display: grid;
  gap: 12px;
}

/* minmax(0, 1fr) keeps long names or paths from widening a column past the page */
@container (min-width: 480px) {
  .grid.cols-2,
  .grid.cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container (min-width: 640px) {
  .grid.cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.LinkCards .card {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 14px 18px 16px;
  font-weight: 400;
  text-decoration: none;
  color: inherit;
  scroll-margin-top: calc(var(--vp-nav-height) + 24px);
  transition: border-color 0.25s, background-color 0.25s;
}

.LinkCards .card.has-icon {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 20px;
}

.LinkCards .card:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}

.icon {
  --icon-size: 20px;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.body {
  flex-grow: 1;
  min-width: 0;
}

.head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card .title {
  flex-grow: 1;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
  color: var(--vp-c-text-1);
}

.has-icon .title {
  font-size: 16px;
}

.badge {
  flex-shrink: 0;
  border-radius: 999px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 600;
  line-height: 24px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.arrow {
  --icon-size: 16px;
  color: var(--vp-c-text-3);
  transition: color 0.25s, transform 0.25s;
}

.card:hover .arrow {
  color: var(--vp-c-brand-1);
  transform: translateX(2px);
}

.card .details {
  margin: 4px 0 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.card .meta {
  --icon-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 20px;
  color: var(--vp-c-text-3);
  overflow-wrap: anywhere;
}

/* Inline layout: compact cards sized to their content, wrapping as a row */
.LinkCards.is-inline .grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.LinkCards.is-inline .card.has-icon {
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 8px;
}

.LinkCards.is-inline .icon {
  --icon-size: 18px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.LinkCards.is-inline .head {
  gap: 12px;
}

.LinkCards.is-inline .title {
  font-size: 15px;
}

.LinkCards.is-inline .details {
  margin: 0;
  font-size: 12px;
  line-height: 16px;
}
</style>
