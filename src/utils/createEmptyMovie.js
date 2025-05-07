import { createEmptySeason } from "./createEmptySeason.js";

export function createEmptyMovie() {
  return {
    name: '',
    type: 'Lẻ',
    releaseYear: '',
    views: '',
    ageRating: 'PG',
    country: 'Việt Nam',
    genres: [],
    collections: [],
    thumbnail: null,
    poster: null,
    singleStream: {
      dubbed: null,
      subbed: null
    },
    seasons: [createEmptySeason()] // Thêm seasons vào movie
  };
}
