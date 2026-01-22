import { supabase } from '../db/db.js';

async function fixCartTable() {
  try {
    console.log('🔧 Checking cart_items table schema...\n');

    console.log(`
    ⚠️  IMPORTANT: Please run this SQL in your Supabase SQL Editor to fix the cart_items table:

    -- Drop existing cart_items table
    DROP TABLE IF EXISTS public.cart_items CASCADE;

    -- Recreate cart_items with correct schema
    CREATE TABLE public.cart_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      product_id bigint NOT NULL,
      quantity integer NOT NULL DEFAULT 1,
      created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
      CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
      CONSTRAINT cart_items_unique_user_product UNIQUE(user_id, product_id)
    );

    -- Enable RLS
    ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    CREATE POLICY "Users can view their own cart items" ON public.cart_items
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own cart items" ON public.cart_items
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own cart items" ON public.cart_items
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own cart items" ON public.cart_items
      FOR DELETE USING (auth.uid() = user_id);
    `);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixCartTable();
