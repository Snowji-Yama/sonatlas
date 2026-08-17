export type FilterableArtist = {
  name: string;
  genre: string;
  subgenres?: string[];
};

export function filterArtists<T extends FilterableArtist>(
  artists: T[],
  { genre = "", subgenre = "", asc = true } = {},
): T[] {
  return artists
    .filter((a) => !genre || a.genre === genre)
    .filter((a) => !subgenre || a.subgenres?.includes(subgenre))
    .toSorted(
      (a, b) =>
        (asc ? 1 : -1) *
        a.name.localeCompare(b.name, "fr", { sensitivity: "base" }),
    );
}
