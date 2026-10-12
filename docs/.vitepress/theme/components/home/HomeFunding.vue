<script setup>
import { VPLink } from 'vitepress/theme'
import Icon from '../Icon.vue'

defineProps({
  // [{ title, focus, links: [{ text, link }] }]
  grants: {
    type: Array,
    required: true
  },
  // [{ period, funder, referendum, referendumLink, reports: [{ month, link }] }], oldest first
  treasury: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="HomeFunding">
    <div class="columns">
      <div class="column">
        <div class="column-title">
          <Icon class="column-icon" name="award" />
          Web3 Foundation grants
        </div>
        <ol class="timeline">
          <li v-for="grant in grants" :key="grant.title" class="entry">
            <div class="entry-title">
              {{ grant.title }}
              <span v-if="grant.focus" class="focus">{{ grant.focus }}</span>
            </div>
            <div class="chips">
              <VPLink v-for="item in grant.links" :key="item.link" class="chip" :href="item.link" no-icon>
                {{ item.text }}
              </VPLink>
            </div>
          </li>
        </ol>
      </div>

      <div class="column">
        <div class="column-title">
          <Icon class="column-icon" name="landmark" />
          Treasury-funded maintenance
        </div>
        <ol class="timeline">
          <li
            v-for="(period, i) in treasury"
            :key="period.period"
            class="entry"
            :class="{ latest: i === treasury.length - 1 }"
          >
            <div class="entry-head">
              <span class="entry-title">{{ period.period }}</span>
              <span class="funder" :class="period.funder.toLowerCase()">{{ period.funder }}</span>
              <VPLink class="referendum" :href="period.referendumLink" no-icon>
                Referendum #{{ period.referendum }}
                <Icon name="arrow-up-right" />
              </VPLink>
            </div>
            <div class="chips">
              <span class="chips-label">Monthly reports</span>
              <VPLink v-for="report in period.reports" :key="report.link" class="chip" :href="report.link" no-icon>
                {{ report.month }}
              </VPLink>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<style scoped>
.HomeFunding {
  container-type: inline-size;
  margin: 20px 0;
}

.columns {
  display: grid;
  gap: 40px;
}

@container (min-width: 880px) {
  .columns {
    grid-template-columns: 5fr 7fr;
    gap: 48px;
  }
}

/*
 * The header icon is 32px wide, so its center sits 16px in. Dots and the rail are
 * centered on that line, and entry text starts where the header text starts (42px).
 */
.column-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--vp-c-text-1);
}

.column-icon {
  --icon-size: 18px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.HomeFunding .timeline {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Rail from the header icon down to the first dot */
.HomeFunding .timeline::before {
  position: absolute;
  top: -18px;
  left: 15px;
  width: 2px;
  height: 30px;
  background-color: var(--vp-c-divider);
  content: '';
}

.HomeFunding .entry {
  position: relative;
  margin: 0;
  padding: 0 0 24px 42px;
}

.HomeFunding .entry:last-child {
  padding-bottom: 0;
}

/* Rail from this dot to the next one */
.entry::before {
  position: absolute;
  top: 12px;
  bottom: -12px;
  left: 15px;
  width: 2px;
  background-color: var(--vp-c-divider);
  content: '';
}

.entry:last-child::before {
  display: none;
}

/* Dot */
.entry::after {
  position: absolute;
  z-index: 1;
  top: 5px;
  left: 9px;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  background-color: var(--vp-c-bg);
  content: '';
}

.entry.latest::after {
  background-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.entry-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
}

.entry-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: var(--vp-c-text-1);
}

.focus {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.funder {
  border-radius: 999px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 20px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.funder.polkadot {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.HomeFunding .referendum {
  --icon-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.HomeFunding .referendum:hover {
  color: var(--vp-c-brand-1);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.chips-label {
  margin-right: 2px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.HomeFunding .chip {
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 0 9px;
  font-size: 12px;
  font-weight: 500;
  line-height: 22px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: border-color 0.25s, color 0.25s;
}

.HomeFunding .chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
