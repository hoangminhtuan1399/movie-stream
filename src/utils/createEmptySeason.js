import { createEmptyEpisode } from "./createEmptyEpisode.js";

export function createEmptySeason() {
  return {
    name: '',
    episodes: [createEmptyEpisode()]
  };
}
