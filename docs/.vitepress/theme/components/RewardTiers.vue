<script setup>
defineProps({
  // [{ tone, level, reward, details }], lowest tier first; tone is gray, green, orange or red
  tiers: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="RewardTiers">
    <div class="grid">
      <div v-for="tier in tiers" :key="tier.level" class="tier" :class="tier.tone">
        <div class="level"><span class="dot" />{{ tier.level }}</div>
        <div class="reward">{{ tier.reward }}</div>
        <div class="details">{{ tier.details }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.RewardTiers {
  container-type: inline-size;
  margin: 16px 0;
}

.grid {
  display: grid;
  gap: 8px;
}

@container (min-width: 420px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@container (min-width: 720px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Same card look as LinkCards */
.tier {
  --tone: var(--vp-c-text-3);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px 16px 14px;
}

.tier.green {
  --tone: var(--vp-c-green-1);
}

.tier.orange {
  --tone: var(--vp-c-yellow-1);
}

.tier.red {
  --tone: var(--vp-c-red-1);
}

.level {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: var(--vp-c-text-2);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--tone);
}

.reward {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 28px;
  color: var(--vp-c-text-1);
}

.details {
  margin-top: 4px;
  font-size: 13px;
  line-height: 19px;
  color: var(--vp-c-text-2);
}
</style>
