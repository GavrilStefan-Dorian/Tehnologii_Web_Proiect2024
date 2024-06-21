const postgres = require('postgres');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres.eimencynxqytlsaudkng:proiectcafeQ!1@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';
const db = postgres(connectionString);

module.exports = db;
