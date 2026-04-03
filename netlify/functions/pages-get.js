const { supabase } = require('./db');
const { verifyToken } = require('./auth-helper');
exports.handler = async (event) => {
  const user = verifyToken(event);
  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  const id = event.path.split('/').pop();
  const { data, error } = await supabase.from('pages').select('*').eq('id', id).eq('user_id', user.userId).single();
  if (error || !data) return { statusCode: 404, body: JSON.stringify({ error: 'Page not found' }) };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
};