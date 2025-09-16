"use client";
import { createContext, useContext, useEffect, useState } from "react";

const WebsocketContext = createContext<WebSocket | null>(null);

export const WebsocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    async function startWs() {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        const socket = new WebSocket(
          `${process.env.NEXT_PUBLIC_WSS_URL}?token=${data.token}`,
        );

        socket.onopen = () => {
          console.log("✅ WebSocket connected");
          setWs(socket);
        };

        socket.onerror = (error) => {
          console.error("❗ WebSocket error:", error);
        };

        socket.onclose = (event) => {
          console.log(
            `❎ WebSocket closed: ${event.code}, Reason: ${event.reason}`,
          );
        };
      } catch (error) {
        console.error("❗ Failed to get token or connect to WebSocket:", error);
      }
    }
    startWs();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <WebsocketContext.Provider value={ws}>{children}</WebsocketContext.Provider>
  );
};

export const useWebsocket = () => {
  const ws = useContext(WebsocketContext);
  if (!ws) {
    console.warn(
      "⚠ WebSocket not available. Ensure the provider is initialized.",
    );
  }
  return ws;
};
