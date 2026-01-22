import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.SUPABASE_DB_USER || 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  host: process.env.SUPABASE_DB_HOST,
  port: process.env.SUPABASE_DB_PORT || 5432,
  database: process.env.SUPABASE_DB_NAME || 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function createSessionTable() {
  try {
    console.log('🔧 Creating session table...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS session (
        sid varchar NOT NULL COLLATE "default",
        sess json NOT NULL,
        expire timestamp(6) NOT NULL
      )
      WITH (OIDS=FALSE);

      ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;

      CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);
    `);

    console.log('✅ Session table created successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating session table:', err.message);
    process.exit(1);
  }
}

createSessionTable();
