import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Dashboard() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const headers = { 'Content-Type':'application/json', Authorization:`Bearer ${getToken()}` };
  useEffect(()=>{ fetchPages(); },[]);
  const fetchPages = async () => {
    try { const res = await fetch('/api/pages-list',{headers}); const data = await res.json(); setPages(Array.isArray(data)?data:[]); }
    finally { setLoading(false); }
  };
  const createPage = async (e) => {
    e.preventDefault(); if(!newTitle.trim()) return; setCreating(true);
    try {
      const res = await fetch('/api/pages-create',{method:'POST',headers,body:JSON.stringify({title:newTitle})});
      const page = await res.json(); setShowModal(false); setNewTitle(''); navigate(`/app/edit/${page.id}`);
    } finally { setCreating(false); }
  };
  const duplicatePage = async (id) => { await fetch(`/api/pages-duplicate/${id}/duplicate`,{method:'POST',headers}); fetchPages(); };
  const togglePublish = async (page) => {
    const action = page.status==='published'?'unpublish':'publish';
    await fetch(`/api/pages-publish/${page.id}/${action}`,{method:'POST',headers}); fetchPages();
  };
  return (
    <div style={{minHeight:'100vh',background:'#f8f7ff'}}>
      <header style={{background:'#fff',borderBottom:'1px solid #eee',padding:'1rem 0'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
          <Link to="/" style={{fontSize:'1.5rem',fontWeight:900,textDecoration:'none',color:'#111'}}>Vibe<span style={{color:'#7c3aed'}}>Kit</span></Link>
          <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
            <span style={{color:'#666',fontSize:'.9rem'}}>{user?.email}</span>
            <button className="btn btn-ghost" onClick={logout} style={{fontSize:'.9rem'}}>Log out</button>
          </div>
        </div>
      </header>
      <main className="container" style={{padding:'2rem 1.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
          <div><h1 style={{fontSize:'1.75rem',fontWeight:800}}>My Pages</h1><p style={{color:'#666'}}>Build and publish your mini-sites</p></div>
          <button className="btn btn-primary" onClick={()=>setShowModal(true)} style={{background:'#7c3aed',borderColor:'#7c3aed',color:'#fff'}}>+ New Page</button>
        </div>
        {loading ? (
          <div className="grid-3">{[1,2,3].map(i=><div key={i} className="skeleton" style={{height:'160px',borderRadius:'12px'}}/>)}</div>
        ) : pages.length===0 ? (
          <div style={{textAlign:'center',padding:'4rem',background:'#fff',borderRadius:'16px',border:'2px dashed #ddd'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>✨</div>
            <h3 style={{fontWeight:700,marginBottom:'.5rem'}}>No pages yet</h3>
            <p style={{color:'#666',marginBottom:'1.5rem'}}>Create your first mini-site</p>
            <button className="btn btn-primary" onClick={()=>setShowModal(true)} style={{background:'#7c3aed',borderColor:'#7c3aed',color:'#fff'}}>Create your first page</button>
          </div>
        ) : (
          <div className="grid-3">
            {pages.map(page=>(
              <div key={page.id} className="card" style={{background:'#fff',borderRadius:'12px',border:'1px solid #eee',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'.75rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <h3 style={{fontWeight:700,fontSize:'1.05rem'}}>{page.title}</h3>
                  <span style={{fontSize:'.75rem',padding:'.2rem .6rem',borderRadius:'999px',background:page.status==='published'?'#d1fae5':'#f3f4f6',color:page.status==='published'?'#065f46':'#6b7280',fontWeight:600}}>{page.status}</span>
                </div>
                <div style={{fontSize:'.85rem',color:'#999'}}>/{page.slug} · {page.view_count||0} views</div>
                <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap',marginTop:'auto'}}>
                  <Link to={`/app/edit/${page.id}`} className="btn btn-primary" style={{background:'#7c3aed',borderColor:'#7c3aed',color:'#fff',fontSize:'.85rem',padding:'.5rem 1rem',flex:1,justifyContent:'center'}}>Edit</Link>
                  <button className="btn btn-outline" onClick={()=>togglePublish(page)} style={{fontSize:'.85rem',padding:'.5rem 1rem',color:'#7c3aed',borderColor:'#7c3aed'}}>{page.status==='published'?'Unpublish':'Publish'}</button>
                  {page.status==='published'&&<a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{fontSize:'.85rem',padding:'.5rem 1rem'}}>↗</a>}
                  <button className="btn btn-ghost" onClick={()=>duplicatePage(page.id)} style={{fontSize:'.85rem',padding:'.5rem 1rem'}} title="Duplicate">⧉</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {showModal&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'1rem'}}>
          <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',width:'100%',maxWidth:'440px',boxShadow:'0 20px 60px rgba(0,0,0,0.2)'}}>
            <h2 style={{fontWeight:800,marginBottom:'1.5rem'}}>Create new page</h2>
            <form onSubmit={createPage} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <input className="input" placeholder="Page title..." value={newTitle} onChange={e=>setNewTitle(e.target.value)} required style={{border:'2px solid #eee'}} autoFocus/>
              <div style={{display:'flex',gap:'.75rem'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShowModal(false)} style={{flex:1}}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating} style={{background:'#7c3aed',borderColor:'#7c3aed',color:'#fff',flex:1}}>{creating?'Creating...':'Create Page'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}