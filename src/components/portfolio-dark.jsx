import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const T = {
  bg: "#0b0f19",
  bgAlt: "#0e1420",
  card: "#111827",
  cardHover: "#151e2e",
  primary: "#6366f1",
  accent: "#22d3ee",
  text: "#e5e7eb",
  muted: "#6b7280",
  border: "#1f2937",
  borderHover: "#374151",
  glow: "rgba(99,102,241,0.18)",
  accentGlow: "rgba(34,211,238,0.12)",
};

// ── Scroll Reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, x = 0, y = 30, className = "", once = true }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Grid Noise Overlay ────────────────────────────────────────────────────────
const GridOverlay = () => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage: `
      linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "64px 64px",
  }} />
);

// ── Floating Orbs ─────────────────────────────────────────────────────────────
const Orb = ({ style, color = T.primary, size = 300 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: "50%",
    background: color,
    filter: "blur(100px)",
    opacity: 0.12,
    position: "absolute",
    pointerEvents: "none",
    ...style,
  }} />
);

// ── Floating Sidebar Nav ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: "hero", label: "01", name: "Index" },
  { id: "about", label: "02", name: "Profile" },
  { id: "skills", label: "03", name: "Stack" },
  { id: "projects", label: "04", name: "Work" },
  { id: "contact", label: "05", name: "Connect" },
];

function FloatingSidebar() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.4 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{
        position: "fixed",
        right: 32,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
      }}
      className="sidebar-nav"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 0",
              transition: "all 0.3s",
            }}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.accent,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {s.name}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.div
              animate={{
                width: isActive ? 28 : 12,
                background: isActive ? T.primary : T.border,
                boxShadow: isActive ? `0 0 12px ${T.primary}` : "none",
              }}
              transition={{ duration: 0.3 }}
              style={{ height: 2, borderRadius: 2 }}
            />
          </button>
        );
      })}
    </motion.aside>
  );
}

// ── Top Logo Bar ──────────────────────────────────────────────────────────────
function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 99,
        padding: "18px 5vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(11,15,25,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "all 0.4s",
      }}
    >
      <motion.div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "-0.5px",
          color: T.text,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{
          display: "inline-block",
          width: 8, height: 8,
          borderRadius: "50%",
          background: T.primary,
          boxShadow: `0 0 12px ${T.primary}`,
        }} />
        Pavithra.dev
      </motion.div>

      <div style={{ display: "flex", gap: 6 }} className="top-nav-links">
        {["Resume", "Blog"].map((l) => (
          <a key={l} href="#" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: T.muted,
            textDecoration: "none",
            padding: "6px 14px",
            borderRadius: 6,
            border: `1px solid ${T.border}`,
            transition: "all 0.2s",
            letterSpacing: 0.5,
          }}
            onMouseEnter={(e) => { e.target.style.color = T.text; e.target.style.borderColor = T.borderHover; }}
            onMouseLeave={(e) => { e.target.style.color = T.muted; e.target.style.borderColor = T.border; }}
          >{l}</a>
        ))}
      </div>
    </motion.header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const words = ["systems.", "experiences.", "products.", "interfaces."];
  const [wIdx, setWIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWIdx((i) => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      padding: "120px 5vw 80px",
    }}>
      <Orb style={{ top: "10%", left: "60%" }} size={500} color={T.primary} />
      <Orb style={{ bottom: "0%", left: "-5%" }} size={350} color={T.accent} />

      {/* Left large label */}
      <div style={{
        position: "absolute",
        left: "5vw",
        top: "50%",
        transform: "translateY(-50%) rotate(-90deg) translateX(-50%)",
        transformOrigin: "left center",
        fontFamily: "'Syne', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 4,
        color: T.muted,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        opacity: 0.5,
      }}>
        Full-Stack developer· 2025
      </div>

      <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", paddingLeft: "6vw" }}>
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            border: `1px solid ${T.border}`,
            borderRadius: 4,
            padding: "6px 14px",
            marginBottom: 40,
            background: "rgba(99,102,241,0.05)",
          }}
        >
          <span style={{
            display: "inline-block",
            width: 6, height: 6,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px #22c55e",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: T.muted, letterSpacing: 1.5, fontWeight: 600, textTransform: "uppercase" }}>
            Open to opportunities
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(44px, 7.5vw, 96px)",
            fontWeight: 800,
            color: T.text,
            lineHeight: 1.0,
            letterSpacing: "-3px",
            marginBottom: 28,
          }}
        >
          I build<br />
          <span style={{
            background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            scalable
          </span>{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={wIdx}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.45 }}
              style={{ color: T.text, display: "inline-block" }}
            >
              {words[wIdx]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "clamp(14px, 2vw, 17px)",
            color: T.muted,
            maxWidth: 500,
            lineHeight: 1.75,
            marginBottom: 48,
            borderLeft: `2px solid ${T.border}`,
            paddingLeft: 20,
          }}
        >
         MERN Stack Developer specializing in full-stack web applications, scalable backend systems, and modern responsive frontends.
building real-world applications that deliver performance and user-focused solutions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: `0 0 30px ${T.glow}` }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: T.primary,
              border: "none",
              borderRadius: 6,
              padding: "13px 28px",
              color: "#fff",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "box-shadow 0.3s",
            }}
          >
            View My Work
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, borderColor: T.primary, color: T.text }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: "transparent",
              border: `1px solid ${T.border}`,
              borderRadius: 6,
              padding: "13px 28px",
              color: T.muted,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            Get in Touch
          </motion.button>
        </motion.div>

        {/* Metrics row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{
            marginTop: 80,
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {[
            { val: "6+", sub: "Years experience" },
            { val: "80k+", sub: "GitHub commits" },
            { val: "30+", sub: "Shipped products" },
            { val: "12", sub: "Open source repos" },
          ].map((m) => (
            <div key={m.sub}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-1px",
                lineHeight: 1,
                marginBottom: 4,
              }}>{m.val}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted }}>{m.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative corner code */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{
          position: "absolute",
          bottom: 60,
          right: "12vw",
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: T.muted,
          opacity: 0.35,
          lineHeight: 1.8,
          userSelect: "none",
          textAlign: "right",
        }}
      >
        {`const developer = {`}<br />
        {`  name: "Pavithra",`}<br />
        {`  role: "Full-Stack",`}<br />
        {`  stack: ["React", "Node", "Go"],`}<br />
        {`};`}
      </motion.div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
const TIMELINE = [
  { year: "2024", role: "Senior Engineer", company: "Stripe", desc: "Led payments infra team, shipped 3 major APIs" },
  { year: "2022", role: "Full-Stack Lead", company: "Vercel", desc: "Frontend platform team, Edge runtime features" },
  { year: "2020", role: "Software Engineer", company: "Atlassian", desc: "Core Jira infrastructure, distributed systems" },
  { year: "2018", role: "Junior Developer", company: "Freelance", desc: "Built 15+ client products from scratch" },
];

function About() {
  return (
    <section id="about" style={{
      padding: "120px 5vw",
      position: "relative",
      overflow: "hidden",
      background: T.bgAlt,
      borderTop: `1px solid ${T.border}`,
      borderBottom: `1px solid ${T.border}`,
    }}>
      <Orb style={{ top: -100, right: -60 }} size={400} color={T.accent} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section label */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.primary, letterSpacing: 2 }}>02 /</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: T.muted, letterSpacing: 3, textTransform: "uppercase" }}>Profile</span>
          </div>
        </Reveal>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="about-grid">
          {/* Left: bio */}
          <div>
            <Reveal>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                marginBottom: 28,
              }}>
                Engineering at the<br />
                <span style={{ color: T.primary }}>intersection</span> of<br />
                craft and scale.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: T.muted, lineHeight: 1.9, marginBottom: 20 }}>
                I'm Pavithra — a junior full-stack developer with one year of experience building products used by millions. I obsess over the details: response times, type hierarchies, and the exact right abstraction.
              </p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: T.muted, lineHeight: 1.9, marginBottom: 36 }}>
                building scalable and efficient web applications. Experienced in developing full-stack solutions using MongoDB, Express.js, React, and Node.js. Passionate about clean code, performance, and creating seamless user experiences.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {["TypeScript", "Go", "Rust", "PostgreSQL", "Kubernetes"].map((t) => (
                  <span key={t} style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    color: T.accent,
                    border: `1px solid rgba(34,211,238,0.2)`,
                    borderRadius: 4,
                    padding: "4px 10px",
                    background: "rgba(34,211,238,0.04)",
                    letterSpacing: 0.5,
                  }}>{t}</span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right: timeline */}
          <div>
            <Reveal delay={0.05} x={40}>
              <div style={{ position: "relative" }}>
                {/* Vertical line */}
                <div style={{
                  position: "absolute",
                  left: 0,
                  top: 0, bottom: 0,
                  width: 1,
                  background: `linear-gradient(to bottom, ${T.primary}, transparent)`,
                }} />

                <div style={{ paddingLeft: 28, display: "flex", flexDirection: "column", gap: 36 }}>
                  {TIMELINE.map((item, i) => (
                    <Reveal key={item.year} delay={0.1 + i * 0.08}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        style={{ position: "relative", cursor: "default" }}
                      >
                        {/* Dot */}
                        <div style={{
                          position: "absolute",
                          left: -32,
                          top: 6,
                          width: 8, height: 8,
                          borderRadius: "50%",
                          background: i === 0 ? T.primary : T.border,
                          border: `2px solid ${i === 0 ? T.primary : T.borderHover}`,
                          boxShadow: i === 0 ? `0 0 12px ${T.primary}` : "none",
                        }} />

                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.primary, letterSpacing: 1.5, marginBottom: 4 }}>
                          {item.year}
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 6 }}>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: T.text }}>{item.role}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted }}>@ {item.company}</span>
                        </div>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{item.desc}</p>
                      </motion.div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
const SKILL_GROUPS = [
  {
    category: "Frontend",
    icon: "⬡",
    skills: [
      { name: "React / Next.js", level: "Expert" },
      { name: "TypeScript", level: "Expert" },
      { name: "WebGL / Three.js", level: "Advanced" },
      { name: "CSS / Framer Motion", level: "Expert" },
    ],
  },
  {
    category: "Backend",
    icon: "⬡",
    skills: [
      { name: "Node.js / Express", level: "Expert" },
      { name: "Go", level: "Advanced" },
      { name: "GraphQL / REST", level: "Expert" },
      { name: "gRPC", level: "Intermediate" },
    ],
  },
  {
    category: "Data & Cloud",
    icon: "⬡",
    skills: [
      { name: "PostgreSQL / Redis", level: "Expert" },
      { name: "MongoDB", level: "Advanced" },
      { name: "AWS / GCP", level: "Advanced" },
      { name: "Kubernetes / Docker", level: "Expert" },
    ],
  },
  {
    category: "Systems",
    icon: "⬡",
    skills: [
      { name: "Rust", level: "Intermediate" },
      { name: "Linux / Shell", level: "Expert" },
      { name: "CI/CD / GitHub Actions", level: "Expert" },
      { name: "Observability (DD/PG)", level: "Advanced" },
    ],
  },
];

const LEVEL_COLOR = { Expert: T.primary, Advanced: T.accent, Intermediate: T.muted };

function SkillGroup({ group, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <Reveal delay={delay}>
      <motion.div
        onHoverStart={() => setHov(true)}
        onHoverEnd={() => setHov(false)}
        whileHover={{ y: -4 }}
        style={{
          background: hov ? T.cardHover : T.card,
          border: `1px solid ${hov ? T.borderHover : T.border}`,
          borderRadius: 12,
          padding: "28px 24px",
          transition: "background 0.3s, border 0.3s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <motion.div
          animate={{ scaleX: hov ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`,
            transformOrigin: "left",
          }}
        />
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
          {group.category}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {group.skills.map((sk) => (
            <div key={sk.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: T.text }}>{sk.name}</span>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: LEVEL_COLOR[sk.level],
                border: `1px solid ${LEVEL_COLOR[sk.level]}44`,
                borderRadius: 3,
                padding: "2px 8px",
                textTransform: "uppercase",
              }}>{sk.level}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Reveal>
  );
}

