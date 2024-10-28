import WebSocket from "ws";
import { getChannel, redisClient } from "./services/redis";
import { createConnectionManager } from "./components/connectionManager";

const start = async () => {
  try {
    await redisClient.connect();
    const wss = new WebSocket.Server({ port: 8080 });

    const { addConnection } = createConnectionManager();

    wss.on("connection", async (ws, req) => {
      try {
        //TODO: add a get user function that checks the jwt and returns the user object
        const user = { id: "dummmy" };
        const channel = getChannel(user);

        const { to, remove, isActive } = addConnection(user.id, ws);

        if(isActive) redisClient.subscribe()
      } catch (err) {}
    });
  } catch (err) {}
};

start();
