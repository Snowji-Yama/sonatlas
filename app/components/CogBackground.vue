<!-- Cogged hub as a background, anchored to the bottom-right corner. -->
<template>
  <svg class="cog" viewBox="0 0 200 200" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="100" cy="100" r="95" />
      <!-- Dashes are sized off the circumference so the ring closes seamlessly:
           2πr / number of teeth, i.e. 36 teeth here. -->
      <circle cx="100" cy="100" r="80" stroke-width="11" stroke-dasharray="4.6 9.363" />
      <circle cx="100" cy="100" r="65" />
      <circle cx="100" cy="100" r="26" />
      <path d="M100 73V50M100 127v23M73 100H50M127 100h23M81 81 64 64M119 119l17 17M119 81l17-17M81 119l-17 17" />
    </g>
  </svg>
</template>

<style scoped>
.cog {
  --size: min(155vw, 900px);
  position: fixed;
  z-index: -1;
  /* The hub anchors to the bottom-right corner of the content column, not of
     the window: on desktop the column is centred and the wheel would otherwise
     look detached, stuck to the screen edge. `50%` is half the viewport, and
     `min()` drops the offset back to zero as soon as the screen is narrower
     than the column. */
  right: calc(50% - min(var(--col) / 2, 50%) - var(--size) / 2);
  bottom: calc(var(--size) / -2);
  width: var(--size);
  height: auto;
  color: var(--ink);
  opacity: .06;
  pointer-events: none;
  animation: spin 48s linear infinite;
}
</style>
