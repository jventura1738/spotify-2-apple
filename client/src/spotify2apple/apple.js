import { findSongOnAppleMusic, getHeader, sleep } from "./helpers";

export const createNewAppleMusicPlaylist = async (playlistInfo) => {
  const pname = playlistInfo.playlistName;
  const trackList = playlistInfo.map((track) => {
    return {
      songName: track.trackName,
      artists: track.artists,
    };
  });
  const appleMusicTracks = [];
  for (const track of trackList) {
    const result = await findSongOnAppleMusic(track);

    if (result) {
      appleMusicTracks.push(result.topSong.songId);
    }

    await sleep(250);
  }
  console.log("Creating playlist...");
  const response = await fetch(
    `https://api.music.apple.com/v1/me/library/playlists`,
    {
      method: "POST",
      headers: getHeader(),
      body: JSON.stringify({
        attributes: {
          name: pname,
          description: "Created from Spotify via Spotify2Apple",
        },
        relationships: {
          tracks: {
            data: appleMusicTracks.map((track) => ({
              id: track,
              type: "songs",
            })),
          },
        },
      }),
    }
  );

  const newPlaylist = await response.json();
  const playlistId = newPlaylist.data[0].id;
  console.log(newPlaylist);
  console.log("Playlist created!", playlistId);
};
