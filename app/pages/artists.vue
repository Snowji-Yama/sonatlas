<script setup lang="ts">
import { ALL_SUBGENRES, GENRES, GENRE_NAMES } from '~/constants/genres'

const { data: artists, pending, error } = useArtists()
const demo = usingMocks()

// ponytail: useState survives navigating to /new and back, and dies with the
// tab — which is the behaviour we want. It also resets on a full reload; if
// that ever bites, move these three lines to sessionStorage.
const genre = useState('filter:genre', () => '')
const subgenre = useState('filter:subgenre', () => '')
const asc = useState('filter:asc', () => true)

const hasFilters = computed(() => !!genre.value || !!subgenre.value)
function resetFilters() {
  genre.value = ''
  subgenre.value = ''
}

// The subgenre picker narrows down to the selected genre.
const subgenreOptions = computed(() => (genre.value ? GENRES[genre.value] ?? [] : ALL_SUBGENRES))
watch(genre, () => {
  if (subgenre.value && !subgenreOptions.value.includes(subgenre.value)) subgenre.value = ''
})

// Changing a filter or the sort scrolls back to the top: otherwise you land in
// the middle of a ranking that no longer has anything to do with the list.
watch([genre, subgenre, asc], () => window.scrollTo({ top: 0 }))

const visible = computed(() =>
  filterArtists(artists.value ?? [], {
    genre: genre.value,
    subgenre: subgenre.value,
    asc: asc.value,
  }),
)

const pad = (n: number) => String(n).padStart(3, '0')
</script>

<template>
  <main class="screen">
    <CogBackground />

    <div class="pinned">
      <div class="bar">
        <NuxtLink to="/" class="meta back">← Index</NuxtLink>
        <span v-if="demo" class="meta face">Demo</span>
        <span class="meta">
          {{ pad(visible.length) }} / {{ pad(artists?.length ?? 0) }}
          <span class="face">Face A</span>
        </span>
      </div>
      <div class="rule-reel"><div class="rule" /></div>

      <header class="head">
        <h1>Collection</h1>
        <button class="sort meta" :aria-label="`Sort ${asc ? 'Z to A' : 'A to Z'}`" @click="asc = !asc">
          {{ asc ? 'A→Z' : 'Z→A' }}
        </button>
      </header>

      <div class="filters">
        <label class="field">
          <span class="meta">Genre</span>
          <select v-model="genre">
            <option value="">All</option>
            <option v-for="g in GENRE_NAMES" :key="g" :value="g">{{ g }}</option>
          </select>
        </label>
        <label class="field">
          <span class="meta">Subgenre</span>
          <select v-model="subgenre">
            <option value="">All</option>
            <option v-for="s in subgenreOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <button
          class="eject"
          :disabled="!hasFilters"
          title="Reset filters"
          aria-label="Reset filters"
          @click="resetFilters"
        >
          <span class="glyph-eject" aria-hidden="true" />
        </button>
      </div>
    </div>

    <p v-if="pending" class="note meta">Reading the tape…</p>
    <p v-else-if="error" class="note err">{{ error.message }}</p>
    <p v-else-if="!visible.length" class="note meta">Blank tape — no results</p>

    <ol v-else class="list">
      <li v-for="(a, i) in visible" :key="a.id" class="row">
        <div class="rule" />
        <div class="grid">
          <span class="meta idx">{{ pad(i + 1) }}</span>
          <h2>{{ a.name }}</h2>
          <!-- One genre per line: a separator ends up stranded alone when the column wraps -->
          <span class="meta genre">
            <span v-for="g in a.genres" :key="g">{{ g }}</span>
          </span>
          <p v-if="a.subgenres?.length" class="meta subs">{{ a.subgenres.join(' · ') }}</p>
        </div>
      </li>
    </ol>

    <div class="dock">
      <NuxtLink to="/new" class="btn accent">
        <span>Record</span>
        <span aria-hidden="true">●</span>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.screen {
  min-height: 100dvh;
  max-width: var(--col);
  margin: 0 auto;
  /* the top padding lives in .pinned, otherwise the list scrolls through the margin */
  padding: 0 var(--pad) calc(var(--bottom) + 5rem);
  display: flex;
  flex-direction: column;
}

