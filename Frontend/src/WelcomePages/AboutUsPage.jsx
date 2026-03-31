 main
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Award, Clock, Music, GraduationCap, Heart, Target, Eye, BookOpen, Star, Mic } from 'lucide-react';

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Music,
  Users,
  Target,
  Eye,
  Heart,
  GraduationCap,
  Award,
  Clock,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  BookOpen,
  Mic,
  Star,
  MapPin,
} from 'lucide-react';
 main
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';
import heroBg from '../assets/hero-bg.jpg';

 main
/* ── Design tokens — identical to WelcomePage ─────────────────────────── */
const AMBER      = '#D97706';
const AMBER_DARK = '#B45309';
const SLATE      = '#1E293B';
const MUTED      = '#64748B';
const WARM_BG    = 'linear-gradient(135deg,#FFF8EE 0%,#FEF3C7 40%,#FFFBF5 100%)';
const DOT_PAT    = { position:'absolute', inset:0, opacity:0.3, backgroundImage:'radial-gradient(circle,rgba(217,119,6,0.12) 1px,transparent 1px)', backgroundSize:'36px 36px', pointerEvents:'none' };
const SERIF      = "'Cormorant Garamond',Georgia,serif";
const SANS       = "'Lato',system-ui,sans-serif";

/* ── Hooks ─────────────────────────────────────────────────────────────── */
const useVisible = (threshold = 0.15) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const useCounter = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const n = parseInt(String(target).replace(/\D/g, ''));
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor(p * n));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

/* ── Global CSS ─────────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    @keyframes floatNote{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-18px) rotate(5deg)}66%{transform:translateY(10px) rotate(-4deg)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes drawLine{from{width:0}to{width:72px}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes scaleIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes gradientShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
    @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .section-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(217,119,6,.1);border:1px solid rgba(217,119,6,.3);color:${AMBER};padding:5px 16px;border-radius:24px;font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;margin-bottom:1rem;font-family:'Lato',sans-serif}
    .amber-btn{background:linear-gradient(135deg,${AMBER},${AMBER_DARK});color:#fff;border:none;border-radius:12px;padding:14px 36px;font-size:1rem;font-weight:700;cursor:pointer;letter-spacing:.04em;box-shadow:0 6px 22px rgba(217,119,6,.42);font-family:'Lato',sans-serif;transition:transform .25s,box-shadow .25s;text-decoration:none;display:inline-block}
    .amber-btn:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(217,119,6,.55)}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:#FFF8EE}
    ::-webkit-scrollbar-thumb{background:${AMBER};border-radius:3px}
    @media(max-width:900px){
      .about-hero-grid{grid-template-columns:1fr!important}
      .about-stats-grid{grid-template-columns:repeat(2,1fr)!important}
      .about-values-grid{grid-template-columns:repeat(2,1fr)!important}
      .about-team-grid{grid-template-columns:1fr!important}
      .about-mission-grid{grid-template-columns:1fr!important}
      .about-instruments-grid{grid-template-columns:repeat(3,1fr)!important}
    }
    @media(max-width:540px){
      .about-stats-grid{grid-template-columns:repeat(2,1fr)!important}
      .about-values-grid{grid-template-columns:1fr!important}
      .about-instruments-grid{grid-template-columns:repeat(2,1fr)!important}
    }
  `}</style>
);

/* ── Reusable section heading ───────────────────────────────────────────── */
const SectionHeading = ({ tag, title, subtitle }) => {
  const [ref, visible] = useVisible(0.2);
  return (
    <div ref={ref} style={{ textAlign:'center', marginBottom:'3.5rem', opacity:visible?1:0, transform:visible?'translateY(0)':'translateY(28px)', transition:'opacity .7s ease,transform .7s ease' }}>
      <span className="section-tag">{tag}</span>
      <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:700, color:SLATE, fontFamily:SERIF, letterSpacing:'-0.02em', marginBottom:subtitle?'1rem':0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize:'1.05rem', color:MUTED, maxWidth:560, margin:'0 auto', lineHeight:1.8, fontFamily:SANS }}>{subtitle}</p>}
      <div style={{ height:3, width:0, background:`linear-gradient(90deg,${AMBER},#F59E0B)`, borderRadius:2, margin:'1.2rem auto 0', animation:visible?'drawLine 1s ease .3s forwards':'none' }} />
    </div>
  );
};

