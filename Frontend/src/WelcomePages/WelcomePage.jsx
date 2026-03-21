import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ─── Animated counter hook ─────────────────────────────────────────────── */
const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const num = parseInt(target);
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

/* ─── Intersection observer hook ────────────────────────────────────────── */
const useVisible = (threshold = 0.2) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

/* ─── Floating music note ────────────────────────────────────────────────── */
const FloatingNote = ({ note, style }) => (
  <span style={{
    position: 'absolute', fontSize: '1.6rem', opacity: 0.1,
    color: '#D97706', userSelect: 'none', pointerEvents: 'none',
    animation: 'floatNote 7s ease-in-out infinite',
    ...style,
  }}>{note}</span>
);

/* ─── Stat card with animated counter ───────────────────────────────────── */
const StatCard = ({ value, suffix = '', label, delay, dark = false }) => {
  const [ref, visible] = useVisible(0.3);
  const num = useCounter(value, 1600, visible);
  return (
    <div ref={ref} style={{
      textAlign: 'center',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      <div style={{
        fontSize: '2.4rem', fontWeight: 800, color: '#D97706',
        fontFamily: "'Cormorant Garamond', serif", lineHeight: 1,
      }}>
        {visible ? `${num}${suffix}` : `0${suffix}`}
      </div>
      <div style={{
        color: dark ? '#64748B' : '#94A3B8',
        fontSize: '0.78rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', marginTop: 6, fontWeight: 600,
      }}>{label}</div>
    </div>
  );
};

/* ─── Feature card ───────────────────────────────────────────────────────── */
const FeatureCard = ({ icon, title, desc, delay }) => {
  const [ref, visible] = useVisible(0.15);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? 'rgba(217,119,6,0.45)' : '#E2E8F0'}`,
        borderRadius: 20, padding: '2rem',
        boxShadow: hovered ? '0 24px 56px rgba(30,41,59,0.13)' : '0 2px 16px rgba(30,41,59,0.05)',
        transform: visible ? (hovered ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(32px)',
        opacity: visible ? 1 : 0,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.4s ease, box-shadow 0.4s, border 0.3s`,
        position: 'relative', overflow: 'hidden', cursor: 'default',
      }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: hovered ? 'linear-gradient(90deg,#D97706,#F59E0B)' : 'transparent',
        transition: 'background 0.4s', borderRadius: '20px 20px 0 0',
      }} />
      <div style={{
        width: 58, height: 58, borderRadius: 16,
        background: hovered ? 'linear-gradient(135deg,#D97706,#B45309)' : 'rgba(217,119,6,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.7rem', marginBottom: '1.25rem',
        transition: 'background 0.4s, box-shadow 0.4s',
        boxShadow: hovered ? '0 8px 24px rgba(217,119,6,0.35)' : 'none',
      }}>{icon}</div>
      <h3 style={{
        fontSize: '1.2rem', fontWeight: 700, color: '#1E293B',
        marginBottom: '0.6rem', fontFamily: "'Cormorant Garamond', serif",
      }}>{title}</h3>
      <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.75, margin: 0 }}>{desc}</p>
    </div>
  );
};

