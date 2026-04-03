const { supabase } = require('./db');
const { verifyToken } = require('./auth-helper');
exports.handler = async (event) => {
  if (event.httpMethod !== 'PUT') return { statusCode: 405, body: 'Method Not Allowed' };
  const user = verifyToken(event);
  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  try {
    const id = event.path.split('/').pop();
    const updates = JSON.parse(event.body);
    const allowed = ['title','sections','theme'];
    const filtered = Object.fromEntries(Object.entries(updates).filter(([k])=>allowed.includes(k)));
    const { data, error } = await supabase.from('pages').update(filtered).eq('id', id).eq('user_id', user.userId).select().single();
    if (error) throw error;
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  } catch (err) { return { statusCode: 500, body: JSON.stringify({ error: err.message }) }; }
};