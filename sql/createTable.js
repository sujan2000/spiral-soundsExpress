import { getDBConnection } from "../db/db.js";

async function createTable() {
  const db = await getDBConnection();

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        price REAL NOT NULL,
        image TEXT NOT NULL,
        year INTEGER,
        genre TEXT,
        stock INTEGER,
        UNIQUE(title, artist, year)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(user_id, product_id)
      )
    `);

    console.log('✅ Tables created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    process.exit(1);
  }
}

createTable();