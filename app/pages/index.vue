<script setup lang="ts">
const { data: artists } = useArtists()
const demo = usingMocks()

// Serial number: the artist count, on 9 digits grouped by 3.
const serial = computed(() =>
  String(artists.value?.length ?? 0).padStart(9, '0').replace(/(\d{3})(?=\d)/g, '$1 '),
)
</script>

<template>
  <main class="screen">
    <div class="bar">
      <span class="meta">Sonatlas</span>
      <span v-if="demo" class="meta face">Demo</span>
      <span class="meta">Type — artist</span>
    </div>
    <div class="rule-reel"><div class="rule" /></div>

    <header class="hero">
      <h1>Sonatlas</h1>
      <p class="meta sub">A collection of artists &amp; genres</p>
    </header>

    <!-- exploded view of the cassette, in line art -->
    <svg class="drawing" viewBox="0 0 340 252" role="img" aria-label="Technical drawing of an audio cassette">
      <g fill="none" stroke="currentColor" stroke-width="1.2">
        <rect x="14" y="36" width="312" height="186" rx="7" />
        <rect x="24" y="46" width="292" height="166" rx="4" opacity=".35" />

        <!-- tape window -->
        <rect x="86" y="68" width="168" height="88" rx="3" />

        <!-- reels: same grammar as the background wheel, a cogged ring.
             The translate sits on an outer g, otherwise the CSS animation would
             overwrite the rotation's transform attribute. -->
        <g transform="translate(128 112)">
          <g class="reel">
            <!-- rim sitting on the outer edge of the teeth: 24 + 3/2 = 25.5 -->
            <circle r="25.5" />
            <circle r="24" stroke-width="3" stroke-dasharray="3.8 4.578" opacity=".3" />
            <circle r="8" />
            <path d="M0 -8.5V-14.5 M0 8.5V14.5 M-8.5 0H-14.5 M8.5 0H14.5 M-6 -6L-10.25 -10.25 M6 6L10.25 10.25 M6 -6L10.25 -10.25 M-6 6L-10.25 10.25" />
          </g>
        </g>
        <g transform="translate(212 112)">
          <g class="reel slow">
            <!-- rim sitting on the outer edge of the teeth: 24 + 3/2 = 25.5 -->
            <circle r="25.5" />
            <circle r="24" stroke-width="3" stroke-dasharray="3.8 4.578" opacity=".3" />
            <circle r="8" />
            <path d="M0 -8.5V-14.5 M0 8.5V14.5 M-8.5 0H-14.5 M8.5 0H14.5 M-6 -6L-10.25 -10.25 M6 6L10.25 10.25 M6 -6L10.25 -10.25 M-6 6L-10.25 10.25" />
          </g>
        </g>

        <!-- head window + lugs -->
        <path d="M104 166h132v34H104z" />
        <path d="M132 166v34M208 166v34" opacity=".45" />
        <circle cx="170" cy="183" r="6" />

        <!-- screws -->
        <circle cx="34" cy="56" r="3" /><circle cx="306" cy="56" r="3" />
        <circle cx="34" cy="202" r="3" /><circle cx="306" cy="202" r="3" />

        <!-- label lines -->
        <path d="M40 82h34M40 92h26M40 102h34" opacity=".5" />

        <!-- dimension lines, drawn outside the body -->
        <path d="M122 36v-14h-46" opacity=".7" />
        <path d="M170 222v14h64" opacity=".7" />
      </g>
      <g fill="currentColor">
        <circle cx="122" cy="36" r="2.4" /><circle cx="170" cy="222" r="2.4" />
      </g>
      <text class="anno" x="72" y="25" text-anchor="end">Face A</text>
      <text class="anno" x="240" y="239">4.76 cm/s</text>
    </svg>

    <nav class="transport">
      <NuxtLink to="/artists" class="btn">
        <span>Browse</span>
        <span class="glyph" aria-hidden="true">▶▶</span>
      </NuxtLink>
      <NuxtLink to="/new" class="btn accent">
        <span>Record</span>
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
/* Fixed height, not `min-height`: the home screen must never scroll. The
   drawing is what absorbs the remaining space — see `.drawing`. */
.screen {
  height: 100dvh;
  max-width: var(--col);
  margin: 0 auto;
  padding: calc(var(--top) + var(--pad)) var(--pad) calc(var(--bottom) + var(--pad));
  display: flex;
  flex-direction: column;
  gap: .7rem;
}

/* digit groups must not break at the end of the bar */
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

/* `flex: 1` + `min-height: 0`: the height comes from the remaining space, not
   from the viewBox ratio, so the drawing shrinks instead of pushing the page.
   Its default `preserveAspectRatio` keeps it centred and proportional in the box. */
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
/* different duration and offset: the two hubs never drift in sync */
.reel.slow { animation-duration: 13.7s; animation-delay: -4s; }

.transport {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  margin-top: clamp(1.5rem, 5vh, 2.5rem);
}

.glyph { font-size: .62rem; letter-spacing: .1em; }

/* Below ~480px tall (phone landscape) the drawing has no usable room left: it
   collapses to 0 and the fixed blocks still overflow by a few pixels.
   So we drop it outright and tighten the floor margins. */
@media (max-height: 480px) {
  .drawing { display: none; }
  .hero { margin: .8rem 0; }
  .transport { margin-top: .8rem; }
}
</style>
