import assert from 'node:assert/strict'
import { test } from 'node:test'
import { filterArtists } from '../app/utils/filterArtists.ts'

const data = [
  { name: 'Sonic Youth', genre: 'ROCK', subgenres: ['Noise rock', 'Post-punk'] },
  { name: 'Aphex Twin', genre: 'ELECTRO', subgenres: ['IDM', 'Ambient'] },
  { name: 'ätna', genre: 'POP', subgenres: [] },
  { name: 'King Tubby', genre: 'REGGAE', subgenres: ['Dub'] },
]
const names = (o = {}) => filterArtists(data, o).map(a => a.name)

test('tri alphabétique insensible aux accents et à la casse', () => {
  assert.deepEqual(names(), ['Aphex Twin', 'ätna', 'King Tubby', 'Sonic Youth'])
  assert.deepEqual(names({ asc: false }), ['Sonic Youth', 'King Tubby', 'ätna', 'Aphex Twin'])
})

test('filtres genre et sous-genre, cumulables', () => {
  assert.deepEqual(names({ genre: 'ROCK' }), ['Sonic Youth'])
  assert.deepEqual(names({ subgenre: 'Dub' }), ['King Tubby'])
  assert.deepEqual(names({ genre: 'ROCK', subgenre: 'Dub' }), [])
  assert.deepEqual(names({ genre: '', subgenre: '' }).length, 4)
})

test('ne mute pas la source', () => {
  filterArtists(data, { asc: false })
  assert.equal(data[0].name, 'Sonic Youth')
})
