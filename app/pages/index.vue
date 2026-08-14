<script setup lang="ts">
const { data: artists } = useArtists()
const demo = usingMocks()

// Numéro de série : le nombre d'artistes, sur 9 chiffres groupés par 3.
const serial = computed(() =>
  String(artists.value?.length ?? 0).padStart(9, '0').replace(/(\d{3})(?=\d)/g, '$1 '),
)
</script>

<template>
  <main class="screen">
    <div class="bar">
      <span class="meta">Sonatlas</span>
      <span v-if="demo" class="meta face">Démo</span>
      <span class="meta">Type — artist</span>
    </div>
    <div class="rule-reel"><div class="rule" /></div>

    <header class="hero">
      <h1>Sonatlas</h1>
      <p class="meta sub">Collection d'artistes &amp; de genres</p>
    </header>

    <!-- vue éclatée de la cassette, en filets -->
    <svg class="drawing" viewBox="0 0 340 252" role="img" aria-label="Schéma technique d'une cassette audio">
      <g fill="none" stroke="currentColor" stroke-width="1.2">
        <rect x="14" y="36" width="312" height="186" rx="7" />
        <rect x="24" y="46" width="292" height="166" rx="4" opacity=".35" />

        <!-- fenêtre de bande -->
        <rect x="86" y="68" width="168" height="88" rx="3" />

        <!-- bobines : même grammaire que la roue de fond, une couronne crantée.
             Le translate est sur un g extérieur, sinon l'animation CSS écraserait
             l'attribut transform de la rotation. -->
        <g transform="translate(128 112)">
          <g class="reel">
            <!-- jante posée sur l'arête externe des crans : 24 + 3/2 = 25.5 -->
            <circle r="25.5" />
            <circle r="24" stroke-width="3" stroke-dasharray="3.8 4.578" opacity=".3" />
            <circle r="8" />
            <path d="M0 -8.5V-14.5 M0 8.5V14.5 M-8.5 0H-14.5 M8.5 0H14.5 M-6 -6L-10.25 -10.25 M6 6L10.25 10.25 M6 -6L10.25 -10.25 M-6 6L-10.25 10.25" />
          </g>
        </g>
        <g transform="translate(212 112)">
          <g class="reel slow">
            <!-- jante posée sur l'arête externe des crans : 24 + 3/2 = 25.5 -->
            <circle r="25.5" />
            <circle r="24" stroke-width="3" stroke-dasharray="3.8 4.578" opacity=".3" />
            <circle r="8" />
            <path d="M0 -8.5V-14.5 M0 8.5V14.5 M-8.5 0H-14.5 M8.5 0H14.5 M-6 -6L-10.25 -10.25 M6 6L10.25 10.25 M6 -6L10.25 -10.25 M-6 6L-10.25 10.25" />
          </g>
        </g>

        <!-- lucarne de tête de lecture + ergots -->
        <path d="M104 166h132v34H104z" />
        <path d="M132 166v34M208 166v34" opacity=".45" />
        <circle cx="170" cy="183" r="6" />

        <!-- vis -->
        <circle cx="34" cy="56" r="3" /><circle cx="306" cy="56" r="3" />
        <circle cx="34" cy="202" r="3" /><circle cx="306" cy="202" r="3" />

        <!-- lignes d'étiquette -->
        <path d="M40 82h34M40 92h26M40 102h34" opacity=".5" />

        <!-- lignes de cote, tracées hors du corps -->
        <path d="M122 36v-14h-46" opacity=".7" />
        <path d="M170 222v14h64" opacity=".7" />
      </g>
      <g fill="currentColor">
        <circle cx="122" cy="36" r="2.4" /><circle cx="170" cy="222" r="2.4" />
      </g>
      <text class="anno" x="72" y="25" text-anchor="end">Face A</text>
      <text class="anno" x="240" y="239">4,76 cm/s</text>
    </svg>

    <nav class="transport">
      <NuxtLink to="/artists" class="btn">
        <span>Parcourir</span>
        <span class="glyph" aria-hidden="true">▶▶</span>
      </NuxtLink>
      <NuxtLink to="/new" class="btn accent">
        <span>Enregistrer</span>
        <span class="glyph" aria-hidden="true">●</span>
      </NuxtLink>
    </nav>

    <div class="rule-reel"><div class="rule" /></div>
    <div class="bar">
      <span class="meta">V1.0 2026</span>
      <span class="meta serial">{{ serial }}</span>
    </div>
  </main>
</template>

<style scoped>
/* Hauteur fixe, pas `min-height` : l'accueil ne doit jamais défiler. C'est le
   schéma qui absorbe la place restante — voir `.drawing`. */
.screen {
  height: 100dvh;
  max-width: 560px;
  margin: 0 auto;
  padding: calc(var(--top) + var(--pad)) var(--pad) calc(var(--bottom) + var(--pad));
  display: flex;
  flex-direction: column;
  gap: .7rem;
}

/* les groupes de chiffres ne doivent pas se couper en bout de barre */
.serial { white-space: nowrap; }

.hero { margin: clamp(1.5rem, 7vh, 3rem) 0 clamp(1rem, 4vh, 2rem); }

.hero h1 {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(3rem, 19vw, 6rem);
  line-height: .84;
  letter-spacing: -.045em;
  text-transform: uppercase;
}

.sub { margin-top: .9rem; }

/* ── dessin ── */
/* `flex: 1` + `min-height: 0` : la hauteur vient de la place restante et non du
   ratio du viewBox, donc le schéma rétrécit au lieu de pousser la page. Son
   `preserveAspectRatio` par défaut le garde centré et proportionné dans la boîte. */
.drawing {
  flex: 1;
  min-height: 0;
  width: 100%;
  color: var(--ink);
}

.drawing .anno {
  font-family: var(--mono);
  font-size: 7.5px;
  letter-spacing: .16em;
  text-transform: uppercase;
  fill: var(--ink);
  opacity: .75;
}

.reel {
  transform-box: fill-box;
  transform-origin: center;
  animation: spin 9s linear infinite;
}
/* durée et déphasage différents : les deux moyeux ne flottent jamais ensemble */
.reel.slow { animation-duration: 13.7s; animation-delay: -4s; }

/* ── transport ── */
.transport {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  margin-top: clamp(1.5rem, 5vh, 2.5rem);
}

.glyph { font-size: .62rem; letter-spacing: .1em; }

/* Sous ~480px de haut (paysage téléphone), le schéma n'a plus de place utile :
   il tombe à 0 et les blocs fixes débordent quand même de quelques pixels.
   On le retire franchement et on resserre les marges plancher. */
@media (max-height: 480px) {
  .drawing { display: none; }
  .hero { margin: .8rem 0; }
  .transport { margin-top: .8rem; }
}
</style>
