import { createEmptySeason } from "./createEmptySeason.js";
import { createEmptyEpisode } from "./createEmptyEpisode.js";
import { MOVIE_TYPES } from "./movieTypeOptions.js";
import { AGE_RATINGS } from "./ageRatingOptions.js";
import { COUNTRIES } from "./countryOptions.js";
import { createEmptyActor } from "./createEmptyActor.js";

export function createEmptyMovie() {
  return {
    title: '',
    subtitle: '',
    description: '',
    type: MOVIE_TYPES.SINGLE,
    releaseYear: '',
    views: '',
    ageRating: AGE_RATINGS.PG,
    country: COUNTRIES.VIETNAM,
    genres: [],
    collections: [],
    thumbnail: null,
    poster: null,
    duration: '',
    singleStream: { dubbed: {}, subbed: {} },
    actors: createEmptyActor(),
    seasons: [createEmptySeason()] // Thêm seasons vào movie
  };
}

/*
title: String
subtitle: String
description: String
type: String: LE / BO
year: Number
duration: Number
ageRating: String: G / PG / PG_13 / R
country: String: 'Âu Mỹ', 'Hàn Quốc', 'Thái Lan', 'Trung Quốc', 'Việt Nam', 'Nhật Bản',
genres: [String]
collections: [CollectionObject]
thumbnail: String
poster: String
singleStream: EpisodeObject
seasons: [SeasonObject]
actors: [ActorObject]
*/
