import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';

const FEATURES = [
  {
    icon: '🐍',
    title: 'Python de A à Z',
    desc: '36 modules structurés en 4 niveaux progressifs.',
  },
  {
    icon: '⚡',
    title: 'Apprentissage actif',
    desc: 'Des exemples réels et des exercices pratiques.',
  },
  {
    icon: '🏆',
    title: 'Système XP',
    desc: 'Gagne des points et monte en niveau.',
  },
  {
    icon: '📱',
    title: 'Responsive',
    desc: 'Accessible sur desktop, tablette et mobile.',
  },
  {
    icon: '🎯',
    title: 'Suivi intelligent',
    desc: 'Visualise ta progression en temps réel.',
  },
  {
    icon: '🆓',
    title: '100% Gratuit',
    desc: 'Aucun abonnement, accès complet.',
  },
];

const LEVELS = [
  {
    emoji: '🐍',
    name: 'Débutant',
    color: '#22c55e',
    modules: 9,
    topics: 'Variables, listes, fonctions…',
  },
  {
    emoji: '🔥',
    name: 'Intermédiaire',
    color: '#3b82f6',
    modules: 10,
    topics: 'POO, décorateurs, regex…',
  },
  {
    emoji: '⚡',
    name: 'Avancé',
    color: '#8b5cf6',
    modules: 6,
    topics: 'Async, API, NumPy…',
  },
  {
    emoji: '🏆',
    name: 'Expert',
    color: '#f97316',
    modules: 4,
    topics: 'ML, Docker, performances…',
  },
];

export default function LandingPage() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_modules: 36,
  });

  const heroRef = useRef(null);

  useEffect(() => {
    courseService
      .getStats()
      .then((r) => setStats(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      if (!heroRef.current) return;

      const x =
        (e.clientX / window.innerWidth - 0.5) * 20;

      const y =
        (e.clientY / window.innerHeight - 0.5) * 20;

      heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMove);

    return () =>
      window.removeEventListener(
        'mousemove',
        handleMove
      );
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.gridBg} />

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logoWrapper}>
            <div style={styles.logoIcon}>🐍</div>

            <span style={styles.logo}>
              Py<span style={{ color: '#22c55e' }}>
                Learn
              </span>
            </span>
          </div>

          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>
              Fonctionnalités
            </a>

            <a href="#levels" style={styles.navLink}>
              Niveaux
            </a>

            <Link to="/login" style={styles.navGhost}>
              Connexion
            </Link>

            
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div ref={heroRef} style={styles.heroBg}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                ...styles.orb,
                ...orbPositions[i],
              }}
            />
          ))}
        </div>

        {/* LEFT */}
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            ✦ Plateforme moderne & gratuite
          </div>

          <h1 style={styles.heroTitle}>
            Maîtrise Python
            <br />

            <span style={styles.gradientText}>
              de façon intelligente.
            </span>
          </h1>

          <p style={styles.heroDesc}>
            Une plateforme moderne inspirée des
            meilleures expériences UI.
            <br />
            Progresse rapidement avec des modules,
            des exercices et un système XP.
          </p>

          <div style={styles.heroActions}>
            <Link
              to="/register"
              style={styles.primaryBtn}
            >
              Commencer gratuitement →
            </Link>

            <Link
              to="/login"
              style={styles.secondaryBtn}
            >
              J’ai déjà un compte
            </Link>
          </div>

          <div style={styles.statsGrid}>
            {[
              {
                value:
                  stats.total_users > 0
                    ? `${stats.total_users}+`
                    : '0',
                label: 'Utilisateurs',
              },
              {
                value: stats.total_modules,
                label: 'Modules',
              },
              {
                value: '4',
                label: 'Niveaux',
              },
              {
                value: '100%',
                label: 'Gratuit',
              },
            ].map((item, index) => (
              <div key={index} style={styles.statCard}>
                <span style={styles.statValue}>
                  {item.value}
                </span>

                <span style={styles.statLabel}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.heroVisual}>
          <div style={styles.codeWindow}>
            <div style={styles.codeHeader}>
              <div style={styles.codeDots}>
                <span
                  style={{
                    ...styles.dot,
                    background: '#ff5f57',
                  }}
                />

                <span
                  style={{
                    ...styles.dot,
                    background: '#febc2e',
                  }}
                />

                <span
                  style={{
                    ...styles.dot,
                    background: '#28c840',
                  }}
                />
              </div>

              <span style={styles.codeFile}>
                python_journey.py
              </span>
            </div>

            <pre style={styles.codeContent}>
{`def fibonacci(n):
    a, b = 0, 1

    for _ in range(n):
        yield a
        a, b = b, a + b

print(list(fibonacci(8)))

class Student:
    def __init__(self, xp=0):
        self.xp = xp

    @property
    def level(self):
        if self.xp > 500:
            return "Expert 🏆"

        return "Beginner 🐍"`}
            </pre>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        style={styles.section}
      >
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTag}>
            Pourquoi PyLearn
          </span>

          <h2 style={styles.sectionTitle}>
            Une expérience simple et moderne
          </h2>

          <p style={styles.sectionSubtitle}>
            Pensée pour apprendre sans surcharge
            visuelle.
          </p>
        </div>

        <div style={styles.featuresGrid}>
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              style={styles.featureCard}
            >
              <div style={styles.featureIcon}>
                {feature.icon}
              </div>

              <h3 style={styles.featureTitle}>
                {feature.title}
              </h3>

              <p style={styles.featureDesc}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* LEVELS */}
      <section id="levels" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTag}>
            Curriculum
          </span>

          <h2 style={styles.sectionTitle}>
            4 niveaux progressifs
          </h2>
        </div>

        <div style={styles.levelGrid}>
          {LEVELS.map((level, index) => (
            <div
              key={index}
              style={{
                ...styles.levelCard,
                borderColor: `${level.color}25`,
              }}
            >
              <div
                style={{
                  ...styles.levelTop,
                  background: `${level.color}10`,
                }}
              >
                <span style={styles.levelEmoji}>
                  {level.emoji}
                </span>

                <span
                  style={{
                    ...styles.levelName,
                    color: level.color,
                  }}
                >
                  {level.name}
                </span>
              </div>

              <p style={styles.levelDesc}>
                {level.topics}
              </p>

              <span
                style={{
                  ...styles.levelBadge,
                  background: `${level.color}15`,
                  color: level.color,
                }}
              >
                {level.modules} modules
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaBox}>
          <h2 style={styles.ctaTitle}>
            Commence gratuitement aujourd’hui.
          </h2>

          <p style={styles.ctaDesc}>
            Rejoins la plateforme et progresse à
            ton rythme.
          </p>

          <Link
            to="/register"
            style={styles.primaryBtn}
          >
            Créer mon compte →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <span style={styles.logo}>
              Py<span style={{ color: '#22c55e' }}>
                Learn
              </span>
            </span>

            <p style={styles.footerText}>
              Apprendre Python gratuitement.
            </p>
          </div>

          <div style={styles.footerContact}>
            <p>Charles Yao</p>

            <a
              href="mailto:redhatteams@gmail.com"
              style={styles.footerLink}
            >
              redhatteams@gmail.com
            </a>

            <a
              href="tel:+2250706836722"
              style={styles.footerLink}
            >
              +225 07 06 83 67 22
            </a>
          </div>
        </div>

        <p style={styles.copy}>
          © 2026 PyLearn — Tous droits réservés from charles pre-Sales engeneer
        </p>
      </footer>
    </div>
  );
}

