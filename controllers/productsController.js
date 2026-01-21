import { getDBConnection } from '../db/db.js'

export async function getGenres(req, res) {

  try {

    const db = await getDBConnection()
    const genreRows = await db.query('SELECT DISTINCT genre FROM products')
    const genres = genreRows.map(row => row.genre)
    res.json(genres)

  } catch (err) {

    res.status(500).json({ error: 'Failed to fetch genres', details: err.message })

  }
}

export async function getProducts(req, res) {
  try {
    const db = await getDBConnection();

    let query = 'SELECT * FROM products';
    const params = [];

    const { genre, search } = req.query;

    if (genre) {
      query += ' WHERE genre = $1';
      params.push(genre);

    } else if (search) {
      query += `
        WHERE title ILIKE $1
        OR artist ILIKE $2
        OR genre ILIKE $3
      `;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const { rows: products } = await db.query(query, params);

    res.json(products);

  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch products',
      details: err.message
    });
  }
}
