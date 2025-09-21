
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      {/* <link rel="icon" href="/assets/img/logo_meio.jpg" /> */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="apple-mobile-web-app-title" content="VemFacul" />
      <title>VemFacul</title>

      <Head />
      <body style={{ margin: 0, padding: 0, backgroundColor: "#f5f2ef" }}>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}           