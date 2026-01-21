import 'dotenv/config'; // automatically loads .env
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  family: 4,
});

export async function getDBConnection() {
  return pool;
}