function Skills() {
  return (
    <section id="skills" style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
      <Orb style={{ bottom: -80, left: "30%" }} size={400} color={T.primary} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.primary, letterSpacing: 2 }}>03 /</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: T.muted, letterSpacing: 3, textTransform: "uppercase" }}>Stack</span>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start" }} className="skills-grid">
          <Reveal>
            <div>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                marginBottom: 20,
              }}>
                The tools<br />I trust<br />in production.
              </h2>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.muted, lineHeight: 1.8 }}>
                Six years of pragmatic choices — technology selected for the right problem, not the resume.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {SKILL_GROUPS.map((g, i) => <SkillGroup key={g.category} group={g} delay={i * 0.07} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    num: "01",
title: "Tanya's Collection",
tagline: "Full-stack e-commerce platform",
desc: "Developed a full-stack e-commerce web application for hair care products such as hair oils and shampoos using the MERN stack.",
tech: ["MongoDB", "Express", "React", "Node.js", "Tailwind CSS", "JWT"],
color: T.primary,
github: "#",
live: "https://tanyanaturals.whydev.co.in/",
year: "2025",
  },
  {
    num: "02",
title: "Povi's Collection",
tagline: "E-commerce jewellery platform",
desc: "Developed the product page for a jewellery e-commerce website, focusing on displaying product details, images, pricing, and category-based listings. ",
tech: ["React", "JavaScript", "Tailwind CSS"],
color: T.accent,
github: "#",
live: "https://poviscollections.whydev.co.in/",
year: "2025",
  },
  {
    
  num: "03",
  title: "Personal Portfolio",
  tagline: "Developer Portfolio Website",
  desc: "Designed and developed a responsive personal portfolio to showcase projects, skills, and experience. Implemented modern UI/UX with smooth animations and optimized performance for better user engagement.",
  tech: ["React.js", "Tailwind CSS", "Framer Motion"],
  color: "#38bdf8",
  github: "#",
  live: "#",
  year: "2026",

  },
  {
    num: "04",
title: "JVR Land Surveys",
tagline: "Land selling landing page",
desc: "Designed and developed a responsive landing page for showcasing land properties and survey details.. Implemented clean UI with smooth navigation for an informative browsing experience.",
tech: ["HTML", "CSS", "JavaScript"],
color: "#f59e0b",
github: "#",
live: "#",
year: "2025",
  },
  {
    num: "05",
title: "Arc360 Job Portal",
tagline: "Feature-rich job management platform",
desc: "A job portal with an admin dashboard enhanced for filtering by certifications and skills. Built with a focus on ease of use, advanced search, and job management for recruiters and candidates.",
tech: ["React", "Node.js", "MongoDB", "Express", "Bootstrap"],
color: "#10b981",
github: "#",
live: "#",
year: "2026"
  },
];

