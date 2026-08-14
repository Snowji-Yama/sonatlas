import type { Artist } from '~/composables/useArtists'

/**
 * Jeu d'essai utilisé tant que Supabase n'est pas configuré.
 * Les sous-genres doivent exister dans GENRES, sinon les filtres ne matchent pas.
 */
export const MOCK_ARTISTS: Artist[] = [
  { id: 'm1', name: 'Sonic Youth', genre: 'ROCK', subgenres: ['Post-punk', 'Indie'] },
  { id: 'm2', name: 'My Bloody Valentine', genre: 'ROCK', subgenres: ['Shoegaze'] },
  { id: 'm3', name: 'Can', genre: 'ROCK', subgenres: ['Krautrock', 'Prog'] },
  { id: 'm4', name: 'Neurosis', genre: 'METAL', subgenres: ['Sludge', 'Post-metal'] },
  { id: 'm5', name: 'Fugazi', genre: 'PUNK', subgenres: ['Post-hardcore', 'Hardcore'] },
  { id: 'm6', name: 'Aphex Twin', genre: 'ELECTRO', subgenres: ['IDM', 'Ambient'] },
  { id: 'm7', name: 'Basic Channel', genre: 'ELECTRO', subgenres: ['Dub techno', 'Techno'] },
  { id: 'm8', name: 'Madlib', genre: 'HIP-HOP', subgenres: ['Boom bap', 'Abstract'] },
  { id: 'm9', name: 'Alice Coltrane', genre: 'JAZZ', subgenres: ['Spiritual jazz', 'Free jazz'] },
  { id: 'm10', name: 'Sun Ra', genre: 'JAZZ', subgenres: ['Free jazz', 'Fusion'] },
  { id: 'm11', name: 'Fela Kuti', genre: 'SOUL / FUNK', subgenres: ['Afrobeat', 'Funk'] },
  { id: 'm12', name: 'King Tubby', genre: 'REGGAE', subgenres: ['Dub', 'Roots'] },
  { id: 'm13', name: 'Vashti Bunyan', genre: 'FOLK', subgenres: ['Freak folk'] },
  { id: 'm14', name: 'Cocteau Twins', genre: 'POP', subgenres: ['Dream pop', 'Art pop'] },
  { id: 'm15', name: 'Steve Reich', genre: 'CLASSIQUE', subgenres: ['Minimalisme', 'Contemporain'] },
  { id: 'm16', name: 'Éliane Radigue', genre: 'EXPÉRIMENTAL', subgenres: ['Drone', 'Musique concrète'] },
]
