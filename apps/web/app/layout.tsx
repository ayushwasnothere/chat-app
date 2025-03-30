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
