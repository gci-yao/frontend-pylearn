import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/api';

const LEVEL_COLORS = {
  debutant: { color: '#22c55e', dim: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.2)' },
  intermediaire: { color: '#3b82f6', dim: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)' },
  avance: { color: '#a855f7', dim: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.2)' },
  expert: { color: '#f97316', dim: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.2)' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [levels, setLevels] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([courseService.getLevels(), courseService.getProgress()])
      .then(([lvlRes, progRes]) => {
        setLevels(lvlRes.data);
        setStats(progRes.data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  const xp = user?.profile?.xp_total || 0;
  const badge = user?.profile?.level_badge || 'Débutant';
  const completed = user?.modules_completed || 0;

  if (loading) return <LoadingSkeleton />;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <p style={styles.greeting}>Bonjour, {user?.first_name || user?.username} 👋</p>
            <h1 style={styles.title}>Ton tableau de bord</h1>
          </div>
          <Link to="/cours" style={styles.ctaBtn}>
            Continuer d'apprendre →
          </Link>
        </div>

        {/* STATS CARDS */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Modules terminés', val: completed, icon: '✅', color: '#22c55e' },
            { label: 'Points XP', val: xp, icon: '⚡', color: '#f59e0b' },
            { label: 'Niveau actuel', val: badge, icon: '🏅', color: '#3b82f6' },
            { label: 'Progression globale', val: `${stats?.percentage || 0}%`, icon: '📈', color: '#a855f7' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: `${s.color}20`, color: s.color }}>{s.icon}</div>
              <div>
                <p style={{ ...styles.statVal, color: s.color }}>{s.val}</p>
                <p style={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* GLOBAL PROGRESS */}
        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <span style={styles.progressTitle}>Progression globale</span>
            <span style={{ color: '#22c55e', fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>
              {completed} / {stats?.total || 0} modules
            </span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${stats?.percentage || 0}%` }} />
          </div>
        </div>

        {/* LEVELS OVERVIEW */}
        <h2 style={styles.sectionTitle}>Niveaux</h2>
        <div style={styles.levelsGrid}>
          {levels.map((level) => {
            const c = LEVEL_COLORS[level.slug] || LEVEL_COLORS.debutant;
            const pct = level.completion_pct || 0;
            return (
              <Link to="/cours" key={level.id} style={{ ...styles.levelCard, borderColor: c.border }}>
                <div style={styles.levelTop}>
                  <span style={styles.levelEmoji}>{level.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ ...styles.levelName, color: c.color }}>{level.title}</p>
                    <p style={styles.levelMeta}>{level.modules_count} modules · {level.completed_count} faits</p>
                  </div>
                  <span style={{ ...styles.levelBadge, background: c.dim, color: c.color }}>{pct}%</span>
                </div>
                <div style={styles.levelBar}>
                  <div style={{ ...styles.levelFill, width: `${pct}%`, background: c.color }} />
                </div>
                <p style={styles.levelDesc}>{level.description}</p>
              </Link>
            );
          })}
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.quickActions}>
          <Link to="/cours" style={styles.actionCard}>
            <span style={{ fontSize: 28 }}>📚</span>
            <div>
              <p style={styles.actionTitle}>Voir tous les cours</p>
              <p style={styles.actionDesc}>Explore et continue tes modules</p>
            </div>
            <span style={styles.actionArrow}>→</span>
          </Link>
          <Link to="/profil" style={styles.actionCard}>
            <span style={{ fontSize: 28 }}>👤</span>
            <div>
              <p style={styles.actionTitle}>Mon profil</p>
              <p style={styles.actionDesc}>Gérer tes informations</p>
            </div>
            <span style={styles.actionArrow}>→</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ ...styles.page, paddingTop: 80 }}>
      <div style={styles.container}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: 80, borderRadius: 12, marginBottom: 16 }} className="skeleton" />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', paddingTop: 80 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  greeting: { color: '#9898b0', fontSize: 14, marginBottom: 4 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: '#f0f0f8' },
  ctaBtn: { padding: '11px 24px', background: '#22c55e', color: '#0a0a0f', fontFamily: "'Syne', sans-serif", fontWeight: 700, borderRadius: 10, fontSize: 14, textDecoration: 'none' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 },
  statCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px', display: 'flex', alignItems: 'center', gap: 14 },
  statIcon: { width: 44, height: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 },
  statVal: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, lineHeight: 1 },
  statLabel: { color: '#9898b0', fontSize: 12, marginTop: 4 },

  progressCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', marginBottom: 32 },
  progressHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressTitle: { color: '#9898b0', fontSize: 14 },
  progressBar: { height: 6, background: '#1c1c28', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #22c55e, #3b82f6)', borderRadius: 3, transition: 'width 1s ease' },

  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#f0f0f8', marginBottom: 16 },
  levelsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 },
  levelCard: { background: '#111118', border: '1px solid', borderRadius: 14, padding: '20px', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform 0.2s, border-color 0.2s' },
  levelTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  levelEmoji: { fontSize: 24 },
  levelName: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 },
  levelMeta: { color: '#5a5a72', fontSize: 12 },
  levelBadge: { padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700 },
  levelBar: { height: 3, background: '#1c1c28', borderRadius: 2, overflow: 'hidden', marginBottom: 12 },
  levelFill: { height: '100%', borderRadius: 2, transition: 'width 1s ease' },
  levelDesc: { color: '#5a5a72', fontSize: 13, lineHeight: 1.5 },

  quickActions: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 },
  actionCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' },
  actionTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15, color: '#f0f0f8', marginBottom: 2 },
  actionDesc: { color: '#5a5a72', fontSize: 13 },
  actionArrow: { marginLeft: 'auto', color: '#5a5a72', fontSize: 18 },
};
