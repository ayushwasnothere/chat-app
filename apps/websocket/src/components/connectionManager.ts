import { WebSocket } from "ws";
import { logger } from "./logger";

const connections = new Map<string, Set<WebSocket>>();

function addConnection(userId: string, ws: WebSocket) {
  if (!connections.has(userId)) {
    connections.set(userId, new Set());
  }
  connections.get(userId)?.add(ws);
}

function removeConnection(userId: string, ws: WebSocket) {
  if (connections.has(userId)) {
    connections.get(userId)?.delete(ws);
    if (connections.get(userId)?.size === 0) {
      connections.delete(userId);
    }
  }
}

function sendMessageToUser(userId: string, message: string) {
  const userConnections = connections.get(userId);
  if (userConnections && userConnections.size > 0) {
    userConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        logger.info(`Message sent to ${userId}: ${message}`);
      }
    });
  } else {
    logger.warn(`No active WebSocket connections for user ${userId}`);
  }
}

export { addConnection, removeConnection, sendMessageToUser };
