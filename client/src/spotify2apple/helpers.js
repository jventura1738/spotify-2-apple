const OPTIMIZE_PRECISION = false;

/* -------------------------- CONVERSION HELP -------------------------- */

// Convert Spotify Track to Apple Music Track
export const findSongOnAppleMusic = async (query) => {
  const appleMusic = getMusicInstance();
  const searchTerms = getSearchTerms(query);
  const response = await fetch(
    `https://api.music.apple.com/v1/catalog/au/search?term=${searchTerms}&limit=1&types=songs`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + appleMusic.developerToken,
        "Music-User-Token": appleMusic.musicUserToken,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  const songs = data.results.songs.data || [];
  if (data.results.songs.data.length === 0) return null;

  const candidates = [];
  songs.forEach((song) => {
    // We will only keep track of name & artist for suggestions later.
    const songId = song.id;
    const songName = prune(song.attributes.name);
    const songArtists = song.attributes.artistName;
    candidates.push({
      songId: songId,
      songName: songName,
      songArtists: songArtists,
    });
    if (OPTIMIZE_PRECISION) {
      const distance = levenshteinDistance(songName, query.trackName);
      if (distance <= 2)
        return { songId: songId, songName: songName, songArtists: songArtists };
      else candidates[candidates.length - 1].distance = distance;
    }
  });
  if (OPTIMIZE_PRECISION) candidates.sort((a, b) => a.distance - b.distance);

  // Typicially, the first song is the best match if the song is well known.
  return {
    topSong: candidates[0],
    runnersUp: candidates.slice(1),
  };
};

/* ------------------------------ AUTH HELP ----------------------------- */

// Get Apple MusicKit Instance
export function getMusicInstance() {
  return window.MusicKit.getInstance();
}

// Get Apple API Header
export function getHeader() {
  const header = {
    Authorization: "Bearer " + getMusicInstance().developerToken,
    "Music-User-Token": getMusicInstance().musicUserToken,
    "Content-Type": "application/json",
  };
  return header;
}

/* ------------------------------ SEARCH HELP ----------------------------- */

// Get Levenshtein "edit" Distance using memoization:
function levenshteinDistance(a, b) {
  const memo = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(null));

  const _distance = (i, j) => {
    if (memo[i][j] != null) return memo[i][j];
    if (i === 0) return (memo[i][j] = j);
    if (j === 0) return (memo[i][j] = i);

    if (a[i - 1] === b[j - 1]) return (memo[i][j] = _distance(i - 1, j - 1));

    return (memo[i][j] = Math.min(
      _distance(i - 1, j - 1) + 1,
      _distance(i, j - 1) + 1,
      _distance(i - 1, j) + 1
    ));
  };
  return _distance(a.length, b.length);
}

// Get search terms for Apple Music API
function getSearchTerms(track) {
  const trackName = prune(track.songName);
  const artists = track.artists;
  const searchTerms = trackName.split(" ").join("+") + "+" + artists.join("+");
  return searchTerms;
}

// Remove unnecessary characters from track name
function prune(string) {
  if (string.includes("(")) {
    string = string.substring(0, string.indexOf("("));
  } else if (string.includes("[")) {
    string = string.substring(0, string.indexOf("["));
  } else if (string.includes("-")) {
    string = string.substring(0, string.indexOf("-"));
  } else if (string.includes("ft.")) {
    string = string.substring(0, string.indexOf("ft."));
  } else if (string.includes("feat.")) {
    string = string.substring(0, string.indexOf("feat."));
  } else if (string.includes("feat")) {
    string = string.substring(0, string.indexOf("feat"));
  } else if (string.includes("ft")) {
    string = string.substring(0, string.indexOf("ft"));
  }
  return string;
}
