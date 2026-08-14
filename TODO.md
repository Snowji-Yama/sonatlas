# To do

## 1. Screen transition animation

Right now: fade + 8px vertical slide, declared in [`nuxt.config.ts`](nuxt.config.ts)
(`app.pageTransition`) and styled in [`main.css`](app/assets/css/main.css) (`.slide-*`).

That is the default setting, not a deliberate choice. Replace it with something that
belongs to cassette mechanics: a lid opening, tape scrolling sideways, a hard cut like
a track change. Mind `prefers-reduced-motion`, already neutralised globally in
`main.css`.

## 2. Several main genres per artist

Today an artist has **one** main genre and N subgenres. Moving to N main genres
touches:

- the schema: `genre text` → `genres text[]` (migration to write)
- [`useArtists.ts`](app/composables/useArtists.ts): the `Artist` type and the `select`
- [`filterArtists.ts`](app/utils/filterArtists.ts): `a.genre === genre` → `includes`
- [`filterArtists.test.ts`](test/filterArtists.test.ts): fixtures and assertions
- [`mockArtists.ts`](app/constants/mockArtists.ts): the sample data
- [`new.vue`](app/pages/new.vue): the `<select>` becomes a set of chips like the
  subgenres, and `options` must aggregate the subgenres of every checked genre
- [`artists.vue`](app/pages/artists.vue): the genre filter, and the genre displayed at
  the end of each row (one value fits there, several do not)

Decision to make before writing code: do subgenres stay attached to a parent genre, or
do they become a flat list?

## 3. Prune the comments

The codebase carries explanatory comments that earned their place while the design was
being figured out, but read as noise once the choices are settled. Go through them and
keep only what a future reader could not deduce from the code.

Worth keeping — these document a decision or a trap, not a mechanism:

- [`supabase.ts`](app/utils/supabase.ts): why a raw client rather than
  `@nuxtjs/supabase`
- [`useAuth.ts`](app/composables/useAuth.ts): why `shouldCreateUser: false` is the line
  that actually protects writes, and why the `ready` flag exists
- [`main.css`](app/assets/css/main.css): why `body` carries no `background` (it would
  paint over negative `z-index` layers)
- [`artists.vue`](app/pages/artists.vue): why filters live in `useState`, and why the
  top padding sits in `.pinned`
- the `ponytail:` markers, which flag deliberate shortcuts

Likely droppable — they restate what the code already says:

- geometry comments in [`index.vue`](app/pages/index.vue) and
  [`CogBackground.vue`](app/components/CogBackground.vue) (dash spacing, rim radius),
  now that the drawing has stopped moving
- section banners in the stylesheets, if the files stay this short