const orbPositions = [
  {
    top: '-10%',
    left: '-10%',
    width: 400,
    height: 400,
    background:
      'radial-gradient(circle, rgba(34,197,94,0.18), transparent 70%)',
  },

  {
    top: '0%',
    right: '-10%',
    width: 420,
    height: 420,
    background:
      'radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)',
  },

  {
    bottom: '-10%',
    left: '20%',
    width: 300,
    height: 300,
    background:
      'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)',
  },

  {
    top: '50%',
    right: '20%',
    width: 200,
    height: 200,
    background:
      'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)',
  },

  {
    bottom: '10%',
    right: '0%',
    width: 260,
    height: 260,
    background:
      'radial-gradient(circle, rgba(34,197,94,0.08), transparent 70%)',
  },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: '#050816',
    color: '#fff',
    overflowX: 'hidden',
    position: 'relative',
    fontFamily: 'Inter, sans-serif',
  },

  gridBg: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    maskImage:
      'radial-gradient(circle at center, black 40%, transparent 100%)',
    pointerEvents: 'none',
  },

  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backdropFilter: 'blur(20px)',
    background: 'rgba(5,8,22,0.7)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },

  navInner: {
    maxWidth: 1180,
    margin: '0 auto',
    height: 72,
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg,#22c55e,#3b82f6)',
  },

  logo: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: "'Syne', sans-serif",
  },

  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },

  navLink: {
    color: '#9ca3af',
    fontSize: 14,
  },

  navGhost: {
    padding: '10px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    fontSize: 14,
  },

  navButton: {
    padding: '11px 18px',
    borderRadius: 12,
    background:
      'linear-gradient(135deg,#22c55e,#3b82f6)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
  },

  hero: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 1180,
    margin: '0 auto',
    minHeight: '100vh',
    padding: '120px 24px 80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 60,
    flexWrap: 'wrap',
  },

  heroBg: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },

  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(10px)',
  },

  heroContent: {
    flex: 1,
    minWidth: 320,
    maxWidth: 560,
    position: 'relative',
    zIndex: 2,
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.18)',
    color: '#22c55e',
    fontSize: 13,
    marginBottom: 24,
  },

  heroTitle: {
    fontSize: 'clamp(44px,6vw,76px)',
    lineHeight: 1,
    fontWeight: 800,
    marginBottom: 22,
    letterSpacing: '-3px',
    fontFamily: "'Syne', sans-serif",
  },

  gradientText: {
    background:
      'linear-gradient(135deg,#22c55e,#3b82f6,#8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  heroDesc: {
    fontSize: 17,
    lineHeight: 1.8,
    color: '#9ca3af',
    marginBottom: 34,
  },

  heroActions: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    marginBottom: 42,
  },

  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    borderRadius: 14,
    background:
      'linear-gradient(135deg,#22c55e,#3b82f6)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
  },

  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 26px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(120px,1fr))',
    gap: 14,
  },

  statCard: {
    padding: '18px',
    borderRadius: 20,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
  },

  statValue: {
    display: 'block',
    fontSize: 26,
    fontWeight: 800,
    marginBottom: 4,
    fontFamily: "'Syne', sans-serif",
  },

  statLabel: {
    color: '#6b7280',
    fontSize: 13,
  },

  heroVisual: {
    flex: 1,
    minWidth: 320,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },

  codeWindow: {
    width: '100%',
    maxWidth: 520,
    background: 'rgba(16,18,27,0.95)',
    borderRadius: 26,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
    marginLeft: '47px', 
  },

  codeHeader: {
    height: 58,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 18px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },

  codeDots: {
    display: 'flex',
    gap: 7,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },

  codeFile: {
    fontSize: 12,
    color: '#6b7280',
  },

  codeContent: {
    margin: 0,
    padding: '24px',
    fontSize: 13,
    lineHeight: 1.9,
    color: '#cbd5e1',
    overflowX: 'auto',
    whiteSpace: 'pre',
    fontFamily: "'DM Mono', monospace",
  },

  section: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 1180,
    margin: '0 auto',
    padding: '90px 24px',
  },

  sectionHeader: {
    textAlign: 'center',
    marginBottom: 54,
  },

  sectionTag: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: 999,
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.15)',
    color: '#22c55e',
    fontSize: 12,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 'clamp(30px,4vw,52px)',
    fontWeight: 800,
    marginBottom: 14,
    letterSpacing: '-2px',
    fontFamily: "'Syne', sans-serif",
  },

  sectionSubtitle: {
    color: '#9ca3af',
    fontSize: 16,
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(260px,1fr))',
    gap: 18,
  },

  featureCard: {
    padding: '28px',
    borderRadius: 24,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.05)',
  },

  featureIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg,rgba(34,197,94,0.12),rgba(59,130,246,0.12))',
    fontSize: 28,
    marginBottom: 18,
  },

  featureTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
  },

  featureDesc: {
    color: '#9ca3af',
    lineHeight: 1.7,
    fontSize: 14,
  },

  levelGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(240px,1fr))',
    gap: 18,
  },

  levelCard: {
    padding: '24px',
    borderRadius: 24,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid',
  },

  levelTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px',
    borderRadius: 16,
    marginBottom: 18,
  },

  levelEmoji: {
    fontSize: 24,
  },

  levelName: {
    fontWeight: 700,
    fontSize: 16,
  },

  levelDesc: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 1.7,
    marginBottom: 18,
  },

  levelBadge: {
    display: 'inline-flex',
    padding: '6px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
  },

  ctaSection: {
    padding: '40px 24px 100px',
    display: 'flex',
    justifyContent: 'center',
  },

  ctaBox: {
    width: '100%',
    maxWidth: 900,
    borderRadius: 32,
    padding: '70px 28px',
    textAlign: 'center',
    background:
      'linear-gradient(135deg,rgba(34,197,94,0.10),rgba(59,130,246,0.10))',
    border: '1px solid rgba(255,255,255,0.06)',
  },

  ctaTitle: {
    fontSize: 'clamp(34px,4vw,56px)',
    fontWeight: 800,
    marginBottom: 18,
    letterSpacing: '-2px',
    fontFamily: "'Syne', sans-serif",
  },

  ctaDesc: {
    color: '#9ca3af',
    lineHeight: 1.8,
    marginBottom: 36,
    fontSize: 16,
  },

  footer: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '50px 24px 24px',
  },

  footerInner: {
    maxWidth: 1180,
    margin: '0 auto 28px',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 30,
  },

  footerText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 13,
  },

  footerContact: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },

  footerLink: {
    color: '#6b7280',
    fontSize: 13,
  },

  copy: {
    textAlign: 'center',
    color: '#4b5563',
    fontSize: 12,
  },
};