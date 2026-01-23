import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import cookieParser from 'cookie-parser';

import { productsRouter } from './routes/products.js'
import { authRouter } from './routes/auth.js'
import { meRouter } from './routes/me.js'
import { cartRouter } from './routes/cart.js'
import dotenv from "dotenv";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 8000
const secret = process.env.SPIRAL_SESSION_SECRET

// Security Middleware
app.use(helmet()) // Secure HTTP headers
app.use(hpp()) // Protect against HTTP Parameter Pollution

// Rate Limiting - Prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for static files
    return req.method === 'GET' && /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i.test(req.path);
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit auth attempts to 5 per 15 minutes
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
})

app.use(express.json({ limit: '10kb' })) // Limit payload size to prevent large attacks

app.use(limiter) // Apply rate limiting (but skip static files)

app.use(cookieParser(secret)); // Use secret for signed cookies

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


app.use('/api/products', productsRouter)

app.use('/api/auth/me', meRouter)

app.use('/api/auth', authRouter)

app.use('/api/cart', cartRouter)

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`)
}).on('error', (err) => {
  console.error('❌ Failed to start server:', err.message)
})