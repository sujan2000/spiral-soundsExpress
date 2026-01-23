import express from 'express'
import {
  addToCart,
  getCartCount,
  getAll,
  deleteItem,
  deleteAll,
  validateAddToCart,
  validateDeleteItem
} from '../controllers/cartController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const cartRouter = express.Router()

cartRouter.post('/add', requireAuth, validateAddToCart, addToCart)
cartRouter.get('/cart-count', requireAuth, getCartCount)
cartRouter.get('/', requireAuth, getAll)
cartRouter.delete('/all', requireAuth, deleteAll)
cartRouter.delete('/:itemId', requireAuth, validateDeleteItem, deleteItem)

export { cartRouter }