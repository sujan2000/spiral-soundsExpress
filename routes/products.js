import express from 'express';
import { supabase } from '../db/db.js';

const productsRouter = express.Router();

// Get all products
productsRouter.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching products:', err.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
productsRouter.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(req.params.id))
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Error fetching product:', err.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export { productsRouter };