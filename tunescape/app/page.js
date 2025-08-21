"use client";

import "react-h5-audio-player/lib/styles.css";

import {
  getPlaylist,
  getShuffledPlaylist,
  getSongForLocation,
  getSongUrl,
} from "@/app/utils";
import { useEffect, useState } from "react";

import AudioPlayer from "react-h5-audio-player";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [playMode, setPlayMode] = useState("list");
  const [playlist, setPlaylist] = useState(getPlaylist());
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [source, setSource] = useState(getSongUrl(playlist[0][0]));
  const [songName, setSongName] = useState(playlist[0][1]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");

  function showToast(message) {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  }

  function getLocationFromIP() {
    fetch("https://ipapi.co/json/").then((res) => {
      res.json().then((data) => {
        if (data.latitude && data.longitude) {
          setLatitude(data.latitude);
          setLongitude(data.longitude);
        }
      });
    });
  }

  function getLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        if (position.coords.latitude && position.coords.longitude) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        } else {
          getLocationFromIP();
        }
      });
    } else {
      getLocationFromIP();
    }
  }

  async function getSong() {
    if (playMode !== "travel" || !latitude || !longitude) return;
    const songData = getSongForLocation(latitude, longitude);
    if (!songData.url || !songData.name) return;
    setSource(songData.url);
    setSongName(songData.name);
  }

  function onSongEnd() {
    if (playMode !== "travel") {
      let newPlaylistIndex = playlistIndex + 1;
      if (newPlaylistIndex >= playlist.length) newPlaylistIndex = 0;
      const song = playlist[newPlaylistIndex];
      setSource(getSongUrl(song[0]));
      setSongName(song[1]);
      setPlaylistIndex(newPlaylistIndex);
    }
  }

  function onClickLastSong() {
    let newPlaylistIndex = playlistIndex - 1;
    if (newPlaylistIndex < 0) newPlaylistIndex = playlist.length - 1;
    const song = playlist[newPlaylistIndex];
    setSource(getSongUrl(song[0]));
    setSongName(song[1]);
    setPlaylistIndex(newPlaylistIndex);
  }

  useEffect(() => {
    let interval = null;
    if (playMode === "travel") {
      getLocation();
      interval = setInterval(() => {
        getLocation();
      }, 10000);
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [playMode]);

  useEffect(() => {
    getSong();
  }, [latitude, longitude]);

  useEffect(() => {
    switch (playMode) {
      case "shuffle":
        const newPlaylist = getShuffledPlaylist();
        setPlaylist(newPlaylist);
        setSource(getSongUrl(newPlaylist[0][0]));
        setSongName(newPlaylist[0][1]);
        setPlaylistIndex(0);
        break;
      case "list":
        const fullPlaylist = getPlaylist();
        setPlaylist(fullPlaylist);
        setPlaylistIndex(0);
        break;
      case "travel":
        getSong();
        break;
    }
  }, [playMode]);

  return (
    <div className={styles.page}>
      <h1 style={{ color: "white" }}>TuneScape</h1>
      <main className={styles.main}>
        <h2 style={{ color: "white", textAlign: "center" }}>
          Playing: {songName}
        </h2>
        {playMode === "list" ? (
          <>
            <input
              type="text"
              placeholder="Search songs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: 300,
                marginBottom: 12,
                padding: "8px 12px",
                fontSize: "1em",
                borderRadius: 8,
                border: "1px solid #888",
                background: "#222",
                color: "#fff",
              }}
            />
            <div style={{ width: 300, height: 250, overflowY: "scroll" }}>
              {playlist
                .filter((song) =>
                  song[1].toLowerCase().includes(search.toLowerCase())
                )
                .map((song, index) => (
                  <div
                    key={index}
                    className={styles.song_item}
                    style={{
                      color: songName == song[1] ? "#14F050" : "yellow",
                    }}
                    onClick={() => {
                      setSource(getSongUrl(song[0]));
                      setSongName(song[1]);
                      setPlaylistIndex(playlist.indexOf(song));
                    }}
                  >
                    {song[1]}
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            <Image
              src="/dance.gif"
              height="300"
              width="300"
              alt="Dancing guy"
            />
            {playMode === "travel" && (
              <div
                className={styles.toggle}
                style={{
                  fontSize: "1.2em",
                }}
                onClick={() =>
                  showToast(
                    "Travel mode sets the song based on your location. As you travel, the song will change automatically."
                  )
                }
              >
                How does Travel Mode work?
              </div>
            )}
          </>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            gap: "1rem",
          }}
        >
          {playMode !== "shuffle" && (
            <h3
              className={styles.toggle}
              onClick={() => setPlayMode("shuffle")}
            >
              Shuffle
            </h3>
          )}
          {playMode !== "travel" && (
            <h3 className={styles.toggle} onClick={() => setPlayMode("travel")}>
              Travel Mode
            </h3>
          )}
          {playMode !== "list" && (
            <h3 className={styles.toggle} onClick={() => setPlayMode("list")}>
              Song Select
            </h3>
          )}
        </div>
        <AudioPlayer
          autoPlay
          autoPlayAfterSrcChange
          showJumpControls={playMode !== "travel"}
          showSkipControls={playMode !== "travel"}
          loop={playMode === "travel"}
          src={source}
          onEnded={() => onSongEnd()}
          onClickNext={() => onSongEnd()}
          onClickPrevious={() => onClickLastSong()}
          style={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100vw",
            backgroundColor: "#000",
            color: "white",
          }}
        />
      </main>
      {toastVisible && <div className={styles.toast}>{toastMessage}</div>}
    </div>
  );
}
