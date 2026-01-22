import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { productsRouter } from './routes/products.js';
import { authRouter } from './routes/auth.js';
import { meRouter } from './routes/me.js';
import { cartRouter } from './routes/cart.js';

dotenv.config();

const app = express();
const secret = process.env.SPIRAL_SESSION_SECRET;

// middleware, routes, etc.
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser(secret));

// health check
app.get('/', (req, res) => {
  res.json({ message: 'API running 🚀' });
});

app.use('/api/products', productsRouter);
app.use('/api/auth/me', meRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);

export default app;
