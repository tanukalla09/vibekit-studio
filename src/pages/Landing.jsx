import { Link } from 'react-router-dom';
import { themes } from '../themes';
const DEMO = ['minimal','neon','pastel'];
export default function Landing() {
  return (
    <div style={{fontFamily:'Inter,sans-serif',background:'#fff',color:'#111'}}>
      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,0.95)',backdropFilter:'blur(10px)',borderBottom:'1px solid #eee',padding:'1rem 0'}}>
        <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontSize:'1.5rem',fontWeight:800}}>Vibe<span style={{color:'#7c3aed'}}>Kit</span></div>
          <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
            <Link to="/login" className="btn btn-ghost" style={{color:'#111'}}>Log in</Link>
            <Link to="/signup" className="btn btn-primary" style={{background:'#7c3aed',borderColor:'#7c3aed',color:'#fff'}}>Get Started Free</Link>
          </div>
        </div>
      </nav>
      <section style={{padding:'6rem 0 4rem',textAlign:'center',background:'linear-gradient(135deg,#f5f3ff 0%,#fdf4ff 100%)'}}>
        <div className="container">
          <div className="fade-up">
            <span style={{display:'inline-block',background:'#7c3aed22',color:'#7c3aed',padding:'.35rem 1rem',borderRadius:'999px',fontSize:'.85rem',fontWeight:600,marginBottom:'1.5rem'}}>✨ Generate a theme, build a mini-site, publish it</span>
            <h1 style={{fontSize:'clamp(2.5rem,6vw,5rem)',fontWeight:900,lineHeight:1.1,letterSpacing:'-2px',marginBottom:'1.5rem'}}>Build beautiful<br/>sites in <span style={{color:'#7c3aed'}}>minutes</span></h1>
            <p style={{fontSize:'1.25rem',color:'#666',maxWidth:'540px',margin:'0 auto 2.5rem'}}>Pick a vibe, customize your content, and publish a polished mini-site — no code required.</p>
            <Link to="/signup" className="btn btn-primary" style={{background:'#7c3aed',borderColor:'#7c3aed',color:'#fff',fontSize:'1.1rem',padding:'1rem 2rem'}}>Create your first page →</Link>
          </div>
        </div>
      </section>
      <section style={{padding:'5rem 0',background:'#fff'}}>
        <div className="container">
          <h2 style={{textAlign:'center',fontSize:'2rem',fontWeight:800,marginBottom:'.75rem'}}>Choose your vibe</h2>
          <p style={{textAlign:'center',color:'#666',marginBottom:'3rem'}}>6 beautiful themes, each with a distinct personality</p>
          <div className="grid-3">
            {DEMO.map(key=>{const t=themes[key];return(
              <div key={key} style={{borderRadius:'12px',overflow:'hidden',border:'2px solid #eee',transition:'transform .2s,box-shadow .2s',cursor:'pointer'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
                <div style={{background:t.preview.bg,padding:'2rem',minHeight:'180px',display:'flex',flexDirection:'column',gap:'.75rem'}}>
                  <div style={{width:'60%',height:'12px',background:t.preview.accent,borderRadius:'4px'}}/>
                  <div style={{width:'80%',height:'8px',background:t.preview.text,borderRadius:'4px',opacity:.3}}/>
                  <div style={{width:'70%',height:'8px',background:t.preview.text,borderRadius:'4px',opacity:.2}}/>
                  <div style={{marginTop:'auto',width:'100px',height:'32px',background:t.preview.accent,borderRadius:'4px'}}/>
                </div>
                <div style={{padding:'1rem 1.25rem',background:'#fafafa'}}><div style={{fontWeight:700,fontSize:'.95rem'}}>{t.name}</div></div>
              </div>
            )})}
          </div>
        </div>
      </section>
      <section style={{padding:'5rem 0',background:'#f5f3ff'}}>
        <div className="container">
          <h2 style={{textAlign:'center',fontSize:'2rem',fontWeight:800,marginBottom:'3rem'}}>Everything you need</h2>
          <div className="grid-3">
            {[{icon:'🎨',title:'Vibe Themes',desc:'6 stunning presets with full CSS design tokens.'},{icon:'⚡',title:'Live Preview',desc:'See exactly how your page looks at every screen size.'},{icon:'🚀',title:'One-click Publish',desc:'Get a shareable public URL instantly.'}].map(f=>(
              <div key={f.title} className="card" style={{background:'#fff',textAlign:'center',padding:'2rem'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>{f.icon}</div>
                <h3 style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'.5rem'}}>{f.title}</h3>
                <p style={{color:'#666',fontSize:'.95rem'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{padding:'5rem 0',textAlign:'center',background:'#7c3aed'}}>
        <div className="container">
          <h2 style={{fontSize:'2.5rem',fontWeight:900,color:'#fff',marginBottom:'1rem'}}>Ready to find your vibe?</h2>
          <p style={{color:'#e0d7ff',fontSize:'1.1rem',marginBottom:'2rem'}}>Build and publish your mini-site in minutes.</p>
          <Link to="/signup" className="btn" style={{background:'#fff',color:'#7c3aed',border:'none',fontSize:'1.1rem',padding:'1rem 2rem'}}>Start building for free →</Link>
        </div>
      </section>
      <footer style={{padding:'2rem 0',textAlign:'center',color:'#999',borderTop:'1px solid #eee',fontSize:'.9rem'}}>
        <div className="container">© 2026 VibeKit Studio. Built with 💜</div>
      </footer>
    </div>
  );
}