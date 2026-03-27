import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const css = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
  .rn { font-family:"Inter",system-ui,sans-serif; position:fixed; inset:0 0 auto 0; z-index:9999; transition:background .3s,box-shadow .3s,border-color .3s; }
  .rn.top { background:rgba(244,248,255,.9); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid rgba(37,99,235,.16); box-shadow:0 2px 16px rgba(15,23,42,.1); }
  .rn.scrolled { background:rgba(255,255,255,.95); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(236,72,153,.22); box-shadow:0 8px 24px rgba(15,23,42,.14); }
  .rn-wrap { max-width:1280px; margin:0 auto; padding:0 1.5rem; }
  .rn-bar { display:flex; align-items:center; justify-content:space-between; height:72px; transition:height .3s; }
  .rn.scrolled .rn-bar { height:64px; }
  .rn-logo img { height:50px; transition:height .3s; }
  .rn.scrolled .rn-logo img { height:44px; }
  .rn-links { display:flex; align-items:center; gap:.25rem; }
  .rn-a { position:relative; color:#334155; font-size:.9375rem; font-weight:500; padding:.5rem 1rem; text-decoration:none; transition:color .25s; white-space:nowrap; }
  .rn-a::after { content:""; position:absolute; bottom:2px; left:50%; transform:translateX(-50%) scaleX(0); width:60%; height:2px; background:linear-gradient(90deg,#2563eb,#f59e0b,#ec4899); border-radius:2px; transition:transform .3s cubic-bezier(.4,0,.2,1); }
  .rn-a:hover,.rn-a.on { color:#2563eb; }
  .rn-a:hover::after,.rn-a.on::after { transform:translateX(-50%) scaleX(1); }
  .rn-a.on { font-weight:600; }
  .rn-btn { margin-left:1rem; display:inline-block; background:linear-gradient(135deg,#2563eb,#f59e0b,#ec4899); color:#ffffff; font-size:.9375rem; font-weight:700; padding:.625rem 1.625rem; border-radius:10px; text-decoration:none; box-shadow:0 8px 20px rgba(37,99,235,.28); transition:transform .25s,box-shadow .25s; }
  .rn-btn:hover { transform:translateY(-2px); box-shadow:0 12px 28px rgba(236,72,153,.25); }
  .rn-hbg { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:7px; border-radius:8px; transition:background .2s; }
  .rn-hbg:hover { background:rgba(37,99,235,.1); }
  .rn-hl { width:24px; height:2px; background:#334155; border-radius:2px; transition:all .3s ease; }
  .rn-hbg.open .rn-hl:nth-child(1) { transform:rotate(45deg) translate(5px,5px); background:#ec4899; }
  .rn-hbg.open .rn-hl:nth-child(2) { opacity:0; }
  .rn-hbg.open .rn-hl:nth-child(3) { transform:rotate(-45deg) translate(6px,-6px); background:#ec4899; }
  .rn-mob { overflow:hidden; max-height:0; opacity:0; transition:max-height .4s cubic-bezier(.4,0,.2,1),opacity .3s ease; }
  .rn-mob.open { max-height:600px; opacity:1; }
  .rn-mob-inner { padding:.5rem 0 1.5rem; display:flex; flex-direction:column; gap:.25rem; background:rgba(255,255,255,.97); border:1px solid rgba(37,99,235,.2); border-radius:12px; margin-bottom:10px; }
  .rn-ma { display:block; padding:.875rem 1rem; color:#334155; font-size:.9375rem; font-weight:500; border-radius:8px; text-decoration:none; transition:background .2s,color .2s; }
  .rn-ma:hover { background:rgba(37,99,235,.1); color:#2563eb; }
  .rn-ma.on { background:rgba(236,72,153,.12); color:#be185d; font-weight:600; }
  .rn-mbtn { display:block; margin:.75rem 1rem 0; background:linear-gradient(135deg,#2563eb,#f59e0b,#ec4899); color:#ffffff; font-size:.9375rem; font-weight:700; padding:.875rem 1rem; border-radius:10px; text-align:center; text-decoration:none; box-shadow:0 8px 20px rgba(37,99,235,.28); transition:box-shadow .25s; }
  .rn-mbtn:hover { box-shadow:0 12px 24px rgba(236,72,153,.25); }
  @media(min-width:768px){ .rn-links{display:flex!important} .rn-hbg{display:none!important} .rn-mob{display:none!important} }
  @media(max-width:767px){ .rn-links{display:none!important} .rn-hbg{display:flex!important} }
`;

const NavBarpage = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const lc = ({ isActive }) => "rn-a" + (isActive ? " on" : "");
  const mc = ({ isActive }) => "rn-ma" + (isActive ? " on" : "");
  return (
    <>
      <style>{css}</style>
      <nav className={"rn " + (scrolled ? "scrolled" : "top")}>
        <div className="rn-wrap">
          <div className="rn-bar">
            <Link to="/" className="rn-logo" style={{textDecoration:"none"}}>
              <img src="/Raadhyam.png" alt="Raadhyam" />
            </Link>
            <div className="rn-links">
              <NavLink to="/" className={lc}>Home</NavLink>
              <NavLink to="/About-Us" className={lc}>About Us</NavLink>
              <NavLink to="/Courses" className={lc}>Courses</NavLink>
              <NavLink to="/Notes" className={lc}>Notes</NavLink>
              <NavLink to="/Contact-Us" className={lc}>Contact Us</NavLink>
              <Link to="/login" className="rn-btn">Enroll Now</Link>
            </div>
            <button className={"rn-hbg" + (open ? " open" : "")} onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
              <div className="rn-hl" /><div className="rn-hl" /><div className="rn-hl" />
            </button>
          </div>
          <div className={"rn-mob" + (open ? " open" : "")}>
            <div className="rn-mob-inner">
              <NavLink to="/" className={mc} onClick={() => setOpen(false)}>Home</NavLink>
              <NavLink to="/About-Us" className={mc} onClick={() => setOpen(false)}>About Us</NavLink>
              <NavLink to="/Courses" className={mc} onClick={() => setOpen(false)}>Courses</NavLink>
              <NavLink to="/Notes" className={mc} onClick={() => setOpen(false)}>Notes</NavLink>
              <NavLink to="/Contact-Us" className={mc} onClick={() => setOpen(false)}>Contact Us</NavLink>
              <Link to="/login" className="rn-mbtn" onClick={() => setOpen(false)}>Enroll Now</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBarpage;
