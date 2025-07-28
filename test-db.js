const { neon } = require('@neondatabase/serverless');

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

if (!process.env.DATABASE_URL) {
  console.log('No DATABASE_URL found');
  process.exit(1);
}

try {
  const sql = neon(process.env.DATABASE_URL);
  
  // Test basic connection
  sql`SELECT 1 as test`.then(result => {
    console.log('Database connection successful:', result);
    
    // Test if tables exist
    return sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
  }).then(tables => {
    console.log('Available tables:', tables.map(t => t.table_name));
  }).catch(error => {
    console.log('Database connection failed:', error.message);
  });
} catch (error) {
  console.log('Failed to initialize database connection:', error.message);
} 