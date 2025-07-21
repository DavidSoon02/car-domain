require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const redisClient = require('./config/redis');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));
app.use(express.json());

app.use('/api/cart', cartRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'cart-view-service' });
});

const startServer = async () => {
    try {
        await redisClient.connect();

        app.listen(PORT, () => {
            console.log(`View service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
