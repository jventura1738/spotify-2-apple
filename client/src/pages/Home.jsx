import React from "react";

import apple_music_logo from "../images/apple_music-logo.png";
import spotify_logo from "../images/spotify-logo.png";

const spotifyLoginUrl = process.env.REACT_APP_SPOTIFY_LOGIN_URL;
const appleMusicLoginUrl =
  process.env.REACT_APP_APPLE_MUSIC_LOGIN_URL ||
  "https://www.apple.com/apple-music/";

class Home extends React.Component {
  showSpotifyLogin = () => {
    window.location.replace(spotifyLoginUrl);
  };
  showAppleMusicLogin = () => {
    window.location.replace(appleMusicLoginUrl);
  };
  render() {
    return (
      <div className="landing flex h-screen">
        <div className="w-1/2 bg-black text-white">
          <div className="top-sliver mb-10">
            <h1 className="mr-2 text-right text-4xl font-semibold text-green-500 sm:text-center">
              Spotify 2
            </h1>
          </div>
          <div className="content mx-10 grid text-center">
            <div className="mx-auto text-left">
              <ol>
                <li className="">1. Log into Spotify</li>
                <li className="">2. Select playlists</li>
                <li className="">3. Log into Apple Music</li>
                <li className="">4. Transfer playlists!</li>
              </ol>
            </div>
            <div className="mx-auto my-10 text-center">
              <button
                type="submit"
                className={`lg:text-md rounded-full bg-green-500 py-2 px-4 font-bold text-black duration-300 hover:bg-green-600 2xl:text-2xl xl:text-xl md:text-sm`}
                onClick={this.showSpotifyLogin}
              >
                Spotify -{">"} Apple
              </button>
              <p>Click to start!</p>
            </div>
            <div className="mx-auto md:my-5">
              <img src={spotify_logo} alt="Spotify logo" />
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-white">
          <div className="top-sliver mb-10">
            <h1 className="ml-2 text-left text-4xl font-semibold text-red-500 sm:text-center">
              Apple Music
            </h1>
          </div>
          <div className="content mx-10 grid text-center">
            <div className="mx-auto text-left">
              <ol>
                <li className="">1. Log into Apple Music</li>
                <li className="">2. Select playlists</li>
                <li className="">3. Log into Spotify</li>
                <li className="">4. Transfer playlists!</li>
              </ol>
            </div>
            <div className="mx-auto my-10 text-center">
              <button
                disabled
                className={`lg:text-md cursor-not-allowed rounded-full bg-gray-400 py-2 px-4 font-bold text-white duration-300 2xl:text-2xl xl:text-xl md:text-sm`}
              >
                Apple -{">"} Spotify
              </button>
              <p>
                Coming soon! <br />
              </p>
              {/* <button
                type="submit"
                className={`lg:text-md rounded-full bg-red-500 py-2 px-4 font-bold text-white duration-300 hover:bg-red-600 2xl:text-2xl xl:text-xl md:text-sm`}
                onClick={this.showSpotifyLogin}
              >
                Apple -{">"} Spotify
              </button> */}
            </div>
            <div className="mx-auto">
              <img src={apple_music_logo} alt="Apple Music logo" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
