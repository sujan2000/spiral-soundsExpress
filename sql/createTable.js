import { supabase } from "../db/db.js";

async function createTable() {
  try {
    // Create products table
    await supabase.from('products').select('*').limit(1);

    // Create users table
    await supabase.from('users').select('*').limit(1);

    // Create cart_items table
    await supabase.from('cart_items').select('*').limit(1);

    console.log('✅ Tables created successfully (or already exist)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error verifying tables:', err.message);
    console.log('ℹ️  Please create tables manually in Supabase SQL editor:');
    console.log(`
    CREATE TABLE IF NOT EXISTS products (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      year INTEGER,
      genre TEXT,
      stock INTEGER,
      UNIQUE(title, artist, year)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id BIGINT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE(user_id, product_id)
    );
    `);
    process.exit(1);
  }
}

createTable();