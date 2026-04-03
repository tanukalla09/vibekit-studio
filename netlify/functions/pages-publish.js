const { supabase } = require('./db');
const { verifyToken } = require('./auth-helper');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const user = verifyToken(event);
  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  const parts = event.path.split('/');
  const action = parts.pop();
  const id = parts.pop();
  const status = action === 'publish' ? 'published' : 'draft';
  const { data, error } = await supabase.from('pages').update({ status }).eq('id', id).eq('user_id', user.userId).select().single();
  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
};