function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -6 }}
      style={{
        minWidth: 340,
        maxWidth: 340,
        background: hov ? T.cardHover : T.card,
        border: `1px solid ${hov ? project.color + "55" : T.border}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "background 0.3s, border 0.3s",
        boxShadow: hov ? `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${project.color}22` : "none",
        flexShrink: 0,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top band */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${project.color}, transparent)`,
      }} />

      <div style={{ padding: "28px 28px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: project.color,
            letterSpacing: 2,
            fontWeight: 700,
          }}>{project.num} / {project.year}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <a href={project.github}
              style={{ color: T.muted, textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = T.text)}
              onMouseLeave={(e) => (e.target.style.color = T.muted)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href={project.live}
              style={{ color: T.muted, textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = T.text)}
              onMouseLeave={(e) => (e.target.style.color = T.muted)}
            >↗</a>
          </div>
        </div>

        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 24,
          fontWeight: 800,
          color: T.text,
          letterSpacing: "-0.5px",
          marginBottom: 4,
        }}>{project.title}</h3>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          color: project.color,
          marginBottom: 16,
          letterSpacing: 0.5,
        }}>{project.tagline}</p>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          color: T.muted,
          lineHeight: 1.75,
          marginBottom: 24,
          flex: 1,
        }}>{project.desc}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tech.map((t) => (
            <span key={t} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: T.muted,
              border: `1px solid ${T.border}`,
              borderRadius: 3,
              padding: "3px 8px",
              letterSpacing: 0.5,
            }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Projects() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 370, behavior: "smooth" });
  };

  return (
    <section id="projects" style={{
      padding: "120px 0",
      background: T.bgAlt,
      borderTop: `1px solid ${T.border}`,
      borderBottom: `1px solid ${T.border}`,
      overflow: "hidden",
      position: "relative",
    }}>
      <Orb style={{ top: -60, right: -40 }} size={350} color={T.primary} />

      <div style={{ padding: "0 5vw", maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.primary, letterSpacing: 2 }}>04 /</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: T.muted, letterSpacing: 3, textTransform: "uppercase" }}>Work</span>
          </div>
        </Reveal>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: T.text,
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
            }}>
              Things I've<br />shipped.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ dir: -1, label: "←", active: canScrollLeft }, { dir: 1, label: "→", active: canScrollRight }].map(({ dir, label, active }) => (
                <motion.button
                  key={dir}
                  whileHover={active ? { scale: 1.08 } : {}}
                  whileTap={active ? { scale: 0.95 } : {}}
                  onClick={() => scroll(dir)}
                  style={{
                    width: 40, height: 40,
                    borderRadius: 6,
                    border: `1px solid ${active ? T.borderHover : T.border}`,
                    background: "transparent",
                    color: active ? T.text : T.muted,
                    cursor: active ? "pointer" : "default",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 16,
                    transition: "all 0.2s",
                    opacity: active ? 1 : 0.4,
                  }}
                >{label}</motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Horizontal scroll area — full width */}
      <div
        ref={scrollRef}
        onScroll={updateScroll}
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingLeft: "5vw",
          paddingRight: "5vw",
          paddingBottom: 8,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {PROJECTS.map((p, i) => (
          <div key={p.num} style={{ scrollSnapAlign: "start" }}>
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3500);
  };

  const inputBase = {
    width: "100%",
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    padding: "12px 16px",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    color: T.text,
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s, box-shadow 0.2s",
  };

  return (
    <section id="contact" style={{ padding: "120px 5vw", position: "relative", overflow: "hidden" }}>
      <Orb style={{ bottom: -80, right: "-5%" }} size={400} color={T.accent} />

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.primary, letterSpacing: 2 }}>05 /</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: T.muted, letterSpacing: 3, textTransform: "uppercase" }}>Connect</span>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="contact-grid">
          {/* Left info */}
          <div>
            <Reveal>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                marginBottom: 24,
              }}>
                Let's build<br />
                something<br />
                <span style={{ color: T.primary }}>worth shipping.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: T.muted, lineHeight: 1.85, marginBottom: 48, maxWidth: 380 }}>
                Open to senior engineering roles, consulting, and technical co-founder opportunities. I respond to every message within 24 hours.
              </p>
            </Reveal>

            {/* Contact details */}
            <Reveal delay={0.15}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Email", val: "pavithrasenthilkumarr@gmail.com", href: "mailto:pavithrasenthilkumarr@gmail.com" },
                  { label: "GitHub", val: "github.com/pavithraS284", href: "https://github.com/pavithraS284" },
                  { label: "LinkedIn", val: "linkedin.com/in/pavithrasenthilkumarr", href: "www.linkedin.com/in/pavithrasenthilkumarr" },
                  { label: "Location", val: "Manali,Chennai", href: null },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: T.primary,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      minWidth: 68,
                    }}>{item.label}</span>
                    <div style={{ height: 1, width: 16, background: T.border }} />
                    {item.href
                      ? <a href={item.href} style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.muted, textDecoration: "none", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.target.style.color = T.text)}
                        onMouseLeave={(e) => (e.target.style.color = T.muted)}
                      >{item.val}</a>
                      : <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: T.muted }}>{item.val}</span>
                    }
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right form */}
          <Reveal delay={0.08} x={40}>
            <div style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "36px 32px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Corner accent */}
              <div style={{
                position: "absolute",
                top: 0, right: 0,
                width: 80, height: 80,
                background: `radial-gradient(circle at top right, ${T.primary}22, transparent)`,
              }} />

              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      background: "rgba(34,197,94,0.08)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      borderRadius: 6,
                      padding: "12px 16px",
                      marginBottom: 20,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 13,
                      color: "#4ade80",
                    }}
                  >
                    ✓ Message received. I'll be in touch.
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {[{ label: "Name", key: "name", placeholder: "Alex Johnson", type: "text" },
                    { label: "Email", key: "email", placeholder: "you@company.com", type: "email" }].map(({ label, key, placeholder, type }) => (
                    <div key={key}>
                      <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>{label}</label>
                      <input
                        type={type}
                        required
                        value={form[key]}
                        placeholder={placeholder}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        style={{ ...inputBase, color: T.text }}
                        onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primary}18`; }}
                        onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted, display: "block", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    placeholder="Tell me about your project or opportunity..."
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{ ...inputBase, resize: "vertical", minHeight: 110, color: T.text }}
                    onFocus={(e) => { e.target.style.borderColor = T.primary; e.target.style.boxShadow = `0 0 0 3px ${T.primary}18`; }}
                    onBlur={(e) => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ boxShadow: `0 0 30px ${T.glow}`, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    background: T.primary,
                    border: "none",
                    borderRadius: 6,
                    padding: "13px",
                    color: "#fff",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    letterSpacing: 0.5,
                    transition: "box-shadow 0.3s",
                  }}
                >
                  Send Message →
                </motion.button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: "28px 5vw",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 12,
    }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted }}>
        © {new Date().getFullYear()} Pavithra — Built with React + Framer Motion
      </span>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.muted }}>
        Designed with obsessive precision.
      </span>
    </footer>
  );
}

// ── Global Styles ─────────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: #0b0f19; color: #e5e7eb; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0b0f19; }
    ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
    .about-grid, .contact-grid { grid-template-columns: 1fr 1fr; }
    .skills-grid { grid-template-columns: 1fr 2fr; }
    @media (max-width: 768px) {
      .about-grid, .contact-grid, .skills-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .sidebar-nav { display: none !important; }
      .top-nav-links { display: none !important; }
    }
  `}</style>
);

// ── App ───────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  return (
    <>
      <GlobalStyle />
      <GridOverlay />
      <TopBar />
      <FloatingSidebar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
