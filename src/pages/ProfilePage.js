import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, courseService } from '../services/api';

const BADGE_CONFIG = {
  'Débutant':       { color: '#22c55e', dim: 'rgba(34,197,94,0.12)',    emoji: '🐍' },
  'Intermédiaire':  { color: '#3b82f6', dim: 'rgba(59,130,246,0.12)',   emoji: '🔥' },
  'Avancé':         { color: '#a855f7', dim: 'rgba(168,85,247,0.12)',   emoji: '⚡' },
  'Expert':         { color: '#f97316', dim: 'rgba(249,115,22,0.12)',   emoji: '🏆' },
};

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [form, setForm] = useState({ first_name: '', last_name: '', bio: '' });
  const [progress, setProgress] = useState(null);
  const [levels, setLevels] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('profil');

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.profile?.bio || '',
      });
    }
    courseService.getProgress().then(r => setProgress(r.data));
    courseService.getLevels().then(r => setLevels(r.data));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile(form);
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const badge = user?.profile?.level_badge || 'Débutant';
  const bc = BADGE_CONFIG[badge] || BADGE_CONFIG['Débutant'];
  const xp = user?.profile?.xp_total || 0;
  const completed = user?.modules_completed || 0;
  const totalModules = progress?.stats?.total || 36;
  const pct = progress?.stats?.percentage || 0;

  // XP thresholds
  const xpLevels = [
    { name: 'Débutant', min: 0, max: 79, color: '#22c55e' },
    { name: 'Intermédiaire', min: 80, max: 199, color: '#3b82f6' },
    { name: 'Avancé', min: 200, max: 499, color: '#a855f7' },
    { name: 'Expert', min: 500, max: 999, color: '#f97316' },
  ];
  const currentLevel = xpLevels.find(l => xp >= l.min && xp <= l.max) || xpLevels[3];
  const nextLevel = xpLevels[xpLevels.indexOf(currentLevel) + 1];
  const xpPct = nextLevel
    ? Math.round((xp - currentLevel.min) / (nextLevel.min - currentLevel.min) * 100)
    : 100;

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* HERO PROFILE */}
        <div style={s.heroCard}>
          <div style={{ ...s.heroGlow, background: `radial-gradient(circle, ${bc.color}25 0%, transparent 70%)` }} />
          <div style={s.heroLeft}>
            <div style={{ ...s.avatar, background: bc.dim, border: `2px solid ${bc.color}40` }}>
              <span style={s.avatarEmoji}>{bc.emoji}</span>
            </div>
            <div>
              <h1 style={s.profileName}>{user?.full_name || user?.username}</h1>
              <p style={s.profileUsername}>@{user?.username}</p>
              <p style={s.profileEmail}>{user?.email}</p>
            </div>
          </div>
          <div style={s.heroRight}>
            <div style={{ ...s.badgePill, background: bc.dim, border: `1px solid ${bc.color}40`, color: bc.color }}>
              {bc.emoji} {badge}
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div style={s.statsRow}>
          {[
            { label: 'Modules terminés', val: completed, icon: '✅', color: '#22c55e' },
            { label: 'Points XP', val: xp, icon: '⚡', color: '#f59e0b' },
            { label: 'Progression', val: `${pct}%`, icon: '📈', color: '#3b82f6' },
            { label: 'Niveaux actifs', val: levels.filter(l => l.completed_count > 0).length, icon: '🏅', color: '#a855f7' },
          ].map((st, i) => (
            <div key={i} style={s.statCard}>
              <span style={{ fontSize: 22 }}>{st.icon}</span>
              <span style={{ ...s.statVal, color: st.color }}>{st.val}</span>
              <span style={s.statLabel}>{st.label}</span>
            </div>
          ))}
        </div>

        {/* XP PROGRESS */}
        <div style={s.xpCard}>
          <div style={s.xpTop}>
            <div>
              <span style={s.xpTitle}>Progression XP</span>
              <span style={{ ...s.xpBadge, background: bc.dim, color: bc.color }}>{badge}</span>
            </div>
            <span style={{ color: currentLevel.color, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>
              {xp} XP {nextLevel ? `/ ${nextLevel.min} pour "${nextLevel.name}"` : '— Niveau maximum !'}
            </span>
          </div>
          <div style={s.xpBarWrap}>
            <div style={{ ...s.xpBarFill, width: `${xpPct}%`, background: currentLevel.color }} />
          </div>
          <div style={s.xpLevels}>
            {xpLevels.map((l, i) => (
              <div key={i} style={{ ...s.xpLevel, opacity: xp >= l.min ? 1 : 0.3 }}>
                <div style={{ ...s.xpDot, background: l.color }} />
                <span style={{ fontSize: 11, color: xp >= l.min ? l.color : '#5a5a72' }}>{l.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div style={s.tabs}>
          {[
            { key: 'profil', label: '👤 Mon profil' },
            { key: 'progression', label: '📊 Ma progression' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ ...s.tabBtn, color: tab === t.key ? '#22c55e' : '#9898b0', borderBottom: `2px solid ${tab === t.key ? '#22c55e' : 'transparent'}` }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profil' && (
          <div style={s.formCard}>
            <h2 style={s.formTitle}>Informations personnelles</h2>
            <form onSubmit={handleSave} style={s.form}>
              <div style={s.row}>
                <FormField label="Prénom" value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} placeholder="Charles" />
                <FormField label="Nom" value={form.last_name} onChange={v => setForm(f => ({ ...f, last_name: v }))} placeholder="Yao" />
              </div>
              <FormField label="Bio" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} placeholder="Dis-nous quelque chose sur toi…" multiline />
              <div style={s.formActions}>
                <button type="submit" disabled={saving} style={s.saveBtn}>
                  {saving ? 'Sauvegarde…' : saved ? '✓ Sauvegardé !' : 'Sauvegarder'}
                </button>
                <button type="button" onClick={logout} style={s.logoutBtn}>
                  Déconnexion
                </button>
              </div>
            </form>
          </div>
        )}

        {tab === 'progression' && (
          <div>
            <div style={s.levelsGrid}>
              {levels.map(level => {
                const pctLevel = level.completion_pct || 0;
                const colors = ['#22c55e','#3b82f6','#a855f7','#f97316'];
                const col = colors[level.order - 1] || '#22c55e';
                return (
                  <div key={level.id} style={{ ...s.levelCard, borderColor: `${col}25` }}>
                    <div style={s.levelTop}>
                      <span style={{ fontSize: 24 }}>{level.icon}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ ...s.levelName, color: col }}>{level.title}</p>
                        <p style={s.levelMeta}>{level.completed_count} / {level.modules_count} modules</p>
                      </div>
                      <span style={{ ...s.pctBadge, background: `${col}15`, color: col }}>{pctLevel}%</span>
                    </div>
                    <div style={s.levelBar}>
                      <div style={{ ...s.levelFill, width: `${pctLevel}%`, background: col }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {progress?.progress?.length > 0 && (
              <div style={s.historyCard}>
                <h3 style={s.historyTitle}>Derniers modules terminés</h3>
                <div style={s.historyList}>
                  {progress.progress.slice(0, 10).map((p, i) => (
                    <div key={p.id} style={{ ...s.historyItem, animationDelay: `${i * 50}ms` }} className="fade-in">
                      <div style={{ ...s.historyDot, background: p.level_color || '#22c55e' }} />
                      <div style={{ flex: 1 }}>
                        <p style={s.historyModule}>{p.module_title}</p>
                        <p style={s.historyLevel}>{p.level_title}</p>
                      </div>
                      <span style={s.historyDate}>
                        {p.completed_at ? new Date(p.completed_at).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, multiline }) {
  const [focused, setFocused] = useState(false);
  const inputStyle = {
    background: '#16161f', border: `1px solid ${focused ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10, padding: '11px 14px', color: '#f0f0f8', fontSize: 14,
    width: '100%', transition: 'all 0.2s', resize: 'vertical',
    boxShadow: focused ? '0 0 0 3px rgba(34,197,94,0.1)' : 'none',
    fontFamily: "'DM Sans', sans-serif",
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#9898b0' }}>{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={inputStyle} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={inputStyle} />
      }
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a0f', paddingTop: 80 },
  container: { maxWidth: 900, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 },

  heroCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden', flexWrap: 'wrap', gap: 20 },
  heroGlow: { position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', pointerEvents: 'none' },
  heroLeft: { display: 'flex', alignItems: 'center', gap: 20 },
  avatar: { width: 72, height: 72, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarEmoji: { fontSize: 36 },
  profileName: { fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#f0f0f8', marginBottom: 2 },
  profileUsername: { color: '#9898b0', fontSize: 13, marginBottom: 2 },
  profileEmail: { color: '#5a5a72', fontSize: 12 },
  heroRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
  badgePill: { padding: '6px 16px', borderRadius: 100, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 },

  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 },
  statCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' },
  statVal: { fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800 },
  statLabel: { color: '#9898b0', fontSize: 12 },

  xpCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '22px 24px' },
  xpTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 },
  xpTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f0f0f8', marginRight: 10 },
  xpBadge: { padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600 },
  xpBarWrap: { height: 8, background: '#1c1c28', borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
  xpBarFill: { height: '100%', borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)' },
  xpLevels: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  xpLevel: { display: 'flex', alignItems: 'center', gap: 6 },
  xpDot: { width: 8, height: 8, borderRadius: '50%' },

  tabs: { display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  tabBtn: { padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: 'none', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },

  formCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px' },
  formTitle: { fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#f0f0f8', marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  formActions: { display: 'flex', gap: 12, paddingTop: 8 },
  saveBtn: { padding: '11px 28px', background: '#22c55e', color: '#0a0a0f', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, borderRadius: 10, cursor: 'pointer', border: 'none', transition: 'all 0.2s' },
  logoutBtn: { padding: '11px 24px', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, borderRadius: 10, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.2)', transition: 'all 0.2s' },

  levelsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 20 },
  levelCard: { background: '#111118', border: '1px solid', borderRadius: 14, padding: '18px' },
  levelTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  levelName: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 },
  levelMeta: { color: '#5a5a72', fontSize: 12 },
  pctBadge: { padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700 },
  levelBar: { height: 4, background: '#1c1c28', borderRadius: 2, overflow: 'hidden' },
  levelFill: { height: '100%', borderRadius: 2, transition: 'width 1s ease' },

  historyCard: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px' },
  historyTitle: { fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#f0f0f8', marginBottom: 16 },
  historyList: { display: 'flex', flexDirection: 'column', gap: 0 },
  historyItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  historyDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  historyModule: { fontWeight: 500, fontSize: 14, color: '#f0f0f8' },
  historyLevel: { color: '#5a5a72', fontSize: 12 },
  historyDate: { color: '#5a5a72', fontSize: 12, flexShrink: 0 },
};
