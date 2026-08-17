export const GENRES: Record<string, string[]> = {
  Rock: [
    "Alternative",
    "Indie Rock",
    "Punk",
    "Post-Rock",
    "Grunge",
    "Psychedelic",
    "Progressive Rock",
    "Hard Rock",
    "Math Rock",
  ],
  Metal: [
    "Heavy Metal",
    "Death Metal",
    "Black Metal",
    "Thrash Metal",
    "Doom Metal",
    "Nu Metal",
    "Metalcore",
    "Symphonic",
  ],
  Pop: [
    "Synthpop",
    "Indie Pop",
    "Dream Pop",
    "Art Pop",
    "Hyperpop",
    "Pop Rock",
    "K-Pop",
    "J-Pop",
  ],
  Hiphop: [
    "Boom Bap",
    "Trap",
    "Drill",
    "Lo-Fi Hip Hop",
    "Cloud Rap",
    "Conscious Rap",
    "UK Grime",
    "US",
    "FR",
  ],
  Electro: [
    "House",
    "Techno",
    "Trance",
    "Drum & Bass",
    "Dubstep",
    "Synthwave",
    "IDM",
    "Garage",
  ],
  Jazz: [
    "Swing",
    "Bebop",
    "Cool Jazz",
    "Hard Bop",
    "Free Jazz",
    "Jazz Fusion",
    "Nu Jazz",
    "Gypsy Jazz",
  ],
  Blues: [
    "Delta Blues",
    "Chicago Blues",
    "Texas Blues",
    "Blues Rock",
    "Soul Blues",
  ],
  "Soul/Funk": [
    "Motown",
    "Neo-Soul",
    "P-Funk",
    "Northern Soul",
    "Psychedelic Funk",
    "Afro-Funk",
  ],
  "R&B": ["Contemporary R&B", "Alternative R&B", "New Jack Swing", "Doo-Wop"],
  "Reggae/Dub": ["Roots Reggae", "Dancehall", "Dub", "Ska", "Rocksteady"],
  Folk: [
    "Indie Folk",
    "Traditional Folk",
    "Anti-Folk",
    "Neofolk",
    "Folk Rock",
  ],
  Country: [
    "Bluegrass",
    "Honky Tonk",
    "Outlaw Country",
    "Country Pop",
    "Alt-Country",
  ],
  Classical: [
    "Baroque",
    "Classical",
    "Romantic",
    "Contemporary",
    "Chamber Music",
    "Opera",
  ],
  Experimental: [
    "Noise",
    "Concrete Music",
    "Avant-Garde",
    "Art Rock",
    "Industrial",
  ],
  Ambient: [
    "Dark Ambient",
    "Space Music",
    "Drone",
    "Illbient",
    "Ambient Techno",
  ],
  World: [
    "Afrobeat",
    "Salsa",
    "Bossa Nova",
    "Flamenco",
    "Cumbia",
    "Raï",
    "Celtic",
    "Reggaeton",
  ],
};

export const GENRE_NAMES = Object.keys(GENRES);

export const ALL_SUBGENRES = [...new Set(Object.values(GENRES).flat())].sort(
  (a, b) => a.localeCompare(b, "en"),
);

/** Genre swatch hue: derived from its position, nothing to maintain. */
export function genreHue(genre: string): number {
  const i = GENRE_NAMES.indexOf(genre);
  return i < 0 ? 38 : Math.round((i * 360) / GENRE_NAMES.length);
}
