import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBarpage from '../WelcomePages/NavBarpage';
import FooterPage from '../WelcomePages/FooterPage';
import heroBg from '../assets/hero-bg.jpg';

const SERIF = "'Cormorant Garamond',Georgia,serif";
const SANS  = "'Lato',system-ui,sans-serif";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha]  = useState('');
  const [showPass, setShowPass]        = useState(false);
  const [showConfirm, setShowConfirm]  = useState(false);
  const [isLoading, setIsLoading]      = useState(false);
  const [errors, setErrors]            = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [focused, setFocused]          = useState('');
  const canvasRef = useRef(null);

  useEffect(() => { generateCaptcha(); }, []);
  useEffect(() => { setErrors({}); setSuccessMessage(''); }, [formData, userCaptcha]);

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
    const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
    g.addColorStop(0, '#FEF3C7'); g.addColorStop(1, '#FFF8EE');
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = 'rgba(217,119,6,0.15)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.random() * canvas.width, 0);
      ctx.lineTo(Math.random() * canvas.width, canvas.height); ctx.stroke();
    }
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

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!formData.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
      const res = await axios.post('/api/register/user', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });
      if (res.data.success) {
        setSuccessMessage('Account created! Redirecting to login...');
        setTimeout(() => { window.location.href = '/login'; }, 1800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      if (err.response?.status === 409) setErrors({ email: 'This email is already registered.' });
      else if (err.response?.data?.field) setErrors({ [err.response.data.field]: msg });
      else setErrors({ general: msg });
      generateCaptcha(); setUserCaptcha('');
    } finally { setIsLoading(false); }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 16px',
    border: `1.5px solid ${errors[field] ? '#EF4444' : focused === field ? '#D97706' : '#E2E8F0'}`,
    borderRadius: 12, fontSize: '0.92rem', fontFamily: SANS,
    color: '#1E293B', background: '#fff', outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    boxShadow: focused === field ? '0 0 0 3px rgba(217,119,6,0.12)' : 'none',
  });

  const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: 700,
    color: '#475569', marginBottom: 6, letterSpacing: '0.06em',
    textTransform: 'uppercase', fontFamily: SANS,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: SANS, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Lato:wght@400;600;700&display=swap');
        @keyframes floatNote { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(8deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>

      <NavBarpage />

      <img src={heroBg} alt="Raadhyam background" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(2,6,23,0.84), rgba(15,23,42,0.84), rgba(2,6,23,0.9))' }} />

      {/* Blobs */}
      <div style={{ position:'absolute', top:'-80px', right:'-80px', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,0.09) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, opacity:0.35, pointerEvents:'none', backgroundImage:'radial-gradient(circle,rgba(217,119,6,0.18) 1px,transparent 1px)', backgroundSize:'32px 32px' }} />
      {[{n:'♩',t:'10%',l:'4%',d:'0s'},{n:'♫',t:'18%',r:'5%',d:'1.4s'},{n:'♬',b:'20%',l:'7%',d:'2.6s'},{n:'𝄞',t:'50%',r:'3%',d:'0.8s'}].map((x,i)=>(
        <span key={i} style={{ position:'absolute', fontSize:'1.8rem', color:'#D97706', opacity:0.13, top:x.t, bottom:x.b, left:x.l, right:x.r, animation:`floatNote 7s ease-in-out ${x.d} infinite`, pointerEvents:'none', userSelect:'none' }}>{x.n}</span>
      ))}

      {/* Card */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'120px 1rem 3rem', position:'relative', zIndex:2 }}>
        <div style={{ background:'#fff', borderRadius:24, boxShadow:'0 24px 80px rgba(217,119,6,0.14), 0 4px 24px rgba(30,41,59,0.08)', padding:'2.5rem', width:'100%', maxWidth:500, animation:'fadeUp 0.5s ease both', border:'1px solid rgba(217,119,6,0.15)' }}>

          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#D97706,#B45309)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', boxShadow:'0 8px 24px rgba(217,119,6,0.35)', fontSize:'2rem' }}>🎶</div>
            <h1 style={{ fontFamily:SERIF, fontSize:'2rem', fontWeight:700, color:'#1E293B', marginBottom:6 }}>Join Raadhyam</h1>
            <p style={{ color:'#64748B', fontSize:'0.9rem' }}>Start your musical journey today</p>
          </div>

          {/* Success */}
          {successMessage && (
            <div style={{ background:'rgba(5,150,105,0.08)', border:'1px solid rgba(5,150,105,0.25)', borderRadius:12, padding:'12px 16px', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:10, color:'#065F46', fontSize:'0.88rem', fontWeight:600 }}>
              ✅ {successMessage}
            </div>
          )}
          {errors.general && (
            <div style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'12px 16px', marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:10, color:'#991B1B', fontSize:'0.88rem', fontWeight:600 }}>
              ⚠️ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            {/* Name */}
            <div>
              <label style={labelStyle}>👤 Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your full name" style={inputStyle('name')}
                onFocus={()=>setFocused('name')} onBlur={()=>setFocused('')} />
              {errors.name && <p style={{ color:'#EF4444', fontSize:'0.75rem', marginTop:4 }}>⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>✉ Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="your@email.com" style={inputStyle('email')}
                onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')} />
              {errors.email && <p style={{ color:'#EF4444', fontSize:'0.75rem', marginTop:4 }}>⚠ {errors.email}</p>}
            </div>

            {/* Password row */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={labelStyle}>🔒 Password</label>
                <div style={{ position:'relative' }}>
                  <input type={showPass ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                    placeholder="Min. 6 chars" style={{ ...inputStyle('password'), paddingRight:40 }}
                    onFocus={()=>setFocused('password')} onBlur={()=>setFocused('')} />
                  <button type="button" onClick={()=>setShowPass(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', color:'#94A3B8' }}>{showPass?'🙈':'👁'}</button>
                </div>
                {errors.password && <p style={{ color:'#EF4444', fontSize:'0.72rem', marginTop:4 }}>⚠ {errors.password}</p>}
              </div>
              <div>
                <label style={labelStyle}>✅ Confirm</label>
                <div style={{ position:'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Repeat password" style={{ ...inputStyle('confirmPassword'), paddingRight:40 }}
                    onFocus={()=>setFocused('confirmPassword')} onBlur={()=>setFocused('')} />
                  <button type="button" onClick={()=>setShowConfirm(p=>!p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', color:'#94A3B8' }}>{showConfirm?'🙈':'👁'}</button>
                </div>
                {errors.confirmPassword && <p style={{ color:'#EF4444', fontSize:'0.72rem', marginTop:4 }}>⚠ {errors.confirmPassword}</p>}
              </div>
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
              {isLoading
                ? (<><div style={{ width:18, height:18, border:'2px solid #94A3B8', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} /> Creating Account...</>)
                : <>🎶 Create My Account</>}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'1.5rem 0' }}>
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
            <span style={{ color:'#94A3B8', fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.06em' }}>OR</span>
            <div style={{ flex:1, height:1, background:'#E2E8F0' }} />
          </div>

          {/* Google */}
          <button onClick={()=>{ window.location.href='/api/auth/google'; }} style={{
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

          <p style={{ textAlign:'center', marginTop:'1.5rem', color:'#64748B', fontSize:'0.88rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#D97706', fontWeight:700, textDecoration:'none' }}>Sign In</Link>
          </p>
        </div>
      </div>

      <FooterPage />
    </div>
  );
};

export default RegisterPage;
