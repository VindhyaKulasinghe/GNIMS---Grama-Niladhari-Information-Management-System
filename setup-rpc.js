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
  console.error('Missing SUPABASE_URL or SUPABASE_KEY in .env');
  process.exit(1);
}

const sqlPath = path.join(__dirname, 'create_user_rpc.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

async function runSQL() {
  console.log('Deploying Create User RPC...');
  try {
    // Note: This relies on the "execute_sql" RPC being present in the project.
    // Most Supabase local/development setups add this or allow direct SQL via REST.
    // If "execute_sql" doesn't exist, we might need another way.
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
      console.error('Error deploying RPC:', error);
      
      if (error.includes('function "execute_sql" does not exist')) {
          console.log('\n⚠️  The "execute_sql" RPC is not installed in your Supabase project.');
          console.log('Please copy the content of "create_user_rpc.sql" and run it manually in the Supabase SQL Editor.');
      }
      return;
    }

    console.log('✅ RPC deployed successfully!');
  } catch (err) {
    console.error('Deployment error:', err.message);
  }
}

runSQL();