/* ─── Course card ────────────────────────────────────────────────────────── */
const CourseCard = ({ icon, name, desc, index }) => {
  const [ref, visible] = useVisible(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'linear-gradient(135deg,#D97706,#B45309)' : '#fff',
        border: `1px solid ${hovered ? '#D97706' : '#E2E8F0'}`,
        borderRadius: 18, padding: '1.75rem',
        opacity: visible ? 1 : 0,
        transform: visible ? (hovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0)') : 'translateY(24px)',
        transition: `opacity 0.6s ease ${(index % 4) * 70}ms, transform 0.35s ease, background 0.4s, border 0.3s, box-shadow 0.35s`,
        cursor: 'pointer',
        boxShadow: hovered ? '0 20px 48px rgba(30,41,59,0.22)' : '0 2px 12px rgba(30,41,59,0.05)',
      }}>
      <div style={{
        fontSize: '2.2rem', marginBottom: '0.9rem', display: 'inline-block',
        transform: hovered ? 'scale(1.25) rotate(-6deg)' : 'scale(1)',
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>{icon}</div>
      <h3 style={{
        fontSize: '1.1rem', fontWeight: 700,
        color: hovered ? '#fff' : '#1E293B',
        marginBottom: '0.5rem', fontFamily: "'Cormorant Garamond', serif",
        transition: 'color 0.3s',
      }}>{name}</h3>
      <p style={{
        color: hovered ? 'rgba(255,255,255,0.85)' : '#64748B',
        fontSize: '0.82rem', lineHeight: 1.7, margin: 0,
        transition: 'color 0.3s',
      }}>{desc}</p>
      <div style={{
        marginTop: '1rem', fontSize: '0.78rem', fontWeight: 700,
        color: '#fff', letterSpacing: '0.08em',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(0)' : 'translateX(-10px)',
        transition: 'opacity 0.3s, transform 0.3s',
      }}>EXPLORE →</div>
    </div>
  );
};

/* ─── Testimonial card ───────────────────────────────────────────────────── */
const TestimonialCard = ({ name, role, text, delay }) => {
  const [ref, visible] = useVisible(0.15);
  return (
    <div ref={ref} style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 20, padding: '2rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      boxShadow: '0 4px 20px rgba(30,41,59,0.06)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 20, right: 24,
        fontSize: '3rem', color: 'rgba(217,119,6,0.12)',
        fontFamily: 'Georgia, serif', lineHeight: 1,
      }}>"</div>
      <div style={{ color: '#D97706', fontSize: '1rem', marginBottom: '0.75rem', letterSpacing: 2 }}>★★★★★</div>
      <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.25rem', fontStyle: 'italic' }}>"{text}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'linear-gradient(135deg,#D97706,#B45309)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '1rem',
          fontFamily: "'Cormorant Garamond', serif",
        }}>{name[0]}</div>
        <div>
          <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem', fontFamily: "'Cormorant Garamond', serif" }}>{name}</div>
          <div style={{ color: '#94A3B8', fontSize: '0.75rem', letterSpacing: '0.06em' }}>{role}</div>
        </div>
      </div>
    </div>
  );
};

