<!-- Moyeu cranté en fond d'écran, moyeu calé dans le coin bas-droit. -->
<template>
  <svg class="cog" viewBox="0 0 200 200" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="100" cy="100" r="95" />
      <!-- Les tirets sont calés sur la circonférence pour boucler sans raccord :
           2πr / nombre de crans, soit 36 crans ici. -->
      <circle cx="100" cy="100" r="80" stroke-width="11" stroke-dasharray="4.6 9.363" />
      <circle cx="100" cy="100" r="65" />
      <circle cx="100" cy="100" r="26" />
      <path d="M100 73V50M100 127v23M73 100H50M127 100h23M81 81 64 64M119 119l17 17M119 81l17-17M81 119l-17 17" />
    </g>
  </svg>
</template>

<style scoped>
.cog {
  /* décalée d'une demi-largeur : le moyeu tombe pile dans le coin bas-droit */
  --size: min(155vw, 900px);
  position: fixed;
  z-index: -1;
  right: calc(var(--size) / -2);
  bottom: calc(var(--size) / -2);
  width: var(--size);
  height: auto;
  color: var(--ink);
  opacity: .06;
  pointer-events: none;
  animation: spin 48s linear infinite;
}
</style>
