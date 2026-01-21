

import { getDBConnection } from '../db/db.js'

export async function viewAllProducts() {
  const db = await getDBConnection()

  // const tableName = 'products'
  // const tableName = 'users'
  const tableName = 'cart_items'

  try {
    const abductions = await db.query(`SELECT * FROM ${tableName}`)
    console.table(abductions)

  } catch (error) {
    console.log('Error fetching products:', error.message)
  } 
}
viewAllProducts()