import assert from 'node:assert/strict'
import { test } from 'node:test'
import { filterArtists } from '../app/utils/filterArtists.ts'

const data = [
  { name: 'Sonic Youth', genres: ['ROCK', 'EXPE'], subgenres: ['Noise rock', 'Post-punk'] },
  { name: 'Aphex Twin', genres: ['ELECTRO'], subgenres: ['IDM', 'Ambient'] },
  { name: 'ätna', genres: ['POP'], subgenres: [] },
  { name: 'King Tubby', genres: ['REGGAE', 'ELECTRO'], subgenres: ['Dub'] },
]
const names = (o = {}) => filterArtists(data, o).map(a => a.name)

test('alphabetical sort, accent- and case-insensitive', () => {
  assert.deepEqual(names(), ['Aphex Twin', 'ätna', 'King Tubby', 'Sonic Youth'])
  assert.deepEqual(names({ asc: false }), ['Sonic Youth', 'King Tubby', 'ätna', 'Aphex Twin'])
})

test('genre and subgenre filters, stackable', () => {
  assert.deepEqual(names({ genre: 'ROCK' }), ['Sonic Youth'])
  assert.deepEqual(names({ subgenre: 'Dub' }), ['King Tubby'])
  assert.deepEqual(names({ genre: 'ROCK', subgenre: 'Dub' }), [])
  assert.deepEqual(names({ genre: '', subgenre: '' }).length, 4)
})

test('an artist matches on any of its genres', () => {
  assert.deepEqual(names({ genre: 'EXPE' }), ['Sonic Youth'])
  assert.deepEqual(names({ genre: 'ELECTRO' }), ['Aphex Twin', 'King Tubby'])
})

test('does not mutate the source', () => {
  filterArtists(data, { asc: false })
  assert.equal(data[0].name, 'Sonic Youth')
})
