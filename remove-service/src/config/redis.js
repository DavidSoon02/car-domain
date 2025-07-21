const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.connect();
    }

    async connect() {
        try {
            this.client = redis.createClient({
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT) || 6379
                }
            });

            this.client.on('connect', () => {
                console.log(`Connected to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
                this.isConnected = true;
            });

            this.client.on('error', (err) => {
                console.error('Redis error:', err);
                this.isConnected = false;
            });

            this.client.on('end', () => {
                console.log('Redis connection ended');
                this.isConnected = false;
            });

            await this.client.connect();
        } catch (error) {
            console.error('Redis connection failed:', error);
            this.isConnected = false;
        }
    }

    getClient() {
        return this.client;
    }

    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
            this.isConnected = false;
        }
    }
}

module.exports = new RedisClient();
