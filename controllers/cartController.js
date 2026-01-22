import { supabase } from '../db/db.js';

const getUserId = (req) => req.user?.id;

export async function addToCart(req, res) {
  try {
    const productId = parseInt(req.body.productId, 10);

    if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product ID' });

    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (existing && existing.length > 0) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing[0].quantity + 1 })
        .eq('user_id', userId)
        .eq('product_id', productId);
    } else {
      await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);
    }

    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error('Error adding to cart:', err.message);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
}

export async function getCartCount(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId);

    const totalItems = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    res.json({ totalItems });
  } catch (err) {
    console.error('Error getting cart count:', err.message);
    res.status(500).json({ error: 'Failed to get cart count' });
  }
}

export async function getAll(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const { data } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (title, artist, price)
      `)
      .eq('user_id', userId);

    res.json({ items: data || [] });
  } catch (err) {
    console.error('Error getting cart:', err.message);
    res.status(500).json({ error: 'Failed to get cart' });
  }
}

export async function deleteItem(req, res) {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const userId = getUserId(req);

    if (isNaN(itemId)) return res.status(400).json({ error: 'Invalid item ID' });
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).json({ error: 'Failed to delete item' });
  }
}

export async function deleteAll(req, res) {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    res.status(204).send();
  } catch (err) {
    console.error('Error clearing cart:', err.message);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}
