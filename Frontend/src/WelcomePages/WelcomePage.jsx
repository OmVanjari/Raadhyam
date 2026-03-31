import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart, Globe, Award, Users, Mic, Guitar, Piano, Drum, Wind, BookOpen, Monitor, Star, Mail, ChevronRight, CheckCircle } from 'lucide-react';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';
import heroBg from '../assets/hero-bg.jpg';

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        setInView(true); 
        obs.disconnect(); 
      } 
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated Counter ─── */
function Counter({ end, suffix = "", duration = 2000, start = false }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [start, end, duration]);

  return <span>{count}{suffix}</span>;
}


/* ─── Section Wrapper ─── */
function Section({ children, className = "", dark = false }) {
  const { ref, inView } = useInView(0.1);
  return (
    <section ref={ref} className={`px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 ${dark ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900' : 'bg-white'} ${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
      <div className="container mx-auto max-w-7xl">{children}</div>
    </section>
  );
}


/* ─── Global Styles ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
    
    @keyframes fadeUp { 
      from { opacity: 0; transform: translateY(30px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    @keyframes float { 
      0%, 100% { transform: translateY(0); } 
      50% { transform: translateY(-10px); } 
    }
    @keyframes marquee { 
      from { transform: translateX(0); } 
      to { transform: translateX(-50%); } 
    }
    @keyframes pulseGlow { 
      0%, 100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.3); } 
      50% { box-shadow: 0 0 40px rgba(217, 119, 6, 0.6); } 
    }
    @keyframes shimmer { 
      0% { background-position: -200% 0; } 
      100% { background-position: 200% 0; } 
    }

    .animate-fade-up { animation: fadeUp 0.8s ease-out both; }
    .animate-fade-up-delay-1 { animation: fadeUp 0.8s ease-out 0.1s both; }
    .animate-fade-up-delay-2 { animation: fadeUp 0.8s ease-out 0.2s both; }
    .animate-fade-up-delay-3 { animation: fadeUp 0.8s ease-out 0.3s both; }
    .animate-fade-up-delay-4 { animation: fadeUp 0.8s ease-out 0.4s both; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-marquee { animation: marquee 30s linear infinite; }
    .animate-pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
    .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }

    .glass-card { 
      background: rgba(255, 255, 255, 0.8); 
      backdrop-filter: blur(12px); 
      border: 1px solid rgba(217, 119, 6, 0.2);
      transition: all 0.3s ease;
    }
    .glass-card:hover { 
      transform: translateY(-8px); 
      box-shadow: 0 24px 56px rgba(30, 41, 59, 0.13);
      border-color: rgba(217, 119, 6, 0.45);
    }

    .hero-stat-card {
      background: linear-gradient(160deg, #0f172a, #1e293b);
      border: 1px solid rgba(217, 119, 6, 0.35);
      box-shadow: 0 16px 40px rgba(2, 6, 23, 0.35);
      transition: all 0.3s ease;
    }
    .hero-stat-card:hover {
      transform: translateY(-8px);
      border-color: rgba(245, 158, 11, 0.7);
      box-shadow: 0 24px 52px rgba(2, 6, 23, 0.5);
    }

    .gold-gradient { 
      background: linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #D97706 100%); 
      color: white;
    }
    
    .text-gold-gradient {
      background: linear-gradient(90deg, #F59E0B, #D97706, #B45309);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .navy-gradient {
      background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Playfair Display', Georgia, serif;
    }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
  `}</style>
);



/* ─── Section Heading Component ─── */
const SectionHeading = ({ tag, title, subtitle }) => {
  const { ref, inView } = useInView(0.2);
  return (
    <div ref={ref} className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`}>
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-600/30 bg-amber-100 text-amber-700 text-sm font-semibold mb-4">
        ⭐ {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
};

/* ─── Stat Card Component ─── */
const StatCard = ({ value, suffix = '', label, delay }) => {
  const { ref, inView } = useInView(0.3);
  const num = inView ? <Counter end={value} suffix={suffix} start={inView} /> : `0${suffix}`;
  
  return (
    <div 
      ref={ref} 
      className={`hero-stat-card p-6 text-center rounded-2xl transition-all duration-700`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="text-3xl md:text-4xl font-bold text-amber-300">{num}</div>
      <p className="text-slate-200/85 text-sm mt-2 uppercase tracking-wide font-semibold">{label}</p>
    </div>
  );
};

/* ─── Feature Card Component ─── */
const FeatureCard = ({ icon: Icon, title, desc, delay }) => {
  const { ref, inView } = useInView(0.15);
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      ref={ref} 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}
      className="glass-card p-8 hover:-translate-y-2 transition-all duration-300 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {hover && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" />}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${hover ? 'bg-gradient-to-r from-amber-600 to-amber-500 shadow-lg shadow-amber-600/30 scale-110' : 'bg-amber-100'}`}>
        <Icon className={`w-7 h-7 ${hover ? 'text-white' : 'text-amber-700'}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
};

/* ─── Course Card Component ─── */
const CourseCard = ({ icon: Icon, title, desc, index }) => {
  const { ref, inView } = useInView(0.1);
  const [hover, setHover] = useState(false);
  
  return (
    <div 
      ref={ref} 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}
      className={`relative rounded-2xl p-6 transition-all duration-300 cursor-pointer ${hover ? 'bg-gradient-to-r from-amber-600 to-amber-500 border-amber-500 -translate-y-1.5 shadow-lg' : 'bg-slate-700/40 border border-amber-600/10 hover:border-amber-600/40'}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${(index % 4) * 70}ms`
      }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${hover ? 'bg-amber-300/20' : 'bg-amber-600/15'}`}>
        <Icon className={`w-6 h-6 ${hover ? 'text-white' : 'text-amber-400'}`} />
      </div>
      <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${hover ? 'text-white' : 'text-slate-100'}`}>{title}</h3>
      <p className={`text-sm leading-relaxed transition-colors duration-300 ${hover ? 'text-amber-50' : 'text-slate-300'}`}>{desc}</p>
      <ChevronRight className={`w-5 h-5 absolute top-6 right-6 transition-all duration-300 ${hover ? 'text-white translate-x-1' : 'text-amber-600/40'}`} />
    </div>
  );
};

/* ─── Testimonial Card Component ─── */
const TestimonialCard = ({ name, role, text, delay }) => {
  const { ref, inView } = useInView(0.15);
  
  return (
    <div 
      ref={ref} 
      className="glass-card p-8 hover:-translate-y-2 transition-all duration-300 relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, j) => (
          <Star key={j} className="w-5 h-5 fill-amber-600 text-amber-600" />
        ))}
      </div>
      <p className="text-slate-800 italic text-lg leading-relaxed mb-6">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-lg">
          {name[0]}
        </div>
        <div>
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="text-slate-600 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════════════════════ */
/*                     RAADHYAM WELCOME PAGE                                 */
/* ═════════════════════════════════════════════════════════════════════════ */

const RaadhyamWelcomeHome = () => {
  const features = [
    { icon: Heart, title: 'Learn with Heart', desc: 'Every session blends emotion, expression, and mentorship — building a deep connection with music.' },
    { icon: Globe, title: 'Online & Offline', desc: 'Learn from anywhere or join us at the studio — HD virtual classes + structured offline sessions.' },
    { icon: Guitar, title: '25+ Instruments', desc: 'Tabla, Harmonium, Sitar, Guitar, Keyboard, Drums, Violin — from beginners to advanced learners.' },
    { icon: Users, title: 'Professional Mentors', desc: 'Trained musicians and industry experts focused on skill, creativity, and discipline.' },
    { icon: Mic, title: 'Stage Performances', desc: 'Real-stage exposure through concerts, competitions, showcases, and recordings.' },
    { icon: Award, title: 'Certifications & Exams', desc: 'Prepared for Trinity, ABRSM, Gandharva, and other music certifications.' },
  ];

  const courses = [
    { icon: Mic, title: 'Vocal Training', desc: 'Indian Classical, Bollywood & Western vocals with voice modulation, breathing, and performance.' },
    { icon: Guitar, title: 'String Instruments', desc: 'Guitar, Violin, Sitar & Ukulele — chords, ragas, melodies, and techniques.' },
    { icon: Piano, title: 'Keyboard & Piano', desc: 'Classical & contemporary piano — chords, scales, improvisation & composition.' },
    { icon: Drum, title: 'Percussion', desc: 'Tabla, Drums, Cajon, Dholak — rhythm cycles and coordination.' },
    { icon: Wind, title: 'Wind Instruments', desc: 'Flute, Saxophone & Harmonica with breath control and notation.' },
    { icon: BookOpen, title: 'Music Theory', desc: 'Notation, harmony, rhythm, scales, chords & composition.' },
    { icon: Monitor, title: 'Online Classes', desc: 'Interactive sessions with recordings, assignments & feedback.' },
    { icon: Star, title: 'Advanced Courses', desc: 'Professional certification, stage performance, recording & mastering.' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Vocal Student', text: 'Raadhyam transformed my singing completely. The teaching is unmatched.' },
    { name: 'Arjun Mehta', role: 'Guitar Student', text: 'I started from zero and within 6 months I was performing on stage.' },
    { name: 'Sneha Gupta', role: 'Piano Student', text: 'The online classes are just as effective as offline with personalized feedback.' },
  ];

  const instruments = ['Tabla', 'Guitar', 'Piano', 'Saxophone', 'Violin', 'Drums', 'Vocals', 'Harmonium', 'Trumpet', 'Dholak', 'Flute', 'Sitar'];
  const heroInstruments = ['Saxophone', 'Violin', 'Drums', 'Vocals', 'Harmonium', 'Trumpet', 'Dholak'];

  return (
    <div className="overflow-x-hidden font-sans bg-slate-50 min-h-screen">
      <GlobalStyles />
      <NavBarpage />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <img src={heroBg} alt="Musical background" className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/92 via-slate-900/86 to-slate-950/94" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-600/30 bg-amber-600/10 text-amber-300 text-sm font-medium mb-8 animate-fade-up">
            <Music className="w-4 h-4" /> Classical Music Education
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-up-delay-1 leading-tight">
            <span className="text-slate-100">Discover Your</span>
            <br />
            <span className="text-gold-gradient">Musical Identity</span>
          </h1>

          <p className="text-slate-300/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up-delay-2 leading-relaxed">
            Professional music education rooted in the Guru–Shishya tradition.<br />
            Online & offline classes for all ages, all instruments, all skill levels.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-up-delay-3">
            <Link to="/login" className="gold-gradient text-slate-900 font-semibold px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-lg animate-pulse-glow">
              Start Learning Today
            </Link>
            <Link to="/Contact-Us" className="border-2 border-amber-600/50 text-amber-300 font-semibold px-8 py-4 rounded-full text-lg hover:bg-amber-600/10 transition-all duration-300">
              Get Free Enquiry
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-slate-300/70 text-sm animate-fade-up-delay-4">
            {['Certified Instructors', 'All Age Groups', 'Online & Offline'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-600" /> {t}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative z-20 bg-slate-50 px-4 pt-6 pb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { num: 500, suffix: '+', label: 'Students Trained' },
              { num: 15, suffix: '+', label: 'Expert Instructors' },
              { num: 25, suffix: '+', label: 'Instruments' },
              { num: 7, suffix: '+', label: 'Years of Excellence' },
            ].map((s, i) => (
              <StatCard key={s.label} value={s.num} suffix={s.suffix} label={s.label} delay={(i + 1) * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HERO INSTRUMENT STRIP ═══ */}
      <section className="py-5 navy-gradient overflow-hidden border-y border-amber-500/20">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...heroInstruments, ...heroInstruments].map((inst, i) => (
            <span key={i} className="mx-8 text-slate-200/80 text-xl sm:text-2xl font-semibold flex items-center gap-3">
              <Music className="w-5 h-5 text-amber-400" />
              {inst}
            </span>
          ))}
        </div>
      </section>

      {/* ═══ WHY CHOOSE ═══ */}
      <Section>
        <SectionHeading tag="Our Strengths" title="Why Choose Raadhyam?" subtitle="We don't just teach music — we shape musicians with care, creativity, and professional excellence." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 80} />
          ))}
        </div>
      </Section>

      {/* ═══ COURSES ═══ */}
      <Section dark className="dark">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-amber-400 font-medium text-sm uppercase tracking-widest mb-4">⭐ Our Programs</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Music Programs for <span className="text-gold-gradient">Every Soul</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Structured courses for all ages and skill levels — certified instructors, real-time practice, personalized feedback.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {courses.map((c, i) => (
            <CourseCard key={c.title} {...c} index={i} />
          ))}
        </div>
      </Section>

      {/* ═══ FOUNDER ═══ */}
      <Section>
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm uppercase tracking-widest mb-4">⭐ Meet the Founder</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-2">
            The Heart Behind <span className="text-gold-gradient">Raadhyam</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
          <div className="relative mx-auto">
            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-amber-600/30 shadow-2xl">
              <img src="/founder.jpg" alt="Mr. Dheeraj Solanki" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full gold-gradient flex items-center justify-center shadow-lg animate-float">
              <Music className="w-10 h-10 text-slate-900" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Mr. Dheeraj Solanki</h3>
            <p className="text-amber-600 font-bold mt-1 mb-6 text-sm uppercase tracking-wide">Indian Classical Musician & Music Educator</p>
            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              With over 7 years of training in Indian Classical Music under the Guru–Shishya Parampara, he brings depth, discipline, and a soulful teaching style.
            </p>
            <blockquote className="border-l-4 border-amber-600 pl-6 italic text-slate-800 text-lg mb-8">
              "Music is a powerful medium — it heals, inspires, and transforms. My goal is to help every learner discover their true musical identity."
            </blockquote>
            <div className="grid grid-cols-3 gap-4">
              {[
                { num: '7+', label: 'Years Classical Training' },
                { num: '3+', label: 'Years Professional Teaching' },
                { num: '10+', label: 'Instruments Taught' },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl bg-slate-100 border border-amber-200">
                  <div className="text-2xl font-bold text-amber-700">{s.num}</div>
                  <p className="text-slate-600 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Section className="bg-slate-100">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm uppercase tracking-widest mb-4">⭐ Testimonials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What Our <span className="text-gold-gradient">Students Say</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} {...t} delay={i * 100} />
          ))}
        </div>
      </Section>

      {/* ═══ FINAL CTA ═══ */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl navy-gradient p-12 sm:p-16 text-center">
          <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-amber-600/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-amber-600/5 translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Begin Your <span className="text-gold-gradient">Musical Journey</span>?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
              Join hundreds of students learning music with heart at Raadhyam Musical Classes.
              First trial class is on us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/login" className="gold-gradient text-slate-900 font-semibold px-10 py-4 rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-amber-600/30">
                Enroll Now
              </Link>
              <a href="mailto:raadhyammusicals@gmail.com" className="inline-flex items-center justify-center gap-2 border-2 border-amber-600/50 text-amber-400 font-semibold px-10 py-4 rounded-full text-lg hover:bg-amber-600/10 transition-all duration-300">
                <Mail className="w-5 h-5" /> Email Us
              </a>
            </div>
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> raadhyammusicals@gmail.com
            </p>
          </div>
        </div>
      </Section>

      <FooterPage />
    </div>
  );
};

export default RaadhyamWelcomeHome;
