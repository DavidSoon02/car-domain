const express = require('express');
const cartService = require('../services/cartService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`Getting cart for user: ${userId}`);

        const cart = await cartService.getCart(userId);

        res.status(200).json({
            success: true,
            message: 'Cart retrieved successfully',
            data: cart
        });
    } catch (error) {
        console.error('Error retrieving cart:', error);

        if (error.message.includes('Redis connection')) {
            return res.status(503).json({
                success: false,
                error: 'Cart service temporarily unavailable. Please try again later.',
                data: { items: [], total: 0, itemCount: 0 }
            });
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

router.get('/item/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const item = await cartService.getCartItem(userId, productId);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Item not found in cart'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cart item retrieved successfully',
            data: item
        });
    } catch (error) {
        console.error('Error retrieving cart item:', error);

        if (error.message.includes('Redis connection')) {
            return res.status(503).json({
                success: false,
                error: 'Cart service temporarily unavailable. Please try again later.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router;
