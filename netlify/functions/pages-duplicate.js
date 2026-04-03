const { supabase } = require('./db');
const { verifyToken } = require('./auth-helper');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const user = verifyToken(event);
  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  const id = event.path.split('/').slice(-2)[0];
  const { data: original } = await supabase.from('pages').select('*').eq('id', id).eq('user_id', user.userId).single();
  if (!original) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  const newSlug = `${original.slug}-copy-${Date.now()}`;
  const { data, error } = await supabase.from('pages').insert({ user_id: user.userId, title: `${original.title} (Copy)`, slug: newSlug, theme: original.theme, sections: original.sections, status: 'draft' }).select().single();
  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
};