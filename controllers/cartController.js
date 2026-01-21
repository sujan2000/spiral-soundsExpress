import { getDBConnection } from '../db/db.js'

/* ADD TO CART */
export async function addToCart(req, res) {
 const db = await getDBConnection()

 const productId = parseInt(req.body.productId, 10)

 if (isNaN(productId)) {
  return res.status(400).json({ error: 'Invalid product ID'})
 }

 const userId = req.session.userId

 const existing = await db.query('SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', [userId, productId])

 if (existing) {
  await db.query('UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?', [existing.id])
 } else {
  await db.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, 1)', [userId, productId])
 }

 res.json({ message: 'Added to cart' })

}


/* GET CART COUNT */
export async function getCartCount(req, res) {
  const db = await getDBConnection()

  const result = await db.query(`SELECT SUM(quantity) AS totalItems FROM cart_items WHERE user_id = $1`, [req.session.userId])

  res.json({ totalItems: result.totalItems || 0 })
}  



/* GET ALL */
export async function getAll(req, res) {

  const db = await getDBConnection()

  const items = await db.query(`SELECT ci.id AS cartItemId, ci.quantity, p.title, p.artist, p.price FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.user_id = $1`, [req.session.userId]) 

  res.json({ items: items})
}  


/* DELETE ITEM */
export async function deleteItem(req, res) {

    const db = await getDBConnection()

    const itemId = parseInt(req.params.itemId, 10)

    if (isNaN(itemId)) {
      return res.status(400).json({error: 'Invalid item ID'})
    }

    const item = await db.query('SELECT quantity FROM cart_items WHERE id = $1 AND user_id = $2', [itemId, req.session.userId])

    if (!item) {
      return res.status(400).json({error: 'Item not found'})
    }

    await db.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [itemId, req.session.userId])

    res.status(204).send()
  
}


/* DELETE ALL */
export async function deleteAll(req, res) {

  const db = await getDBConnection()

  await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.session.userId])

  res.status(204).send()
  
}

