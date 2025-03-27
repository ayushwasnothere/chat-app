"use client";

import { useState } from "react";
import { Button } from "./button";

export function Chatbox({
  ws,
  to,
  sender,
}: {
  ws: WebSocket;
  to: string;
  sender: string;
}) {
  const [message, setMessage] = useState("");
  return (
    <div>
      <input type="text" onChange={(e) => setMessage(e.target.value)} />
      <Button
        onClick={() => {
          const data = {
            sender,
            to,
            content: message,
          };
          console.log(ws);
          ws?.send(JSON.stringify(data));
        }}
        label="Send"
      />
    </div>
  );
}
