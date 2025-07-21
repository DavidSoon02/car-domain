const redisClient = require('../config/redis');

class CartService {
    constructor() {
        this.redis = redisClient.getClient();
    }

    async removeFromCart(userId, productId, quantity = null) {
        const cartKey = `cart:${userId}`;
        const productKey = `${productId}`;

        const existingItem = await this.redis.hGet(cartKey, productKey);

        if (!existingItem) {
            throw new Error('Item not found in cart');
        }

        const item = JSON.parse(existingItem);

        if (quantity === null || quantity >= item.quantity) {
            await this.redis.hDel(cartKey, productKey);
            return { message: 'Item removed completely from cart' };
        } else {
            item.quantity -= quantity;
            await this.redis.hSet(cartKey, productKey, JSON.stringify(item));
            return item;
        }
    }

    async clearCart(userId) {
        const cartKey = `cart:${userId}`;
        await this.redis.del(cartKey);
        return { message: 'Cart cleared successfully' };
    }
}

module.exports = new CartService();
