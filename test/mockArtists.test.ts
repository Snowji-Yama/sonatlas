import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GENRES } from '../app/constants/genres.ts'
import { MOCK_ARTISTS } from '../app/constants/mockArtists.ts'

test('every mock artist matches a genre and its subgenres', () => {
  for (const a of MOCK_ARTISTS) {
    const subgenres = GENRES[a.genre]
    assert.ok(subgenres, `unknown genre: ${a.genre}`)
    for (const s of a.subgenres) assert.ok(subgenres.includes(s), `${a.genre} has no subgenre ${s}`)
  }
})
