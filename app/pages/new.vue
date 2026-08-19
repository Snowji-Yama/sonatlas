<script setup lang="ts">
import { GENRES, GENRE_NAMES } from '~/constants/genres'

const { session, ready, sendLink, signOut, enabled } = useAuth()
const demo = usingMocks()
/** Sign-in screen as long as Supabase is wired up and we are not signed in. */
const locked = computed(() => enabled && ready.value && !session.value)

const email = ref('')
const sending = ref(false)
const sent = ref(false)
const authError = ref('')

async function requestLink() {
  const trimmed = email.value.trim()
  if (!trimmed) {
    authError.value = 'Enter your email address.'
    return
  }
  sending.value = true
  authError.value = ''
  try {
    await sendLink(trimmed)
    sent.value = true
  } catch (e) {
    authError.value = (e as Error).message
  } finally {
    sending.value = false
  }
}

const name = ref('')
const genres = ref<string[]>([])
const subgenres = ref<string[]>([])
const saving = ref(false)
const error = ref('')

// One block per selected genre, in GENRES order so the blocks do not reshuffle
// with the order you clicked the genres in. No subgenre belongs to two genres,
// so no block repeats a chip.
const groups = computed(() =>
  GENRE_NAMES.filter(g => genres.value.includes(g)).map(name => ({ name, subs: GENRES[name] ?? [] })),
)

function toggle(list: string[], v: string) {
  const i = list.indexOf(v)
  i === -1 ? list.push(v) : list.splice(i, 1)
}

function toggleGenre(g: string) {
  toggle(genres.value, g)
  // Dropping a genre must drop the subgenres it was the only source of.
  const allowed = groups.value.flatMap(x => x.subs)
  subgenres.value = subgenres.value.filter(s => allowed.includes(s))
}

