/**
 * Run: node scripts/seed-editor-credentials.js [password]
 * Default password: globalist2024
 * Copy the printed SQL into Supabase SQL Editor and run it to create the editor login row.
 */
const { hashSync } = require('bcryptjs');
const password = process.argv[2] || 'globalist2024';
const username = 'editor';
const password_hash = hashSync(password, 10);
// Escape single quotes for SQL
const hashEscaped = password_hash.replace(/'/g, "''");
console.log('-- Run this in Supabase SQL Editor (after creating editor_credentials table):');
console.log(`INSERT INTO public.editor_credentials (username, password_hash)`);
console.log(`VALUES ('${username}', '${hashEscaped}')`);
console.log(`ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now();`);
console.log('-- Then log in with username: editor, password:', password);
