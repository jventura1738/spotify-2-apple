import React from "react";
import Home from "./pages/Home";
import SpotifyPlaylists from "./pages/SpotifyPlaylists";

import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <main className="bg-theme min-h-screen">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spotify_playlists" element={<SpotifyPlaylists />} />
          </Routes>
        </Router>
      </main>
    );
  }
}

export default App;