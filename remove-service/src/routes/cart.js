const express = require('express');
const cartService = require('../services/cartService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.delete('/remove', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const result = await cartService.removeFromCart(userId, productId, quantity);

        res.status(200).json({
            message: 'Item processed successfully',
            result
        });
    } catch (error) {
        if (error.message === 'Item not found in cart') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/clear', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await cartService.clearCart(userId);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
