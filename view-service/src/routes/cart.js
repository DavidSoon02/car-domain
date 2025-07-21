const express = require('express');
const cartService = require('../services/cartService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);

        res.status(200).json({
            message: 'Cart retrieved successfully',
            cart
        });
    } catch (error) {
        console.error('Error retrieving cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/item/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const item = await cartService.getCartItem(userId, productId);

        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        res.status(200).json({
            message: 'Item retrieved successfully',
            item
        });
    } catch (error) {
        console.error('Error retrieving cart item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
