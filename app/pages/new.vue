<script setup lang="ts">
import { GENRES, GENRE_NAMES } from '~/constants/genres'

const { session, ready, sendLink, signOut, enabled } = useAuth()
const demo = usingMocks()
/** Écran de connexion tant que Supabase est branché et qu'on n'est pas identifié. */
const locked = computed(() => enabled && ready.value && !session.value)

const email = ref('')
const sending = ref(false)
const sent = ref(false)
const authError = ref('')

async function requestLink() {
  const trimmed = email.value.trim()
  if (!trimmed) {
    authError.value = 'Renseigne ton adresse.'
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
const genre = ref('')
const subgenres = ref<string[]>([])
const saving = ref(false)
const error = ref('')

const options = computed(() => (genre.value ? GENRES[genre.value] ?? [] : []))
watch(genre, () => { subgenres.value = [] })

function toggle(s: string) {
  const i = subgenres.value.indexOf(s)
  i === -1 ? subgenres.value.push(s) : subgenres.value.splice(i, 1)
}

async function submit() {
  const trimmed = name.value.trim()
  if (!trimmed || !genre.value) {
    error.value = 'Nom et genre principal sont obligatoires.'
    return
  }
  saving.value = true
  error.value = ''
  try {
    await addArtist({ name: trimmed, genre: genre.value, subgenres: [...subgenres.value] })
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
      <span v-if="demo" class="meta face">Démo</span>
      <span class="meta">
        Piste 01
        <span class="face">Face B</span>
      </span>
    </div>
    <div class="rule-reel"><div class="rule" /></div>

    <header class="head">
      <h1>{{ locked ? 'Accès réservé' : 'Nouvel enregistrement' }}</h1>
    </header>

    <p v-if="enabled && !ready" class="hint meta">Vérification de la session…</p>

    <!-- ── connexion ── -->
    <form v-else-if="locked" class="form" novalidate @submit.prevent="requestLink">
      <p class="hint meta">
        L'écriture est réservée au titulaire de la collection. Un lien de connexion
        à usage unique sera envoyé par e-mail.
      </p>

      <label class="field">
        <span class="meta">01 — Adresse e-mail</span>
        <input v-model="email" type="email" required autocomplete="email" placeholder="toi@exemple.fr">
      </label>

      <p v-if="sent" class="sent meta" role="status">
        Lien envoyé à {{ email }}. Ouvre-le depuis cet appareil.
      </p>
      <p v-if="authError" class="error meta" role="alert">⚠ {{ authError }}</p>

      <button type="submit" class="btn accent" :disabled="sending">
        <span>{{ sending ? 'Envoi…' : 'Recevoir le lien' }}</span>
        <span aria-hidden="true">→</span>
      </button>
    </form>

    <!-- ── ajout ── -->
    <form v-else class="form" novalidate @submit.prevent="submit">
      <label class="field">
        <span class="meta">01 — Artiste</span>
        <input v-model="name" type="text" required autocapitalize="words" placeholder="Nom du groupe">
      </label>

      <label class="field">
        <span class="meta">02 — Genre principal</span>
        <select v-model="genre" required>
          <option value="" disabled>Choisir</option>
          <option v-for="g in GENRE_NAMES" :key="g" :value="g">{{ g }}</option>
        </select>
      </label>

      <div class="field">
        <span class="meta">03 — Sous-genres<template v-if="subgenres.length"> ({{ subgenres.length }})</template></span>
        <p v-if="!options.length" class="hint meta">En attente du genre principal</p>
        <div v-else class="chips">
          <button
            v-for="s in options"
            :key="s"
            type="button"
            class="chip meta"
            :class="{ on: subgenres.includes(s) }"
            :aria-pressed="subgenres.includes(s)"
            @click="toggle(s)"
          >{{ s }}</button>
        </div>
      </div>

      <p v-if="error" class="error meta" role="alert">⚠ {{ error }}</p>

      <button type="submit" class="btn accent" :disabled="saving">
        <span>{{ saving ? 'Enregistrement…' : 'Enregistrer' }}</span>
        <span aria-hidden="true">●</span>
      </button>
    </form>

    <div class="rule-reel"><div class="rule" /></div>
    <div class="bar">
      <span class="meta">Type A — normal</span>
      <button v-if="session" class="meta signout" @click="signOut">Déconnexion</button>
      <span class="meta">Stereo on</span>
    </div>
  </main>
</template>

<style scoped>
.screen {
  min-height: 100dvh;
  max-width: 560px;
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

/* ── formulaire : une fiche technique ── */
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
