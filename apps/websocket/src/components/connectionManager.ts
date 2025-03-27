import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";

export interface Room extends Map<string, WebSocket> {}
export interface Connections extends Map<string, Room> {}

const getDefaultRoom = (map: Connections, key: string): Room => {
  if (!map.has(key)) {
    map.set(key, new Map());
  }
  return map.get(key) as Room;
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

  const to = (room: Room) => (callback: (ws: WebSocket) => void) => {
    room.forEach(callback);
  };

  const remove =
    (room: Room, key: string, id: string) =>
    (
      onRemoveConnection: (ws: WebSocket) => void = () => {},
      onRemoveRoom = () => {},
    ) => {
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
