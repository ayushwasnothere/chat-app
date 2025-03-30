import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./providers";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Raven",
  description: "Send the ravens",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon/apple-touch-icon.png",
    },
    { rel: "icon", type: "image/x-icon", url: "/favicon/favicon.ico" },
    {
      rel: "icon",
      sizes: "192x192",
      type: "image/png",
      url: "/favicon/android-chrome-192x192.png",
    },
    {
      rel: "icon",
      sizes: "512x512",
      type: "image/png",
      url: "/favicon/android-chrome-512x512.png",
    },
  ],
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className + " " + poppins.className}>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
