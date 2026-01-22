import { supabase } from '../db/db.js';

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
  try {
    const { genre, search } = req.query;

    let query = supabase.from('products').select('*');

    if (genre) {
      query = query.eq('genre', genre);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,artist.ilike.%${search}%,genre.ilike.%${search}%`
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
