import express from 'express';
import { getGenres, getProducts, validateProductQuery } from '../controllers/productsController.js';

const productsRouter = express.Router();

// Get all genres first (must be before :id route)
productsRouter.get('/genres', getGenres);

// Get all products with filters
productsRouter.get('/', validateProductQuery, getProducts);

export { productsRouter };