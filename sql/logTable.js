import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Log table data
 * @param {'products'|'users'|'cart_items'} tableName
 */
export async function logTable(tableName) {
  try {
    let data, error;

    if (tableName === 'cart_items') {
      // Include related user and product info
      ({ data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          created_at,
          users(id, username, email),
          products(id, title, artist, price)
        `));
    } else {
      // For products or users
      ({ data, error } = await supabase
        .from(tableName)
        .select('*'));
    }

    if (error) {
      console.error(`❌ Error fetching ${tableName}:`, error.message);
      return;
    }

    console.log(`\n📋 ${tableName.toUpperCase()} table data:`)
    console.table(data);

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

// Change table name to log
logTable('products'); // 'users' | 'cart_items'
