const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
    }

    async connect() {
        try {
            this.client = redis.createClient({
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379
                }
            });

            this.client.on('error', (err) => {
                console.error('Redis error:', err);
            });

            await this.client.connect();
            console.log(`Connected to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
        } catch (error) {
            console.error('Redis connection failed:', error);
            throw error;
        }
    }

    getClient() {
        return this.client;
    }
}

module.exports = new RedisClient();
