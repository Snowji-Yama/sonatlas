import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GENRES } from '../app/constants/genres.ts'
import { MOCK_ARTISTS } from '../app/constants/mockArtists.ts'

test('every mock artist matches its genres and their subgenres', () => {
  for (const a of MOCK_ARTISTS) {
    assert.ok(a.genres.length, `${a.name} has no genre`)
    for (const g of a.genres) assert.ok(GENRES[g], `unknown genre: ${g}`)
    const allowed = a.genres.flatMap(g => GENRES[g] ?? [])
    for (const s of a.subgenres) {
      assert.ok(allowed.includes(s), `${a.name}: no genre of ${a.genres.join('/')} has subgenre ${s}`)
    }
  }
})
