const redisClient = require('../config/redis');

class CartService {
    constructor() {
        this.redis = redisClient.getClient();
    }

    async addToCart(userId, productId, quantity, productName, price) {
        const cartKey = `cart:${userId}`;
        const productKey = `${productId}`;

        const existingItem = await this.redis.hGet(cartKey, productKey);

        if (existingItem) {
            const item = JSON.parse(existingItem);
            item.quantity += quantity;
            await this.redis.hSet(cartKey, productKey, JSON.stringify(item));
            return item;
        } else {
            const newItem = {
                productId,
                productName,
                price,
                quantity
            };
            await this.redis.hSet(cartKey, productKey, JSON.stringify(newItem));
            return newItem;
        }
    }
}

module.exports = new CartService();
