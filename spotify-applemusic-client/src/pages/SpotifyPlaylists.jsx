import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";
import PulseLoader from "react-spinners/PulseLoader";

import PlaylistCard from "../components/PlaylistCard";
import Footer from "../components/Footer";
import { createNewAppleMusicPlaylist } from "../spotify2apple/apple";

const spotifyPlaylistsUrl = process.env.REACT_APP_SPOTIFY_PLAYLISTS_URL;
const spotifyAccessToken = Cookies.get("spotify_access_token");

const SpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);

  useEffect(() => {
    const filteredData = playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlaylists(filteredData);
  }, [playlists, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (playlistId) => {
    if (selectedPlaylists.includes(playlistId)) {
      setSelectedPlaylists(selectedPlaylists.filter((id) => id !== playlistId));
    } else {
      setSelectedPlaylists([...selectedPlaylists, playlistId]);
    }
  };

  // This happens when the component is mounted:
  useEffect(() => {
    const getPlaylists = async () => {
      const url = `${spotifyPlaylistsUrl}?access_token=${spotifyAccessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      setPlaylists(data.items);
    };
    getPlaylists();
    setTimeout(() => {
      setLoading(false);
    }, 250); // 1000 milliseconds = 1 second
  }, []);

  const handleAppleConversion = async () => {
    setLoading(true);
    const appleMusic = window.MusicKit.getInstance();
    await appleMusic.authorize();

    const spotifyTracksUrl = process.env.REACT_APP_GET_SPOTIFY_TRACKS_URL;
    const allPlaylistsTracksInfoPromises = selectedPlaylists.map(
      async (selectedPlaylist) => {
        // Send playlist link to backend to get song information back:
        const currentPlaylistTracks = await fetch(spotifyTracksUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playlistId: playlists[selectedPlaylist].id,
            trackCount: playlists[selectedPlaylist].tracks.total,
            spotifyAccessToken: spotifyAccessToken,
          }),
        });
        const currentPlaylistTracksInfo = await currentPlaylistTracks.json();
        currentPlaylistTracksInfo.playlistName =
          playlists[selectedPlaylist].name;
        return currentPlaylistTracksInfo;
      }
    );
    const playlistsToBeTransferred = await Promise.all(
      allPlaylistsTracksInfoPromises
    );
    playlistsToBeTransferred.forEach(async (playlist) => {
      await createNewAppleMusicPlaylist(playlist);
    });
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <div className="flex h-screen flex-col items-center justify-center">
          <h1 className="order-1 m-10 text-center text-white">Sit tight...</h1>
          <PulseLoader color={"#1DB954"} size={15} className="order-2" />
        </div>
      ) : (
        <div>
          <div className="mb-10 text-center font-semibold text-white">
            <h1 className="mb-6 text-4xl">Spotify 2 Apple</h1>
            <p>Select the playlist(s) you wish to transfer to Apple Music.</p>
            <input
              type="text"
              placeholder="Search your playlists..."
              className="mx-auto mt-4 w-1/2 rounded-xl bg-gray-800 p-2 text-white outline-none"
              onChange={handleSearch}
            />
            {selectedPlaylists.length > 0 ? (
              <button
                className="ml-4 mt-4 rounded-xl bg-green-400/80 p-2 text-black"
                onClick={handleAppleConversion}
              >
                Convert
              </button>
            ) : (
              <button
                className="ml-4 mt-4 cursor-not-allowed rounded-xl bg-gray-400/80 p-2 text-black"
                disabled
              >
                Convert
              </button>
            )}
          </div>
          <div className="mx-auto grid grid-cols-5 gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
            {filteredPlaylists.map((playlist, index) => (
              <div
                key={index}
                className={`${
                  selectedPlaylists.includes(index)
                    ? "bg-green-400/80"
                    : "bg-gray-500"
                } max-w-sm overflow-hidden rounded-xl text-center text-black shadow-lg duration-150 hover:bg-green-300/80`}
                onClick={() => handleCardClick(index)}
              >
                <PlaylistCard
                  key={index}
                  playlistTitle={playlist.name}
                  playlistImage={playlist.images[0].url}
                  playlistLink={playlist.external_urls.spotify}
                  playlistOwner={playlist["owner"].display_name}
                  trackCount={playlist.tracks.total}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default SpotifyPlaylists;
