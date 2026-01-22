import { supabase } from '../db/db.js';

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

    console.log(`\n📋 ${tableName.toUpperCase()} table data (${data.length} records):`)
    console.table(data);

    // Additional info for products
    if (tableName === 'products') {
      const genres = [...new Set(data.map(p => p.genre).filter(Boolean))];
      console.log(`\n🎵 Unique Genres Found: ${genres.length}`);
      console.log(genres);
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

// Change table name to log
logTable('products'); // 'users' | 'cart_items'
