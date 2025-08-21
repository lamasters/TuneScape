import song_dict from "@/app/song_dict.json";
import song_grid from "@/app/song_grid.json";

const GRID_SIZE = 28;
const GRID_SPACING = 0.01;

export function getSongUrl(song) {
  return `https://oldschool.runescape.wiki/images/transcoded/${song}/${song}.mp3`;
}

export function getSongForLocation(latitude, longitude) {
  const latitudeOffset = Math.abs(
    Math.round(latitude * (1 / GRID_SPACING)) % GRID_SIZE
  );
  const longitudeOffset = Math.abs(
    Math.round(longitude * (1 / GRID_SPACING)) % GRID_SIZE
  );
  const song = song_grid.song_grid[latitudeOffset][longitudeOffset];
  const songName = song_dict[song];
  const songUrl = getSongUrl(song);

  return { url: songUrl, name: songName };
}

export function getShuffledPlaylist() {
  return Array.from(Object.entries(song_dict)).sort(() => 0.5 - Math.random());
}

export function getPlaylist() {
  return Array.from(Object.entries(song_dict)).map((song) => [
    song[0],
    song[1],
  ]);
}