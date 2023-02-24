import React from "react";

import apple_logo from "../images/apple_music-logo.png";

const Results = () => {
  return (
    <section className="landing h-screen bg-white text-black">
      <div className="mx-auto grid w-2/3 grid-cols-1 justify-center py-10 text-center">
        <div className="col-span-1 mb-10">
          <h1 className="mx-auto my-auto text-center text-4xl font-semibold">
            Successfully transferred playlists!
          </h1>
        </div>
        <div className="col-span-1">
          Click below to open Apple Music. Note that the playlists may take a
          few minutes to appear.
        </div>
      </div>
      <div className="mx-auto h-1/3 w-1/6">
        <a href="https://music.apple.com" rel="noreferrer" target="_blank">
          <img
            src={apple_logo}
            alt="Apple logo"
            className="mx-auto block cursor-pointer rounded"
          />
        </a>
      </div>
    </section>
  );
};

export default Results;
