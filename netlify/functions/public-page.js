const { supabase } = require('./db');
exports.handler = async (event) => {
  const parts = event.path.split('/');
  const slug = parts[parts.indexOf('pages') + 1];
  const isView = parts.includes('view');
  const isContact = parts.includes('contact');
  if (isView && event.httpMethod === 'POST') {
    const { data: page } = await supabase.from('pages').select('view_count').eq('slug', slug).single();
    await supabase.from('pages').update({ view_count: (page?.view_count || 0) + 1 }).eq('slug', slug);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }
  if (isContact && event.httpMethod === 'POST') {
    const { name, email, message } = JSON.parse(event.body);
    if (!name || !email || !message) return { statusCode: 400, body: JSON.stringify({ error: 'All fields required' }) };
    await supabase.from('contact_submissions').insert({ page_slug: slug, name, email, message });
    return { statusCode: 201, body: JSON.stringify({ ok: true }) };
  }
  const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).eq('status', 'published').single();
  if (error || !data) return { statusCode: 404, body: JSON.stringify({ error: 'Page not found' }) };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
};