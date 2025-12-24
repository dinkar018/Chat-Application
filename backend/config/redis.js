import { createClient } from "redis";

console.log("🔵 Initializing Redis client...");

const redis = createClient({
  url: "redis://localhost:6379",
});

redis.on("connect", () => {
  console.log("🟢 Redis TCP connection established");
});

redis.on("ready", () => {
  console.log("✅ Redis client ready to use");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redis.on("end", () => {
  console.log("🔴 Redis connection closed");
});

await redis.connect();
console.log("🚀 Redis main client connected");

/* ---- Subscriber (duplicate connection) ---- */
console.log("🔵 Initializing Redis subscriber client...");

const redisSub = redis.duplicate();

redisSub.on("connect", () => {
  console.log("🟢 Redis SUB TCP connection established");
});

redisSub.on("ready", () => {
  console.log("✅ Redis subscriber ready");
});

redisSub.on("error", (err) => {
  console.error("❌ Redis SUB error:", err);
});

redisSub.on("end", () => {
  console.log("🔴 Redis SUB connection closed");
});

await redisSub.connect();
console.log("🚀 Redis subscriber connected");

export { redis, redisSub };
