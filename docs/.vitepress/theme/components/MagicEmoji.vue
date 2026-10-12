<script setup>
import { ref } from 'vue'

// Playful emoji for headings: tilted, wiggles on hover, casts sparkles on click.
defineProps({
  emoji: {
    type: String,
    required: true
  },
  tilt: {
    type: Number,
    default: 10
  }
})

const el = ref(null)
const waving = ref(false)
const colors = ['#ff5c8c', '#eac926', '#f39335', '#ff8fb0']

function cast() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  waving.value = false
  requestAnimationFrame(() => (waving.value = true))

  const rect = el.value.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  const count = 14
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span')
    particle.className = 'magic-particle'
    particle.textContent = i % 4 === 0 ? '✨' : '✦'
    Object.assign(particle.style, {
      left: `${x}px`,
      top: `${y}px`,
      color: colors[i % colors.length],
      fontSize: `${10 + Math.random() * 10}px`
    })
    document.body.appendChild(particle)

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const distance = 36 + Math.random() * 44
    particle.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0.3)', opacity: 1 },
        {
          transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(1) rotate(${Math.random() * 180}deg)`,
          opacity: 0
        }
      ],
      { duration: 650 + Math.random() * 350, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    ).onfinish = () => particle.remove()
  }
}
</script>

<template>
  <span
    ref="el"
    class="MagicEmoji ignore-header"
    :class="{ waving }"
    :style="{ '--tilt': `${tilt}deg` }"
    aria-hidden="true"
    @click="cast"
    @animationend="waving = false"
  >{{ emoji }}</span>
</template>

<style scoped>
.MagicEmoji {
  display: inline-block;
  margin-left: 0.2em;
  font-size: 0.9em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  rotate: var(--tilt);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.15));
  transition: rotate 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.MagicEmoji:hover {
  rotate: calc(var(--tilt) * -1);
  scale: 1.15;
}

.MagicEmoji.waving {
  animation: magic-wave 0.8s ease-in-out;
}

@keyframes magic-wave {
  0%,
  100% {
    rotate: var(--tilt);
  }
  20% {
    rotate: -16deg;
  }
  40% {
    rotate: 14deg;
  }
  60% {
    rotate: -10deg;
  }
  80% {
    rotate: 6deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .MagicEmoji {
    transition: none;
  }
}
</style>
