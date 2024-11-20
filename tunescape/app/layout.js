import localFont from "next/font/local";
import "./globals.css";

const pixelifySans = localFont({
  src: "./fonts/PixelifySans-Regular.ttf",
  variable: "--font-pixelify-sans",
  weight: "400",
});

export const metadata = {
  title: "TuneScape",
  description: "Tunes for strolling around Gielinor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TuneScape</title>
        <link rel="icon" href="/favicon.ico" size="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Pixelify+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${pixelifySans.variable}`}>{children}</body>
    </html>
  );
}
