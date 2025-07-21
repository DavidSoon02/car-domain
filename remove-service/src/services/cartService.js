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

    async removeFromCart(userId, productId, quantity = null) {
        try {
            const redis = await this.getRedisClient();
            const cartKey = `cart:${userId}`;
            const productKey = `${productId}`;

            const existingItem = await redis.hGet(cartKey, productKey);

            if (!existingItem) {
                throw new Error('Item not found in cart');
            }

            const item = JSON.parse(existingItem);

            if (quantity === null || quantity >= item.quantity) {
                await redis.hDel(cartKey, productKey);
                return { message: 'Item removed completely from cart' };
            } else {
                item.quantity -= quantity;
                await redis.hSet(cartKey, productKey, JSON.stringify(item));
                return item;
            }
        } catch (error) {
            console.error('Error removing from cart:', error);

            if (error.message.includes('Redis connection')) {
                throw new Error('Cart service temporarily unavailable. Please try again later.');
            }

            throw error;
        }
    }

    async clearCart(userId) {
        try {
            const redis = await this.getRedisClient();
            const cartKey = `cart:${userId}`;
            await redis.del(cartKey);
            return { message: 'Cart cleared successfully' };
        } catch (error) {
            console.error('Error clearing cart:', error);

            if (error.message.includes('Redis connection')) {
                throw new Error('Cart service temporarily unavailable. Please try again later.');
            }

            throw error;
        }
    }
}

module.exports = new CartService();
