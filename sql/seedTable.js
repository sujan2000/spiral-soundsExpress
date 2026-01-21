
import { getDBConnection } from '../db/db.js'
import { vinyl } from '../data.js'

export async function seedTable() {
    const db = await getDBConnection();

    try {
        // Start a transaction
        await db.query('BEGIN');

        for (const { title, artist, price, image, year, genre, stock } of vinyl) {
            await db.query(
                `
        INSERT INTO products (title, artist, price, image, year, genre, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (title, artist) DO NOTHING
        `,
                [title, artist, price, image, year, genre, stock]
            );
        }

        // Commit transaction
        await db.query('COMMIT');
        console.log('All records inserted successfully');

    } catch (error) {
        await db.query('ROLLBACK');
        console.log('Error inserting data:', error.message);
    }
}
seedTable()