import { createEmptySeason } from "./createEmptySeason.js";
import { createEmptyEpisode } from "./createEmptyEpisode.js";
import { MOVIE_TYPES } from "./movieTypeOptions.js";
import { AGE_RATINGS } from "./ageRatingOptions.js";
import { COUNTRIES } from "./countryOptions.js";

export function createEmptyMovie() {
  return {
    title: '',
    type: MOVIE_TYPES.SINGLE,
    releaseYear: '',
    views: '',
    ageRating: AGE_RATINGS.PG,
    country: COUNTRIES.VIETNAM,
    genres: [],
    collections: [],
    thumbnail: null,
    poster: null,
    singleStream: createEmptyEpisode(),
    seasons: [createEmptySeason()] // Thêm seasons vào movie
  };
}
