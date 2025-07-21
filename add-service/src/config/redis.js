const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
    }

    async connect() {
        try {
            this.client = redis.createClient({
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT
            });

            this.client.on('error', (err) => {
                console.error('Redis error:', err);
            });

            await this.client.connect();
            console.log('Connected to Redis');
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
