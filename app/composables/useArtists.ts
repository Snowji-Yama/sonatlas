import { MOCK_ARTISTS } from '~/constants/mockArtists'

export type Artist = {
  id: string
  name: string
  genre: string
  subgenres: string[]
}

const TABLE = 'sonatlas_artists'

// ponytail: le mode démo garde ses ajouts en mémoire, perdus au rechargement.
// Suffisant pour dérouler le parcours complet sans base ; pas de persistance à écrire.
const mockStore = [...MOCK_ARTISTS]

export function useArtists() {
  return useAsyncData<Artist[]>('artists', async () => {
    const c = supabase()
    if (!c) return [...mockStore]
    const { data, error } = await c.from(TABLE).select('id, name, genre, subgenres')
    if (error) throw new Error(error.message)
    return data as Artist[]
  }, { default: () => [] })
}

export async function addArtist(artist: Omit<Artist, 'id'>) {
  const c = supabase()
  if (!c) {
    mockStore.push({ id: `m${mockStore.length + 1}-${artist.name}`, ...artist })
    return
  }
  const { error } = await c.from(TABLE).insert(artist)
  if (error) throw new Error(error.message)
}
