import dotenv from "dotenv";
dotenv.config();
import WebSocket from "ws";
import { getCurrentUser } from "./services/user";
import { parse } from "url";
import {
  addConnection,
  removeConnection,
  sendMessageToUser,
} from "./components/connectionManager";
import { logger } from "./components/logger";

const start = async () => {
  try {
    const wss = new WebSocket.Server({ port: 8080 }, () => {
      console.log("Server started on http://localhost:8080");
    });

    wss.on("connection", async (ws, req) => {
      try {
        const parsedUrl = parse(req.url || "", true);
        const token = parsedUrl.query.token as string;
        if (!token) {
          console.error("Missing token");
          ws.close(1008, "Missing token");
          return;
        }

        const user: any = await getCurrentUser(token);
        if (user) {
          logger.info(`User connected: ${user.id}`);
        }

        addConnection(user.id, ws);

        ws.on("message", (data) => {
          try {
            const { senderId, toId } = JSON.parse(data.toString());
            if (senderId !== user.id || toId === user.id) {
              ws.send("Invalid format");
              logger.warn(`Invalid format from user id: ${senderId}`);
              return;
            }
            if (toId) {
              sendMessageToUser(toId, data.toString());
              logger.info(`Message sent from ${user.id} to ${toId}`);
            }
          } catch (err: any) {
            logger.error(`Error parsing message: ${err.message}`);
          }
        });

        ws.on("close", () => {
          if (user) {
            removeConnection(user.id, ws);
            logger.info(`User disconnected: ${user.id}`);
          }
        });
      } catch (err: any) {
        logger.error(`Error connecting: ${err}`);
        ws.close(1011, "Internal Server Error!");
      }
    });
  } catch (err) {
    logger.error(`Error starting server: ${err}`);
  }
};

start();