/* ─── Inline NavBar ──────────────────────────────────────────────────────── */
const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/About-Us' },
    { label: 'Courses', to: '/Courses' },
    { label: 'Notes', to: '/Notes' },
    { label: 'Contact', to: '/Contact-Us' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: '#fff',
      borderBottom: '2px solid #D97706',
      boxShadow: scrolled ? '0 4px 24px rgba(217,119,6,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
      transition: 'box-shadow 0.4s ease',
    }}>
      {/* Amber shimmer line at very top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #D97706, #F59E0B, #B45309, #F59E0B, #D97706)',
        backgroundSize: '300% auto',
        animation: 'shimmer 4s linear infinite',
      }} />

      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/Raadhyam.png" alt="Raadhyam"
            style={{
              height: 44, width: 'auto',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div style={{
            display: 'none', width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg,#D97706,#92400E)',
            alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🎵</div>
          <span style={{
            color: '#1E293B', fontSize: '1.35rem', fontWeight: 700,
            fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.03em',
          }}>Raadhyam<span style={{ color: '#D97706' }}>.</span></span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map(l => (
            <Link key={l.label} to={l.to}
              style={{
                color: activeLink === l.label ? '#D97706' : '#1E293B',
                fontSize: '0.78rem', fontWeight: 700,
                textDecoration: 'none', letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: "'Lato', sans-serif",
                position: 'relative', padding: '4px 0',
                transition: 'color 0.25s',
              }}
              onMouseEnter={e => {
                setActiveLink(l.label);
                e.currentTarget.style.color = '#D97706';
              }}
              onMouseLeave={e => {
                setActiveLink('');
                e.currentTarget.style.color = '#1E293B';
              }}
            >
              {l.label}
              {/* Animated underline */}
              <span style={{
                position: 'absolute', bottom: -2, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg,#D97706,#F59E0B)',
                borderRadius: 2,
                transform: activeLink === l.label ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1)',
              }} />
            </Link>
          ))}

          {/* Enroll button with ripple */}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{
              background: 'linear-gradient(135deg,#D97706,#B45309)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '10px 26px', fontSize: '0.82rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.06em',
              boxShadow: '0 4px 16px rgba(217,119,6,0.35)',
              fontFamily: "'Lato', sans-serif",
              textTransform: 'uppercase',
              position: 'relative', overflow: 'hidden',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(217,119,6,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(217,119,6,0.35)';
              }}
            >
              🎵 Enroll Now
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lato:wght@300;400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @keyframes floatNote {
      0%,100% { transform: translateY(0) rotate(0deg); }
      33%      { transform: translateY(-18px) rotate(5deg); }
      66%      { transform: translateY(10px) rotate(-4deg); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulseRing {
      0%   { transform: scale(0.95); opacity: 0.7; }
      100% { transform: scale(1.55); opacity: 0; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideLeft {
      from { opacity: 0; transform: translateX(-48px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(48px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes drawLine {
      from { width: 0; }
      to   { width: 72px; }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes glowPulse {
      0%,100% { box-shadow: 0 0 24px rgba(217,119,6,0.25); }
      50%      { box-shadow: 0 0 48px rgba(217,119,6,0.55); }
    }
    @keyframes waveBar {
      0%,100% { transform: scaleY(0.4); }
      50%      { transform: scaleY(1); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }

    .hero-left  { animation: slideLeft  0.95s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
    .hero-right { animation: slideRight 0.95s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
    .hero-sub   { animation: fadeUp 0.8s ease 0.55s both; }
    .hero-cta   { animation: fadeUp 0.8s ease 0.75s both; }
    .hero-stats { animation: fadeUp 0.8s ease 0.95s both; }

    .amber-btn {
      background: linear-gradient(135deg,#D97706,#B45309);
      color: #fff; border: none; border-radius: 12px;
      padding: 14px 36px; font-size: 1rem; font-weight: 700;
      cursor: pointer; letter-spacing: 0.04em;
      box-shadow: 0 6px 22px rgba(217,119,6,0.42);
      font-family: 'Lato', sans-serif;
      transition: transform 0.25s, box-shadow 0.25s;
    }
    .amber-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(217,119,6,0.55); }

    .ghost-btn {
      background: transparent;
      color: #F8FAFC; border: 1.5px solid rgba(248,250,252,0.4);
      border-radius: 12px; padding: 14px 36px;
      font-size: 1rem; font-weight: 600; cursor: pointer;
      letter-spacing: 0.04em; font-family: 'Lato', sans-serif;
      transition: background 0.3s, border-color 0.3s;
    }
    .ghost-btn:hover { background: rgba(248,250,252,0.08); border-color: rgba(248,250,252,0.7); }

    .section-tag {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.3);
      color: #D97706; padding: 5px 16px; border-radius: 24px;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em;
      text-transform: uppercase; margin-bottom: 1rem;
      font-family: 'Lato', sans-serif;
    }
    .divider-amber {
      height: 3px; width: 0;
      background: linear-gradient(90deg,#D97706,#F59E0B);
      border-radius: 2px; margin-top: 14px;
      animation: drawLine 1s ease 0.7s forwards;
    }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #F8FAFC; }
    ::-webkit-scrollbar-thumb { background: #D97706; border-radius: 3px; }
  `}</style>
);

/* ─── Main component ─────────────────────────────────────────────────────── */
const RaadhyamHomepage = () => {

  const courses = [
    { name: 'Vocal Training',     icon: '🎤', desc: 'Indian Classical, Bollywood & Western vocals with voice modulation, breathing, and stage performance.' },
    { name: 'String Instruments', icon: '🎸', desc: 'Guitar, Violin, Sitar & Ukulele — fingerpicking, chords, ragas, melodies, and advanced techniques.' },
    { name: 'Keyboard & Piano',   icon: '🎹', desc: 'Classical & contemporary piano — chords, scales, sight-reading, improvisation & composition.' },
    { name: 'Percussion',         icon: '🥁', desc: 'Tabla, Drums, Cajon, Dholak & more. Rhythm cycles, hand techniques, coordination & performance.' },
    { name: 'Wind Instruments',   icon: '🎷', desc: 'Flute, Saxophone & Harmonica with breath control, notation, ragas, and western melodies.' },
    { name: 'Music Theory',       icon: '🎼', desc: 'Basics to advanced — notation, harmony, rhythm, scales, chords & composition beautifully structured.' },
    { name: 'Online Classes',     icon: '💻', desc: 'Interactive virtual sessions with live guidance, recordings, weekly assignments & personalized feedback.' },
    { name: 'Advanced Courses',   icon: '⭐', desc: 'Professional certification, stage performance, studio recording, mixing & mastering.' },
  ];

  const features = [
    { icon: '❤️', title: 'Learn with Heart',          desc: 'Every session blends emotion, expression, and mentorship — building a deep, lifelong connection with music.' },
    { icon: '🌐', title: 'Online & Offline',           desc: 'Learn from anywhere or join us at the studio — HD virtual classes + structured offline sessions.' },
    { icon: '🎼', title: '25+ Instruments',            desc: 'Tabla, Harmonium, Sitar, Guitar, Keyboard, Drums, Violin — from beginners to advanced learners.' },
    { icon: '🏆', title: 'Professional Mentors',       desc: 'Trained musicians and industry experts focused on skill, creativity, performance, and discipline.' },
    { icon: '🎭', title: 'Stage Performances',         desc: 'Real-stage exposure through concerts, competitions, showcases, and studio recordings.' },
    { icon: '📜', title: 'Certifications & Exams',     desc: 'Prepared for Trinity, ABRSM, Gandharva, and other prestigious music certifications.' },
  ];

  const testimonials = [
    { name: 'Priya Sharma',   role: 'Vocal Student',   text: 'Raadhyam transformed my singing completely. Sir Dheeraj\'s patience and deep knowledge of classical music is unmatched.' },
    { name: 'Arjun Mehta',    role: 'Guitar Student',  text: 'I started from zero and within 6 months I was performing on stage. The structured curriculum is brilliant.' },
    { name: 'Sneha Gupta',    role: 'Piano Student',   text: 'The online classes are just as effective as offline. The personalized feedback after every session is what sets Raadhyam apart.' },
  ];

  const instruments = ['🎵 Tabla','🎸 Guitar','🎹 Piano','🎷 Saxophone','🎻 Violin','🥁 Drums','🎤 Vocals','🪗 Harmonium','🎺 Trumpet','🪘 Dholak','🎼 Flute','🎵 Sitar'];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Lato', Arial, sans-serif" }}>
      <GlobalStyles />
      <NavBar />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', paddingTop: 70,
        background: 'linear-gradient(135deg, #FFF8EE 0%, #FEF3C7 40%, #FFFBF5 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Large decorative amber circle — top right */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Small decorative circle — bottom left */}
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: 360, height: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,119,6,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        {/* Subtle dot pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(217,119,6,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />

        {/* Floating notes — dark amber on light bg */}
        {[
          { note: '♩', style: { top: '14%', left: '4%',  animationDelay: '0s',   fontSize: '2rem',   color: '#D97706', opacity: 0.18 } },
          { note: '♫', style: { top: '20%', right: '5%', animationDelay: '1.3s', fontSize: '1.8rem', color: '#D97706', opacity: 0.15 } },
          { note: '♬', style: { bottom: '20%', left: '8%', animationDelay: '2.5s', color: '#D97706', opacity: 0.14 } },
          { note: '♪', style: { top: '60%', right: '10%', animationDelay: '0.7s', color: '#D97706', opacity: 0.16 } },
          { note: '𝄞', style: { top: '44%', left: '2%',  animationDelay: '1.9s', fontSize: '2.6rem', color: '#D97706', opacity: 0.12 } },
          { note: '♩', style: { bottom: '32%', right: '3%', animationDelay: '3.2s', color: '#D97706', opacity: 0.13 } },
        ].map((n, i) => (
          <span key={i} style={{
            position: 'absolute', userSelect: 'none', pointerEvents: 'none',
            fontSize: n.style.fontSize || '1.6rem',
            color: n.style.color,
            opacity: n.style.opacity,
            top: n.style.top, bottom: n.style.bottom,
            left: n.style.left, right: n.style.right,
            animation: `floatNote 7s ease-in-out ${n.style.animationDelay} infinite`,
          }}>{n.note}</span>
        ))}

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 2rem 4rem', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>

            {/* Left */}
            <div className="hero-left">
              <div className="section-tag">🎵 Classical Music Education</div>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.8rem,5vw,4.2rem)', fontWeight: 700,
                lineHeight: 1.1, color: '#1E293B', marginBottom: '1.2rem',
                letterSpacing: '-0.02em',
              }}>
                Discover Your{' '}
                <span style={{
                  background: 'linear-gradient(90deg,#D97706,#F59E0B,#D97706)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite',
                }}>Musical</span>
                <br />Identity
              </h1>
              <div className="divider-amber" />

              <p className="hero-sub" style={{
                color: '#475569', fontSize: '1.1rem', lineHeight: 1.85,
                margin: '1.5rem 0', maxWidth: 480,
              }}>
                Professional music education rooted in the Guru–Shishya tradition. Online & offline classes for all ages, all instruments, all skill levels.
              </p>

              <div className="hero-cta" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: '2rem' }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <button className="amber-btn">Start Learning Today</button>
                </Link>
                <Link to="/Contact-Us" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'transparent', color: '#1E293B',
                    border: '2px solid #1E293B', borderRadius: 12,
                    padding: '13px 32px', fontSize: '1rem', fontWeight: 600,
                    cursor: 'pointer', letterSpacing: '0.04em',
                    fontFamily: "'Lato', sans-serif",
                    transition: 'background 0.3s, color 0.3s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#1E293B'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1E293B'; }}
                  >Get Free Enquiry</button>
                </Link>
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: '2.5rem', flexWrap: 'wrap' }}>
                {['✓ Certified Instructors', '✓ All Age Groups', '✓ Online & Offline'].map(b => (
                  <span key={b} style={{ color: '#64748B', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em' }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Right — image card */}
            <div className="hero-right" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

              {/* Decorative background blob */}
              <div style={{
                position: 'absolute', width: '85%', height: '85%',
                borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
                background: 'linear-gradient(135deg, rgba(217,119,6,0.15), rgba(251,191,36,0.1))',
                zIndex: 0,
              }} />

              {/* Main image card */}
              <div style={{
                position: 'relative', zIndex: 2,
                borderRadius: 28,
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(217,119,6,0.2), 0 8px 32px rgba(30,41,59,0.12)',
                border: '3px solid rgba(217,119,6,0.3)',
                maxWidth: 420, width: '100%',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=700&auto=format&fit=crop&q=80"
                  alt="Music Learning at Raadhyam"
                  style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }}
                />
                {/* Overlay gradient bottom */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                  background: 'linear-gradient(to top, rgba(30,41,59,0.75), transparent)',
                }} />
                {/* Badge bottom left */}
                <div style={{
                  position: 'absolute', bottom: 18, left: 18,
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: 12, padding: '10px 16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#D97706,#B45309)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}>🎵</div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E293B' }}>500+ Students</div>
                    <div style={{ fontSize: '0.68rem', color: '#D97706', fontWeight: 700 }}>★★★★★ 5.0 Rated</div>
                  </div>
                </div>
                {/* Badge top right */}
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'linear-gradient(135deg,#D97706,#B45309)',
                  color: '#fff', borderRadius: 10, padding: '6px 14px',
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                  boxShadow: '0 4px 14px rgba(217,119,6,0.4)',
                }}>LIVE CLASSES</div>
              </div>

              {/* Floating mini card */}
              <div style={{
                position: 'absolute', top: '8%', left: '-5%', zIndex: 3,
                background: '#fff', borderRadius: 14, padding: '12px 16px',
                boxShadow: '0 8px 28px rgba(30,41,59,0.12)',
                border: '1px solid rgba(217,119,6,0.2)',
                animation: 'floatNote 5s ease-in-out 0.5s infinite',
              }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>🎸</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E293B' }}>25+ Instruments</div>
              </div>

              {/* Floating mini card 2 */}
              <div style={{
                position: 'absolute', bottom: '10%', right: '-4%', zIndex: 3,
                background: '#fff', borderRadius: 14, padding: '12px 16px',
                boxShadow: '0 8px 28px rgba(30,41,59,0.12)',
                border: '1px solid rgba(217,119,6,0.2)',
                animation: 'floatNote 6s ease-in-out 1.5s infinite',
              }}>
                <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>🏆</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1E293B' }}>Certified Mentors</div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-stats" style={{
            marginTop: '5rem', paddingTop: '3rem',
            borderTop: '1px solid rgba(30,41,59,0.08)',
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem',
          }}>
            <StatCard value={500} suffix="+" label="Students Trained"    delay={0}   dark />
            <StatCard value={15}  suffix="+" label="Expert Instructors"  delay={120} dark />
            <StatCard value={25}  suffix="+" label="Instruments"         delay={240} dark />
            <StatCard value={7}   suffix="+" label="Years of Excellence" delay={360} dark />
          </div>
        </div>
      </section>

      {/* ══ MARQUEE INSTRUMENTS STRIP ════════════════════════════════════ */}
      <div style={{
        background: '#1E293B',
        borderTop: '1px solid rgba(217,119,6,0.2)',
        borderBottom: '1px solid rgba(217,119,6,0.2)',
        padding: '14px 0', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', width: 'max-content' }}>
          {[...instruments, ...instruments].map((item, i) => (
            <span key={i} style={{
              color: '#94A3B8', fontSize: '0.82rem', fontWeight: 600,
              letterSpacing: '0.1em', padding: '0 2rem', whiteSpace: 'nowrap',
            }}>
              {item} <span style={{ color: 'rgba(217,119,6,0.4)', marginLeft: '1.5rem' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ WHY CHOOSE ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem', maxWidth: 600 }}>
            <div className="section-tag">✦ Our Strengths</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700,
              color: '#1E293B', letterSpacing: '-0.02em',
            }}>Why Choose Raadhyam?</h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.75 }}>
              We don't just teach music — we shape musicians with care, creativity, and professional excellence.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* ══ FOUNDER ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 2rem',
        background: 'linear-gradient(135deg, #FFF8EE 0%, #FEF3C7 50%, #FFFBF5 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-5%', top: '5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(217,119,6,0.1) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem' }}>
            <div className="section-tag" style={{ background: 'rgba(217,119,6,0.12)', borderColor: 'rgba(217,119,6,0.35)' }}>
              ✦ Meet Our Founder
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700,
              color: '#1E293B', letterSpacing: '-0.02em',
            }}>The Heart Behind Raadhyam</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5rem', alignItems: 'center' }}>
            {/* Photo */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute', inset: -14, borderRadius: '50%',
                border: '2px solid rgba(217,119,6,0.18)',
              }} />
              <div style={{
                width: 260, height: 260, borderRadius: '50%',
                border: '3px solid rgba(217,119,6,0.35)',
                overflow: 'hidden', position: 'relative', zIndex: 2,
                boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
                background: 'linear-gradient(135deg,rgba(217,119,6,0.15),rgba(30,41,59,0.5))',
              }}>
                <img src="/founder.jpg" alt="Mr. Dheeraj Solanki"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div style={{
                position: 'absolute', bottom: -8, right: '10%', zIndex: 3,
                background: 'linear-gradient(135deg,#D97706,#B45309)',
                color: '#fff', borderRadius: 12, padding: '8px 16px',
                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em',
                boxShadow: '0 8px 24px rgba(217,119,6,0.4)',
              }}>Founder & Director</div>
            </div>

            {/* Content */}
            <div>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.2rem', fontWeight: 700, color: '#1E293B', marginBottom: 6,
              }}>Mr. Dheeraj Solanki</h3>
              <p style={{ color: '#D97706', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                Indian Classical Musician & Music Educator
              </p>
              <p style={{ color: '#475569', lineHeight: 1.85, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
                With over 7 years of dedicated training in Indian Classical Music under the traditional Guru–Shishya Parampara, Mr. Dheeraj Solanki brings depth, discipline, and a soulful touch to his teaching style.
              </p>
              <blockquote style={{
                borderLeft: '3px solid #D97706', paddingLeft: '1.25rem',
                margin: '1.75rem 0', fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.2rem', fontStyle: 'italic', color: '#1E293B', lineHeight: 1.75,
                background: 'rgba(217,119,6,0.05)', padding: '1rem 1.25rem', borderRadius: '0 12px 12px 0',
              }}>
                "Music is a powerful medium — it heals, inspires, and transforms. My goal is to help every learner discover their true musical identity."
              </blockquote>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  { val: '7+ Yrs', lbl: 'Classical Training' },
                  { val: '3+ Yrs', lbl: 'Professional Teaching' },
                  { val: '10+',    lbl: 'Instruments Taught' },
                ].map((s, i) => (
                  <div key={i} style={{
                    textAlign: 'center', padding: '1rem',
                    background: '#fff',
                    border: '1px solid rgba(217,119,6,0.25)',
                    borderRadius: 14,
                    boxShadow: '0 2px 12px rgba(217,119,6,0.08)',
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', fontFamily: "'Cormorant Garamond', serif" }}>{s.val}</div>
                    <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 4 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COURSES ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem', maxWidth: 600 }}>
            <div className="section-tag">✦ Our Programs</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700,
              color: '#1E293B', letterSpacing: '-0.02em',
            }}>Music Programs for Every Soul</h2>
            <p style={{ color: '#64748B', fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.75 }}>
              Structured courses for all ages and skill levels — certified instructors, real-time practice, personalized feedback.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.25rem' }}>
            {courses.map((c, i) => <CourseCard key={i} {...c} index={i} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/Courses" style={{ textDecoration: 'none' }}>
              <button className="amber-btn" style={{ padding: '13px 40px' }}>View All Courses</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 2rem',
        background: 'linear-gradient(135deg, #FFF8EE 0%, #FEF3C7 50%, #FFFBF5 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(217,119,6,0.07) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <div className="section-tag">
              ✦ Student Stories
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700,
              color: '#1E293B', letterSpacing: '-0.02em',
            }}>What Our Students Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {testimonials.map((t, i) => <TestimonialCard key={i} {...t} delay={i * 100} />)}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 2rem',
        background: '#F8FAFC',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative musical staff lines */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${20 + i * 14}%`, height: 1,
            background: 'rgba(30,41,59,0.04)', pointerEvents: 'none',
          }} />
        ))}
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg,#D97706,#B45309)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.2rem', margin: '0 auto 2rem',
            boxShadow: '0 12px 36px rgba(217,119,6,0.4)',
            animation: 'glowPulse 3s ease-in-out infinite',
          }}>🎵</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.2rem,4vw,3.2rem)', fontWeight: 700,
            color: '#1E293B', letterSpacing: '-0.02em', marginBottom: '1rem',
          }}>Ready to Begin Your Musical Journey?</h2>
          <p style={{ color: '#64748B', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.75, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Join hundreds of students learning music with heart at Raadhyam Musical Classes. First trial class is on us.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="amber-btn" style={{ fontSize: '1.05rem', padding: '15px 44px' }}>Enroll Now</button>
            </Link>
            <a href="mailto:raadhyammusicals@gmail.com" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent', color: '#1E293B',
                border: '1.5px solid rgba(30,41,59,0.3)',
                borderRadius: 12, padding: '15px 36px',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Lato', sans-serif", letterSpacing: '0.04em',
                transition: 'border-color 0.3s, background 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.color = '#D97706'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(30,41,59,0.3)'; e.currentTarget.style.color = '#1E293B'; }}
              >✉ Email Us</button>
            </a>
          </div>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginTop: '1.75rem', letterSpacing: '0.05em' }}>
            raadhyammusicals@gmail.com
          </p>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer style={{
        background: '#fff',
        borderTop: '2px solid #D97706',
        padding: '4rem 2rem 2rem',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' }}>
          {/* Brand */}
          <div>
            <img src="/Raadhyam.png" alt="Raadhyam" style={{ height: 52, marginBottom: '1.25rem' }}
              onError={e => e.target.style.display = 'none'} />
            <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: 280 }}>
              Teaching music with heart and passion. Online & offline classes for all instruments and all ages.
            </p>
            {/* Social links */}
            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
              {[
                {
                  href: 'https://www.instagram.com/learnwith_raadhyam/',
                  label: 'Instagram',
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://www.youtube.com/@raadhyammusicacademy',
                  label: 'YouTube',
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://www.linkedin.com/',
                  label: 'LinkedIn',
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                },
                {
                  href: 'https://www.facebook.com/',
                  label: 'Facebook',
                  svg: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  title={s.label}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    color: '#475569',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                    transition: 'background 0.25s, color 0.25s, border-color 0.25s, transform 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#D97706'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#D97706'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none'; }}
                >{s.svg}</a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {[
            { title: 'Quick Links', links: [{ l: 'Home', h: '/' }, { l: 'About Us', h: '/About-Us' }, { l: 'Courses', h: '/Courses' }, { l: 'Notes', h: '/Notes' }, { l: 'Contact', h: '/Contact-Us' }] },
            { title: 'Contact', links: [{ l: 'raadhyammusicals@gmail.com', h: 'mailto:raadhyammusicals@gmail.com' }, { l: 'Agra, Uttar Pradesh', h: '#' }, { l: 'Online Worldwide', h: '#' }] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{
                color: '#1E293B', fontWeight: 700, fontSize: '0.78rem',
                letterSpacing: '0.14em', marginBottom: '1.25rem',
                textTransform: 'uppercase', fontFamily: "'Lato', sans-serif",
                paddingBottom: '0.6rem',
                borderBottom: '1px solid rgba(217,119,6,0.3)',
              }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(lk => (
                  <li key={lk.l}>
                    <a href={lk.h} style={{
                      color: '#64748B', fontSize: '0.85rem',
                      textDecoration: 'none', transition: 'color 0.25s',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#D97706'}
                      onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
                    >
                      <span style={{ color: 'rgba(217,119,6,0.4)', fontSize: '0.6rem' }}>◆</span>
                      {lk.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Enroll CTA */}
          <div>
            <h4 style={{
              color: '#1E293B', fontWeight: 700, fontSize: '0.78rem',
              letterSpacing: '0.14em', marginBottom: '1.25rem',
              textTransform: 'uppercase', fontFamily: "'Lato', sans-serif",
              paddingBottom: '0.6rem',
              borderBottom: '1px solid rgba(217,119,6,0.3)',
            }}>Enroll Today</h4>
            <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              Start your musical journey with a free trial class.
            </p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="amber-btn" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>Get Started</button>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(30,41,59,0.1)',
          marginTop: '3rem', paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ color: '#64748B', fontSize: '0.82rem', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} Raadhyam Musical Classes. All rights reserved.
          </p>
          <p style={{ color: '#64748B', fontSize: '0.82rem' }}>
            Crafted with <span style={{ color: '#D97706' }}>♥</span> for Music
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RaadhyamHomepage;
