# Spotify 2 Apple Music Playlist Converter

[![Spotify 2 Apple YouTube](https://img.youtube.com/vi/H7LBnBkQscU/0.jpg)](https://www.youtube.com/watch?v=H7LBnBkQscU)

Click above to see the YouTube demo!

by Justin Ventura

## Requirements:

- Spotify Account (free or premium)
- Apple Music Account
- Spotify & Apple Developer Accounts

### Instructions:

###### Setting up the React client (front-end)

1. Change directories to `spotify-2-apple/client`.
2. Install dependencies with npm: `npm i` or `npm install`. You might get deprecation messages.
3. (Optional) Install prettier dev dependency for tailwindcss `npm install -D prettier prettier-plugin-tailwindcss`. See <a href="https://github.com/tailwindlabs/prettier-plugin-tailwindcss" target="_blank">here</a> for more details.
4. Set up your environment files. Refer to the comments in the `.env.example` files then rename them to `.env`. This is very important, skipping this step may result in ungodly behavior.
5. In `index.html`, paste your Apple dev token in the <script> tag. I am not sure how to get around this yet, so if you find out please leave a pr, it would be greatly appreciated!
6. Start the react app: `npm start`. If the react server doesn't start due to port errors, your `localhost:3000` might be blocked, or active. Either shut off whatever is on the port, or change the port to another open one.

###### Setting up the Node server (back-end)

1. Change directories to `spotify-2-apple/server`.
2. Install dependencies with npm: `npm i` or `npm install`. You might get deprecation messages.
3. Set up your environment files. Same instructions as front-end above.
4. Start the server: `node app.js`. If the node server doesn't start due to port errors, your `localhost:8888` might be blocked, or active. Either shut off whatever is on the port, or change the port to another open one. You will need to double check your `.env` files to ensure that the server port is consistent.

##### App is ready to go!

### ISSUES & TROUBLE SHOOTING:

1. Yes, my old token is hard coded in the git history. It's revoked so don't bother using it, I made a new one :)
2. Here are some current limitations that I will be addressing:

  - You can only go from Spotify to Apple Music. I will be adding the reverse functionality soon.
  - The app is currently kinda slow due to Apple's rate limiting. I will figure out the solution to this.
  - If the app can't find a song, it will skip it. I will be adding a way to manually add songs to the playlist eventually.

3. If something doesn't work while setting up, consider the following:

  - Make sure your Spotify and Apple Music dev accounts and associated keys are expired and are correct.
  - Ensure that your `.env` files are consistent and follow the comments.
  - Make sure your ports aren't blocked.

4. If you've followed the instructions carefully and it still won't work, leave an issue and I'll sort it out!
