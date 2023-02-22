import { findSongOnAppleMusic, getHeader, getMusicInstance } from "./helpers";

export const createNewAppleMusicPlaylist = async (playlistInfo) => {
  const pname = playlistInfo.playlistName;
  const trackList = playlistInfo.map((track) => {
    return {
      songName: track.trackName,
      artists: track.artists,
    };
  });

  // const appleMusicTracks = [];
  // trackList.forEach(async (track) => {
  //   const result = await findSongOnAppleMusic(track);
  //   if (result) {
  //     appleMusicTracks.push(result.topSong.id);
  //   }
  //   // Use this later:
  //   const runnersUp = result.runnersUp;
  // });
  const appleMusicTracks = await Promise.all(
    trackList.map(async (track) => {
      const result = await findSongOnAppleMusic(track);
      if (result) {
        return result.topSong.id;
      }
    })
  ).then((validTracks) => validTracks.filter(Boolean));
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
  console.log(playlistId);
};
