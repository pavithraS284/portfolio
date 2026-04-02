import { useState, useEffect, useRef } from "react";
import emailjs from '@emailjs/browser';

// ─── Global Styles ───────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --emerald: #10b981;
    --teal: #0d9488;
    --cyan: #06b6d4;
    --dark: #050d12;
    --card: #0d1f2d;
    --card2: #0f2535;
    --border: rgba(16,185,129,0.18);
    --text: #e2f0eb;
    --muted: #6b8c82;
    --grain-opacity: 0.04;
  }

  * { box-sizing: border-box; }
  html { background: var(--dark); scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    color: var(--text);
    overflow-x: hidden;
    cursor: none;
    margin: 0;
  }
 a, button { pointer-events: auto !important; cursor: none; }
input, textarea, select { pointer-events: auto !important; cursor: text; }

  h1, h2, h3, h4 { font-family: 'Syne', sans-serif; }

  #cursor {
    width: 12px; height: 12px;
    background: var(--emerald);
    border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 999;
    transform: translate(-50%, -50%);
    transition: transform 0.1s, width 0.2s, height 0.2s, opacity 0.2s;
    mix-blend-mode: screen;
  }
  #cursor-ring {
    width: 36px; height: 36px;
    border: 1.5px solid rgba(16,185,129,0.5);
    border-radius: 50%;
    position: fixed; top: 0; left: 0;
    pointer-events: none; z-index: 998;
    transform: translate(-50%, -50%);
    transition: transform 0.18s ease, width 0.2s, height 0.2s;
  }
    canvas, .orb {
  pointer-events: none;
}
#cursor, #cursor-ring {
  pointer-events: none !important;
}
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    opacity: var(--grain-opacity);
    pointer-events: none;
    z-index: 9990;
    pointer-events:none !important;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--dark); }
  ::-webkit-scrollbar-thumb { background: var(--emerald); border-radius: 2px; }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(80px); pointer-events: none; z-index: 0;
    animation: orbFloat 8s ease-in-out infinite;
  }
  .orb-1 { width:500px;height:500px;background:rgba(16,185,129,0.07);top:-100px;right:-100px;animation-delay:0s; }
  .orb-2 { width:400px;height:400px;background:rgba(6,182,212,0.06);bottom:200px;left:-100px;animation-delay:3s; }
  .orb-3 { width:300px;height:300px;background:rgba(13,148,136,0.05);top:50%;left:40%;animation-delay:5s; }

  @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }
  @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
  @keyframes loadProgress { 0%{width:0} 100%{width:100%} }
  @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes dotFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

  .reveal {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.2s; }
  .reveal-delay-3 { transition-delay: 0.3s; }
  .reveal-delay-4 { transition-delay: 0.4s; }

  .grad-text {
    background: linear-gradient(135deg, var(--emerald), var(--cyan));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    position: relative; overflow: visible;
  }
  .card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg,rgba(16,185,129,0.04) 0%,transparent 60%);
    opacity: 0; transition: opacity 0.3s;
    border-radius: 16px;  
    pointer-events: none; 
  }
  .card:hover::before { opacity: 1; }
  .card:hover {
    border-color: rgba(16,185,129,0.4);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba(16,185,129,0.1);
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    background: linear-gradient(135deg, var(--emerald), var(--teal));
    color: #fff; font-weight: 600; font-size: 0.9rem;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
    font-family: 'DM Sans', sans-serif;
    cursor: none; border: none; outline: none; text-decoration: none;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(16,185,129,0.35); opacity:0.95; }
  .btn-primary:disabled { opacity: 0.7; }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    border: 1.5px solid var(--emerald);
    color: var(--emerald); font-weight: 600; font-size: 0.9rem;
    border-radius: 8px; background: transparent;
    transition: transform 0.2s, background 0.2s;
    font-family: 'DM Sans', sans-serif;
    cursor: none; text-decoration: none;
  }
  .btn-outline:hover { transform:translateY(-2px); background:rgba(16,185,129,0.08); }

  .tag {
    font-size:0.7rem; font-weight:600;
    letter-spacing:0.08em; text-transform:uppercase;
    padding:4px 10px; border-radius:99px;
    background:rgba(16,185,129,0.1); color:var(--emerald);
    border:1px solid rgba(16,185,129,0.2);
  }

  .section-label {
    font-size:0.7rem; letter-spacing:0.25em;
    text-transform:uppercase; color:var(--emerald);
    font-family:'DM Sans',sans-serif; font-weight:500;
  }

  .timeline-dot {
    width:12px; height:12px; background:var(--emerald);
    border-radius:50%;
    box-shadow:0 0 0 4px rgba(16,185,129,0.2),0 0 20px rgba(16,185,129,0.4);
    flex-shrink:0;
  }

  .skill-bar-fill {
    height:100%; border-radius:99px; width:0;
    transition:width 1.4s cubic-bezier(0.4,0,0.2,1);
  }

  .social-icon {
    width:44px;height:44px;
    display:flex;align-items:center;justify-content:center;
    border:1px solid var(--border); border-radius:10px;
    color:var(--muted); font-size:1rem;
    transition:border-color 0.2s,color 0.2s,background 0.2s,transform 0.2s;
    cursor:none; text-decoration:none;
  }
  .social-icon:hover { border-color:var(--emerald);color:var(--emerald);background:rgba(16,185,129,0.08);transform:translateY(-2px); }

  .nav-link {
    font-size:0.85rem; font-weight:500; color:var(--muted);
    text-decoration:none; letter-spacing:0.02em;
    transition:color 0.2s; position:relative; cursor:none;
  }
  .nav-link::after {
    content:''; position:absolute; bottom:-2px; left:0;
    height:1px; width:0; background:var(--emerald); transition:width 0.25s;
  }
  .nav-link:hover { color:var(--emerald); }
  .nav-link:hover::after { width:100%; }

  .form-input {
    width:100%; background:var(--card2);
    border:1px solid var(--border); border-radius:10px;
    padding:14px 18px; color:var(--text);
    font-family:'DM Sans',sans-serif; font-size:0.95rem;
    outline:none; transition:border-color 0.2s,box-shadow 0.2s; resize:none;
  }
  .form-input::placeholder { color:var(--muted); }
  .form-input:focus { border-color:var(--emerald); box-shadow:0 0 0 3px rgba(16,185,129,0.12); }

  .grid-bg {
    background-image:
      linear-gradient(rgba(16,185,129,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(16,185,129,0.04) 1px,transparent 1px);
    background-size:60px 60px;
  }

  @media(max-width:768px) {
    .orb { display:none; }
    .about-grid { grid-template-columns:1fr !important; gap:40px !important; }
    .contact-grid { grid-template-columns:1fr !important; }
    .name-email-grid { grid-template-columns:1fr !important; }
    .float-badge-wrap { display:none !important; }
    .desktop-nav-wrap { display:none !important; }
    .hire-btn-wrap { display:none !important; }
    .hamburger-wrap { display:flex !important; }
  }
  @media(min-width:769px) {
    .float-badge-wrap { display:block !important; }
    .hamburger-wrap { display:none !important; }
  }
`;

// ─── Data ────────────────────────────────────────────────
const ROLES = ["MERN Stack Developer", "Full-Stack Engineer", "React Developer", "Node.js Developer"];

const SKILLS = [
  { name: "React.js",     icon: "fab fa-react",      color: "#61DAFB", pct: 85 },
  { name: "Node.js",      icon: "fab fa-node-js",    color: "#68A063", pct: 80 },
  { name: "Express.js",   icon: "fas fa-server",     color: "#ffffff60",pct: 78 },
  { name: "MongoDB",      icon: "fas fa-database",   color: "#4DB33D", pct: 82 },
  { name: "JavaScript",   icon: "fab fa-js-square",  color: "#F7DF1E", pct: 88 },
  { name: "Tailwind CSS", icon: "fab fa-css3-alt",   color: "#38BDF8", pct: 90 },
];

const PROJECTS = [
  {
    icon: "fas fa-leaf",
    iconBg: "linear-gradient(135deg,var(--emerald),var(--teal))",
    title: "Tanya's Naturals",
    live: "https://tanyanaturals.whydev.co.in/",
    github: "https://github.com/yourname/tanya",
    featured: true,
    desc: "A full-featured e-commerce platform for natural products. Complete shopping experience with advanced filtering, secure checkout, and a powerful admin panel for inventory and order management.",
    tags: ["MongoDB","Express","React","Node.js","JWT"],
    features: [
      "Product browsing with filters & search",
      "Cart, wishlist & secure checkout",
      "Admin dashboard & order management",
      "Role-based access control",
    ],
  },
  {
    icon: "fas fa-gem",
    iconBg: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    title: "Povi's Collections",
    live: "https://poviscollections.whydev.co.in/",
    github: "https://github.com/yourname/povi",
    desc: "Built a robust order management system where admins can create, update, and manage orders with full control. Designed user-order mapping using MongoDB ObjectId to track and fetch customer details for each order.",
    tags: ["Node.js","Express","MongoDB","REST API"],
  },
  {
  icon: "fas fa-map",
  iconBg: "linear-gradient(135deg,#22c55e,#16a34a)",
  title: "JVR Land Surveys",
  live:"https://jvrlandsurveys.com/",
  desc: "Developed a responsive frontend website for a land survey business, showcasing services, project details, and contact information. Designed a clean and user-friendly interface with modern UI components to ensure smooth navigation and optimal user experience across devices.",
  tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
},
];

const EXPERIENCE_POINTS = [
  [
  "Contributed to the development of full-stack e-commerce applications using the MERN stack.",
  "Developed RESTful APIs with Express.js and Node.js, implementing authentication and access control mechanisms.",
  "Assisted in designing MongoDB schemas to improve data organization and query efficiency.",
  "Participated in building admin features including order management and product handling interfaces.",
  "Collaborated using Git workflows, adhering to coding standards and maintaining well-documented code."
]
];

// ─── Custom Hook: Reveal on Scroll ───────────────────────
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.querySelectorAll(".skill-bar-fill").forEach((bar) => {
              bar.style.width = bar.dataset.pct + "%";
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ─── Cursor Component ────────────────────────────────────
function Cursor() {
  const cursorRef = useRef(null);
  const ringRef  = useRef(null);
  const state    = useRef({ mx:0, my:0, rx:0, ry:0 });

  useEffect(() => {
    const onMove = (e) => { state.current.mx = e.clientX; state.current.my = e.clientY; };
    document.addEventListener("mousemove", onMove);

    let raf;
    const tick = () => {
      const s = state.current;
      s.rx += (s.mx - s.rx) * 0.12;
      s.ry += (s.my - s.ry) * 0.12;
      if (cursorRef.current) { cursorRef.current.style.left=s.mx+"px"; cursorRef.current.style.top=s.my+"px"; }
      if (ringRef.current)   { ringRef.current.style.left=s.rx+"px";   ringRef.current.style.top=s.ry+"px"; }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const grow   = () => { cursorRef.current&&(cursorRef.current.style.transform="translate(-50%,-50%) scale(2.5)"); ringRef.current&&(ringRef.current.style.transform="translate(-50%,-50%) scale(1.5)"); };
    const shrink = () => { cursorRef.current&&(cursorRef.current.style.transform="translate(-50%,-50%) scale(1)");   ringRef.current&&(ringRef.current.style.transform="translate(-50%,-50%) scale(1)"); };

    const addListeners = () => {
      document.querySelectorAll("a,button,.card,.social-icon").forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    addListeners();
    const mo = new MutationObserver(addListeners);
    mo.observe(document.body, { childList:true, subtree:true });

    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); mo.disconnect(); };
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} style={{ pointerEvents: "none" }} />
<div id="cursor-ring" ref={ringRef} style={{ pointerEvents: "none" }} />
    </>
  );
}

// ─── Loading Screen ──────────────────────────────────────
function LoadingScreen({ hidden }) {
  return (
    <div style={{
      position:"fixed", inset:0, background:"var(--dark)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      zIndex:9997, transition:"opacity 0.6s ease, visibility 0.6s ease",
      opacity: hidden ? 0 : 1, visibility: hidden ? "hidden" : "visible",
    }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, letterSpacing:"-0.02em" }}>
        <span className="grad-text">P</span>
        <span style={{ color:"var(--text)" }}>avithra</span>
        <span className="grad-text">.</span>
      </div>
      <p style={{ color:"var(--muted)", fontSize:"0.8rem", letterSpacing:"0.15em", textTransform:"uppercase", marginTop:8 }}>
        Loading portfolio
      </p>
      <div style={{ width:200, height:2, background:"rgba(16,185,129,0.15)", borderRadius:2, overflow:"hidden", marginTop:24 }}>
        <div style={{ height:"100%", background:"linear-gradient(90deg,var(--emerald),var(--cyan))", borderRadius:2, animation:"loadProgress 1.6s cubic-bezier(0.4,0,0.2,1) forwards" }} />
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────
function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);
  const links = ["about","skills","projects","experience","contact"];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, width:"100%", zIndex:100,
        backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        borderBottom:"1px solid var(--border)",
        background: scrolled ? "rgba(5,13,18,0.95)" : "rgba(5,13,18,0.8)",
        transition:"background 0.3s",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>
          <a href="#hero" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:800, letterSpacing:"-0.02em", textDecoration:"none", cursor:"none" }}>
            <span className="grad-text">P</span>
            <span style={{ color:"var(--text)" }}>avithra</span>
            <span className="grad-text">.</span>
          </a>

          <div className="desktop-nav-wrap" style={{ display:"flex", gap:32 }}>
            {links.map((id) => (
              <a key={id} href={`#${id}`} className="nav-link" style={{ textTransform:"capitalize" }}>{id}</a>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <a href="#contact" className="btn-primary hire-btn-wrap" style={{ padding:"9px 22px", fontSize:"0.8rem" }}>
              <i className="fas fa-envelope" style={{ fontSize:"0.75rem" }} /> Hire Me
            </a>
            <button
              className="hamburger-wrap"
              onClick={() => setOpen((v) => !v)}
              style={{ background:"none", border:"none", color:"var(--text)", fontSize:"1.2rem", cursor:"none", display:"none" }}
            >
              <i className={open ? "fas fa-times" : "fas fa-bars"} />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div style={{ position:"fixed", top:64, left:0, right:0, background:"rgba(5,13,18,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)", zIndex:99, padding:24, display:"flex", flexDirection:"column", gap:20 }}>
          {links.map((id) => (
            <a key={id} href={`#${id}`} className="nav-link" style={{ fontSize:"1rem", textTransform:"capitalize" }} onClick={() => setOpen(false)}>{id}</a>
          ))}
        </div>
      )}
    </>
  );
}

