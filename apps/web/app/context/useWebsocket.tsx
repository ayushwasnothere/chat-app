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
        const res = await fetch("http://localhost:3000/api/user");
        const data = await res.json();
        setToken(data.token);

        ws.current = new WebSocket(`ws://localhost:8080?token=${data.token}`);

        ws.current.onopen = () => {
          console.log("WebSocket connected");
          ws.current?.send(
            JSON.stringify({ to: "nami", sender: "luffy", content: "hi nami" }),
          );
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
