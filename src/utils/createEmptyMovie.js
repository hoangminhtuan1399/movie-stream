import { createEmptySeason } from "./createEmptySeason.js";
import { createEmptyEpisode } from "./createEmptyEpisode.js";
import { MOVIE_TYPES } from "./movieTypeOptions.js";

export function createEmptyMovie() {
  return {
    title: '',
    type: MOVIE_TYPES.SINGLE,
    releaseYear: '',
    views: '',
    ageRating: 'PG',
    country: 'Việt Nam',
    genres: [],
    collections: [],
    thumbnail: null,
    poster: null,
    singleStream: createEmptyEpisode(),
    seasons: [createEmptySeason()] // Thêm seasons vào movie
  };
}
