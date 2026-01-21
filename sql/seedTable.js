
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import { vinyl } from '../data.js'

export async function seedTable() {

    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    try {

        await db.exec("BEGIN TRANSACTION")

        for (const { title, artist, price, image, year, genre, stock } of vinyl) {
            await db.run(`
        INSERT OR IGNORE INTO products (title, artist, price, image, year, genre, stock )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [title, artist, price, image, year, genre, stock]
            )
        }

        await db.exec("COMMIT TRANSACTION")
        console.log('All records inserted successfully')

    } catch (error) {
        await db.exec('ROLLBACK')
        console.log('Error inserting data:', error.message)
    } finally {
        await db.close()
        console.log('Database connection close')
    }
}
seedTable()