import React from "react";

const PlaylistCard = (props) => {
  return (
    <div
      className={`text-white bg-white/0 text-center max-w-sm overflow-hidden`}
    >
      <img
        className="w-52 h-52 object-cover object-center mx-auto rounded-lg m-2"
        src={props.playlistImage}
        alt={props.playlistTitle}
      />
      <div className="">
        <div className="truncate font-bold text-md mb-2">
          {props.playlistTitle}
        </div>
      </div>
      <div className="">
        <a
          href={props.playlistLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-500/0 hover:bg-green-400  duration-300 rounded-full px-3 py-1 text-sm text-black truncate"
        >
          {props.trackCount + " tracks by " + props.playlistOwner}
        </a>
      </div>
    </div>
  );
};

export default PlaylistCard;
