"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getSongForLocation, getShuffledPlaylist } from "@/app/utils";

export default function Home() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [source, setSource] = useState(
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925200019ea797ea1/view?project=6738fca6003590a48574"
  );
  const [songName, setSongName] = useState("Scape Main");
  const [shuffle, setShuffle] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [playlistIndex, setPlaylistIndex] = useState(0);

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
    console.log("Updating song!");
    if (shuffle || !latitude || !longitude) return;
    const songData = getSongForLocation(latitude, longitude);
    if (!songData.url || !songData.name) return;
    setSource(songData.url);
    setSongName(songData.name);
  }

  function onSongEnd() {
    if (shuffle) {
      let newPlaylistIndex = playlistIndex + 1;
      if (newPlaylistIndex >= playlist.length) newPlaylistIndex = 0;
      const song = playlist[newPlaylistIndex];
      setSource(
        `https://oldschool.runescape.wiki/images/transcoded/${song[0]}/${song[0]}.mp3`
      );
      setSongName(song[1]);
      setPlaylistIndex(newPlaylistIndex);
    }
  }

  function onClickLastSong() {
    let newPlaylistIndex = playlistIndex - 1;
    if (newPlaylistIndex < 0) newPlaylistIndex = playlist.length - 1;
    const song = playlist[newPlaylistIndex];
    setSource(
      `https://oldschool.runescape.wiki/images/transcoded/${song[0]}/${song[0]}.mp3`
    );
    setSongName(song[1]);
    setPlaylistIndex(newPlaylistIndex);
  }

  useEffect(() => {
    getLocation();
    setInterval(() => {
      getLocation();
    }, 10000);
  }, []);

  useEffect(() => {
    getSong();
  }, [latitude, longitude]);

  useEffect(() => {
    if (shuffle) {
      const newPlaylist = getShuffledPlaylist();
      setPlaylist(newPlaylist);
      setSource(
        `https://oldschool.runescape.wiki/images/transcoded/${newPlaylist[0][0]}/${newPlaylist[0][0]}.mp3`
      );
      setSongName(newPlaylist[0][1]);
    } else {
      getLocation();
    }
  }, [shuffle]);

  return (
    <div className={styles.page}>
      <h1 style={{ color: "white" }}>TuneScape</h1>
      <main className={styles.main}>
        <Image src="/dance.gif" height="300" width="300" alt="Dancing guy" />
        <h2 style={{ color: "white", textAlign: "center" }}>
          Playing: {songName}
        </h2>
        <h3
          style={{ color: "white", textAlign: "center" }}
          className={styles.toggle}
          onClick={() => setShuffle(!shuffle)}
        >
          Switch to {shuffle ? "Travel" : "Shuffle"} Mode
        </h3>
        <AudioPlayer
          autoPlay
          autoPlayAfterSrcChange
          showJumpControls={shuffle}
          showSkipControls={shuffle}
          loop={!shuffle}
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
    </div>
  );
}
