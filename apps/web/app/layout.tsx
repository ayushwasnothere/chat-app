import type { Metadata } from "next";
import "./globals.css";
import { Provider } from "./providers";
import { AppbarClient } from "./AppbarClient";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <AppbarClient />
        <body>{children}</body>
      </Provider>
    </html>
  );
}