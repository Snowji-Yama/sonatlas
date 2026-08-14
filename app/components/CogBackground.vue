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
  --size: min(155vw, 900px);
  position: fixed;
  z-index: -1;
  /* Le moyeu se cale sur le coin bas-droit de la colonne de contenu, pas de la
     fenêtre : sur desktop la colonne est centrée et la roue paraîtrait sinon
     détachée, collée au bord de l'écran. `50%` vaut la moitié du viewport, le
     `min()` fait retomber le décalage à zéro dès que l'écran est plus étroit
     que la colonne. */
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
