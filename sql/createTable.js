

import { getDBConnection } from "../db/db.js";

async function createTable() {
    const db = await getDBConnection()

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
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT NOT NULL,
       username TEXT NOT NULL,
       password TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       UNIQUE(email, username)
        )
        `);

    await db.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL,
              product_id INTEGER NOT NULL,
              quantity INTEGER NOT NULL DEFAULT 1,
              FOREIGN KEY (user_id) REFERENCES users(id),
              FOREIGN KEY (product_id) REFERENCES products(id)
            )
            `);

    console.log('Table products, users and cart_items created with UNIQUE constraint');
}
createTable()