import { supabase } from '../db/db.js';
import { query, validationResult } from 'express-validator';
import xss from 'xss';

// Validation middleware for products
export const validateProductQuery = [
  query('genre').optional().trim().isLength({ max: 50 }).withMessage('Genre must be less than 50 characters'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search must be less than 100 characters'),
];

const sanitizeInput = (str) => xss(str, { whiteList: {}, stripIgnoredTag: true });

// GET /api/products/genres
export async function getGenres(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('genre');

    if (error) throw error;

    // Remove duplicates & nulls
    const genres = [...new Set(data.map(g => g.genre).filter(Boolean))];

    res.json(genres);
  } catch (err) {
    console.error('Error fetching genres:', err.message);
    res.status(500).json({ error: 'Failed to fetch genres', details: err.message });
  }
}

// GET /api/products?genre=&search=
export async function getProducts(req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    let { genre, search } = req.query;

    // Sanitize inputs to prevent XSS and injection
    if (genre) genre = sanitizeInput(genre).trim();
    if (search) search = sanitizeInput(search).trim();

    let query = supabase.from('products').select('*');

    if (genre && genre.length > 0) {
      query = query.eq('genre', genre);
    }

    if (search && search.length > 0) {
      query = query.or(
        `title.ilike.%${search.replace(/'/g, "''")}%,artist.ilike.%${search.replace(/'/g, "''")}%,genre.ilike.%${search.replace(/'/g, "''")}%`
      );
    }

    const { data: products, error } = await query;

    if (error) throw error;

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
}
