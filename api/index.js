import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { productsRouter } from '../routes/products.js';
import { authRouter } from '../routes/auth.js';
import { meRouter } from '../routes/me.js';
import { cartRouter } from '../routes/cart.js';

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

















2026-01-23 12:26:18.081 [error] Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/var/task/api/routes/products.js' imported from /var/task/api/index.js
    at finalizeResolution (node:internal/modules/esm/resolve:280:11)
    at moduleResolve (node:internal/modules/esm/resolve:870:10)
    at moduleResolveWithNodePath (node:internal/modules/esm/resolve:996:14)
    at defaultResolve (node:internal/modules/esm/resolve:1039:79)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:757:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:734:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:317:38)
    at #link (node:internal/modules/esm/module_job:208:49)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///var/task/api/routes/products.js'
}
Node.js process exited with exit status: 1. The logs above can help with debugging the issue.