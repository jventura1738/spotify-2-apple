import React from "react";

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
      <section className="landing h-screen text-white">
        <div className="grid grid-cols-1 justify-center text-center outline-white 2xl:mx-32 md:mx-12">
          <div className="col-span-1">
            <h1 className="mb-10 text-center text-4xl font-semibold">
              Spotify 2 Apple
            </h1>
            <p className="mb-10 ">Apple Music to spotify coming soon!</p>
          </div>
          <div className="col-span-1">
            <button
              type="submit"
              className={`rounded-full bg-green-500 py-2 px-4 font-bold text-black hover:bg-green-600`}
              onClick={this.showSpotifyLogin}
            >
              Convert Spotify -{">"} Apple Music
            </button>
            {/* <button
              type="submit"
              className={`rounded-full bg-green-500 py-2 px-4 font-bold text-black hover:bg-green-600`}
              onClick={this.showAppleMusicLogin}
            >
              Convert Apple Music -{">"} Spotify (coming soon)
            </button> */}
          </div>
        </div>
      </section>
    );
  }
}

export default Home;
