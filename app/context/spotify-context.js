"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./toast-context";
import { useIsMobile } from "../_hooks/useIsMobile";

const SpotifyContext = React.createContext(null);

export default SpotifyContext;

export function SpotifyClientProvider({ children }) {
  const [spotifyUser, setSpotifyUser] = useState(null);
  const [_code, setCode] = useState(null);
  const [auth, setAuth] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [generationHistory, setGenerationHistory] = useState({});
  const [error, setError] = useState(null);

  const { showToast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const spotifyUser = JSON.parse(localStorage.getItem("spotifyUser"));
    const playlist = JSON.parse(localStorage.getItem("playlist"));
    const history = JSON.parse(localStorage.getItem("history"));

    if (auth) {
      setAuth(auth);
    }
    if (spotifyUser) {
      setSpotifyUser(spotifyUser);
    }
    if (playlist) {
      setPlaylist(playlist);
    }
    if (history) {
      setGenerationHistory(history);
    }
    // setFilters(defaultFilters);

    const params = new URLSearchParams(window.location.search.substring(1));
    const code = params.get("code");

    if (code) {
      setCode(code);
    }
  }, []);

  const checkTokenTime = async () => {
    // checks if auth is present and if a new time is greater than the time for auth
    if (auth && auth.expires_at && new Date() > new Date(auth.expires_at)) {
      const params = new URLSearchParams({
        refresh_token: auth.refresh_token,
      });
      const res = await fetch("api/token/refresh? " + params.toString());

      if (res.status === 200) {
        const data = await res.json();
        const seconds = data.expires_in;
        data.created_at = new Date();
        data.expires_at = new Date().setSeconds(
          data.created_at.getSeconds() + seconds,
        );
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth(data);
      } else {
        setError(res);
      }
    }
  };

  const tokenCall = async (_code) => {
    // console.log("tokenCall", _code);
    if (!_code) return;
    // gets the user https://api.spotify.com/v1/me
    // https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
    // needs the access_token and token_type in the request
    const res = await fetch(`/api/token?code=${_code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch token");
    } else {
      const data = await res.json();
      const seconds = data.expires_in;
      data.created_at = new Date();
      data.expires_at = new Date(data.created_at.getTime() + seconds * 1000);

      localStorage.setItem("auth", JSON.stringify(data));
      setAuth(data);
      getSpotifyUser(data);
    }
    // needs error handling;
  };

  const getSpotifyUser = async (authData = auth) => {
    if (!authData) return;

    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
      },
    });
    const data = await res.json();
    // console.log(data);
    setSpotifyUser(data);
    localStorage.setItem("spotifyUser", JSON.stringify(data));
    window.history.replaceState(
      {},
      "",
      window.location.host.includes("localhost")
        ? "http://" + window.location.host
        : "https://" + window.location.host,
    );
  };

  async function onSuccessCode(_code) {
    await tokenCall(_code);
    await checkForPlaylist();
  }

  const checkForPlaylist = async () => {
    // looks for the playlist 'Randofy' in user playlists to see if its available
    await checkTokenTime();
    // recursive because can only get 50 items at a time
    await findPlaylist(0, -1);
  };

  const getPlaylist = async (playlistId) => {
    await checkTokenTime();
    const temp = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: { Authorization: `Bearer ${auth.access_token}` },
      },
    );
    const response = await temp.json();
    const songIds = response.tracks.items.map((item) => item.track.id);

    const playlist = {
      id: response.id,
      track_ids: songIds,
      tracks: response.tracks.items,
      link: response.href,
    };
    setPlaylist(playlist);
    localStorage.setItem("playlist", JSON.stringify(playlist));
    // await getPlaylistItems();
  };

  const createPlaylist = async () => {
    // check token status first, always.
    // (this is probably not needed but i did it always previously);
    await checkTokenTime();
    const res = await fetch(
      `https://api.spotify.com/v1/users/${spotifyUser.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Randofy",
          description:
            "A playlist created by Randofy of your saved songs. Enjoy!",
          public: true,
        }),
      },
    );

    //Testing this for non 200 status... new on 10/7/24
    if (!res.ok) {
      setError(res.json());
    } else {
      const data = await res.json();
      const playlist = {
        id: data.id,
        tracks: data?.tracks?.items || [],
        link: data.href,
      };
      setPlaylist(playlist);
      localStorage.setItem("playlist", JSON.stringify(playlist));
    }
  };

  // searches for the playlist if it exists and uses getPlaylist to retrieve the playlist and create playlist if it does not
  const findPlaylist = async (offset, total) => {
    console.log("findPlaylist", auth);
    if (!auth) return;
    const res = await fetch(
      `https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      },
    );

    const data = await res.json();
    //Testing this for non 200 status... new on 10/7/24
    if (res.status !== 200) {
      setError(data);
      return;
    }
    const items = data.items;
    if (total === -1) {
      total = data.total;
    }
    const filtered = items.filter((item) => {
      if (item.name === "Randofy") {
        return item.id;
      }
    });

    if (filtered.length) {
      await getPlaylist(filtered[0].id);
      // await getPlaylistItems();
    } else if (offset + 50 >= total) {
      await createPlaylist();
    } else {
      findPlaylist(offset + 50, total);
    }
  };

  const isInPlaylist = (songId) => {
    if (!auth || !playlist) {
      return false;
    }
    console.log("Checking if song is in playlist...", playlist.track_ids);
    for (const id of playlist.track_ids) {
      if (id === songId) {
        console.log("Song is in playlist.");
        return true;
      }
    }
  };

  const addToPlaylist = async (songId) => {
    await checkTokenTime();
    // creates playlist if there is none
    await checkForPlaylist();

    if (isInPlaylist(songId)) {
      showToast("Song already in playlist", "info");
      return 0;
    } else {
      const songUri = "spotify:track:" + songId;
      try {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?uris=${songUri}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${auth.access_token}`,
              Accept: "application/json",
            },
          },
        );
        const updatedPlaylist = {
          ...playlist,
          track_ids: [...playlist.track_ids, songId],
        };
        setPlaylist(updatedPlaylist);
        localStorage.setItem("playlist", JSON.stringify(playlist));
        showToast("Song added to playlist", "success");
      } catch (error) {
        console.error(error.response?.data || error.message);
        setError(error);
        showToast("Error adding song to playlist", "error");
      }
    }
  };

  const removeFromPlaylist = async (songId) => {
    await checkTokenTime();
    if (!isInPlaylist(songId)) {
      return 0;
    } else {
      const songUri = "spotify:track:" + songId;
      try {
        await axios.delete(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${auth.access_token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: {
              tracks: [{ uri: songUri }],
            },
          },
        );

        setPlaylist({
          ...playlist,
          track_ids: playlist.track_ids.filter((item) => item !== songId),
        });
        localStorage.setItem("playlist", JSON.stringify(playlist));

        showToast("Song removed from playlist", "success");
      } catch (error) {
        // console.log("error in addSong")
        setError(error);
        showToast("Error removing song from playlist", "error");
      }
    }
  };

  const loginRequest = async () => {
    window.location.href = "/api/login";
  };

  const logoutRequest = () => {
    // Clear localStorage/sessionStorage/cookies
    localStorage.removeItem("spotifyUser");
    localStorage.removeItem("auth");
    localStorage.removeItem("playlist");
    setSpotifyUser(null);
    setAuth(null);
    setPlaylist(null);
    setPlaylistSongs(null); // removing soon
    setError(null);

    // Optional: Show a toast or message if needed
    console.log("Logged out.");
  };

  useEffect(() => {
    if (_code) {
      onSuccessCode(_code);
    }
  }, [_code]);

  const spotifyClient = {
    // State
    spotifyUser,
    isLoading,
    // General Functions
    loginRequest,
    logoutRequest,
    getPlaylist,
    // Playlist functions
    addToPlaylist,
    removeFromPlaylist,
    isInPlaylist,
  };

  const context = {
    spotifyClient,
  };

  return (
    <SpotifyContext.Provider value={context}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotifyContext() {
  const context = React.useContext(SpotifyContext);
  if (!context) {
    throw new Error("useSpotifyContext must be used within a SpotifyProvider");
  }
  return context;
}
