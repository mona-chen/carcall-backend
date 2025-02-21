import Redis from "ioredis";

class RedisSingleton {
    private static instance: Redis;

    private constructor() {}

    public static getInstance(): Redis {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new Redis({
                host: process.env.REDIS_HOST as string || "127.0.0.1",
                port: Number(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD as string || undefined,
                tls: process.env.REDIS_TLS ? {} : undefined, // Use TLS if specified
            });

            RedisSingleton.instance.on("connect", () => {
                console.log("✅ Connected to Redis");
            });

            RedisSingleton.instance.on("error", (err:any) => {
                console.error("❌ Redis Error:", err);
            });
        }

        return RedisSingleton.instance;
    }
}

export default RedisSingleton;
