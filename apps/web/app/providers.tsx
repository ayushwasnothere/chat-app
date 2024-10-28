"use client";
import { SessionProvider } from "next-auth/react";
import { WebsocketProvider } from "./context/useWebsocket";

export const Provider = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) => {
  return (
    <div>
      <SessionProvider>
        <WebsocketProvider token={token}>{children}</WebsocketProvider>
      </SessionProvider>
    </div>
  );
};
