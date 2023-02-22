/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require("express"); // Express web server framework
const rp = require("request-promise");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Load vars from .env file
require("dotenv").config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const spotify_redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 *
 * This will be used for the state (security measure)
 */
const generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

const app = express();
app.use(express.static(__dirname + "/public")).use(cookieParser());
app.use(bodyParser.json());

const allowedOrigins = ["http://localhost:3000"];
app.use(function (req, res, next) {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function (req, res) {
  res.send("Hello World!");
});

/** ------------------------ SPOTIFY API HERE ------------------------- */
const scopes = [
  "user-read-private", // Need this for basic user info; name, pfp, etc.
  "playlist-read-private", // Access to private playlists
  "playlist-read-collaborative", // Access to collaborative playlists
  "user-library-read", // Access to saved songs/albums/EPs
];
const scope = scopes.join(" ");

// Spotify login:
app.get("/spotify_login", function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // Here app requests authorization:
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: spotify_redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );

    return res.status(400).json({ error: "state_mismatch" });
  }
  res.clearCookie(stateKey);
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    json: true,
  };

  rp.post(authOptions, function (error, response, body) {
    // Handle errors:
    if (error || response.statusCode !== 200) {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "invalid_token",
          })
      );
    }
    // Tokens:
    const access_token = body.access_token,
      refresh_token = body.refresh_token;

    res.cookie("spotify_access_token", access_token);
    let uri = process.env.FRONTEND_URI || "http://localhost:3000";
    res.redirect(uri + "/spotify_playlists");
  });
});

app.get("/refresh_spotify_token", function (req, res) {
  // Requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  rp.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.get("/spotify_playlists", function (req, res) {
  const access_token = req.query.access_token;
  const options = {
    url: "https://api.spotify.com/v1/me/playlists",
    headers: { Authorization: "Bearer " + access_token },
    json: true,
  };
  rp.get(options, function (error, response, body) {
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(body));
  });
});

app.post("/get_spotify_tracks", async function (req, res) {
  const playlistId = req.body.playlistId;
  const trackCount = req.body.trackCount;
  const spotify_access_token = req.body.spotifyAccessToken;
  try {
    // Since spotify only allows 50 tracks per request, we will make
    // batch requests.  We will also make two requests per batch as
    // opposed to one request per song in order to avoid rate limiting
    // and keep things fast.
    const batchSize = trackCount > 50 ? 50 : trackCount;
    const totalRequests = Math.ceil(trackCount / batchSize);

    const trackInfo = [];
    const trackInfoPromises = [];
    for (let i = 0; i < totalRequests; i++) {
      const offset = i * batchSize;
      const trackIdsResponse = await rp.get({
        uri: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
        },
        json: true,
        // As per docs the max is 50:
        qs: {
          offset: offset,
          limit: batchSize,
        },
      });
      const trackIds = trackIdsResponse.items.map((item) => item.track.id);
      const trackInfoPromise = await rp.get({
        uri: `https://api.spotify.com/v1/tracks?ids=${trackIds.join(",")}`,
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
        },
        json: true,
      });
      trackInfoPromises.push(trackInfoPromise);
    }
    const responses = await Promise.all(trackInfoPromises);
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i].tracks;
      if (response.error) {
        console.error(response.error);
        res.status(500).json({ message: "An error occurred" });
        return;
      }
      response.forEach((track) => {
        const trackName = track.name;
        const artists = track.artists.map((artist) => artist.name);
        trackInfo.push({ trackName, artists });
      });
    }
    res.json(trackInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

/** ------------------------ APPLE TOKEN STUFF HERE ------------------------- */

// Apple Music key:
const jwt = require("jsonwebtoken");
const fs = require("fs");

// Download the private key from Apple and save it as apple_private_key.p8:
const private_key = fs.readFileSync("apple_private_key.p8").toString();
const team_id = process.env.APPLE_TEAM_ID;
const key_id = process.env.APPLE_KEY_ID;

// Leave this all the same:
const token = jwt.sign({}, private_key, {
  algorithm: "ES256",
  expiresIn: "180d",
  issuer: team_id,
  header: {
    alg: "ES256",
    kid: key_id,
  },
});

app.get("/apple_token", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ token: token }));
});

let port = process.env.PORT;
console.log(`Listening on port ${port}!`);
app.listen(port);