async function submit() {
  const trimmed = name.value.trim()
  if (!trimmed || !genres.value.length) {
    error.value = 'Name and at least one genre are required.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await addArtist({ name: trimmed, genres: [...genres.value], subgenres: [...subgenres.value] })
    await refreshNuxtData('artists')
    await navigateTo('/artists')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="screen">
    <CogBackground />

    <div class="bar">
      <NuxtLink to="/artists" class="meta back">← Collection</NuxtLink>
      <span v-if="demo" class="meta face">Demo</span>
      <span class="meta">
        Track 01
        <span class="face">Face B</span>
      </span>
    </div>
    <div class="rule-reel"><div class="rule" /></div>

    <header class="head">
      <h1>{{ locked ? 'Restricted access' : 'New recording' }}</h1>
    </header>

    <p v-if="enabled && !ready" class="hint meta">Checking session…</p>

    <!-- ── sign in ── -->
    <form v-else-if="locked" class="form" novalidate @submit.prevent="requestLink">
      <p class="hint meta">
        Writing is reserved for the owner of the collection. A single-use sign-in
        link will be sent by email.
      </p>

      <label class="field">
        <span class="meta">01 — Email address</span>
        <input v-model="email" type="email" required autocomplete="email" placeholder="you@example.com">
      </label>

      <p v-if="sent" class="sent meta" role="status">
        Link sent to {{ email }}. Open it from this device.
      </p>
      <p v-if="authError" class="error meta" role="alert">⚠ {{ authError }}</p>

      <button type="submit" class="btn accent" :disabled="sending">
        <span>{{ sending ? 'Sending…' : 'Get the link' }}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>

    <!-- ── add ── -->
    <form v-else class="form" novalidate @submit.prevent="submit">
      <label class="field">
        <span class="meta">01 — Artist</span>
        <input v-model="name" type="text" required autocapitalize="words" placeholder="Band name">
      </label>

      <div class="field">
        <span class="meta">02 — Genres<template v-if="genres.length"> ({{ genres.length }})</template></span>
        <div class="chips">
          <button
            v-for="g in GENRE_NAMES"
            :key="g"
            type="button"
            class="chip meta"
            :class="{ on: genres.includes(g) }"
            :aria-pressed="genres.includes(g)"
            @click="toggleGenre(g)"
          >{{ g }}</button>
        </div>
      </div>

      <div class="field">
        <span class="meta">03 — Subgenres<template v-if="subgenres.length"> ({{ subgenres.length }})</template></span>
        <p v-if="!groups.length" class="hint meta">Waiting for a genre</p>
        <div v-else class="groups">
          <div v-for="grp in groups" :key="grp.name">
            <span class="meta group-label">{{ grp.name }}</span>
            <div class="chips">
              <button
                v-for="s in grp.subs"
                :key="s"
                type="button"
                class="chip meta"
                :class="{ on: subgenres.includes(s) }"
                :aria-pressed="subgenres.includes(s)"
                @click="toggle(subgenres, s)"
              >{{ s }}</button>
            </div>
          </div>
        </div>
      </div>

      <p v-if="error" class="error meta" role="alert">⚠ {{ error }}</p>

      <button type="submit" class="btn accent" :disabled="saving">
        <span>{{ saving ? 'Saving…' : 'Record' }}</span>
        <span aria-hidden="true">●</span>
      </button>
    </form>

    <div class="rule-reel"><div class="rule" /></div>
    <div class="bar">
      <span class="meta">Type A — normal</span>
      <button v-if="session" class="meta signout" @click="signOut">Sign out</button>
      <span class="meta">Stereo on</span>
    </div>
  </main>
</template>

<style scoped>
.screen {
  min-height: 100dvh;
  max-width: var(--col);
  margin: 0 auto;
  padding: calc(var(--top) + var(--pad)) var(--pad) calc(var(--bottom) + var(--pad));
  display: flex;
  flex-direction: column;
  gap: .7rem;
}

.head { margin: clamp(1rem, 4vh, 2rem) 0 .6rem; }

.head h1 {
  font-family: var(--display);
  font-weight: 700;
  font-size: clamp(2rem, 10vw, 3.2rem);
  line-height: .85;
  letter-spacing: -.045em;
  text-transform: uppercase;
}

.form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.field > .meta { display: block; margin-bottom: .35rem; }

.field input, .field select {
  width: 100%;
  height: 2.6rem;
  appearance: none;
  border: 0;
  border-bottom: 1px solid var(--ink);
  border-radius: 0;
  background: transparent;
  padding: 0 1.2rem 0 0;
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.4rem;
  line-height: 1;
  letter-spacing: -.03em;
  text-transform: uppercase;
  color: var(--ink);
}
.field input::placeholder { color: var(--ink-3); }
.field select {
  background-image:
    linear-gradient(45deg, transparent 50%, var(--ink) 50%),
    linear-gradient(135deg, var(--ink) 50%, transparent 50%);
  background-position: right .3rem center, right .05rem center;
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
}
.field input:focus-visible, .field select:focus-visible {
  outline: 0;
  border-bottom-color: var(--accent);
  border-bottom-width: 2px;
}

.hint { padding: .6rem 0; opacity: .7; line-height: 1.7; text-transform: none; letter-spacing: .06em; }

.chips { display: flex; flex-wrap: wrap; gap: .3rem; padding-top: .2rem; }

/* one block per genre: without the label two chip rows just look like a wrap */
.groups { display: flex; flex-direction: column; gap: .8rem; }
.group-label { display: block; opacity: .55; }

.chip {
  border: 1px solid var(--ink);
  border-radius: 2px;
  padding: .35em .6em;
  color: var(--ink);
  transition: background .12s linear, color .12s linear;
}
.chip.on { background: var(--ink); color: var(--paper); }
.chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.error { color: var(--accent); letter-spacing: .08em; }
.sent { letter-spacing: .08em; text-transform: none; }

.signout {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.signout:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.btn { margin-top: auto; }
</style>
