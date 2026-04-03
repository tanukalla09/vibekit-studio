const { supabase } = require('./db');
const { verifyToken } = require('./auth-helper');
function slugify(t){ return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const user = verifyToken(event);
  if (!user) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  try {
    const { title, theme = 'minimal' } = JSON.parse(event.body);
    if (!title) return { statusCode: 400, body: JSON.stringify({ error: 'Title required' }) };
    let slug = slugify(title);
    const { data: existing } = await supabase.from('pages').select('slug').like('slug', `${slug}%`);
    if (existing?.length) slug = `${slug}-${existing.length + 1}`;
    const defaultSections = [
      { type:'hero', title:'Welcome to my page', subtitle:'Built with VibeKit Studio', buttonText:'Learn More', buttonUrl:'#' },
      { type:'features', items:[{title:'Fast',description:'Lightning quick performance'},{title:'Beautiful',description:'Stunning design out of the box'},{title:'Simple',description:'Easy to set up and customize'}] },
      { type:'gallery', images:['https://picsum.photos/400/300?random=1','https://picsum.photos/400/300?random=2','https://picsum.photos/400/300?random=3'] },
      { type:'contact' }
    ];
    const { data, error } = await supabase.from('pages').insert({ user_id: user.userId, title, slug, theme, sections: defaultSections }).select().single();
    if (error) throw error;
    return { statusCode: 201, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
  } catch (err) { return { statusCode: 500, body: JSON.stringify({ error: err.message }) }; }
};