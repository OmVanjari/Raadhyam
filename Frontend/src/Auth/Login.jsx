import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS  = "'Lato',system-ui,sans-serif";

const LoginPage = () => {
  const [formData, setFormData]       = useState({ email: '', password: '' });
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [showPass, setShowPass]       = useState(false);
  const [isLoading, setIsLoading]     = useState(false);
  const [errors, setErrors]           = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [focused, setFocused]         = useState('');
  const canvasRef = useRef(null);

  /* ── auth checks ── */
  useEffect(() => {
    checkAuthStatus();
    checkGoogleAuth();
    checkUrlToken();
    generateCaptcha();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { setIsCheckingAuth(false); return; }
      const res = await axios.get('/api/check-auth', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.authenticated) {
        window.location.href = res.data.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/home';
        return;
      }
      localStorage.removeItem('authToken');
    } catch { localStorage.removeItem('authToken'); }
    finally { setIsCheckingAuth(false); }
  };

  const checkGoogleAuth = () => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get('token'), userData = p.get('user'), err = p.get('error');
    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        window.history.replaceState({}, '', window.location.pathname);
        window.location.href = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/home';
      } catch { setErrors({ general: 'Failed to process authentication data' }); }
    }
    if (err) { setErrors({ general: `Google authentication failed: ${err}` }); window.history.replaceState({}, '', window.location.pathname); }
  };

  const checkUrlToken = () => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get('token'), userData = p.get('user');
    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        window.history.replaceState({}, '', window.location.pathname);
        window.location.href = user.role === 'admin' ? '/dashboard/admin' : '/dashboard/home';
      } catch {}
    }
  };

  /* ── captcha ── */
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    setCaptchaText(Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
    setErrors(p => ({ ...p, captcha: '' }));
  };

  useEffect(() => {
    if (!canvasRef.current || !captchaText) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // bg
    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    g.addColorStop(0, '#FEF3C7'); g.addColorStop(1, '#FFF8EE');
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(217,119,6,0.15)`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.random() * canvas.width, 0);
      ctx.lineTo(Math.random() * canvas.width, canvas.height); ctx.stroke();
    }
    // letters
    captchaText.split('').forEach((ch, i) => {
      ctx.save();
      ctx.translate(14 + i * 22, 22 + (Math.random() * 6 - 3));
      ctx.rotate(Math.random() * 0.4 - 0.2);
      ctx.font = `bold ${18 + Math.random() * 4}px ${SANS}`;
      ctx.fillStyle = i % 2 === 0 ? '#1E293B' : '#D97706';
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    });
  }, [captchaText]);

  useEffect(() => { setErrors({}); setSuccessMessage(''); }, [formData, userCaptcha]);

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    if (!userCaptcha) e.captcha = 'CAPTCHA is required';
    else if (userCaptcha.toUpperCase() !== captchaText) e.captcha = 'CAPTCHA does not match';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true); setErrors({}); setSuccessMessage('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); setIsLoading(false); return; }
    try {
      const res = await axios.post('/api/login/user', { email: formData.email.toLowerCase().trim(), password: formData.password });
      if (res.data.success) {
        setSuccessMessage('Login successful! Redirecting...');
        if (res.data.token) localStorage.setItem('authToken', res.data.token);
        if (res.data.user)  localStorage.setItem('userData', JSON.stringify(res.data.user));
        setTimeout(() => { window.location.href = res.data.user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/home'; }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      if (msg === 'Invalid login') setErrors({ general: 'No account found with this email.' });
      else if (msg === 'Wrong password') setErrors({ general: 'Incorrect password. Please try again.' });
      else if (msg === 'Use Google Sign-In for this account') setErrors({ general: 'This email uses Google Sign-In.' });
      else setErrors({ general: msg });
      generateCaptcha(); setUserCaptcha('');
    } finally { setIsLoading(false); }
  };

  const handleGoogle = () => {
    window.location.href = `/api/auth/google?redirect=${encodeURIComponent(window.location.origin + '/login')}`;
  };

  if (isCheckingAuth) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#FFF8EE,#FEF3C7)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #D97706', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ color: '#64748B', fontFamily: SANS }}>Checking authentication...</p>
      </div>
    </div>
  );

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 16px',
    border: `1.5px solid ${errors[field] ? '#EF4444' : focused === field ? '#D97706' : '#E2E8F0'}`,
    borderRadius: 12, fontSize: '0.92rem', fontFamily: SANS,
    color: '#1E293B', background: '#fff', outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    boxShadow: focused === field ? '0 0 0 3px rgba(217,119,6,0.12)' : 'none',
  });

  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: SANS };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#FFF8EE 0%,#FEF3C7 45%,#FFFBF5 100%)', fontFamily: SANS, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');
        @keyframes floatNote { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(8deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position:'absolute', top:'-80px', right:'-80px', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,0.09) 0%,transparent 70%)', pointerEvents:'none' }} />
      {/* Dot pattern */}
      <div style={{ position:'absolute', inset:0, opacity:0.35, pointerEvents:'none', backgroundImage:'radial-gradient(circle,rgba(217,119,6,0.18) 1px,transparent 1px)', backgroundSize:'32px 32px' }} />
      {/* Floating notes */}
      {[{n:'♩',t:'12%',l:'5%',d:'0s'},{n:'♫',t:'20%',r:'6%',d:'1.4s'},{n:'♬',b:'22%',l:'8%',d:'2.6s'},{n:'𝄞',t:'55%',r:'4%',d:'0.8s'}].map((x,i)=>(
        <span key={i} style={{ position:'absolute', fontSize:'1.8rem', color:'#D97706', opacity:0.13, top:x.t, bottom:x.b, left:x.l, right:x.r, animation:`floatNote 7s ease-in-out ${x.d} infinite`, pointerEvents:'none', userSelect:'none' }}>{x.n}</span>
      ))}

      {/* Nav strip */}
      <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'#fff', borderBottom:'2px solid #D97706', boxShadow:'0 2px 12px rgba(217,119,6,0.1)', height:64, display:'flex', alignItems:'center', padding:'0 2rem', justifyContent:'space-between' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <img src="/Raadhyam.png" alt="Raadhyam" style={{ height:40 }} onError={e=>e.target.style.display='none'} />
          <span style={{ fontFamily:SERIF, fontSize:'1.3rem', fontWeight:700, color:'#1E293B' }}>Raadhyam<span style={{color:'#D97706'}}>.</span></span>
        </Link>
        <Link to="/" style={{ fontSize:'0.82rem', fontWeight:700, color:'#64748B', textDecoration:'none', letterSpacing:'0.06em', textTransform:'uppercase' }}>← Back to Home</Link>
      </div>

      {/* Card */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'90px 1rem 3rem' }}>
        <div style={{ background:'#fff', borderRadius:24, boxShadow:'0 24px 80px rgba(217,119,6,0.14), 0 4px 24px rgba(30,41,59,0.08)', padding:'2.5rem', width:'100%', maxWidth:460, animation:'fadeUp 0.5s ease both', border:'1px solid rgba(217,119,6,0.15)' }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#D97706,#B45309)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', boxShadow:'0 8px 24px rgba(217,119,6,0.35)', fontSize:'2rem' }}>🎵</div>
            <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:'#1E293B', marginBottom:6 }}>Welcome Back</h1>
            <p style={{ color:'#64748B', fontSize:'0.9rem' }}>Sign in to continue your musical journey</p>
          </div>

          {/* Success */}
          {successMessage && (
            <div style={{ background:'rgba(5,150,105,0.08)', border:'1px solid rgba(5,150,105,0.25)', borderRadius:12, padding:'12px 16px', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:10, color:'#065F46', fontSize:'0.88rem', fontWeight:600 }}>
              ✅ {successMessage}
            </div>
          )}
          {/* Error */}
          {errors.general && (
            <div style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'12px 16px', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:10, color:'#991B1B', fontSize:'0.88rem', fontWeight:600 }}>
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
            {/* Email */}
            <div>
              <label style={labelStyle}>✉ Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="your@email.com" style={inputStyle('email')}
                onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')} />
              {errors.email && <p style={{ color:'#EF4444', fontSize:'0.75rem', marginTop:4 }}>⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>🔒 Password</label>
              <div style={{ position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Enter your password" style={{ ...inputStyle('password'), paddingRight:44 }}
                  onFocus={()=>setFocused('password')} onBlur={()=>setFocused('')} />
                <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'#94A3B8' }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <p style={{ color:'#EF4444', fontSize:'0.75rem', marginTop:4 }}>⚠ {errors.password}</p>}
            </div>

            {/* CAPTCHA */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <label style={labelStyle}>🎼 CAPTCHA</label>
                <button type="button" onClick={generateCaptcha} style={{ fontSize:'0.75rem', fontWeight:700, color:'#D97706', background:'rgba(217,119,6,0.1)', border:'1px solid rgba(217,119,6,0.25)', borderRadius:8, padding:'3px 10px', cursor:'pointer', fontFamily:SANS }}>↻ Refresh</button>
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <canvas ref={canvasRef} width={130} height={44} style={{ borderRadius:10, border:'1.5px solid #E2E8F0', flexShrink:0 }} />
                <input type="text" value={userCaptcha} onChange={e=>setUserCaptcha(e.target.value)}
                  placeholder="Type here" style={{ ...inputStyle('captcha'), flex:1 }}
                  onFocus={()=>setFocused('captcha')} onBlur={()=>setFocused('')} />
              </div>
              {errors.captcha && <p style={{ color:'#EF4444', fontSize:'0.75rem', marginTop:4 }}>⚠ {errors.captcha}</p>}
            </div>

            {/* Forgot */}
            <div style={{ textAlign:'right', marginTop:-4 }}>
              <a href="/forgot-password" style={{ fontSize:'0.8rem', color:'#D97706', fontWeight:700, textDecoration:'none' }}>Forgot password?</a>
            </div>

            {/* Demo buttons */}
            <div>
              <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#94A3B8', letterSpacing:'0.1em', textTransform:'uppercase', textAlign:'center', marginBottom:8, fontFamily:SANS }}>⚡ Quick Demo Access</p>
              <div style={{ display:'flex', gap:10 }}>
                <button type="button" onClick={() => { window.location.href = '/dashboard/admin'; }}
                  style={{ flex:1, padding:'10px', borderRadius:10, border:'1.5px solid #D97706', background:'rgba(217,119,6,0.07)', color:'#B45309', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', fontFamily:SANS, transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(217,119,6,0.15)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(217,119,6,0.07)'}>
                  🛡 Demo Admin
                </button>
                <button type="button" onClick={() => { window.location.href = '/dashboard/home'; }}
                  style={{ flex:1, padding:'10px', borderRadius:10, border:'1.5px solid #1E293B', background:'rgba(30,41,59,0.05)', color:'#1E293B', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', fontFamily:SANS, transition:'background 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(30,41,59,0.12)'}
                  onMouseLeave={e=>e.currentTarget.style.background='rgba(30,41,59,0.05)'}>
                  🎵 Demo User
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} style={{
              background: isLoading ? '#E2E8F0' : 'linear-gradient(135deg,#D97706,#B45309)',
              color: isLoading ? '#94A3B8' : '#fff', border:'none', borderRadius:12,
              padding:'14px', fontSize:'1rem', fontWeight:700, cursor: isLoading ? 'not-allowed' : 'pointer',
              fontFamily:SANS, letterSpacing:'0.04em',
              boxShadow: isLoading ? 'none' : '0 6px 20px rgba(217,119,6,0.35)',
              transition:'transform 0.2s, box-shadow 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}
              onMouseEnter={e=>{ if(!isLoading){ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(217,119,6,0.5)'; }}}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 20px rgba(217,119,6,0.35)'; }}
            >
              {isLoading ? (<><div style={{ width:18, height:18, border:'2px solid #94A3B8', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Signing In...</>) : (<>🎵 Sign In to Raadhyam</>)}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'1.5rem 0' }}>
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
            <span style={{ color:'#94A3B8', fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.06em' }}>OR</span>
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={isLoading} style={{
            width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12,
            background:'#fff', border:'1.5px solid #E2E8F0', borderRadius:12,
            padding:'12px', fontSize:'0.92rem', fontWeight:700, cursor:'pointer',
            color:'#1E293B', fontFamily:SANS,
            transition:'border-color 0.25s, box-shadow 0.25s',
            boxShadow:'0 2px 8px rgba(30,41,59,0.06)',
          }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='#D97706'; e.currentTarget.style.boxShadow='0 4px 16px rgba(217,119,6,0.15)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='#E2E8F0'; e.currentTarget.style.boxShadow='0 2px 8px rgba(30,41,59,0.06)'; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Register link */}
          <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#64748B', fontSize:'0.88rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#D97706', fontWeight:700, textDecoration:'none' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
