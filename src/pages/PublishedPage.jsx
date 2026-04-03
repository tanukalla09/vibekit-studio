import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { themes } from '../themes';
function SectionRenderer({section,vars,slug}){
  const s=p=>vars[`--${p}`]||'';
  const [form,setForm]=useState({name:'',email:'',message:''});
  const [submitted,setSubmitted]=useState(false);
  const submit=async(e)=>{
    e.preventDefault();
    await fetch(`/api/public-page/pages/${slug}/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
    setSubmitted(true);
  };
  if(section.type==='hero') return(
    <section style={{background:s('bg'),color:s('text'),padding:'clamp(3rem,8vw,6rem) clamp(1rem,5vw,3rem)',textAlign:'center'}}>
      <h1 style={{fontSize:'clamp(2rem,5vw,4rem)',fontWeight:900,marginBottom:'1rem',fontFamily:s('font-heading'),lineHeight:1.1}}>{section.title}</h1>
      <p style={{fontSize:'clamp(1rem,2vw,1.25rem)',color:s('text-muted'),marginBottom:'2rem',maxWidth:'600px',margin:'0 auto 2rem'}}>{section.subtitle}</p>
      {section.buttonText&&<a href={section.buttonUrl||'#'} style={{display:'inline-block',background:s('accent'),color:s('accent-text'),padding:'.875rem 2.5rem',borderRadius:s('radius'),fontWeight:700,textDecoration:'none',boxShadow:s('shadow'),fontSize:'1.05rem'}}>{section.buttonText}</a>}
    </section>
  );
  if(section.type==='features') return(
    <section style={{background:s('surface'),padding:'clamp(2rem,6vw,4rem) clamp(1rem,5vw,3rem)'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1.5rem',maxWidth:'1100px',margin:'0 auto'}}>
        {(section.items||[]).map((item,i)=>(
          <div key={i} style={{background:s('bg'),padding:'1.75rem',borderRadius:s('radius'),boxShadow:s('shadow'),transition:'transform .2s'}}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'}
            onMouseLeave={e=>e.currentTarget.style.transform=''}>
            <h3 style={{fontWeight:700,marginBottom:'.5rem',fontFamily:s('font-heading')}}>{item.title}</h3>
            <p style={{color:s('text-muted'),fontSize:'.95rem',lineHeight:1.6}}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
  if(section.type==='gallery') return(
    <section style={{background:s('bg'),padding:'clamp(2rem,6vw,4rem) clamp(1rem,5vw,3rem)'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1rem',maxWidth:'1100px',margin:'0 auto'}}>
        {(section.images||[]).filter(Boolean).map((url,i)=>(
          <img key={i} src={url} alt="" style={{width:'100%',aspectRatio:'4/3',objectFit:'cover',borderRadius:s('radius'),transition:'transform .3s'}}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
            onMouseLeave={e=>e.currentTarget.style.transform=''} loading="lazy"/>
        ))}
      </div>
    </section>
  );
  if(section.type==='contact') return(
    <section style={{background:s('surface'),padding:'clamp(2rem,6vw,4rem) clamp(1rem,5vw,3rem)'}}>
      <div style={{maxWidth:'520px',margin:'0 auto'}}>
        <h2 style={{fontFamily:s('font-heading'),fontWeight:700,marginBottom:'1.5rem',textAlign:'center',fontSize:'clamp(1.5rem,3vw,2rem)'}}>Get in touch</h2>
        {submitted?(
          <div style={{textAlign:'center',padding:'2rem',background:s('bg'),borderRadius:s('radius')}}>
            <div style={{fontSize:'2.5rem',marginBottom:'.5rem'}}>✉️</div>
            <p style={{fontWeight:600}}>Message sent! Thank you.</p>
          </div>
        ):(
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {[['name','Name','text'],['email','Email','email']].map(([k,p,t])=>(
              <input key={k} type={t} placeholder={p} required value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                style={{padding:'.875rem',borderRadius:s('radius'),border:`2px solid ${s('surface')}`,background:s('bg'),color:s('text'),fontSize:'1rem',minHeight:'44px'}}/>
            ))}
            <textarea placeholder="Message" required rows={4} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
              style={{padding:'.875rem',borderRadius:s('radius'),border:`2px solid ${s('surface')}`,background:s('bg'),color:s('text'),fontSize:'1rem',resize:'vertical'}}/>
            <button type="submit" style={{background:s('accent'),color:s('accent-text'),padding:'.875rem',borderRadius:s('radius'),border:'none',fontWeight:700,cursor:'pointer',fontSize:'1rem',minHeight:'44px'}}>Send Message</button>
          </form>
        )}
      </div>
    </section>
  );
  return null;
}
export default function PublishedPage(){
  const {slug}=useParams();
  const [page,setPage]=useState(null);
  const [error,setError]=useState(false);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    fetch(`/api/public-page/pages/${slug}`)
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>{setPage(data);fetch(`/api/public-page/pages/${slug}/view`,{method:'POST'});})
      .catch(()=>setError(true))
      .finally(()=>setLoading(false));
  },[slug]);
  if(loading) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><p>Loading...</p></div>;
  if(error) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem'}}><div><div style={{fontSize:'4rem'}}>404</div><h1>Page not found</h1><p style={{color:'#666'}}>This page doesn't exist or hasn't been published.</p></div></div>;
  const theme=themes[page.theme]||themes.minimal;
  return(
    <>
      <style>{`:root{${Object.entries(theme.vars).map(([k,v])=>`${k}:${v}`).join(';')}}`}</style>
      <div style={{background:theme.vars['--bg'],color:theme.vars['--text'],fontFamily:theme.vars['--font-body'],minHeight:'100vh'}}>
        {page.sections.map((s,i)=><SectionRenderer key={i} section={s} vars={theme.vars} slug={slug}/>)}
        <footer style={{background:theme.vars['--surface'],padding:'1rem',textAlign:'center',fontSize:'.8rem',color:theme.vars['--text-muted']}}>
          Made with <span style={{color:theme.vars['--accent']}}>VibeKit Studio</span>
        </footer>
      </div>
    </>
  );
}