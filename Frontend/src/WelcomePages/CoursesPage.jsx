import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, CheckCircle, X, Clock, BarChart3 } from 'lucide-react';
import NavBarpage from './NavBarpage';
import FooterPage from './FooterPage';
import heroBg from '../assets/hero-bg.jpg';

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

const courses = [
  {
    name: 'Vocal Training',
    icon: '🎤',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&auto=format&fit=crop&q=80',
    tag: 'Most Popular',
    level: 'Beginner to Advanced',
    duration: '3 months+',
    desc: 'Indian Classical, Bollywood and Western vocals with voice modulation and stage performance.',
    details: [
      'Hindustani and Carnatic classical foundations',
      'Bollywood and Western vocal styles',
      'Breathing techniques and voice modulation',
      'Sur, taal and raga training',
      'Stage performance and mic technique',
      'Recording and playback sessions',
    ],
  },
  {
    name: 'Guitar',
    icon: '🎸',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending',
    level: 'Beginner to Pro',
    duration: '4 months+',
    desc: 'Acoustic and electric guitar with chords, fingerpicking, scales, and lead techniques.',
    details: [
      'Basic to advanced chord progressions',
      'Fingerpicking and strumming patterns',
      'Lead guitar and soloing techniques',
      'Music reading and tablature',
      'Bollywood, classical and Western styles',
      'Live performance preparation',
    ],
  },
  {
    name: 'Keyboard and Piano',
    icon: '🎹',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&auto=format&fit=crop&q=80',
    tag: 'Classic',
    level: 'All Levels',
    duration: '3 months+',
    desc: 'Classical and contemporary piano with chords, scales, sight-reading and composition.',
    details: [
      'Western classical piano foundations',
      'Chords, scales and arpeggios',
      'Sight-reading and music notation',
      'Bollywood and film music arrangements',
      'Improvisation and composition',
      'Trinity and ABRSM exam preparation',
    ],
  },
  {
    name: 'Tabla and Percussion',
    icon: '🥁',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop&q=80',
    tag: 'Traditional',
    level: 'Beginner to Advanced',
    duration: '4 months+',
    desc: 'Tabla, drums, cajon, and dholak with rhythm cycles, hand techniques and coordination.',
    details: [
      'Tabla bols and taal cycles',
      'Western drum kit fundamentals',
      'Cajon and hand percussion',
      'Dholak for folk and devotional music',
      'Rhythm coordination exercises',
      'Ensemble and accompaniment skills',
    ],
  },
  {
    name: 'Violin',
    icon: '🎻',
    image: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=600&auto=format&fit=crop&q=80',
    tag: 'Classical',
    level: 'Beginner to Advanced',
    duration: '5 months+',
    desc: 'Indian classical and Western violin with bowing, ragas, scales and performance.',
    details: [
      'Proper posture and bowing technique',
      'Indian classical ragas on violin',
      'Western scales and classical pieces',
      'Intonation and ear training',
      'Film and fusion violin styles',
      'Stage and orchestra performance',
    ],
  },
  {
    name: 'Flute',
    icon: '🪈',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&auto=format&fit=crop&q=80',
    tag: 'Soulful',
    level: 'Beginner to Advanced',
    duration: '3 months+',
    desc: 'Bansuri and Western flute with breath control, ragas, notation and melodies.',
    details: [
      'Breath control and embouchure',
      'Bansuri for Indian classical music',
      'Western flute scales and pieces',
      'Raga-based improvisation',
      'Devotional and folk music styles',
      'Performance and recording techniques',
    ],
  },
  {
    name: 'Harmonium',
    icon: '🪗',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&auto=format&fit=crop&q=80',
    tag: 'Devotional',
    level: 'All Levels',
    duration: '2 months+',
    desc: 'Harmonium for bhajans, classical and devotional music with sur and taal.',
    details: [
      'Sur and swara fundamentals',
      'Bhajan and kirtan accompaniment',
      'Classical raga-based playing',
      'Left hand bellows technique',
      'Taal and rhythm coordination',
      'Devotional and stage performance',
    ],
  },
  {
    name: 'Music Theory',
    icon: '🎼',
    image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=600&auto=format&fit=crop&q=80',
    tag: 'Foundation',
    level: 'All Levels',
    duration: '2 months+',
    desc: 'Notation, harmony, rhythm, scales, chords and composition in a clear structure.',
    details: [
      'Music notation and sight-reading',
      'Scales, modes and intervals',
      'Chord theory and harmony',
      'Rhythm and time signatures',
      'Composition and arrangement basics',
      'Exam prep: Trinity, ABRSM, Gandharva',
    ],
  },
];

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Lato:wght@400;600;700&display=swap');

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .co-fade-up { animation: fadeUp .8s ease both; }
    .co-fade-up-d1 { animation: fadeUp .8s ease .12s both; }
    .co-fade-up-d2 { animation: fadeUp .8s ease .24s both; }
    .co-float { animation: float 3s ease-in-out infinite; }

    .co-card {
      background: rgba(255,255,255,.86);
      border: 1px solid rgba(217,119,6,.2);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease;
    }

    .co-card:hover {
      transform: translateY(-8px);
      border-color: rgba(217,119,6,.45);
      box-shadow: 0 24px 56px rgba(30,41,59,.13);
    }

    .co-gold-gradient {
      background: linear-gradient(135deg,#D97706 0%, #F59E0B 50%, #D97706 100%);
      color: #fff;
    }

    .co-text-gold {
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

const CourseCard = ({ course, delay, onOpen }) => {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(course)}
      className="co-card overflow-hidden cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? (hovered ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(28px)',
        transition: `opacity .65s ease ${delay}ms, transform .35s ease, box-shadow .35s ease, border-color .35s ease`,
      }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform .5s ease' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider co-gold-gradient">
          {course.tag}
        </span>
        <span className="absolute right-3 bottom-3 text-3xl">{course.icon}</span>
      </div>

      <div className="p-5">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{course.name}</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            <BarChart3 className="w-3.5 h-3.5" /> {course.level}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            <Clock className="w-3.5 h-3.5" /> {course.duration}
          </span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4">{course.desc}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-amber-700">View Details</span>
          <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">+</span>
        </div>
      </div>
    </div>
  );
};

