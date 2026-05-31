import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Missing SUPABASE_URL or SUPABASE_KEY/VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  process.exit(1);
}

const sqlPath = path.join(__dirname, 'cleanup-and-setup.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

async function runSQL() {
  console.log('⏳ Connecting to Supabase and executing cleanup/schema migration...');
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error executing SQL on Supabase:', error);
      return;
    }

    console.log('✅ Success! Database successfully truncated and schema updated with the "division" column on all tables.');
  } catch (err) {
    console.error('❌ Fetch error (verify your internet connection and .env credentials):', err.message);
  }
}

runSQL();
