"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Client, Functions } from "appwrite";
import Image from "next/image";

export default function Home() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [source, setSource] = useState(
    "https://homelab.hippogriff-lime.ts.net/v1/storage/buckets/673924ee0018eaadf391/files/673925200019ea797ea1/view?project=6738fca6003590a48574&project=6738fca6003590a48574&mode=admin"
  );
  const [songName, setSongName] = useState("Scape Main");

  const client = new Client();
  client
    .setEndpoint("https://homelab.hippogriff-lime.ts.net/v1")
    .setProject("6738fca6003590a48574");
  const functions = new Functions(client);

  useEffect(() => {
    setInterval(() => {
      let latitude = null;
      let longitude = null;
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition((position) => {
          latitude = Math.round(position.coords.latitude * 100) / 100;
          longitude = Math.round(position.coords.longitude * 100) / 100;
        });
      }
      if (latitude === null || longitude === null) {
        fetch("https://ipapi.co/json/").then((res) => {
          res.json().then((data) => {
            latitude = Math.round(data.latitude * 100) / 100;
            longitude = Math.round(data.longitude * 100) / 100;
          });
        });
      }
      if (latitude !== null && longitude !== null) {
        setLatitude(latitude);
        setLongitude(longitude);
      }
    }, 10000);
  }, []);

  useEffect(() => {
    async function getSong() {
      console.log("Updating song!");
      if (latitude === null || longitude === null) return;
      const res = await functions.createExecution(
        "673d545c001f5c42abf2",
        JSON.stringify({ location: `${latitude},${longitude}` })
      );
      if (!res.responseBody) return;
      const body = JSON.parse(res.responseBody);
      console.log(body.song_url);
      if (body.song_url) setSource(body.song_url);
      if (body.song_name) setSongName(body.song_name);
    }
    getSong();
  }, [latitude, longitude]);

  return (
    <div className={styles.page}>
      <h1 style={{ color: "white" }}>TuneScape</h1>
      <main className={styles.main}>
        <Image src="/dance.gif" height="300" width="300" alt="Dancing guy" />
        <h2 style={{ color: "white", textAlign: "center" }}>
          Playing: {songName}
        </h2>
        <AudioPlayer
          autoPlay
          autoPlayAfterSrcChange
          showJumpControls={false}
          loop
          src={source}
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