const CourseModal = ({ course, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-amber-500/20 shadow-2xl"
      >
        <div className="relative h-64">
          <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-900 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute left-6 bottom-5">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider co-gold-gradient inline-block mb-2">
              {course.tag}
            </span>
            <h2 className="text-3xl font-bold text-white">{course.icon} {course.name}</h2>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
              <BarChart3 className="w-3.5 h-3.5" /> {course.level}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              <Clock className="w-3.5 h-3.5" /> {course.duration}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
              <CheckCircle className="w-3.5 h-3.5" /> Online and Offline
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed mb-5">{course.desc}</p>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-50 p-5 mb-6">
            <h4 className="text-xl font-bold text-slate-900 mb-3">What You Will Learn</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {course.details.map((detail) => (
                <div key={detail} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-amber-700" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/login" className="flex-1">
              <button className="w-full co-gold-gradient rounded-xl py-3 font-semibold shadow-lg shadow-amber-700/25 hover:-translate-y-0.5 transition">
                Enroll Now
              </button>
            </Link>
            <Link to="/Contact-Us" className="flex-1">
              <button className="w-full rounded-xl py-3 font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-100 transition">
                Free Enquiry
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursesPage = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      <GlobalStyles />
      <NavBarpage />

      <section className="relative min-h-[62vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24">
        <img src={heroBg} alt="Courses hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/90" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/35 bg-amber-600/10 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide co-fade-up">
            <Music className="w-4 h-4" /> Our Programs
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mt-6 mb-4 co-fade-up-d1 text-slate-100">
            Courses for <span className="co-text-gold">Every Soul</span>
          </h1>

          <p className="text-slate-300/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto co-fade-up-d2">
            Structured programs for all ages and levels with certified instructors,
            live practice, and personalized feedback.
          </p>

          <div className="flex flex-wrap gap-5 justify-center mt-8 text-sm text-slate-300 co-fade-up-d2">
            {['Online and Offline', 'All Levels', 'Performance Focused'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400" /> {item}
              </span>
            ))}
          </div>
        </div>

      </section>

      <section className="relative mt-0 z-20 px-4 pt-12 pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((course, i) => (
              <CourseCard key={course.name} course={course} delay={i * 70} onOpen={setSelected} />
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-slate-600 mb-4">Not sure which course to pick? We will help you choose.</p>
            <Link to="/Contact-Us" className="inline-block co-gold-gradient px-8 py-3 rounded-xl font-semibold shadow-lg shadow-amber-700/25 hover:-translate-y-0.5 transition">
              Get Free Counselling
            </Link>
          </div>
        </div>
      </section>

      <FooterPage />

      {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default CoursesPage;
