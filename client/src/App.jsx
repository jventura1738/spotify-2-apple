import React from "react";
import Home from "./pages/Home";
import SpotifyPlaylists from "./pages/SpotifyPlaylists";
import Results from "./pages/Results";

import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <main className="min-h-screen bg-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spotify_playlists" element={<SpotifyPlaylists />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </Router>
      </main>
    );
  }
}

export default App;
