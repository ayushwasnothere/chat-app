"use client";
import { createContext, useContext, useEffect, useRef } from "react";

const WebsocketContext = createContext<WebSocket | null>(null);

export const WebsocketProvider = ({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080?token=" + token);

    ws.current.onopen = () => {
      console.log("Wensocket onn");
      ws.current?.send(
        JSON.stringify({ to: "nami", sender: "luffy", content: "hi nami" }),
      );
    };

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
