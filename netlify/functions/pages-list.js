const { supabase } = require('./db');
const { verifyToken } = require('./auth-helper');
exports.handler = async (event) => {
  const user = verifyToken(event);
  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  const { data, error } = await supabase.from('pages').select('id,title,slug,status,theme,view_count,created_at,updated_at').eq('user_id', user.userId).order('updated_at', { ascending: false });
  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
};