/* pinned header + filters: always reachable while scrolling */
.pinned {
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: .6rem;
  padding: calc(var(--top) + var(--pad)) 0 .7rem;
  background: var(--paper);
}
.pinned::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: var(--ink);
  opacity: .55;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-top: .3rem;
}

.head h1 {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(2rem, 10vw, 3rem);
  line-height: .85;
  letter-spacing: -.045em;
  text-transform: uppercase;
}

.sort {
  flex: none;
  border: 1px solid var(--ink);
  border-radius: 2px;
  padding: .35rem .5rem;
  color: var(--ink);
}
.sort:active { background: var(--accent); }
.sort:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.filters { display: flex; align-items: flex-end; gap: .8rem; }

.field { flex: 1; min-width: 0; }
.field .meta { display: block; margin-bottom: .2rem; }

.field select {
  width: 100%;
  height: 2.1rem;
  appearance: none;
  border: 0;
  border-bottom: 1px solid var(--ink);
  border-radius: 0;
  background: transparent;
  padding: 0 1.2rem 0 0;
  font-family: var(--display);
  font-weight: 700;
  font-size: .9rem;
  letter-spacing: -.01em;
  text-transform: uppercase;
  background-image:
    linear-gradient(45deg, transparent 50%, var(--ink) 50%),
    linear-gradient(135deg, var(--ink) 50%, transparent 50%);
  background-position: right .3rem center, right .05rem center;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}
.field select:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.eject {
  flex: none;
  width: 2.1rem;
  height: 2.1rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--ink);
  border-radius: 2px;
}
.eject:active:not(:disabled) { background: var(--accent); }
.eject:disabled { opacity: .3; }
.eject:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.glyph-eject {
  position: relative;
  width: 0;
  height: 0;
  border-bottom: 7px solid var(--ink);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  margin-top: -3px;
}
.glyph-eject::after {
  content: '';
  position: absolute;
  top: 10px;
  left: -6px;
  width: 12px;
  height: 2px;
  background: var(--ink);
}

.note { padding: 3rem 0; text-align: center; }
.note.err { color: var(--accent); font-size: .8rem; }

.list { list-style: none; }

.row > .rule { opacity: .35; }
/* the first row would double the bottom rule of .pinned */
.row:first-child > .rule { display: none; }

/* index | name            genre
        | subgenres            */
.grid {
  display: grid;
  grid-template-columns: 2.4rem 1fr auto;
  align-items: baseline;
  gap: .1rem .5rem;
  padding: .7rem 0 .9rem;
}

.idx { grid-row: 1; align-self: center; }

.grid h2 {
  grid-column: 2;
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(1.25rem, 6vw, 1.6rem);
  line-height: 1;
  letter-spacing: -.035em;
  text-transform: uppercase;
  word-break: break-word;
}

/* Each row is its own grid, so an auto column sizes to that row alone and the
   left edge shifts from row to row. Fixed width = one shared edge.
   16ch fits the longest genre name ("Experimental"); a longer one would wrap. */
.genre {
  grid-column: 3;
  width: 16ch;
  display: flex;
  flex-direction: column;
  color: var(--ink);
}
.genre > span { white-space: nowrap; }

.subs {
  grid-column: 2 / -1;
  margin-top: .35rem;
  letter-spacing: .1em;
  text-transform: none;
}

/* Fixed at the bottom: the gradient fades the list out under the button. */
.dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  padding: 1.6rem var(--pad) calc(var(--bottom) + .9rem);
  background: linear-gradient(to bottom, transparent, var(--paper) 45%);
}
.dock .btn { max-width: calc(var(--col) - 2 * var(--pad)); margin: 0 auto; }
</style>
