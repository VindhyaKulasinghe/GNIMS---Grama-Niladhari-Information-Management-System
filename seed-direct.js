import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// TO RUN THIS SCRIPT:
// 1. Get your connection string from Supabase (Settings -> Database)
// 2. Add DATABASE_URL to your .env file
//    Example: DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.jiocwleypxwtyezispaj.supabase.co:5432/postgres

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL is missing in .env file.');
  console.log('Please add: DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres');
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Supabase in many environments
  }
});

async function seed() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Reading sample_data.sql...');
    const sql = fs.readFileSync('./sample_data.sql', 'utf8');

    console.log('Executing SQL (this may take a few seconds)...');
    await client.query(sql);

    console.log('✅ Database seeded successfully with 20 records per table!');
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
    if (err.detail) console.error('Detail:', err.detail);
  } finally {
    await client.end();
  }
}

seed();
