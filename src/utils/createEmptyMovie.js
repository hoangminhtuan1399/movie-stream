import { createEmptySeason } from "./createEmptySeason.js";
import { MOVIE_TYPES, MOVIE_VALUES } from "./movieTypeOptions.js";

const createEmptyStream = () => ({
  fileUrl: '',
  fileName: ''
});

export const createEmptyMovie = () => ({
  id: null,
    title: '',
    subtitle: '',
    description: '',
  releaseYear: new Date().getFullYear(),
  country: 'US',
  genres: [],
  ageRating: '13+',
  thumbnail: '',
  poster: '',
  views: 0,
    type: MOVIE_VALUES.SINGLE,
  singleStream: {
    dubbed: createEmptyStream(),
    subbed: createEmptyStream()
  },
  seasons: [createEmptySeason()],
  actors: [],
});

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
