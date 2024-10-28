import { createClient, RedisClientType } from "redis";

const [host, port] = process.env.REDIS_URL?.split(":") as string[];

export const redisClient: RedisClientType = createClient({
  socket: {
    host: host,
    port: Number(port),
  },
});

export const getChannel = ({ id }: { id: string }) => {
  return `user:${id}`;
};