// ─── Hero ────────────────────────────────────────────────
function Hero() {
  const canvasRef = useRef(null);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length:60 }, () => ({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      r: Math.random()*1.5+0.3,
      dx:(Math.random()-0.5)*0.3, dy:(Math.random()-0.5)*0.3,
      o: Math.random()*0.5+0.1,
    }));

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach((p) => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(16,185,129,${p.o})`; ctx.fill();
        p.x+=p.dx; p.y+=p.dy;
        if(p.x<0||p.x>canvas.width)  p.dx*=-1;
        if(p.y<0||p.y>canvas.height) p.dy*=-1;
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
        const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
        if(d<100) {
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(16,185,129,${0.06*(1-d/100)})`; ctx.lineWidth=0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize",resize); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    let ri=0, ci=0, del=false, t;
    const tick = () => {
      const cur = ROLES[ri];
      if(!del){ ci++; setTyped(cur.slice(0,ci)); if(ci===cur.length){ del=true; t=setTimeout(tick,2200); return; } }
      else    { ci--; setTyped(cur.slice(0,ci)); if(ci===0){ del=false; ri=(ri+1)%ROLES.length; } }
      t = setTimeout(tick, del?55:90);
    };
    t = setTimeout(tick, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className="grid-bg" style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, opacity:0.4, width:"100%", height:"100%" }} />

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"120px 24px 80px", width:"100%", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:28, maxWidth:760 }}>

          <div className="reveal" style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:32, height:1, background:"var(--emerald)" }} />
            <span className="section-label">Available for opportunities</span>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--emerald)", animation:"dotFloat 2s ease-in-out infinite" }} />
          </div>

          <h1 className="reveal reveal-delay-1" style={{ fontSize:"clamp(3rem,8vw,6rem)", fontWeight:800, lineHeight:1.05, letterSpacing:"-0.03em", margin:0 }}>
            Hi, I'm <span className="grad-text">Pavithra</span><br />
           
          </h1>

          <div className="reveal reveal-delay-2" style={{ fontSize:"clamp(1.1rem,3vw,1.6rem)", fontWeight:600, fontFamily:"'Syne',sans-serif", color:"var(--text)" }}>
            <span style={{ borderRight:"2px solid var(--emerald)", paddingRight:4 }}>{typed}</span>
          </div>

          <p className="reveal reveal-delay-3" style={{ fontSize:"1.05rem", color:"var(--muted)", lineHeight:1.75, maxWidth:540, margin:0 }}>
            Building scalable and user-friendly web applications. Crafting end-to-end solutions with the MERN stack — from elegant UIs to robust APIs.
          </p>

          <div className="reveal reveal-delay-4" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            <a href="#projects" className="btn-primary"><i className="fas fa-folder-open" /> View Projects</a>
            <a href="#contact" className="btn-outline"><i className="fas fa-paper-plane" /> Contact Me</a>
          </div>

          <div className="reveal reveal-delay-4" style={{ display:"flex", gap:40, paddingTop:16, flexWrap:"wrap", alignItems:"center" }}>
            {[["1","Years Exp."],["2+","Projects"],["4","Core Skills"]].map(([n,l],i) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:40 }}>
                {i>0 && <div style={{ width:1, height:48, background:"var(--border)" }} />}
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800 }} className="grad-text">{n}</div>
                  <div style={{ color:"var(--muted)", fontSize:"0.8rem", letterSpacing:"0.05em" }}>{l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="float-badge-wrap" style={{ position:"absolute", right:"6%", top:"25%", display:"none", animation:"floatBadge 3s ease-in-out infinite" }}>
        <div className="card" style={{ padding:"20px 28px", display:"flex", flexDirection:"column", gap:12, minWidth:200 }}>
          <div style={{ fontSize:"0.7rem", color:"var(--muted)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Core Stack</div>
          {[["fab fa-react","#61DAFB","React.js"],["fab fa-node-js","#68A063","Node.js"],["fas fa-database","#4DB33D","MongoDB"],["fas fa-server","#ffffff80","Express.js"]].map(([ic,col,nm]) => (
            <div key={nm} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:col, fontSize:"1.1rem" }}><i className={ic} /></span>
              <span style={{ fontSize:"0.85rem" }}>{nm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:"absolute", bottom:40, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, color:"var(--muted)" }}>
        <span style={{ fontSize:"0.7rem", letterSpacing:"0.1em", textTransform:"uppercase" }}>Scroll</span>
        <div style={{ width:1, height:40, background:"linear-gradient(to bottom,var(--emerald),transparent)", animation:"scrollPulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────
function About() {
  const codeLines = [
    <div key="1"><span style={{ color:"#f472b6" }}>const</span> <span style={{ color:"#60a5fa" }}>developer</span> <span style={{ color:"var(--muted)" }}>=</span> <span style={{ color:"var(--muted)" }}>{"{"}</span></div>,
    ...[["name","'Pavithra S'","#fbbf24"],["role","'MERN Stack Dev'","#fbbf24"],["experience","'1 Year'","#a78bfa"]].map(([k,v,c]) => (
      <div key={k} style={{ paddingLeft:20 }}><span style={{ color:"#34d399" }}>{k}</span><span style={{ color:"var(--muted)" }}>: </span><span style={{ color:c }}>{v}</span><span style={{ color:"var(--muted)" }}>,</span></div>
    )),
    <div key="stack-key" style={{ paddingLeft:20 }}><span style={{ color:"#34d399" }}>stack</span><span style={{ color:"var(--muted)" }}>: [</span></div>,
    ...["'MongoDB'","'Express.js'","'React.js'","'Node.js'"].map((s) => (
      <div key={s} style={{ paddingLeft:40 }}><span style={{ color:"#fbbf24" }}>{s}</span><span style={{ color:"var(--muted)" }}>,</span></div>
    )),
    <div key="close-arr" style={{ paddingLeft:20 }}><span style={{ color:"var(--muted)" }}>],</span></div>,
    <div key="passion" style={{ paddingLeft:20 }}><span style={{ color:"#34d399" }}>passion</span><span style={{ color:"var(--muted)" }}>: </span><span style={{ color:"#fbbf24" }}>'Building for impact'</span></div>,
    <div key="close"><span style={{ color:"var(--muted)" }}>{"}"}</span></div>,
  ];

  return (
    <section id="about" style={{ padding:"120px 24px", position:"relative", zIndex:1 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

          <div className="reveal" style={{ position:"relative" }}>
            <div style={{ aspectRatio:1, maxWidth:440, background:"var(--card)", borderRadius:24, border:"1px solid var(--border)", overflow:"hidden" }}>
              <div style={{ padding:40, height:"100%", display:"flex", flexDirection:"column", gap:16 }}>
                <div style={{ fontSize:"0.7rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--emerald)" }}>// about.js</div>
                <div style={{ display:"flex", flexDirection:"column", gap:10, fontFamily:"monospace", fontSize:"0.82rem", lineHeight:1.6 }}>
                  {codeLines}
                </div>
              </div>
            </div>
            <div style={{ position:"absolute", bottom:-20, right:30, width:80, height:80, background:"linear-gradient(135deg,var(--emerald),var(--cyan))", borderRadius:"50%", opacity:0.15, filter:"blur(20px)" }} />
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            <div className="reveal">
              <span className="section-label">About Me</span>
              <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, margin:"12px 0 0", letterSpacing:"-0.02em", lineHeight:1.1 }}>
                Crafting <span className="grad-text">digital experiences</span> with code
              </h2>
            </div>
            <p className="reveal reveal-delay-1" style={{ color:"var(--muted)", lineHeight:1.8, fontSize:"0.97rem" }}>
              I'm a passionate MERN Stack Developer with over a year of hands-on experience building full-stack web applications. My journey spans from designing pixel-perfect React interfaces to architecting scalable Node.js APIs and MongoDB databases.
            </p>
            <p className="reveal reveal-delay-2" style={{ color:"var(--muted)", lineHeight:1.8, fontSize:"0.97rem" }}>
              My strongest work has been in e-commerce — building complete platforms with product catalogs, filtering systems, shopping carts, order pipelines, and admin dashboards. I care deeply about performance, clean code, and user experience.
            </p>
            <div className="reveal reveal-delay-3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {["REST API Design","E-commerce Dev","Responsive UI/UX","Database Design"].map((item) => (
                <div key={item} className="card" style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ color:"var(--emerald)", fontSize:"1.2rem" }}><i className="fas fa-check-circle" /></span>
                  <span style={{ fontSize:"0.85rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Skills ──────────────────────────────────────────────
function Skills() {
  const extras = [["fab fa-git-alt","Git"],["fab fa-github","GitHub"],[null,"REST APIs"],[null,"JWT Auth"],[null,"Postman"],[null,"VS Code"],[null,"npm"],[null,"Vercel"]];
  return (
    <section id="skills" style={{ padding:"120px 24px", position:"relative", zIndex:1, background:"linear-gradient(to bottom,transparent,rgba(16,185,129,0.02),transparent)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:64 }}>
          <span className="section-label">What I Work With</span>
          <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, margin:"12px 0 0", letterSpacing:"-0.02em" }}>
            Skills & <span className="grad-text">Technologies</span>
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20, marginBottom:60 }}>
          {SKILLS.map((s,i) => (
            <div key={s.name} className={`card reveal${i>0?` reveal-delay-${Math.min(i,4)}`:""}`} style={{ padding:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
                <div style={{ width:42, height:42, background:`${s.color}18`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <i className={s.icon} style={{ color:s.color, fontSize:"1.2rem" }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:"0.95rem", marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:"0.75rem", color:"var(--muted)" }}>Proficiency</div>
                </div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:s.color }}>{s.pct}%</div>
              </div>
              <div style={{ height:4, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                <div className="skill-bar-fill" data-pct={s.pct} style={{ background:`linear-gradient(90deg,${s.color},${s.color}80)` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop:60, textAlign:"center" }}>
          <div style={{ color:"var(--muted)", fontSize:"0.75rem", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:28 }}>Also comfortable with</div>
          <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:12 }}>
            {extras.map(([ic,lbl]) => (
              <span key={lbl} className="tag">{ic && <><i className={ic} />{" "}</>}{lbl}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Projects ────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" style={{ padding:"120px 24px", position:"relative", zIndex:1 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="reveal" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:64, flexWrap:"wrap", gap:16 }}>
          <div>
            <span className="section-label">Portfolio</span>
            <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, margin:"12px 0 0", letterSpacing:"-0.02em" }}>
              Featured <span className="grad-text">Projects</span>
            </h2>
          </div>
          <a href="#contact" className="btn-outline" style={{ fontSize:"0.8rem", padding:"9px 20px" }}>
            <i className="fas fa-arrow-right" /> All Projects
          </a>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:24 }}>
          {PROJECTS.map((p,i) => (
            <div key={p.title} className={`card reveal${i>0?` reveal-delay-${i}`:""}`} style={{ padding:32, position:"relative" }}>
              {p.featured && (
                <div style={{ position:"absolute", top:20, right:20, background:"linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,182,212,0.1))", border:"1px solid rgba(16,185,129,0.25)", borderRadius:99, padding:"4px 12px", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--emerald)" }}>Featured</div>
              )}
              <div style={{ width:48, height:48, background:p.iconBg, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                <i className={p.icon} style={{ color:"white", fontSize:"1.2rem" }} />
              </div>
              <h3 style={{ fontSize:"1.3rem", fontWeight:700, margin:"0 0 8px", letterSpacing:"-0.01em" }}>{p.title}</h3>
              <p style={{ color:"var(--muted)", fontSize:"0.85rem", lineHeight:1.7, margin:"0 0 20px" }}>{p.desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:p.features?24:28 }}>
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              {p.features && (
                <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28, padding:16, background:"rgba(16,185,129,0.04)", borderRadius:10, border:"1px solid rgba(16,185,129,0.1)" }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.82rem", color:"var(--muted)" }}>
                      <i className="fas fa-check" style={{ color:"var(--emerald)", fontSize:"0.75rem" }} /> {f}
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", gap:12 }}>
              <a
  href={p.live}
  target="_blank"
  rel="noopener noreferrer"
  className="btn-primary"
  style={{ fontSize:"0.8rem", padding:"9px 18px", flex:1, justifyContent:"center", display:"inline-flex" }}
>
  <i className="fas fa-external-link-alt" /> Live Demo
</a>
               <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize:"0.8rem", padding:"9px 18px", flex:1, justifyContent:"center" }}>
                  <i className="fab fa-github" style={{ fontSize:"0.8rem" }} /> GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ──────────────────────────────────────────
function Experience() {
  return (
    <section id="experience" style={{ padding:"120px 24px", position:"relative", zIndex:1, background:"linear-gradient(to bottom,transparent,rgba(16,185,129,0.02),transparent)" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:64 }}>
          <span className="section-label">Career</span>
          <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, margin:"12px 0 0", letterSpacing:"-0.02em" }}>
            Work <span className="grad-text">Experience</span>
          </h2>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:0, position:"relative" }}>
          <div style={{ position:"absolute", left:24, top:12, bottom:12, width:1, background:"var(--border)" }} />

          {/* Current role */}
          <div className="reveal" style={{ display:"flex", gap:28, paddingBottom:48 }}>
            <div style={{ flexShrink:0, paddingTop:4, paddingLeft:18 }}>
              <div className="timeline-dot" />
            </div>
            <div className="card" style={{ flex:1, padding:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:16 }}>
                <div>
                  <h3 style={{ fontSize:"1.15rem", fontWeight:700, margin:"0 0 4px" }}>MERN Stack Developer</h3>
                  <div style={{ color:"var(--emerald)", fontSize:"0.88rem", fontWeight:500 }}>WHY Global Services</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span className="tag">Full-time</span>
                  <span style={{ color:"var(--muted)", fontSize:"0.78rem" }}>2025 – 2026</span>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {EXPERIENCE_POINTS[0].map((pt,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, color:"var(--muted)", fontSize:"0.88rem", lineHeight:1.6 }}>
                    <i className="fas fa-circle" style={{ fontSize:"0.35rem", marginTop:7, color:"var(--emerald)", flexShrink:0 }} />
                    {pt}
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:20, paddingTop:20, borderTop:"1px solid var(--border)" }}>
                {["React","Node.js","Express","MongoDB","Tailwind CSS","Git"].map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>

          {/* Training */}
          <div className="reveal reveal-delay-1" style={{ display:"flex", gap:28 }}>
            <div style={{ flexShrink:0, paddingTop:4, paddingLeft:18 }}>
              <div className="timeline-dot" style={{ background:"var(--muted)", boxShadow:"none" }} />
            </div>
            <div className="card" style={{ flex:1, padding:32 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:12 }}>
                <div>
                  <h3 style={{ fontSize:"1.15rem", fontWeight:700, margin:"0 0 4px" }}>Frontend</h3>
                  <div style={{ color:"var(--muted)", fontSize:"0.88rem", fontWeight:500 }}>Frontend Internship</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span className="tag" style={{ background:"rgba(107,140,130,0.1)", color:"var(--muted)", borderColor:"rgba(107,140,130,0.2)" }}>Completed</span>
                  <span style={{ color:"var(--muted)", fontSize:"0.78rem" }}>2024</span>
                </div>
              </div>
              <p style={{ color:"var(--muted)", fontSize:"0.88rem", lineHeight:1.7, margin:0 }}>
                Trained as a Frontend Developer, building responsive web applications using  HTML, CSS, and JavaScript. Worked on real-world projects focusing on modern UI design, reusable components, and delivering seamless user experiences across devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────
function Contact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = (e) => {
  e.preventDefault();
  setSending(true);

  emailjs.sendForm(
    "service_w4wjtea",   // your service ID
    "template_b05n89i",    // keep whatever template ID you already have
    e.target,
    "o8UeesCsQR-jY5Awx"    // from EmailJS
  )
  .then(() => {
    setSending(false);
    setSent(true);
    e.target.reset();
  })
  .catch((error) => {
    console.log(error);
    setSending(false);
  });
};

  return (
    <section id="contact" style={{ padding:"120px 24px", position:"relative", zIndex:1 }}>
      <div style={{ maxWidth:1000, margin:"0 auto" }}>
        <div className="reveal" style={{ textAlign:"center", marginBottom:64 }}>
          <span className="section-label">Let's Connect</span>
          <h2 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, margin:"12px 0 0", letterSpacing:"-0.02em" }}>
            Get In <span className="grad-text">Touch</span>
          </h2>
          <p style={{ color:"var(--muted)", fontSize:"0.97rem", margin:"16px auto 0", maxWidth:480, lineHeight:1.7 }}>
            Have a project in mind or want to collaborate? I'd love to hear from you. Let's build something great together.
          </p>
        </div>

        <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:40, alignItems:"start" }}>
          {/* Info column */}
          <div className="reveal" style={{ display:"flex", flexDirection:"column", gap:20 }}>
            {[
              { icon:"fas fa-envelope",      label:"Email",    value:"pavithrasenthilkumarr@gmail.com" },
              { icon:"fas fa-map-marker-alt", label:"Location", value:"Manali,Chennai" },
            ].map(({ icon,label,value }) => (
              <div key={label} className="card" style={{ padding:24, display:"flex", gap:16, alignItems:"flex-start" }}>
                <div style={{ width:44, height:44, background:"rgba(16,185,129,0.1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <i className={icon} style={{ color:"var(--emerald)" }} />
                </div>
                <div>
                  <div style={{ fontSize:"0.75rem", color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{label}</div>
                  <div style={{ fontSize:"0.9rem" }}>{value}</div>
                </div>
              </div>
            ))}

            <div className="card" style={{ padding:24, display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ width:44, height:44, background:"rgba(16,185,129,0.1)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <i className="fas fa-briefcase" style={{ color:"var(--emerald)" }} />
              </div>
              <div>
                <div style={{ fontSize:"0.75rem", color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Status</div>
                <div style={{ fontSize:"0.9rem", display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ width:7, height:7, background:"#22c55e", borderRadius:"50%", animation:"dotFloat 2s ease-in-out infinite", display:"inline-block" }} />
                  Open to opportunities
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize:"0.75rem", color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>Find me on</div>
              <div style={{ fontSize:"0.75rem", color:"var(--muted)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:14 }}>
  Find me on
</div>

<div style={{ display:"flex", gap:10 }}>
  {[
    ["fab fa-github","GitHub","https://github.com/pavithraS284"],
    ["fab fa-linkedin-in","LinkedIn","https://www.linkedin.com/in/pavithrasenthilkumarr"],
    ["fab fa-twitter","Twitter","https://twitter.com/your-username"]
  ].map(([ic,lbl,link]) => (
    <a 
      key={lbl} 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="social-icon" 
      title={lbl}
    >
      <i className={ic} />
    </a>
  ))}
</div>
            </div>
          </div>

          {/* Form */}
          <div className="card reveal reveal-delay-1" style={{ padding:36 }}>
            <h3 style={{ fontSize:"1.15rem", fontWeight:700, margin:"0 0 24px" }}>Send a Message</h3>
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="name-email-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
  ["Name","text","Your name",true,"from_name"],
  ["Email","email","your@email.com",true,"from_email"]
].map(([lbl,type,ph,req,name]) => (
  <div key={lbl}>
    <label style={{ fontSize:"0.75rem", color:"var(--muted)", letterSpacing:"0.06em", textTransform:"uppercase", display:"block", marginBottom:8 }}>
      {lbl}
    </label>
    <input 
      name={name}   
      type={type} 
      className="form-input" 
      placeholder={ph} 
      required={req} 
    />
    
  </div>
))}
              </div>
              <div>
                <label style={{ fontSize:"0.75rem", color:"var(--muted)", letterSpacing:"0.06em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Subject</label>
               <input 
  name="subject"
  type="text" 
  className="form-input" 
  placeholder="What's this about?" 
/>


              </div>
              <div>
                <label style={{ fontSize:"0.75rem", color:"var(--muted)", letterSpacing:"0.06em", textTransform:"uppercase", display:"block", marginBottom:8 }}>Message</label>
               <textarea 
  name="message"
  className="form-input" 
  rows={5} 
  placeholder="Tell me about your project..." 
/>
              </div>
              {!sent ? (
                <button type="submit" className="btn-primary" style={{ justifyContent:"center", marginTop:4 }} disabled={sending}>
                  {sending ? <><i className="fas fa-spinner fa-spin" /> Sending...</> : <><i className="fas fa-paper-plane" /> Send Message</>}
                </button>
              ) : (
                <div style={{ textAlign:"center", padding:12, background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:8, color:"var(--emerald)", fontSize:"0.88rem" }}>
                  <i className="fas fa-check-circle" /> Message sent! I'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ padding:"40px 24px", borderTop:"1px solid var(--border)", position:"relative", zIndex:1 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:800, marginBottom:4 }}>
            <span className="grad-text">P</span>
            <span style={{ color:"var(--text)" }}>avithra</span>
            <span className="grad-text">.</span>
          </div>
          <div style={{ color:"var(--muted)", fontSize:"0.8rem" }}>MERN Stack Developer</div>
        </div>
        <div style={{ color:"var(--muted)", fontSize:"0.8rem", textAlign:"center" }}>
          Designed & built with <span style={{ color:"var(--emerald)" }}>♥</span> using React & Tailwind CSS
        </div>
        <div style={{ color:"var(--muted)", fontSize:"0.8rem" }}>© 2025 Pavithra S. All rights reserved.</div>
      </div>
    </footer>
  );
}

// ─── Root App ────────────────────────────────────────────
export default function Portfolio() {
  const [loadingHidden, setLoadingHidden] = useState(false);
  const [scrolled, setScrolled]           = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoadingHidden(true), 1800);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  useReveal();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      {/* Font Awesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <Cursor />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <LoadingScreen hidden={loadingHidden} />
      <Navbar scrolled={scrolled} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
