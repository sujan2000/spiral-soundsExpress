/* import { getDBConnection } from './db/db.js'

async function logTable() {
  const db = await getDBConnection()

  const tableName = 'cart_items'
  // const tableName = 'products'
  // const tableName = 'users'

  try {
    const table = await db.all(`SELECT * FROM ${tableName}`)
    console.table(table)

  } catch (err) {

    console.error('Error fetching table:', err.message)

  } finally {

    await db.close()

  }
}

logTable() */

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

export async function viewAllProducts() {
  const db = await open({
    filename: path.join('database.db'),
    driver: sqlite3.Database
  })

  try {
    const abductions = await db.all('SELECT * FROM products')
    console.table(abductions)

  } catch (error) {
    console.log('Error fetching products:', error.message)
  } finally {
    await db.close()
  }
}
viewAllProducts()