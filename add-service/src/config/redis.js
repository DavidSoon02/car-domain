const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
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
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Redis connected');
                this.isConnected = true;
            });

            this.client.on('disconnect', () => {
                console.log('Redis disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
            this.isConnected = true;
            console.log(`Connected to Redis at ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);
        } catch (error) {
            console.error('Redis connection failed:', error);
            this.isConnected = false;
            throw error;
        }
    }

    getClient() {
        if (!this.client || !this.isConnected) {
            throw new Error('Redis client not connected');
        }
        return this.client;
    }

    isClientConnected() {
        return this.isConnected && this.client && this.client.isReady;
    }

    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
            this.isConnected = false;
        }
    }
}

module.exports = new RedisClient();
