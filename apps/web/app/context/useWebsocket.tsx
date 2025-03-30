"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const WebsocketContext = createContext<WebSocket | null>(null);

export const WebsocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useRef<WebSocket | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function startWs() {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        setToken(data.token);

        ws.current = new WebSocket(
          `${process.env.NEXT_PUBLIC_WSS_URL}?token=${data.token}`,
        );

        ws.current.onopen = () => {
          console.log("WebSocket connected");
        };
      } catch (error) {
        console.error("Failed to get token");
      }
    }
    startWs();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <WebsocketContext.Provider value={ws.current}>
      {children}
    </WebsocketContext.Provider>
  );
};

export const useWebsocket = () => useContext(WebsocketContext);
