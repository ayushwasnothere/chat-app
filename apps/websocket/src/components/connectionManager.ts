import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

interface Room extends Map<string, WebSocket> {}
interface Connections extends Map<string, Room> {}

const getDefaultRoom = (
  map: Connections,
  key: string,
  defaultValue: Room = new Map(),
) => {
  if (!map.has(key)) map.set(key, defaultValue);
  return map.get(key);
};

export const createConnectionManager = () => {
  const connections: Connections = new Map();

  const add = (key: string, ws: WebSocket, id = uuidv4()) => {
    const room = getDefaultRoom(connections, key);
    room?.set(id, ws);
    return {
      to: to(room as Room),
      remove: remove(room as Room, key as string, id as string),
      isActive: room?.size === 1,
    };
  };

  const to = (room: Room) => (callback: () => void) => {
    Array.from(room.values()).forEach(callback);
  };

  const remove =
    (room: Room, key: string, id: string) =>
    (onRemoveConnection = () => {}, onRemoveRoom = () => {}) => {
      removeConnection(room, id, onRemoveConnection);
      removeRoom(room, key, onRemoveRoom);
    };

  const removeConnection = (
    room: Room,
    id: string,
    onRemoveConnection: (ws: WebSocket) => void,
  ) => {
    onRemoveConnection(room.get(id) as WebSocket);
    room.delete(id);
  };

  const removeRoom = (
    room: Room,
    key: string,
    onRemoveRoom: () => void,
    force = false,
  ) => {
    if (!force && room.size > 0) return;
    connections.delete(key);
    onRemoveRoom();
  };
  return { addConnection: add };
};
