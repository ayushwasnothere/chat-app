"use client";
import { SessionProvider } from "next-auth/react";
import { WebsocketProvider } from "./context/useWebsocket";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <SessionProvider>
        <WebsocketProvider>{children}</WebsocketProvider>
      </SessionProvider>
    </div>
  );
};
