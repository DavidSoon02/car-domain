const redisClient = require('../config/redis');

class CartService {
    constructor() {
        this.redis = redisClient.getClient();
    }

    async getCart(userId) {
        const cartKey = `cart:${userId}`;
        const cartData = await this.redis.hGetAll(cartKey);

        if (!cartData || Object.keys(cartData).length === 0) {
            return { items: [], total: 0, itemCount: 0 };
        }

        const items = Object.keys(cartData).map(productId => {
            return JSON.parse(cartData[productId]);
        });

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
            items,
            total: parseFloat(total.toFixed(2)),
            itemCount
        };
    }

    async getCartItem(userId, productId) {
        const cartKey = `cart:${userId}`;
        const productKey = `${productId}`;

        const itemData = await this.redis.hGet(cartKey, productKey);

        if (!itemData) {
            return null;
        }

        return JSON.parse(itemData);
    }
}

module.exports = new CartService();
