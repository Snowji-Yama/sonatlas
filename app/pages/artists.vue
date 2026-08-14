<script setup lang="ts">
import { ALL_SUBGENRES, GENRES, GENRE_NAMES } from '~/constants/genres'

const { data: artists, pending, error } = useArtists()
const demo = usingMocks()

// ponytail: useState survit à la navigation vers /new et retour, et meurt avec
// l'onglet — ce qui est le comportement demandé. Il repart aussi à zéro sur un
// rechargement complet ; si ça gêne, passer ces trois lignes en sessionStorage.
const genre = useState('filter:genre', () => '')
const subgenre = useState('filter:subgenre', () => '')
const asc = useState('filter:asc', () => true)

const hasFilters = computed(() => !!genre.value || !!subgenre.value)
function resetFilters() {
  genre.value = ''
  subgenre.value = ''
}

// Le sélecteur de sous-genre se restreint au genre choisi.
const subgenreOptions = computed(() => (genre.value ? GENRES[genre.value] ?? [] : ALL_SUBGENRES))
watch(genre, () => {
  if (subgenre.value && !subgenreOptions.value.includes(subgenre.value)) subgenre.value = ''
})

// Changer un filtre ou le tri renvoie en haut de liste : sinon on se retrouve
// au milieu d'un classement qui n'a plus rien à voir.
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
        <span v-if="demo" class="meta face">Démo</span>
        <span class="meta">
          {{ pad(visible.length) }} / {{ pad(artists?.length ?? 0) }}
          <span class="face">Face A</span>
        </span>
      </div>
      <div class="rule-reel"><div class="rule" /></div>

      <header class="head">
        <h1>Collection</h1>
        <button class="sort meta" :aria-label="`Trier ${asc ? 'de Z à A' : 'de A à Z'}`" @click="asc = !asc">
          {{ asc ? 'A→Z' : 'Z→A' }}
        </button>
      </header>

      <div class="filters">
        <label class="field">
          <span class="meta">Genre</span>
          <select v-model="genre">
            <option value="">Tous</option>
            <option v-for="g in GENRE_NAMES" :key="g" :value="g">{{ g }}</option>
          </select>
        </label>
        <label class="field">
          <span class="meta">Sous-genre</span>
          <select v-model="subgenre">
            <option value="">Tous</option>
            <option v-for="s in subgenreOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </label>
        <button
          class="eject"
          :disabled="!hasFilters"
          title="Réinitialiser les filtres"
          aria-label="Réinitialiser les filtres"
          @click="resetFilters"
        >
          <span class="glyph-eject" aria-hidden="true" />
        </button>
      </div>
    </div>

    <p v-if="pending" class="note meta">Lecture de la bande…</p>
    <p v-else-if="error" class="note err">{{ error.message }}</p>
    <p v-else-if="!visible.length" class="note meta">Bande vierge — aucun résultat</p>

    <ol v-else class="list">
      <li v-for="(a, i) in visible" :key="a.id" class="row">
        <div class="rule" />
        <div class="grid">
          <span class="meta idx">{{ pad(i + 1) }}</span>
          <h2>{{ a.name }}</h2>
          <span class="meta genre">{{ a.genre }}</span>
          <p v-if="a.subgenres?.length" class="meta subs">{{ a.subgenres.join(' · ') }}</p>
        </div>
      </li>
    </ol>

    <div class="dock">
      <NuxtLink to="/new" class="btn accent">
        <span>Enregistrer</span>
        <span aria-hidden="true">●</span>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.screen {
  min-height: 100dvh;
  max-width: 560px;
  margin: 0 auto;
  /* le padding haut vit dans .pinned, sinon la liste défile dans la marge */
  padding: 0 var(--pad) calc(var(--bottom) + 5rem);
  display: flex;
  flex-direction: column;
}

/* en-tête + filtres épinglés : toujours accessibles pendant le défilement */
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

/* ── titre ── */
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

/* ── filtres ── */
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
  /* chevron */
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

/* ── liste ── */
.note { padding: 3rem 0; text-align: center; }
.note.err { color: var(--accent); font-size: .8rem; }

.list { list-style: none; }

.row > .rule { opacity: .35; }
/* la première ligne doublerait le filet de bas de .pinned */
.row:first-child > .rule { display: none; }

/* index | nom            genre
        | sous-genres           */
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

.genre { grid-column: 3; text-align: right; white-space: nowrap; color: var(--ink); }

.subs {
  grid-column: 2 / -1;
  margin-top: .35rem;
  letter-spacing: .1em;
  text-transform: none;
}

/* ── appel à l'action ── */
/* Fixe en bas : le dégradé fait disparaître la liste sous le bouton. */
.dock {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  padding: 1.6rem var(--pad) calc(var(--bottom) + .9rem);
  background: linear-gradient(to bottom, transparent, var(--paper) 45%);
}
.dock .btn { max-width: calc(560px - 2 * var(--pad)); margin: 0 auto; }
</style>
