import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/products/genres
export async function getGenres(req, res) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('genre');

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch genres' });
    }

    // Remove duplicates & nulls
    const genres = [...new Set(data.map(g => g.genre).filter(Boolean))];

    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch genres', details: err.message });
  }
}

// GET /api/products?genre=&search=
export async function getProducts(req, res) {
  try {
    const { genre, search } = req.query;

    let query = supabase.from('products').select('*');

    if (genre) {
      query = query.eq('genre', genre);
    }

    if (search) {
      const searchPattern = `%${search}%`;
      query = query.or(
        `title.ilike.${searchPattern},artist.ilike.${searchPattern},genre.ilike.${searchPattern}`
      );
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
}
