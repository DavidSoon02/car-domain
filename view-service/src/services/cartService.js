const redisClient = require('../config/redis');

class CartService {
    async getRedisClient() {
        // Esperar un poco si la conexión no está lista
        let retries = 0;
        const maxRetries = 5;

        while (retries < maxRetries) {
            try {
                const client = redisClient.getClient();
                if (client && client.isReady) {
                    return client;
                }
            } catch (error) {
                console.log(`Redis not ready, attempt ${retries + 1}/${maxRetries}`);
            }

            retries++;
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms
        }

        throw new Error('Redis connection not available after retries');
    }

    async getCart(userId) {
        try {
            const redis = await this.getRedisClient();
            const cartKey = `cart:${userId}`;
            const cartData = await redis.hGetAll(cartKey);

            if (!cartData || Object.keys(cartData).length === 0) {
                return { items: [], total: 0, itemCount: 0 };
            }

            const items = Object.keys(cartData).map(productId => {
                try {
                    return JSON.parse(cartData[productId]);
                } catch (parseError) {
                    console.error('Error parsing cart item:', parseError);
                    return null;
                }
            }).filter(item => item !== null);

            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

            return {
                items,
                total: parseFloat(total.toFixed(2)),
                itemCount
            };
        } catch (error) {
            console.error('Error getting cart:', error);

            // Si es un error de conexión, devolver carrito vacío en lugar de fallar
            if (error.message.includes('Redis connection')) {
                console.warn('Redis unavailable, returning empty cart');
                return { items: [], total: 0, itemCount: 0 };
            }

            throw error;
        }
    }

    async getCartItem(userId, productId) {
        try {
            const redis = await this.getRedisClient();
            const cartKey = `cart:${userId}`;
            const productKey = `${productId}`;

            const itemData = await redis.hGet(cartKey, productKey);

            if (!itemData) {
                return null;
            }

            return JSON.parse(itemData);
        } catch (error) {
            console.error('Error getting cart item:', error);

            // Si es un error de conexión, devolver null
            if (error.message.includes('Redis connection')) {
                console.warn('Redis unavailable, returning null for cart item');
                return null;
            }

            throw error;
        }
    }
}

module.exports = new CartService();
