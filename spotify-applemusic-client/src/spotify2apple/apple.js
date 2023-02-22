import { findSongOnAppleMusic } from "./helpers";

export function getMusicInstance() {
  return window.MusicKit.getInstance();
}

export function getHeader() {
  const header = {
    Authorization: "Bearer " + getMusicInstance().developerToken,
    "Music-User-Token": getMusicInstance().musicUserToken,
    "Content-Type": "application/json",
  };
  return header;
}

export const createNewAppleMusicPlaylist = async (playlistInfo) => {
  const appleMusic = getMusicInstance();
  const pname = playlistInfo.playlistName;
  const trackList = playlistInfo.map((track) => {
    return {
      songName: track.trackName,
      artists: track.artists,
    };
  });

  const validTrackIDs = [];
  trackList.forEach(async (track) => {
    const result = await findSongOnAppleMusic(track);
    if (result) {
      validTrackIDs.push(result);
    }
  });
  const queryParameters = { l: "en-au" };
  const data = {
    attributes: { name: pname, description: "Created by Spotify2Apple" },
    // relationships: {
    //   tracks: {
    //     data: appleMusicTracks
    //       .filter((search) => search.songs)
    //       .map((search) => ({ id: search.songs.data[0].id, type: "songs" })),
    //   },
    // },
  };
  //   const response = await appleMusic.api.music(
  //     "v1/me/library/playlists",
  //     queryParameters,
  //     {
  //       fetchOptions: {
  //         method: "POST",
  //         body: JSON.stringify(data),
  //         headers: getHeader(),
  //       },
  //     }
  //   );

  const response = await fetch(
    `https://api.music.apple.com/v1/me/library/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getMusicInstance().developerToken,
        "Music-User-Token": getMusicInstance().musicUserToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attributes: {
          name: pname,
          description: "Created from Spotify via Spotify2Apple",
        },
      }),
    }
  );

  const newPlaylist = await response.json();
  const playlistId = newPlaylist.data[0].id;

  console.log(playlistId);
};
