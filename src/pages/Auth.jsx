import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Auth({ mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch(`/api/auth-${mode}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      login(data.user, data.token);
      navigate('/app');
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f3ff',padding:'1rem'}}>
      <div style={{width:'100%',maxWidth:'420px'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link to="/" style={{fontSize:'1.75rem',fontWeight:900,textDecoration:'none',color:'#111'}}>Vibe<span style={{color:'#7c3aed'}}>Kit</span></Link>
          <p style={{color:'#666',marginTop:'.5rem'}}>{mode==='login'?'Welcome back':'Create your account'}</p>
        </div>
        <div style={{background:'#fff',borderRadius:'16px',padding:'2rem',boxShadow:'0 4px 40px rgba(0,0,0,0.08)'}}>
          {error&&<div style={{background:'#fee2e2',color:'#dc2626',padding:'.75rem',borderRadius:'8px',marginBottom:'1rem',fontSize:'.9rem'}}>{error}</div>}
          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:'.5rem',fontSize:'.9rem'}}>Email</label>
              <input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={{border:'2px solid #eee'}}/>
            </div>
            <div>
              <label style={{display:'block',fontWeight:600,marginBottom:'.5rem',fontSize:'.9rem'}}>Password</label>
              <input className="input" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} style={{border:'2px solid #eee'}}/>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{background:'#7c3aed',borderColor:'#7c3aed',color:'#fff',width:'100%',marginTop:'.5rem',opacity:loading?.7:1}}>
              {loading?'Please wait...':(mode==='login'?'Log In':'Create Account')}
            </button>
          </form>
          <p style={{textAlign:'center',marginTop:'1.5rem',color:'#666',fontSize:'.9rem'}}>
            {mode==='login'?"Don't have an account? ":"Already have an account? "}
            <Link to={mode==='login'?'/signup':'/login'} style={{color:'#7c3aed',fontWeight:600}}>{mode==='login'?'Sign up':'Log in'}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}