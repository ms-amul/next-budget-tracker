import "./globals.css";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Head from "next/head"; // Import Head component for meta tags

export const metadata = {
  title: "Servify - AI Finance Manager",
  description: "Generated by create next app",
  icons: {
    icon: "/icon.png",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href={metadata.manifest} />
        <link rel="icon" type="image/png" href={metadata.icons}></link>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="budget, tracker, finance, app" />
        <meta name="author" content="RAJGOPAL HOTA" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.icon} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.icon} />
      </Head>
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