/* ── Stat card ──────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, number, label, delay }) => {
  const [ref, visible] = useVisible(0.2);
  const [hov, setHov] = useState(false);
  const count = useCounter(number, 1600, visible);
  const suffix = String(number).replace(/\d/g, '');
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?`linear-gradient(135deg,${AMBER},${AMBER_DARK})`:'#fff', border:`1px solid ${hov?AMBER:'#E2E8F0'}`, borderRadius:20, padding:'1.75rem', textAlign:'center', opacity:visible?1:0, transform:visible?(hov?'translateY(-8px) scale(1.05)':'translateY(0)'):'translateY(28px)', transition:`opacity .6s ease ${delay}ms,transform .35s ease,background .4s,border .3s,box-shadow .35s`, boxShadow:hov?`0 24px 56px rgba(217,119,6,0.25)`:'0 2px 12px rgba(30,41,59,.05)', cursor:'default', position:'relative', overflow:'hidden' }}>
      <div style={{ width:52, height:52, borderRadius:14, background:hov?'rgba(255,255,255,0.25)':`rgba(217,119,6,0.1)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', transition:'background .4s,transform .3s', transform:hov?'scale(1.15) rotate(10deg)':'scale(1)' }}>
        <Icon style={{ color:hov?'#fff':AMBER, width:24, height:24 }} />
      </div>
      <div style={{ fontSize:'2.2rem', fontWeight:800, color:hov?'#fff':AMBER, fontFamily:SERIF, lineHeight:1, marginBottom:'0.4rem', transition:'color .3s' }}>{visible?`${count}${suffix}`:`0${suffix}`}</div>
      <div style={{ fontSize:'.78rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:hov?'rgba(255,255,255,.85)':MUTED, fontFamily:SANS, transition:'color .3s' }}>{label}</div>
    </div>
  );
};

/* ── Value card ─────────────────────────────────────────────────────────── */
const ValueCard = ({ icon: Icon, title, description, delay }) => {
  const [ref, visible] = useVisible(0.15);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'#fff', border:`1px solid ${hov?`rgba(217,119,6,.45)`:'#E2E8F0'}`, borderRadius:20, padding:'2rem', boxShadow:hov?`0 28px 64px rgba(217,119,6,.18)`:'0 2px 16px rgba(30,41,59,.05)', transform:visible?(hov?'translateY(-10px) scale(1.02)':'translateY(0)'):'translateY(32px)', opacity:visible?1:0, transition:`opacity .7s ease ${delay}ms,transform .4s ease,box-shadow .4s,border .3s`, position:'relative', overflow:'hidden', cursor:'default' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:hov?`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`:'transparent', backgroundSize:'200% 100%', animation:hov?'gradientShift 2s ease infinite':'none', transition:'background .4s', borderRadius:'20px 20px 0 0' }} />
      <div style={{ width:58, height:58, borderRadius:16, background:hov?`linear-gradient(135deg,${AMBER},${AMBER_DARK})`:`rgba(217,119,6,0.1)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem', transition:'background .4s,box-shadow .4s,transform .4s', transform:hov?'scale(1.1) rotate(-5deg)':'scale(1)', boxShadow:hov?`0 12px 32px rgba(217,119,6,.4)`:'none' }}>
        <Icon style={{ color:hov?'#fff':AMBER, width:26, height:26, transition:'color .3s' }} />
      </div>
      <h3 style={{ fontSize:'1.15rem', fontWeight:700, color:SLATE, marginBottom:'.6rem', fontFamily:SERIF }}>{title}</h3>
      <p style={{ color:MUTED, fontSize:'.88rem', lineHeight:1.75, margin:0, fontFamily:SANS }}>{description}</p>
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lato:wght@400;600;700&display=swap');

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes pulseDot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.35); opacity: .55; }
    }

    .au-fade-up { animation: fadeUp .75s ease both; }
    .au-fade-up-d1 { animation: fadeUp .75s ease .12s both; }
    .au-fade-up-d2 { animation: fadeUp .75s ease .24s both; }
    .au-marquee { animation: marquee 28s linear infinite; }
    .au-pulse-dot { animation: pulseDot 2s ease infinite; }

    .au-card {
      background: rgba(255,255,255,.88);
      border: 1px solid rgba(217,119,6,.2);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
    }
    .au-card:hover {
      transform: translateY(-6px);
      border-color: rgba(217,119,6,.42);
      box-shadow: 0 20px 44px rgba(15,23,42,.14);
    }

    .au-dark-card {
      background: linear-gradient(160deg, rgba(15,23,42,.84), rgba(30,41,59,.82));
      border: 1px solid rgba(245,158,11,.35);
      border-radius: 20px;
      box-shadow: 0 16px 36px rgba(2,6,23,.32);
      transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
    }
    .au-dark-card:hover {
      transform: translateY(-6px);
      border-color: rgba(245,158,11,.62);
      box-shadow: 0 22px 46px rgba(2,6,23,.45);
    }

    .au-gold-gradient {
      background: linear-gradient(135deg,#D97706,#F59E0B,#D97706);
      color: #fff;
    }

    .au-text-gradient {
      background: linear-gradient(90deg,#F59E0B,#D97706,#B45309);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Playfair Display', Georgia, serif;
    }
  `}</style>
);

