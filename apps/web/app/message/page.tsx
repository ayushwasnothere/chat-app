"use client";
import { Chatbox } from "@repo/ui/chatbox";
import { useWebsocket } from "../context/useWebsocket";

interface Message {
  to: string;
  sender: string;
  content: string;
}
export default async function Message() {
  const ws = useWebsocket() as WebSocket;
  console.log("is ononon" + ws);
  let messages: Message[] = [];
  if (ws) {
    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      messages.push(message);
    };
  }

  return (
    <div className="h-full w-full">
      {messages.map((m) => {
        return <div>{JSON.stringify(m)}</div>;
      })}
      <Chatbox sender="luffy" to="nami" ws={ws as WebSocket} />
    </div>
  );
}
