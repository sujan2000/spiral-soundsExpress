import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { productsRouter } from '../routes/products.js';
import { authRouter } from '../routes/auth.js';
import { meRouter } from '../routes/me.js';
import { cartRouter } from '../routes/cart.js';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const secret = process.env.SPIRAL_SESSION_SECRET;

// --- Path resolution for Vercel / ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

// --- Security middleware ---
app.use(helmet());
app.use(hpp());

// --- Proxy trust (bounded, safe) ---
app.set('trust proxy', 1);

// --- Rate limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) =>
    req.method === 'GET' &&
    /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i.test(req.path),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

// --- Core middleware ---
app.use(express.json({ limit: '10kb' }));
app.use(limiter);
app.use(cookieParser(secret));

app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// --- Static frontend (FIXED absolute path) ---
app.use(express.static(publicDir));

// --- API routes ---
app.use('/api/products', productsRouter);
app.use('/api/auth/me', meRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);

// --- Backend-only aliases (NO frontend changes) ---
app.use('/products', productsRouter);
app.use('/auth/me', meRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);

// --- SPA fallback (must be LAST) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// --- Global error handler (diagnostics) ---
app.use((err, req, res, next) => {
  console.error('UNHANDLED ERROR:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
