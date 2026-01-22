import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { vinyl } from '../data.js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function seedTable() {
    try {
        const records = vinyl.map(
            ({ title, artist, price, image, year, genre, stock }) => ({
                title,
                artist,
                price,
                image,
                year,
                genre,
                stock
            })
        );

        const { error } = await supabase
            .from('products')
            .upsert(records, {
                onConflict: 'title,artist,year',
                ignoreDuplicates: true
            });

        if (error) throw error;

        console.log('✅ All records inserted successfully');

    } catch (error) {
        console.error('❌ Error inserting data:', error.message);
    }
}

seedTable();
