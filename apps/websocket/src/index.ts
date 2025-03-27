import dotenv from "dotenv";
dotenv.config();
import WebSocket from "ws";
import { getChannel, redisClient } from "./services/redis";
import { createConnectionManager } from "./components/connectionManager";
import { getCurrentUser } from "./services/user";
import { parse } from "url";

// TODO: implement real user type

const start = async () => {
  try {
    await redisClient.connect();
    const wss = new WebSocket.Server({ port: 8080 }, () => {
      console.log("Server started on http://localhost:8080");
    });

    const { addConnection } = createConnectionManager();

    wss.on("connection", async (ws, req) => {
      try {
        // TODO: implement real user type

        const parsedUrl = parse(req.url || "", true);
        const token = parsedUrl.query.token as string;
        if (!token) {
          console.error("Missing token");
          ws.close(1008, "Missing token");
          return;
        }

        const user: any = await getCurrentUser(token);
        if (user) {
          console.log(`User ${user.id} connected`);
        }

        const { to, remove, isActive } = addConnection(user.id, ws);

        if (isActive) {
          ws.on("message", (message) => {
            const data = JSON.parse(message.toString());
            if (data.type === "SEND_MESSAGE") {
              to((wsConn: WebSocket) => {
                wsConn.send(JSON.stringify({ type: "RECEIVE_MESSAGE", data }));
              });
            }
          });
        }

        ws.on("close", () => {
          remove(
            (wsConn: WebSocket) => wsConn.close(),
            () => redisClient.unsubscribe(channel),
          );
        });
      } catch (err) {
        ws.close(1011, "Internal Server Error!");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

start();
