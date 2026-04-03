import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { themes } from '../themes';
const VIEWPORTS = { desktop:'100%', tablet:'768px', mobile:'375px' };
export default function Editor() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [page, setPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [viewport, setViewport] = useState('desktop');
  const [activeSection, setActiveSection] = useState(0);
  const headers = { 'Content-Type':'application/json', Authorization:`Bearer ${getToken()}` };
  useEffect(()=>{ fetch(`/api/pages-get/${id}`,{headers}).then(r=>r.json()).then(setPage); },[id]);
  const save = useCallback(async(data=page)=>{
    if(!data) return; setSaving(true);
    await fetch(`/api/pages-update/${data.id}`,{method:'PUT',headers,body:JSON.stringify({title:data.title,sections:data.sections,theme:data.theme})});
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false),2000);
  },[page]);
  useEffect(()=>{
    if(!page) return;
    const t = setTimeout(()=>save(page),1500);
    return ()=>clearTimeout(t);
  },[page?.sections,page?.theme,page?.title]);
  const togglePublish = async()=>{
    const action = page.status==='published'?'unpublish':'publish';
    const res = await fetch(`/api/pages-publish/${page.id}/${action}`,{method:'POST',headers});
    const updated = await res.json();
    setPage(p=>({...p,status:updated.status}));
  };
  const updateSection=(idx,updates)=>setPage(p=>{const s=[...p.sections];s[idx]={...s[idx],...updates};return{...p,sections:s}});
  const moveSection=(idx,dir)=>{
    setPage(p=>{const s=[...p.sections];const n=idx+dir;if(n<0||n>=s.length)return p;[s[idx],s[n]]=[s[n],s[idx]];return{...p,sections:s}});
    setActiveSection(idx+dir);
  };
  if(!page) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>Loading...</div>;
  const theme=themes[page.theme]||themes.minimal;
  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',background:'#f0f0f5'}}>
      <div style={{background:'#fff',borderBottom:'1px solid #eee',padding:'.75rem 1rem',display:'flex',alignItems:'center',gap:'1rem',flexWrap:'wrap'}}>
        <Link to="/app" style={{fontWeight:800,textDecoration:'none',color:'#111',fontSize:'1.2rem'}}>Vibe<span style={{color:'#7c3aed'}}>Kit</span></Link>
        <input value={page.title} onChange={e=>setPage(p=>({...p,title:e.target.value}))} style={{border:'none',borderBottom:'2px solid #eee',padding:'.25rem .5rem',fontWeight:600,fontSize:'1rem',flex:1,minWidth:'120px',background:'transparent'}}/>
        <div style={{display:'flex',border:'1px solid #eee',borderRadius:'8px',overflow:'hidden'}}>
          {Object.keys(VIEWPORTS).map(v=>(
            <button key={v} onClick={()=>setViewport(v)} style={{padding:'.4rem .75rem',border:'none',background:viewport===v?'#7c3aed':'#fff',color:viewport===v?'#fff':'#666',cursor:'pointer',fontSize:'.8rem',fontWeight:600,transition:'all .2s'}}>
              {v.charAt(0).toUpperCase()+v.slice(1)}
            </button>
          ))}
        </div>
        <span style={{fontSize:'.8rem',color:saved?'#10b981':'#999',fontWeight:600}}>{saving?'⟳ Saving...':saved?'✓ Saved':'Auto-save on'}</span>
        <button className="btn" onClick={togglePublish} style={{background:page.status==='published'?'#fee2e2':'#7c3aed',color:page.status==='published'?'#dc2626':'#fff',border:'none',fontSize:'.85rem',padding:'.5rem 1rem'}}>
          {page.status==='published'?'Unpublish':'🚀 Publish'}
        </button>
        {page.status==='published'&&<a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{fontSize:'.85rem',padding:'.5rem 1rem',color:'#7c3aed',borderColor:'#7c3aed'}}>↗ View Live</a>}
      </div>
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        <div style={{width:'300px',minWidth:'260px',background:'#fff',borderRight:'1px solid #eee',overflowY:'auto',padding:'1rem'}}>
          <div style={{marginBottom:'1.5rem'}}>
            <label style={{fontWeight:700,fontSize:'.85rem',display:'block',marginBottom:'.5rem'}}>🎨 Vibe Theme</label>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'.5rem'}}>
              {Object.entries(themes).map(([key,t])=>(
                <button key={key} onClick={()=>setPage(p=>({...p,theme:key}))} style={{padding:'.5rem',borderRadius:'8px',border:page.theme===key?'2px solid #7c3aed':'2px solid #eee',background:t.preview.bg,cursor:'pointer',display:'flex',flexDirection:'column',gap:'3px',alignItems:'center',transition:'all .15s'}}>
                  <div style={{width:'20px',height:'4px',background:t.preview.accent,borderRadius:'2px'}}/>
                  <div style={{fontSize:'.55rem',color:t.preview.text,fontWeight:600,textAlign:'center',lineHeight:1.2}}>{t.name.split('/')[0].trim()}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{fontWeight:700,fontSize:'.85rem',marginBottom:'.75rem'}}>📄 Sections</div>
          {page.sections.map((section,idx)=>(
            <div key={idx} style={{marginBottom:'.75rem',border:`2px solid ${activeSection===idx?'#7c3aed':'#eee'}`,borderRadius:'10px',overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',padding:'.6rem .75rem',background:activeSection===idx?'#f5f3ff':'#fafafa',cursor:'pointer'}} onClick={()=>setActiveSection(activeSection===idx?-1:idx)}>
                <span style={{flex:1,fontWeight:600,fontSize:'.85rem',textTransform:'capitalize'}}>
                  {section.type==='hero'?'🏠':section.type==='features'?'⭐':section.type==='gallery'?'🖼️':'📬'} {section.type}
                </span>
                <div style={{display:'flex',gap:'.25rem'}}>
                  <button onClick={e=>{e.stopPropagation();moveSection(idx,-1)}} style={{border:'none',background:'transparent',cursor:'pointer',padding:'2px 6px',color:'#999',fontSize:'.8rem'}}>↑</button>
                  <button onClick={e=>{e.stopPropagation();moveSection(idx,1)}} style={{border:'none',background:'transparent',cursor:'pointer',padding:'2px 6px',color:'#999',fontSize:'.8rem'}}>↓</button>
                  <span style={{color:'#999',fontSize:'.75rem'}}>{activeSection===idx?'▲':'▼'}</span>
                </div>
              </div>
              {activeSection===idx&&(
                <div style={{padding:'.75rem',display:'flex',flexDirection:'column',gap:'.5rem'}}>
                  <SectionEditor section={section} onChange={u=>updateSection(idx,u)}/>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'1.5rem',background:'#e8e8f0'}}>
          <div style={{width:VIEWPORTS[viewport],maxWidth:'100%',transition:'width .3s ease',background:'#fff',boxShadow:'0 4px 40px rgba(0,0,0,0.15)',borderRadius:viewport!=='desktop'?'16px':'8px',overflow:'hidden',minHeight:'600px'}}>
            <PagePreview page={page} theme={theme}/>
          </div>
        </div>
      </div>
    </div>
  );
}
function SectionEditor({section,onChange}){
  if(section.type==='hero') return(<>
    <input className="input" placeholder="Title" value={section.title||''} onChange={e=>onChange({title:e.target.value})} style={{border:'1px solid #eee',fontSize:'.85rem',padding:'.5rem'}}/>
    <input className="input" placeholder="Subtitle" value={section.subtitle||''} onChange={e=>onChange({subtitle:e.target.value})} style={{border:'1px solid #eee',fontSize:'.85rem',padding:'.5rem'}}/>
    <input className="input" placeholder="Button text" value={section.buttonText||''} onChange={e=>onChange({buttonText:e.target.value})} style={{border:'1px solid #eee',fontSize:'.85rem',padding:'.5rem'}}/>
    <input className="input" placeholder="Button URL" value={section.buttonUrl||''} onChange={e=>onChange({buttonUrl:e.target.value})} style={{border:'1px solid #eee',fontSize:'.85rem',padding:'.5rem'}}/>
  </>);
  if(section.type==='features') return(<>
    {(section.items||[]).map((item,i)=>(
      <div key={i} style={{border:'1px solid #f0f0f0',borderRadius:'6px',padding:'.5rem',display:'flex',flexDirection:'column',gap:'.35rem'}}>
        <input className="input" placeholder={`Feature ${i+1} title`} value={item.title||''} onChange={e=>{const items=[...section.items];items[i]={...items[i],title:e.target.value};onChange({items})}} style={{border:'1px solid #eee',fontSize:'.8rem',padding:'.4rem'}}/>
        <input className="input" placeholder="Description" value={item.description||''} onChange={e=>{const items=[...section.items];items[i]={...items[i],description:e.target.value};onChange({items})}} style={{border:'1px solid #eee',fontSize:'.8rem',padding:'.4rem'}}/>
      </div>
    ))}
  </>);
  if(section.type==='gallery') return(<>
    {(section.images||[]).map((url,i)=>(
      <input key={i} className="input" placeholder={`Image ${i+1} URL`} value={url} onChange={e=>{const images=[...section.images];images[i]=e.target.value;onChange({images})}} style={{border:'1px solid #eee',fontSize:'.8rem',padding:'.4rem'}}/>
    ))}
  </>);
  return <p style={{fontSize:'.8rem',color:'#999'}}>Contact form auto-generated ✓</p>;
}
function PagePreview({page,theme}){
  return(
    <div style={{background:theme.vars['--bg'],color:theme.vars['--text'],fontFamily:theme.vars['--font-body'],minHeight:'100%'}}>
      <style>{`:root{${Object.entries(theme.vars).map(([k,v])=>`${k}:${v}`).join(';')}}`}</style>
      {page.sections.map((s,i)=><SectionRenderer key={i} section={s} vars={theme.vars}/>)}
    </div>
  );
}
function SectionRenderer({section,vars}){
  const s=p=>vars[`--${p}`]||'';
  if(section.type==='hero') return(
    <section style={{background:s('bg'),color:s('text'),padding:'4rem 2rem',textAlign:'center'}}>
      <h1 style={{fontSize:'clamp(1.8rem,5vw,3.5rem)',fontWeight:900,marginBottom:'1rem',fontFamily:s('font-heading')}}>{section.title}</h1>
      <p style={{fontSize:'1.1rem',color:s('text-muted'),marginBottom:'2rem'}}>{section.subtitle}</p>
      {section.buttonText&&<a href={section.buttonUrl||'#'} style={{display:'inline-block',background:s('accent'),color:s('accent-text'),padding:'.75rem 2rem',borderRadius:s('radius'),fontWeight:700,textDecoration:'none'}}>{section.buttonText}</a>}
    </section>
  );
  if(section.type==='features') return(
    <section style={{background:s('surface'),padding:'3rem 2rem'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem',maxWidth:'900px',margin:'0 auto'}}>
        {(section.items||[]).map((item,i)=>(
          <div key={i} style={{background:s('bg'),padding:'1.5rem',borderRadius:s('radius'),boxShadow:s('shadow')}}>
            <h3 style={{fontWeight:700,marginBottom:'.5rem',fontFamily:s('font-heading')}}>{item.title}</h3>
            <p style={{color:s('text-muted'),fontSize:'.9rem'}}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
  if(section.type==='gallery') return(
    <section style={{background:s('bg'),padding:'3rem 2rem'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'1rem',maxWidth:'900px',margin:'0 auto'}}>
        {(section.images||[]).filter(Boolean).map((url,i)=>(
          <img key={i} src={url} alt="" style={{width:'100%',height:'180px',objectFit:'cover',borderRadius:s('radius')}} loading="lazy"/>
        ))}
      </div>
    </section>
  );
  if(section.type==='contact') return(
    <section style={{background:s('surface'),padding:'3rem 2rem'}}>
      <div style={{maxWidth:'500px',margin:'0 auto'}}>
        <h2 style={{fontFamily:s('font-heading'),fontWeight:700,marginBottom:'1.5rem',textAlign:'center'}}>Get in touch</h2>
        {['Name','Email','Message'].map(f=>f==='Message'?
          <textarea key={f} placeholder={f} rows={4} style={{width:'100%',marginBottom:'.75rem',padding:'.75rem',borderRadius:s('radius'),border:`2px solid ${s('surface')}`,background:s('bg'),color:s('text'),fontFamily:s('font-body'),resize:'vertical'}}/>
          :<input key={f} placeholder={f} style={{width:'100%',marginBottom:'.75rem',padding:'.75rem',borderRadius:s('radius'),border:`2px solid ${s('surface')}`,background:s('bg'),color:s('text')}}/>
        )}
        <button style={{width:'100%',background:s('accent'),color:s('accent-text'),padding:'.75rem',borderRadius:s('radius'),border:'none',fontWeight:700,cursor:'pointer'}}>Send Message</button>
      </div>
    </section>
  );
  return null;
}