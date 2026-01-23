import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import cookieParser from 'cookie-parser';

import { productsRouter } from '../routes/products.js';
import { authRouter } from '../routes/auth.js';
import { meRouter } from '../routes/me.js';
import { cartRouter } from '../routes/cart.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const secret = process.env.SPIRAL_SESSION_SECRET;

// middleware, routes, etc.
app.use(helmet());
app.use(hpp());

// Rate Limiting - Prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.method === 'GET' && /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i.test(req.path);
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
})

app.use(express.json({ limit: '10kb' }));

app.use(limiter)

app.use(cookieParser(secret));

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}))


app.use(express.static('public'))


app.use('/api/products', productsRouter);
app.use('/api/auth/me', meRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);

export default app;












