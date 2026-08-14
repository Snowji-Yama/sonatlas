// Référentiel figé en dur : pas de table `genres` en base, pas d'admin à écrire.
// Pour en ajouter un, on édite ce fichier.
export const GENRES: Record<string, string[]> = {
  'ROCK': ['Garage', 'Post-punk', 'Shoegaze', 'Stoner', 'Math rock', 'Krautrock', 'Prog', 'Indie'],
  'METAL': ['Black', 'Death', 'Doom', 'Sludge', 'Thrash', 'Post-metal', 'Grindcore'],
  'PUNK': ['Hardcore', 'Post-hardcore', 'Emo', 'Crust', 'Oi!', 'Ska-punk', 'Noise rock'],
  'ELECTRO': ['Techno', 'House', 'Ambient', 'IDM', 'Drum & Bass', 'Synthwave', 'EBM', 'Dub techno'],
  'HIP-HOP': ['Boom bap', 'Trap', 'Abstract', 'Cloud rap', 'G-funk', 'Jazz rap'],
  'JAZZ': ['Bebop', 'Free jazz', 'Fusion', 'Spiritual jazz', 'Nu jazz', 'Cool jazz'],
  'SOUL / FUNK': ['Motown', 'Neo-soul', 'Funk', 'Disco', 'Afrobeat', 'Rare groove'],
  'REGGAE': ['Dub', 'Roots', 'Ska', 'Rocksteady', 'Dancehall'],
  'FOLK': ['Americana', 'Freak folk', 'Chanson', 'Bluegrass', 'Neofolk'],
  'POP': ['Synthpop', 'Dream pop', 'Indie pop', 'City pop', 'Art pop'],
  'CLASSIQUE': ['Baroque', 'Romantique', 'Minimalisme', 'Contemporain'],
  'EXPÉRIMENTAL': ['Drone', 'Musique concrète', 'Field recording', 'Noise', 'Post-rock'],
}

export const GENRE_NAMES = Object.keys(GENRES)

export const ALL_SUBGENRES = [...new Set(Object.values(GENRES).flat())].sort((a, b) =>
  a.localeCompare(b, 'fr'),
)

/** Teinte de la pastille couleur d'un genre : dérivée de sa position, rien à maintenir. */
export function genreHue(genre: string): number {
  const i = GENRE_NAMES.indexOf(genre)
  return i < 0 ? 38 : Math.round((i * 360) / GENRE_NAMES.length)
}
