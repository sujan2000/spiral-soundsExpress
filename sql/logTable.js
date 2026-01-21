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

import { getDBConnection } from '../db/db.js'

export async function viewAllProducts() {
  const db = await getDBConnection()

  // const tableName = 'products'
  // const tableName = 'users'
  const tableName = 'cart_items'

  try {
    const abductions = await db.all(`SELECT * FROM ${tableName}`)
    console.table(abductions)

  } catch (error) {
    console.log('Error fetching products:', error.message)
  } finally {
    await db.close()
  }
}
viewAllProducts()