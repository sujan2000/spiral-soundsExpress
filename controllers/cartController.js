import { supabase } from '../db/db.js';
import { body, param, validationResult } from 'express-validator';

// Validation middleware
export const validateAddToCart = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer'),
];

export const validateDeleteItem = [
  param('itemId')
    .isUUID()
    .withMessage('Item ID must be a valid UUID'),
];

const getUserId = (req) => req.user?.id;

export async function addToCart(req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const productId = parseInt(req.body.productId, 10);
    const userId = getUserId(req);
    
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    // Check if item already in cart
    const { data: existing, error: fetchError } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existing) {
      // Update quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (updateError) throw updateError;
    } else {
      // Insert new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);
      
      if (insertError) throw insertError;
    }

    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error('Error adding to cart:', err.message);
    res.status(500).json({ error: 'Failed to add to cart', details: err.message });
  }
}

export async function getCartCount(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId);

    if (error) throw error;

    const totalItems = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    res.json({ totalItems });
  } catch (err) {
    console.error('Error getting cart count:', err.message);
    res.status(500).json({ error: 'Failed to get cart count', details: err.message });
  }
}

export async function getAll(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (id, title, artist, price, image)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ items: data || [] });
  } catch (err) {
    console.error('Error getting cart:', err.message);
    res.status(500).json({ error: 'Failed to get cart', details: err.message });
  }
}

export async function deleteItem(req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const itemId = req.params.itemId; // Keep as UUID string, don't parse as int
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).json({ error: 'Failed to delete item', details: err.message });
  }
}

export async function deleteAll(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

    res.status(204).send();
  } catch (err) {
    console.error('Error clearing cart:', err.message);
    res.status(500).json({ error: 'Failed to clear cart', details: err.message });
  }
}
