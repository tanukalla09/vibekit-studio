const { supabase } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { email, password } = JSON.parse(event.body);
    if (!email || !password || password.length < 6) return { statusCode: 400, body: JSON.stringify({ error: 'Valid email and password (min 6 chars) required' }) };
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing) return { statusCode: 400, body: JSON.stringify({ error: 'Email already registered' }) };
    const password_hash = await bcrypt.hash(password, 10);
    const { data: user, error } = await supabase.from('users').insert({ email, password_hash }).select('id,email,created_at').single();
    if (error) throw error;
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user, token }) };
  } catch (err) { return { statusCode: 500, body: JSON.stringify({ error: err.message }) }; }
};