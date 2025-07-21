const express = require('express');
const cartService = require('../services/cartService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { productId, quantity, productName, price } = req.body;
        const userId = req.user.id;

        if (!productId || !quantity || !productName || !price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const item = await cartService.addToCart(userId, productId, quantity, productName, price);

        res.status(200).json({
            message: 'Item added to cart successfully',
            item
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
