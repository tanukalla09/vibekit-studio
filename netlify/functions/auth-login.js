const { supabase } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { email, password } = JSON.parse(event.body);
    const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
    if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid email or password' }) };
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return { statusCode: 401, body: JSON.stringify({ error: 'Invalid email or password' }) };
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: { id: user.id, email: user.email }, token }) };
  } catch (err) { return { statusCode: 500, body: JSON.stringify({ error: err.message }) }; }
};