const SectionHeading = ({ tag, title, subtitle }) => {
  const { ref, inView } = useInView(0.2);
  return (
    <div
      ref={ref}
      className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-600/30 bg-amber-100 text-amber-700 text-xs font-bold tracking-[0.16em] uppercase mb-4">
        {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">{title}</h2>
      {subtitle && <p className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
};

const StatCard = ({ stat, delay }) => {
  const { ref, inView } = useInView(0.2);
  const Icon = stat.icon;
  return (
    <div
      ref={ref}
      className="au-dark-card p-6 text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      <div className="w-12 h-12 mx-auto rounded-xl bg-amber-400/20 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-amber-300" />
      </div>
      <p className="text-3xl font-bold text-amber-300 mb-1">{stat.number}</p>
      <p className="text-slate-200/85 text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
    </div>
  );
};

const ValueCard = ({ value, delay }) => {
  const { ref, inView } = useInView(0.15);
  const Icon = value.icon;
  return (
    <div
      ref={ref}
      className="au-card p-7"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-amber-700" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{value.description}</p>
 main
    </div>
  );
};

 main
/* ── Team card ──────────────────────────────────────────────────────────── */
const TeamCard = ({ member, delay }) => {
  const [ref, visible] = useVisible(0.1);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'#fff', border:`1px solid ${hov?`rgba(217,119,6,.3)`:'#E2E8F0'}`, borderRadius:24, padding:'2.5rem', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', opacity:visible?1:0, transform:visible?(hov?'translateY(-8px) scale(1.02)':'translateY(0)'):'translateY(32px)', transition:`opacity .7s ease ${delay}ms,transform .4s ease,box-shadow .4s,border .3s`, boxShadow:hov?`0 32px 72px rgba(217,119,6,.18)`:'0 4px 20px rgba(30,41,59,.06)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER_DARK},${AMBER})`, backgroundSize:'200% 100%', animation:hov?'gradientShift 3s ease infinite':'none', borderRadius:'24px 24px 0 0' }} />
      <div style={{ width:160, height:160, borderRadius:'50%', overflow:'hidden', border:`4px solid rgba(217,119,6,.2)`, boxShadow:hov?`0 0 0 12px rgba(217,119,6,.12),0 12px 32px rgba(217,119,6,.2)`:'0 0 0 0px rgba(217,119,6,0)', marginBottom:'1.5rem', transition:'box-shadow .4s,transform .4s', transform:hov?'scale(1.05)':'scale(1)' }}>
        <img src={member.image} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%', transition:'transform .4s', transform:hov?'scale(1.1)':'scale(1)' }} />
      </div>
      <h3 style={{ fontSize:'1.5rem', fontWeight:700, color:SLATE, marginBottom:'.3rem', fontFamily:SERIF }}>{member.name}</h3>
      <p style={{ color:AMBER, fontWeight:700, fontSize:'.85rem', letterSpacing:'.06em', marginBottom:'1rem', fontFamily:SANS, textTransform:'uppercase' }}>{member.role}</p>
      <p style={{ color:MUTED, fontSize:'.9rem', lineHeight:1.8, marginBottom:'1.5rem', maxWidth:380, fontFamily:SANS }}>{member.bio}</p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', marginBottom:'1.25rem' }}>
        {member.expertise.map((s, i) => (
          <span key={i} style={{ background:`rgba(217,119,6,${hov?.12:.08})`, color:AMBER, border:`1px solid rgba(217,119,6,.2)`, padding:'4px 12px', borderRadius:20, fontSize:'.78rem', fontWeight:600, fontFamily:SANS }}>{s}</span>
        ))}
      </div>
      <ul style={{ listStyle:'none', padding:0, margin:0, width:'100%' }}>
        {member.achievements.map((a, i) => (
          <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:'.5rem', justifyContent:'center' }}>
            <CheckCircle style={{ color:'#16a34a', width:15, height:15, flexShrink:0, marginTop:2 }} />
            <span style={{ color:MUTED, fontSize:'.82rem', fontFamily:SANS, textAlign:'left' }}>{a}</span>
          </li>
        ))}
      </ul>

const TeamCard = ({ member, delay }) => {
  const { ref, inView } = useInView(0.12);
  return (
    <div
      ref={ref}
      className="au-card p-7"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-4 border-4 border-amber-500/30">
        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 text-center">{member.name}</h3>
      <p className="text-amber-700 font-bold text-xs uppercase tracking-wider text-center mt-1 mb-4">{member.role}</p>
      <p className="text-slate-600 text-sm leading-relaxed mb-5">{member.bio}</p>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-bold mb-2">Expertise</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {member.expertise.map((skill) => (
          <span key={skill} className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300/60">
            {skill}
          </span>
        ))}
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-bold mb-2">Achievements</p>
      <div className="space-y-1.5">
        {member.achievements.map((a) => (
          <div key={a} className="flex items-start gap-2 text-sm text-slate-600">
            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
            <span>{a}</span>
          </div>
        ))}
      </div>
 main
    </div>
  );
};

 main
/* ── Mission/Vision card ────────────────────────────────────────────────── */
const MissionCard = ({ icon: Icon, title, texts, delay }) => {
  const [ref, visible] = useVisible(0.1);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:hov?`linear-gradient(135deg,#fff 0%,#FFF8EE 50%,#fff 100%)`:'#fff', border:`2px solid ${hov?`rgba(217,119,6,.4)`:'#E2E8F0'}`, borderRadius:20, padding:'2.5rem', opacity:visible?1:0, transform:visible?(hov?'translateY(-10px) scale(1.02)':'translateY(0)'):'translateY(28px)', transition:`opacity .7s ease ${delay}ms,transform .4s ease,box-shadow .4s,border .3s,background .5s`, boxShadow:hov?`0 32px 72px rgba(217,119,6,.2)`:'0 2px 16px rgba(30,41,59,.05)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:hov?`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`:'transparent', backgroundSize:'200% 100%', animation:hov?'gradientShift 2s ease infinite':'none', transition:'background .4s', borderRadius:'20px 20px 0 0' }} />
      <div style={{ width:60, height:60, borderRadius:16, background:hov?`linear-gradient(135deg,${AMBER},${AMBER_DARK})`:`rgba(217,119,6,0.1)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem', transition:'background .4s,box-shadow .4s,transform .4s', boxShadow:hov?`0 12px 32px rgba(217,119,6,.4)`:'none', transform:hov?'scale(1.15) rotate(-10deg)':'scale(1)' }}>
        <Icon style={{ color:hov?'#fff':AMBER, width:28, height:28, transition:'color .3s' }} />
      </div>
      <h3 style={{ fontSize:'1.5rem', fontWeight:700, color:hov?AMBER:SLATE, marginBottom:'1rem', fontFamily:SERIF, transition:'color .3s' }}>{title}</h3>
      {texts.map((t, i) => <p key={i} style={{ color:MUTED, lineHeight:1.8, marginBottom:i<texts.length-1?'1rem':0, fontFamily:SANS, fontSize:'.92rem' }}>{t}</p>)}

const InstrumentCard = ({ inst, index }) => {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="au-card overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity .6s ease ${(index % 6) * 60}ms, transform .6s ease ${(index % 6) * 60}ms`,
      }}
    >
      <div className="h-28 overflow-hidden">
        <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 text-center">
        <span className="text-sm font-semibold text-slate-800">{inst.name}</span>
      </div>
 main
    </div>
  );
};

 main
/* ── Main About Page ────────────────────────────────────────────────────── */
const AboutUsPage = () => {
  const floatingNotes = [
    { note:'♩', top:'14%', left:'4%',   delay:'0s',   size:'2rem' },
    { note:'♫', top:'20%', right:'5%',  delay:'1.3s', size:'1.8rem' },
    { note:'♬', bottom:'20%', left:'8%', delay:'2.5s', size:'1.6rem' },
    { note:'♪', top:'60%', right:'10%', delay:'0.7s', size:'1.6rem' },
    { note:'𝄞', top:'44%', left:'2%',   delay:'1.9s', size:'2.6rem' },
  ];

  const stats = [
    { icon: Users,         number: '500+', label: 'Students Trained' },
    { icon: GraduationCap, number: '15+',  label: 'Expert Instructors' },
    { icon: Music,         number: '25+',  label: 'Instruments' },
    { icon: Award,         number: '7+',   label: 'Years of Excellence' },
  ];

  const values = [
    { icon: Heart,         title: 'Passion for Music',      description: 'Every lesson is infused with genuine love for music — we teach with heart, not just technique.' },
    { icon: Target,        title: 'Goal-Oriented Learning',  description: 'Structured curriculum designed to take you from beginner to performer with clear milestones.' },
    { icon: Users,         title: 'Guru–Shishya Tradition',  description: 'Rooted in the ancient Indian tradition of personal mentorship and deep musical bonding.' },
    { icon: Award,         title: 'Certified Excellence',    description: 'Prepared for Trinity, ABRSM, Gandharva and other prestigious music certifications.' },
    { icon: Eye,           title: 'Stage Exposure',          description: 'Real performance opportunities through concerts, competitions, and studio recordings.' },
    { icon: BookOpen,      title: 'Holistic Education',      description: 'Theory, practice, history, and performance — a complete musical education for every student.' },
  ];

  const team = [
    {
      name: 'Mr. Dheeraj Solanki',
      role: 'Founder & Director',
      bio: 'With over 7 years of dedicated training in Indian Classical Music under the Guru–Shishya Parampara, Mr. Dheeraj brings depth, discipline, and a soulful touch to every lesson.',
      image: '/founder.jpg',
      expertise: ['Indian Classical', 'Guitar', 'Harmonium', 'Music Theory'],
      achievements: ['7+ years classical training', '3+ years professional teaching', '10+ instruments mastered'],
    },
    {
      name: 'Ms. Priya Sharma',
      role: 'Vocal & Keyboard Instructor',
      bio: 'A trained Hindustani vocalist and keyboard artist with a passion for blending classical roots with contemporary expression.',
      image: '/Instructor1.jpg',
      expertise: ['Hindustani Vocals', 'Keyboard', 'Bollywood', 'Western'],
      achievements: ['Performed at 50+ events', 'Trinity Grade 8 certified', '200+ students trained'],
    },
    {
      name: 'Mr. Arjun Mehta',
      role: 'Guitar & Percussion Instructor',
      bio: 'A versatile musician specializing in guitar and percussion, bringing energy and precision to every session.',
      image: '/Instructor2.jpg',
      expertise: ['Guitar', 'Tabla', 'Drums', 'Cajon'],
      achievements: ['15+ years performance experience', 'ABRSM certified', 'Studio recording artist'],
    },
  ];

  const instruments = [
    { name: 'Guitar',     emoji: '🎸', image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=80' },
    { name: 'Piano',      emoji: '🎹', image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&auto=format&fit=crop&q=80' },
    { name: 'Violin',     emoji: '🎻', image: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&auto=format&fit=crop&q=80' },
    { name: 'Tabla',      emoji: '🥁', image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&auto=format&fit=crop&q=80' },
    { name: 'Vocals',     emoji: '🎤', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=80' },
    { name: 'Drums',      emoji: '🥁', image: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=400&auto=format&fit=crop&q=80' },
    { name: 'Harmonium',  emoji: '🪗', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80' },
    { name: 'Flute',      emoji: '🎼', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&auto=format&fit=crop&q=80' },
    { name: 'Sitar',      emoji: '🎵', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80' },
    { name: 'Ukulele',    emoji: '🎸', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80' },
    { name: 'Saxophone',  emoji: '🎷', image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&auto=format&fit=crop&q=80' },
    { name: 'Cajon',      emoji: '🪘', image: 'https://images.unsplash.com/photo-1571327073757-71d13c9e04b8?w=400&auto=format&fit=crop&q=80' },
  ];

  const marqueeItems = ['🎵 Tabla','🎸 Guitar','🎹 Piano','🎷 Saxophone','🎻 Violin','🥁 Drums','🎤 Vocals','🪗 Harmonium','🎺 Trumpet','🪘 Dholak','🎼 Flute','🎵 Sitar'];

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', fontFamily:SANS }}>
      <GlobalStyles />
      <NavBarpage />

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ minHeight:'80vh', paddingTop:72, background:WARM_BG, position:'relative', overflow:'hidden', display:'flex', alignItems:'center' }}>
        <div style={{ position:'absolute', top:-120, right:-120, width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.13) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.09) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        {floatingNotes.map((n, i) => (
          <span key={i} style={{ position:'absolute', userSelect:'none', pointerEvents:'none', fontSize:n.size, color:AMBER, opacity:.15, top:n.top, bottom:n.bottom, left:n.left, right:n.right, animation:`floatNote 7s ease-in-out ${n.delay} infinite` }}>{n.note}</span>
        ))}
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'5rem 2rem 4rem', width:'100%', textAlign:'center' }}>
          <span className="section-tag">✦ Our Story</span>
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(2.8rem,5vw,4.2rem)', fontWeight:700, lineHeight:1.1, color:SLATE, marginBottom:'1.2rem', letterSpacing:'-0.02em' }}>
            About{' '}
            <span style={{ background:`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>Raadhyam</span>
          </h1>
          <div style={{ height:3, width:0, background:`linear-gradient(90deg,${AMBER},#F59E0B)`, borderRadius:2, margin:'0 auto 1.5rem', animation:'drawLine 1s ease .5s forwards' }} />
          <p style={{ color:'#475569', fontSize:'1.1rem', lineHeight:1.85, maxWidth:640, margin:'0 auto 2.5rem', fontFamily:SANS }}>
            A music school rooted in the Guru–Shishya tradition, dedicated to nurturing every student's unique musical voice through professional education, personal mentorship, and real-world performance.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            <Link to="/login" className="amber-btn">Start Learning Today</Link>
            <Link to="/Contact-Us" style={{ background:'transparent', color:SLATE, border:`2px solid ${SLATE}`, borderRadius:12, padding:'13px 32px', fontSize:'1rem', fontWeight:600, cursor:'pointer', letterSpacing:'.04em', fontFamily:SANS, transition:'background .3s,color .3s', textDecoration:'none', display:'inline-block' }}
              onMouseEnter={e => { e.target.style.background = SLATE; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = SLATE; }}>
              Get Free Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════════════════ */}
      <div style={{ background:'#fff', borderTop:`1px solid rgba(217,119,6,.15)`, borderBottom:`1px solid rgba(217,119,6,.15)`, padding:'14px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', animation:'marquee 22s linear infinite', width:'max-content' }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} style={{ color:MUTED, fontSize:'.82rem', fontWeight:600, letterSpacing:'.1em', padding:'0 2rem', whiteSpace:'nowrap', fontFamily:SANS }}>
              {item} <span style={{ color:`rgba(217,119,6,.4)`, marginLeft:'1.5rem' }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ═════════════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#F8FAFC' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ Our Impact" title="Raadhyam by the Numbers" subtitle="Years of dedication, hundreds of students, and a legacy of musical excellence." />
          <div className="about-stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem' }}>
            {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 100} />)}
          </div>
        </div>
      </section>

      {/* ══ MISSION & VISION ══════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Our Purpose" title="Mission & Vision" subtitle="What drives us every single day." />
          <div className="about-mission-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem' }}>
            <MissionCard icon={Target} title="Our Mission" delay={0} texts={[
              'To provide world-class music education rooted in the Guru–Shishya tradition, making quality musical training accessible to every aspiring musician regardless of age or background.',
              'We believe music is a universal language — and our mission is to help every student find their voice, develop their craft, and share their gift with the world.',
            ]} />
            <MissionCard icon={Eye} title="Our Vision" delay={150} texts={[
              'To become India\'s most trusted music institution — a place where tradition meets innovation, and where every student leaves not just as a musician, but as a confident, expressive artist.',
              'We envision a community of lifelong learners united by their love for music, performing on stages across the country and beyond.',
            ]} />
          </div>
        </div>
      </section>

      {/* ══ FOUNDER ═══════════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:'#F8FAFC', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:'-5%', top:'5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.1) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Meet Our Founder" title="The Heart Behind Raadhyam" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'5rem', alignItems:'center' }} className="about-hero-grid">
            {/* Photo */}
            <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
              <div style={{ position:'absolute', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,rgba(217,119,6,.15) 0%,transparent 70%)`, top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} />
              <div style={{ width:260, height:260, borderRadius:'50%', border:`3px solid rgba(217,119,6,.35)`, overflow:'hidden', position:'relative', zIndex:2, boxShadow:'0 24px 64px rgba(0,0,0,.2)' }}>
                <img src="/founder.jpg" alt="Mr. Dheeraj Solanki" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div style={{ position:'absolute', bottom:-8, right:'10%', zIndex:3, background:`linear-gradient(135deg,${AMBER},${AMBER_DARK})`, color:'#fff', borderRadius:12, padding:'8px 16px', fontSize:'.78rem', fontWeight:700, letterSpacing:'.05em', boxShadow:`0 8px 24px rgba(217,119,6,.4)`, fontFamily:SANS }}>Founder & Director</div>
            </div>
            {/* Content */}
            <div>
              <h3 style={{ fontFamily:SERIF, fontSize:'2.2rem', fontWeight:700, color:SLATE, marginBottom:6 }}>Mr. Dheeraj Solanki</h3>
              <p style={{ color:AMBER, fontSize:'.9rem', fontWeight:700, letterSpacing:'.1em', marginBottom:'1.5rem', textTransform:'uppercase', fontFamily:SANS }}>Indian Classical Musician & Music Educator</p>
              <p style={{ color:'#475569', lineHeight:1.85, marginBottom:'1.25rem', fontSize:'.95rem', fontFamily:SANS }}>
                With over 7 years of dedicated training in Indian Classical Music under the traditional Guru–Shishya Parampara, Mr. Dheeraj Solanki brings depth, discipline, and a soulful touch to his teaching style.
              </p>
              <blockquote style={{ borderLeft:`3px solid ${AMBER}`, paddingLeft:'1.25rem', margin:'1.75rem 0', fontFamily:SERIF, fontSize:'1.2rem', fontStyle:'italic', color:SLATE, lineHeight:1.75, background:`rgba(217,119,6,.05)`, padding:'1rem 1.25rem', borderRadius:'0 12px 12px 0' }}>
                "Music is a powerful medium — it heals, inspires, and transforms. My goal is to help every learner discover their true musical identity."
              </blockquote>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem' }}>
                {[{val:'7+ Yrs',lbl:'Classical Training'},{val:'3+ Yrs',lbl:'Professional Teaching'},{val:'10+',lbl:'Instruments Taught'}].map((s, i) => (
                  <div key={i} style={{ textAlign:'center', padding:'1rem', background:'#fff', border:`1px solid rgba(217,119,6,.25)`, borderRadius:14, boxShadow:`0 2px 12px rgba(217,119,6,.08)` }}>
                    <div style={{ fontSize:'1.5rem', fontWeight:800, color:AMBER, fontFamily:SERIF }}>{s.val}</div>
                    <div style={{ color:MUTED, fontSize:'.78rem', marginTop:4, fontFamily:SANS }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#fff' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ What We Stand For" title="Our Core Values" subtitle="The principles that guide every lesson, every interaction, and every performance at Raadhyam." />
          <div className="about-values-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            {values.map((v, i) => <ValueCard key={i} {...v} delay={i * 80} />)}

const FacilityCard = ({ facility, delay }) => {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="au-card overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      <div className="h-48 overflow-hidden relative">
        <img src={facility.image} alt={facility.title} className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/50 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{facility.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{facility.description}</p>
      </div>
    </div>
  );
};

const MissionCard = ({ Icon, title, texts, delay }) => {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className="au-card p-8"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-amber-700" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <div className="space-y-3">
        {texts.map((t) => (
          <p key={t} className="text-slate-600 text-sm leading-relaxed">{t}</p>
        ))}
      </div>
    </div>
  );
};

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Priya Sharma',
      role: 'Founder & Head Instructor',
      bio: "Classically trained pianist with 15+ years of teaching experience. Master's in Music Education from Berklee College of Music. Specializes in Western classical and contemporary piano.",
      image: '/Instructor2.jpg',
      expertise: ['Piano', 'Music Theory', 'Composition', 'Western Classical'],
      achievements: ['Grade 8 Trinity College London', 'Berklee College Alumni', '15+ Years Experience'],
    },
    {
      name: 'Anand Rathore',
      role: 'Music Teacher & Classical Vocal Specialist',
      bio: 'Experienced music educator with strong command over Indian classical vocal music, rhythm, and theory. Skilled in teaching and explaining musical concepts with clarity.',
      image: '/Instructor1.jpg',
      expertise: ['Classical Vocal', 'Swar & Taal', 'Harmonium', 'Synthesizer', 'Tabla', 'Music Theory'],
      achievements: [
        'Teaching at Prayag Emerald Junior High School, Agra',
        'Teaching at Gayatri Tapobhoomi, Mathura',
        'Teaching at St. Andrews School, Agra',
        'Prabhakar from Prayagraj Sangeet Samiti',
        'M.A in Music from Jivaji University (2025)',
      ],
    },
  ];

  const values = [
    { icon: Heart, title: 'Passion for Music', description: 'We believe genuine love for music is the foundation of great musical education and performance.' },
    { icon: Users, title: 'Student-Centered', description: 'Every student is unique. We tailor our teaching methods to individual learning styles and goals.' },
    { icon: GraduationCap, title: 'Excellence', description: 'We maintain the highest standards in teaching, curriculum, and student support services.' },
    { icon: BookOpen, title: 'Comprehensive Learning', description: 'From basic notes to advanced compositions, we cover music theory and practical skills.' },
    { icon: Mic, title: 'Performance Focused', description: 'Regular recitals and concerts to build confidence and stage presence in students.' },
    { icon: Star, title: 'Innovative Methods', description: 'Blending traditional teaching with modern technology and contemporary music trends.' },
  ];

  const stats = [
    { number: '500+', label: 'Students Trained', icon: Users },
    { number: '15+', label: 'Expert Instructors', icon: GraduationCap },
    { number: '25+', label: 'Instruments', icon: Music },
    { number: '10+', label: 'Years Experience', icon: Calendar },
    { number: '45+', label: 'Annual Concerts', icon: Mic },
    { number: '98%', label: 'Success Rate', icon: CheckCircle },
  ];

  const facilities = [
    {
      title: 'Soundproof Practice Rooms',
      description: '8 fully equipped soundproof rooms for individual and group practice sessions',
      image: 'https://images.unsplash.com/photo-1651339764881-54e8338b185b?w=600&auto=format&fit=crop&q=60',
    },
    {
      title: 'Recording Studio',
      description: 'Professional recording setup for students to record their progress and compositions',
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Instrument Library',
      description: 'Well-maintained collection of instruments available for student practice',
      image: 'https://plus.unsplash.com/premium_photo-1682125896993-12a1758b6cb3?w=600&auto=format&fit=crop&q=60',
    },
    {
      title: 'Performance Hall',
      description: '100-seat auditorium for regular student performances and recitals',
      image: 'https://images.unsplash.com/photo-1597071692394-6661037e14ef?w=600&auto=format&fit=crop&q=60',
    },
  ];

  const instruments = [
    { name: 'Piano', image: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&auto=format&fit=crop&q=60' },
    { name: 'Guitar', image: 'https://plus.unsplash.com/premium_photo-1693169973609-342539dea9dc?w=600&auto=format&fit=crop&q=60' },
    { name: 'Tabla', image: 'https://images.unsplash.com/photo-1633411988188-6e63354a9019?w=600&auto=format&fit=crop&q=60' },
    { name: 'Flute', image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&auto=format&fit=crop&q=60' },
    { name: 'Sitar', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=60' },
    { name: 'Drums', image: 'https://images.unsplash.com/photo-1543443258-92b04ad5ec6b?w=600&auto=format&fit=crop&q=60' },
    { name: 'Harmonium', image: 'https://media.istockphoto.com/id/1367529261/photo/indian-classical-music.webp?a=1&b=1&s=612x612&w=0&k=20&c=CoYsfAPCP0e5nsv7-J5efD6nZu4bUFwhwZH42-TgJ1k=' },
    { name: 'Vocals', image: 'https://images.unsplash.com/photo-1615748562188-07be820cff5b?w=600&auto=format&fit=crop&q=60' },
    { name: 'Keyboard', image: 'https://images.unsplash.com/photo-1614978498256-94ec73df1015?w=600&auto=format&fit=crop&q=60' },
    { name: 'Dholak', image: 'https://media.istockphoto.com/id/2195962108/photo/indian-traditional-drums-close-up.jpg?s=612x612&w=0&k=20&c=jqVw-ICQsZDN7z_EjPh6Aj0tlKmGhMEz6GJeI0NB2r8=' },
  ];

  const heroInstruments = ['Saxophone', 'Violin', 'Drums', 'Vocals', 'Harmonium', 'Trumpet', 'Dholak'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      <GlobalStyles />
      <NavBarpage />

      <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <img src={heroBg} alt="About Raadhyam" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/35 bg-amber-600/10 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide au-fade-up">
            <Music className="w-4 h-4" /> Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-100 mt-6 mb-4 au-fade-up-d1">
            About <span className="au-text-gradient">Raadhyam</span>
          </h1>
          <p className="text-slate-300/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto au-fade-up-d2">
            Discover our journey, mission, and the passion that drives us to nurture musical talent across generations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 au-fade-up-d2">
            <Link to="/Contact-Us" className="au-gold-gradient px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-700/25 hover:-translate-y-0.5 transition">
              Get Free Enquiry
            </Link>
            <button className="px-8 py-3 rounded-xl border-2 border-amber-500/50 text-amber-300 font-semibold hover:bg-amber-500/10 transition">
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden border-y border-amber-500/25">
        <div className="container mx-auto max-w-7xl px-4 flex flex-wrap justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-100 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 au-pulse-dot" />
            Institute Currently Open
          </div>
          <div className="flex flex-wrap gap-5 text-slate-300">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> Mon-Sat: 9 AM - 9 PM</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-400" /> Sunday: 9 AM - 6 PM</span>
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-amber-400" /> +91 84103 37618</span>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="By The Numbers" title="Raadhyam in Numbers" subtitle="A decade of musical excellence, student success, and community impact." />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden border-y border-amber-500/25">
        <div className="flex au-marquee whitespace-nowrap">
          {[...heroInstruments, ...heroInstruments].map((name, i) => (
            <span key={i} className="mx-8 text-slate-200/85 text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <Music className="w-5 h-5 text-amber-400" />
              {name}
            </span>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
              alt="Our Music Studio"
              className="w-full rounded-3xl shadow-2xl border border-amber-500/30"
            />
            <div className="absolute -bottom-4 left-6 bg-white border border-amber-500/25 rounded-xl px-4 py-2 shadow-md">
              <p className="text-xs uppercase tracking-[0.16em] text-amber-700 font-bold">Est. 2012</p>
              <p className="text-sm text-slate-700 font-semibold">10+ Years of Music</p>
            </div>
          </div>
          <div>
            <SectionHeading tag="Our Journey" title="Our Story & Journey" />
            <div className="space-y-4 -mt-4 text-slate-600 leading-relaxed">
              <p>Raadhyam Musical Classes was founded in 2012 with a simple mission: to make quality music education accessible to everyone. What started as a small studio with just two instructors has now grown into a premier music institution with a thriving community of over 500 students.</p>
              <p>Our name "Raadhyam" comes from the Sanskrit word for "pleasing to the heart," which reflects our philosophy that music should come from the heart and bring joy to both the performer and the listener.</p>
              <p>Over the years, we've expanded our curriculum to include 25+ instruments, launched online classes, and established annual music festivals that showcase our students' talents.</p>
            </div>
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-50">
              <Award className="w-5 h-5 text-amber-700 mt-0.5" />
              <p className="text-sm text-slate-700 font-semibold">Award-winning music education institution - Best Music School 2023</p>
            </div>
 main
          </div>
        </div>
      </section>

 main
      {/* ══ TEAM ══════════════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#F8FAFC', position:'relative', overflow:'hidden' }}>
        <div style={DOT_PAT} />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          <SectionHeading tag="✦ Our Instructors" title="Meet the Team" subtitle="Passionate musicians and dedicated educators who bring out the best in every student." />
          <div className="about-team-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem' }}>
            {team.map((m, i) => <TeamCard key={i} member={m} delay={i * 120} />)}

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="What We Teach" title="Instruments We Teach" subtitle="Comprehensive training in 25+ instruments across various musical traditions." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {instruments.map((inst, i) => (
              <InstrumentCard key={inst.name} inst={inst} index={i} />
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-slate-600 text-sm mb-3">...and many more! Contact us for instruments not listed here.</p>
            <Link to="/Contact-Us" className="inline-block au-gold-gradient px-6 py-3 rounded-xl font-semibold">Inquire About Other Instruments</Link>
 main
          </div>
        </div>
      </section>

main
      {/* ══ INSTRUMENTS ═══════════════════════════════════════════════════ */}
      <section style={{ padding:'6rem 2rem', background:'#fff' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <SectionHeading tag="✦ What We Teach" title="25+ Instruments & Counting" subtitle="From classical Indian to contemporary Western — we cover it all." />
          <div className="about-instruments-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem' }}>
            {instruments.map((inst, i) => (
              <InstrumentCard key={i} instrument={inst} index={i} />

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Infrastructure" title="Our Facilities" subtitle="State-of-the-art infrastructure designed for optimal learning experience." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((f, i) => (
              <FacilityCard key={f.title} facility={f} delay={i * 90} />
 main
            ))}
          </div>
        </div>
      </section>

 main
      {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding:'7rem 2rem', background:WARM_BG, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,.15) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={DOT_PAT} />
        <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', position:'relative', zIndex:2 }}>
          <span className="section-tag">✦ Begin Your Journey</span>
          <h2 style={{ fontFamily:SERIF, fontSize:'clamp(2rem,4vw,3rem)', fontWeight:700, color:SLATE, marginBottom:'1.25rem', letterSpacing:'-0.02em' }}>
            Ready to Discover Your{' '}
            <span style={{ background:`linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})`, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 3s linear infinite' }}>Musical Voice?</span>
          </h2>
          <p style={{ color:'#475569', fontSize:'1.05rem', lineHeight:1.85, marginBottom:'2.5rem', fontFamily:SANS }}>
            Join hundreds of students who have found their rhythm, their melody, and their confidence at Raadhyam. Your musical journey starts with a single note.
          </p>
          <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
            <Link to="/login" className="amber-btn">Enroll Now</Link>
            <Link to="/Contact-Us" style={{ background:'transparent', color:SLATE, border:`2px solid ${SLATE}`, borderRadius:12, padding:'13px 32px', fontSize:'1rem', fontWeight:600, cursor:'pointer', letterSpacing:'.04em', fontFamily:SANS, transition:'background .3s,color .3s', textDecoration:'none', display:'inline-block' }}
              onMouseEnter={e => { e.target.style.background = SLATE; e.target.style.color = '#fff'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = SLATE; }}>
              Contact Us
            </Link>
          </div>
          <div style={{ display:'flex', gap:24, marginTop:'2.5rem', flexWrap:'wrap', justifyContent:'center' }}>
            {['✓ Free Trial Class','✓ All Age Groups','✓ Online & Offline'].map(b => (
              <span key={b} style={{ color:MUTED, fontSize:'.82rem', fontWeight:700, letterSpacing:'.04em', fontFamily:SANS }}>{b}</span>
            ))}
          </div>

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Purpose" title="Our Mission & Vision" subtitle="We believe that everyone has musical potential waiting to be discovered." />
          <div className="grid md:grid-cols-2 gap-6">
            <MissionCard
              Icon={Target}
              title="Our Mission"
              delay={0}
              texts={[
                'To provide exceptional music education that nurtures creativity, builds confidence, and fosters a lifelong love for music in students of all ages and skill levels through personalized attention and comprehensive curriculum.',
                'We strive to create a supportive environment where students can explore their musical interests and develop their unique artistic voice while maintaining the highest standards of musical excellence.',
              ]}
            />
            <MissionCard
              Icon={Eye}
              title="Our Vision"
              delay={120}
              texts={[
                'To become the leading music education institution recognized for excellence in teaching, innovation in curriculum, and commitment to student success across India.',
                'We envision a world where music education is accessible to all and where every individual can experience the transformative power of music, creating a more harmonious society through the universal language of music.',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Philosophy" title="Our Values & Philosophy" subtitle="The principles that guide everything we do at Raadhyam." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <ValueCard key={value.title} value={value} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="The Team" title="Meet Our Founders" subtitle="The passionate musicians behind Raadhyam." />
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((m, i) => (
              <TeamCard key={m.name} member={m} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <SectionHeading tag="Find Us" title="Visit Our Campus" subtitle="Come experience the music in person." />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="au-card p-7">
              <div className="space-y-5">
                {[
                  {
                    icon: MapPin,
                    label: 'Main Campus',
                    content: 'Raadhyam Music Institute, Ashiyana PT. Deen, Shop no.04, Sector 7, Dayal Upadhyay Puram, Agra, Uttar Pradesh 282007',
                  },
                  { icon: Phone, label: 'Contact', content: '+91 84103 37618, +91 94123 18590' },
                  { icon: Mail, label: 'Email', content: 'raadhyammusicals@gmail.com' },
                  { icon: Clock, label: 'Hours', content: 'Monday - Saturday: 9:00 AM - 9:00 PM, Sunday: 9:00 AM - 6:00 PM' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex gap-3">
                      <Icon className="w-5 h-5 text-amber-700 mt-0.5" />
                      <div>
                        <p className="text-slate-900 text-sm font-semibold">{item.label}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="au-card p-2 overflow-hidden h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.666687052142!2d77.95964401102849!3d27.198210876379967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39747702598cee49%3A0x8c378565a19b33c5!2sRaadhyam%20Music%20Academy!5e0!3m2!1sen!2sin!4v1763693224614!5m2!1sen!2sin"
                className="w-full h-full rounded-2xl"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Raadhyam Music Institute Location"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 sm:p-14 border border-amber-500/25">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/35 bg-amber-600/10 text-amber-300 text-xs font-bold tracking-[0.16em] uppercase mb-4">
              Join Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Ready to Start Your <span className="au-text-gradient">Musical Journey?</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-8">
              Join over 500 students who have discovered their musical potential with Raadhyam. Limited spots available for {new Date().getFullYear()} batch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/Contact-Us" className="au-gold-gradient px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-700/25 hover:-translate-y-0.5 transition">
                Get Enquiry
              </Link>
              <button className="px-8 py-3 rounded-xl border-2 border-amber-500/50 text-amber-300 font-semibold hover:bg-amber-500/10 transition">
                Download Brochure
              </button>
            </div>
          </div>
 main
        </div>
      </section>

      <FooterPage />
    </div>
  );
 main
};

/* ── Instrument card with image ─────────────────────────────────────────── */
const InstrumentCard = ({ instrument, index }) => {
  const [ref, visible] = useVisible(0.1);
  const [hov, setHov] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `2px solid ${hov ? AMBER : '#E2E8F0'}`,
        borderRadius: 20,
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transform: visible
          ? hov ? 'translateY(-10px) scale(1.04)' : 'translateY(0) scale(1)'
          : 'translateY(28px) scale(0.96)',
        transition: `opacity .6s ease ${(index % 4) * 80}ms, transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s, border .3s`,
        boxShadow: hov
          ? `0 20px 48px rgba(217,119,6,.28), 0 0 0 4px rgba(217,119,6,.1)`
          : '0 2px 16px rgba(30,41,59,.07)',
        cursor: 'default',
        position: 'relative',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: `linear-gradient(135deg, #FFF8EE, #FEF3C7)` }}>
        {!imgErr ? (
          <img
            src={instrument.image}
            alt={instrument.name}
            onError={() => setImgErr(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hov ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform .5s ease',
              display: 'block',
            }}
          />
        ) : (
          /* Fallback: emoji on warm gradient */
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
            {instrument.emoji}
          </div>
        )}

        {/* Gradient overlay — always present, stronger on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hov
            ? `linear-gradient(to top, rgba(217,119,6,.55) 0%, rgba(217,119,6,.1) 60%, transparent 100%)`
            : `linear-gradient(to top, rgba(30,41,59,.35) 0%, transparent 60%)`,
          transition: 'background .4s',
        }} />

        {/* Amber top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: hov ? `linear-gradient(90deg,${AMBER},#F59E0B,${AMBER})` : 'transparent',
          backgroundSize: '200% 100%',
          animation: hov ? 'gradientShift 2s ease infinite' : 'none',
          transition: 'background .3s',
        }} />
      </div>

      {/* Name area */}
      <div style={{
        padding: '1rem 1rem .9rem',
        textAlign: 'center',
        background: hov ? `linear-gradient(135deg, #FFF8EE, #fff)` : '#fff',
        transition: 'background .4s',
      }}>
        <span style={{
          fontWeight: 700,
          fontSize: '.95rem',
          color: hov ? AMBER : SLATE,
          fontFamily: SANS,
          letterSpacing: '.02em',
          transition: 'color .3s',
        }}>
          {instrument.name}
        </span>
      </div>
    </div>
  );
main
};

export default AboutUsPage;
