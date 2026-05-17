import React, { useEffect, useState, useCallback } from 'react';
import { courseService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LEVEL_THEME = {
  debutant:      { color: '#22c55e', dim: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.2)', glow: 'rgba(34,197,94,0.3)' },
  intermediaire: { color: '#3b82f6', dim: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)', glow: 'rgba(59,130,246,0.3)' },
  avance:        { color: '#a855f7', dim: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.2)', glow: 'rgba(168,85,247,0.3)' },
  expert:        { color: '#f97316', dim: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.2)', glow: 'rgba(249,115,22,0.3)' },
};

export default function CoursePage() {
  const { user, refreshUser } = useAuth();
  const [levels, setLevels] = useState([]);
  const [activeLevel, setActiveLevel] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    courseService.getLevels().then(r => {
      setLevels(r.data);
      if (!activeLevel && r.data.length) setActiveLevel(r.data[0]);
    }).finally(() => setLoading(false));
  }, [activeLevel]);

  useEffect(() => { load(); }, []); // eslint-disable-line

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = async (moduleId) => {
    setToggling(moduleId);
    try {
      const { data } = await courseService.toggleModule(moduleId);
      showToast(data.completed ? `+${data.xp_total ? '' : ''}✅ Module terminé ! +XP` : '🔄 Remis à zéro', data.completed ? 'success' : 'info');
      load();
      refreshUser();
      if (activeModule?.id === moduleId) {
        setActiveModule(m => ({ ...m, is_completed: data.completed }));
      }
    } catch {
      showToast('Une erreur est survenue', 'error');
    } finally {
      setToggling(null);
    }
  };

  const totalModules = levels.reduce((a, l) => a + l.modules_count, 0);
  const totalDone = levels.reduce((a, l) => a + l.completed_count, 0);
  const globalPct = totalModules ? Math.round(totalDone / totalModules * 100) : 0;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '2px solid #1c1c28', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={styles.page}>
      {/* TOAST */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === 'success' ? 'rgba(34,197,94,0.95)' : toast.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(59,130,246,0.95)' }}>
          {toast.msg}
        </div>
      )}

      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Curriculum</h2>
            <div style={styles.globalProg}>
              <div style={styles.globalProgBar}>
                <div style={{ ...styles.globalProgFill, width: `${globalPct}%` }} />
              </div>
              <span style={styles.globalProgLabel}>{totalDone}/{totalModules}</span>
            </div>
          </div>
          {levels.map(level => {
            const theme = LEVEL_THEME[level.slug] || LEVEL_THEME.debutant;
            const isActive = activeLevel?.id === level.id;
            return (
              <div key={level.id}>
                <button
                  onClick={() => { setActiveLevel(level); setActiveModule(null); }}
                  style={{ ...styles.levelBtn, background: isActive ? theme.dim : 'transparent', borderColor: isActive ? theme.border : 'transparent' }}
                >
                  <span style={styles.levelBtnEmoji}>{level.icon}</span>
                  <div style={styles.levelBtnInfo}>
                    <span style={{ ...styles.levelBtnName, color: isActive ? theme.color : '#f0f0f8' }}>{level.title}</span>
                    <span style={styles.levelBtnMeta}>{level.completed_count}/{level.modules_count} modules</span>
                  </div>
                  <div style={{ ...styles.levelPctBadge, background: theme.dim, color: theme.color }}>
                    {level.completion_pct}%
                  </div>
                </button>
                {isActive && (
                  <div style={styles.moduleList}>
                    {level.modules?.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => setActiveModule(mod)}
                        style={{
                          ...styles.moduleBtn,
                          background: activeModule?.id === mod.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                          borderLeft: activeModule?.id === mod.id ? `2px solid ${theme.color}` : '2px solid transparent',
                        }}
                      >
                        <span style={{ ...styles.moduleCheck, background: mod.is_completed ? theme.dim : 'transparent', color: mod.is_completed ? theme.color : '#5a5a72', border: `1px solid ${mod.is_completed ? theme.border : 'rgba(255,255,255,0.1)'}` }}>
                          {mod.is_completed ? '✓' : '○'}
                        </span>
                        <span style={{ ...styles.moduleBtnName, color: activeModule?.id === mod.id ? '#f0f0f8' : '#9898b0' }}>
                          {mod.icon} {mod.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {/* CONTENT */}
        <main style={styles.main}>
          {!activeModule ? (
            <LevelOverview level={activeLevel} theme={LEVEL_THEME[activeLevel?.slug]} onSelectModule={setActiveModule} />
          ) : (
            <ModuleView
              module={activeModule}
              theme={LEVEL_THEME[activeLevel?.slug] || LEVEL_THEME.debutant}
              onToggle={handleToggle}
              toggling={toggling}
              user={user}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function LevelOverview({ level, theme, onSelectModule }) {
  if (!level) return null;
  const t = theme || LEVEL_THEME.debutant;
  return (
    <div style={styles.overview}>
      <div style={{ ...styles.overviewBanner, background: `linear-gradient(135deg, ${t.dim}, transparent)`, borderColor: t.border }}>
        <span style={{ fontSize: 48 }}>{level.icon}</span>
        <div>
          <span style={{ ...styles.overviewTag, background: t.dim, color: t.color }}>Niveau {level.order}</span>
          <h1 style={{ ...styles.overviewTitle, color: t.color }}>{level.title}</h1>
          <p style={styles.overviewDesc}>{level.description}</p>
        </div>
        <div style={styles.overviewStats}>
          <div style={styles.overviewStat}>
            <span style={{ ...styles.overviewStatVal, color: t.color }}>{level.completed_count}</span>
            <span style={styles.overviewStatLabel}>Faits</span>
          </div>
          <div style={styles.overviewStat}>
            <span style={{ ...styles.overviewStatVal, color: t.color }}>{level.modules_count}</span>
            <span style={styles.overviewStatLabel}>Total</span>
          </div>
          <div style={styles.overviewStat}>
            <span style={{ ...styles.overviewStatVal, color: t.color }}>{level.completion_pct}%</span>
            <span style={styles.overviewStatLabel}>Terminé</span>
          </div>
        </div>
      </div>
      <h2 style={styles.modulesTitle}>Modules de ce niveau</h2>
      <div style={styles.modulesGrid}>
        {level.modules?.map((mod, i) => (
          <button key={mod.id} onClick={() => onSelectModule(mod)} style={{ ...styles.moduleCard, borderColor: mod.is_completed ? t.border : 'rgba(255,255,255,0.07)', animationDelay: `${i * 60}ms` }} className="fade-in">
            <div style={styles.moduleCardTop}>
              <span style={styles.moduleCardIcon}>{mod.icon}</span>
              <span style={{ ...styles.moduleCardCheck, color: mod.is_completed ? t.color : '#5a5a72' }}>
                {mod.is_completed ? '✓' : `${mod.duration_min}min`}
              </span>
            </div>
            <h3 style={styles.moduleCardTitle}>{mod.title}</h3>
            <p style={styles.moduleCardDesc}>{mod.description}</p>
            <div style={styles.moduleCardFooter}>
              <span style={{ ...styles.xpBadge, background: `${t.color}15`, color: t.color }}>+{mod.xp_reward} XP</span>
              {mod.is_completed && <span style={{ ...styles.doneBadge, background: t.dim, color: t.color }}>Terminé ✓</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModuleView({ module, theme, onToggle, toggling, user }) {
  const [tab, setTab] = useState('concept');
  const t = theme;

  return (
    <div style={styles.moduleView}>
      {/* MODULE HEADER */}
      <div style={styles.moduleHeader}>
        <div>
          <div style={styles.moduleMeta}>
            <span style={{ ...styles.moduleTag, background: t.dim, color: t.color }}>{module.level_title}</span>
            <span style={styles.moduleDuration}>⏱ {module.duration_min} min</span>
            <span style={{ ...styles.xpBadge, background: `${t.color}15`, color: t.color }}>+{module.xp_reward} XP</span>
          </div>
          <h1 style={styles.moduleTitle}>{module.icon} {module.title}</h1>
          <p style={styles.moduleDesc}>{module.description}</p>
        </div>
        <button
          onClick={() => onToggle(module.id)}
          disabled={toggling === module.id}
          style={{
            ...styles.toggleBtn,
            background: module.is_completed ? t.dim : t.color,
            color: module.is_completed ? t.color : '#0a0a0f',
            border: `1px solid ${module.is_completed ? t.border : 'transparent'}`,
            boxShadow: module.is_completed ? 'none' : `0 0 20px ${t.glow}`,
          }}
        >
          {toggling === module.id
            ? <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            : module.is_completed ? '↺ Remettre à zéro' : '✓ Marquer comme fait'}
        </button>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        {[
          { key: 'concept', label: '📖 Concept' },
          { key: 'code', label: '💻 Code' },
          { key: 'exercices', label: '🎯 Exercices' },
        ].map(tab_ => (
          <button
            key={tab_.key}
            onClick={() => setTab(tab_.key)}
            style={{
              ...styles.tabBtn,
              color: tab === tab_.key ? t.color : '#9898b0',
              borderBottom: `2px solid ${tab === tab_.key ? t.color : 'transparent'}`,
              background: 'transparent',
            }}
          >
            {tab_.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={styles.tabContent} key={tab}>
        {tab === 'concept' && (
          <div style={styles.conceptBox}>
            <div style={{ ...styles.conceptBlock, borderColor: t.border, background: t.dim }}>
              <h3 style={{ ...styles.conceptLabel, color: t.color }}>📌 Résumé du concept</h3>
              <p style={styles.conceptText}>{module.concept}</p>
            </div>
          </div>
        )}
        {tab === 'code' && (
          <div>
            <div style={styles.codeHeader}>
              <span style={styles.codeFilename}>exemple.py</span>
              <button onClick={() => navigator.clipboard?.writeText(module.code_example)} style={styles.copyBtn}>
                📋 Copier
              </button>
            </div>
            <pre style={styles.codeBlock}>{module.code_example}</pre>
          </div>
        )}
        {tab === 'exercices' && (
          <div style={styles.exercisesBlock}>
            <p style={styles.exosIntro}>
              Mets en pratique ce que tu viens d'apprendre. Essaie de résoudre chaque exercice avant de chercher la solution.
            </p>
            {module.exercises?.map((ex, i) => (
              <div key={ex.id} style={{ ...styles.exoCard, borderColor: t.border, animationDelay: `${i * 80}ms` }} className="fade-in">
                <div style={{ ...styles.exoNum, background: t.dim, color: t.color }}>
                  {i + 1}
                </div>
                <p style={styles.exoText}>{ex.text}</p>
              </div>
            ))}
            <button
              onClick={() => {
                const msg = `Donne-moi la solution complète et expliquée de l'exercice sur "${module.title}" en Python : "${module.exercises?.[0]?.text}"`;
                window.open(`https://claude.ai/chat?q=${encodeURIComponent(msg)}`, '_blank');
              }}
              style={{ ...styles.askAIBtn, background: t.dim, color: t.color, borderColor: t.border }}
            >
              ✨ Demander à Claude l'explication →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', paddingTop: 64 },
  layout: { display: 'flex', height: 'calc(100vh - 64px)' },
  toast: { position: 'fixed', top: 80, right: 24, zIndex: 1000, padding: '12px 20px', borderRadius: 10, color: '#0a0a0f', fontWeight: 700, fontSize: 14, animation: 'slideIn 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' },

  sidebar: { width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.07)', overflowY: 'auto', padding: '20px 12px' },
  sidebarHeader: { padding: '0 8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 12 },
  sidebarTitle: { fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#f0f0f8', marginBottom: 10 },
  globalProg: { display: 'flex', alignItems: 'center', gap: 8 },
  globalProgBar: { flex: 1, height: 3, background: '#1c1c28', borderRadius: 2, overflow: 'hidden' },
  globalProgFill: { height: '100%', background: 'linear-gradient(90deg, #22c55e, #3b82f6)', borderRadius: 2, transition: 'width 1s ease' },
  globalProgLabel: { fontSize: 11, color: '#5a5a72', flexShrink: 0 },

  levelBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 10px', borderRadius: 10, border: '1px solid', cursor: 'pointer', marginBottom: 2, transition: 'all 0.2s' },
  levelBtnEmoji: { fontSize: 18 },
  levelBtnInfo: { flex: 1, textAlign: 'left' },
  levelBtnName: { fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, display: 'block' },
  levelBtnMeta: { color: '#5a5a72', fontSize: 11 },
  levelPctBadge: { fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 100, flexShrink: 0 },

  moduleList: { paddingLeft: 16, marginBottom: 8 },
  moduleBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 6, cursor: 'pointer', marginBottom: 1, textAlign: 'left', transition: 'all 0.15s' },
  moduleCheck: { width: 18, height: 18, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 },
  moduleBtnName: { fontSize: 12, lineHeight: 1.3 },

  main: { flex: 1, overflowY: 'auto', padding: '28px' },

  overview: { maxWidth: 900, margin: '0 auto' },
  overviewBanner: { display: 'flex', alignItems: 'center', gap: 24, padding: '32px', borderRadius: 20, border: '1px solid', marginBottom: 32, flexWrap: 'wrap' },
  overviewTag: { display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' },
  overviewTitle: { fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 8 },
  overviewDesc: { color: '#9898b0', fontSize: 14, lineHeight: 1.6 },
  overviewStats: { display: 'flex', gap: 24, marginLeft: 'auto' },
  overviewStat: { textAlign: 'center' },
  overviewStatVal: { fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, display: 'block' },
  overviewStatLabel: { color: '#5a5a72', fontSize: 12 },
  modulesTitle: { fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#f0f0f8', marginBottom: 16 },
  modulesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  moduleCard: { background: '#111118', border: '1px solid', borderRadius: 14, padding: '20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', display: 'block', width: '100%' },
  moduleCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  moduleCardIcon: { fontSize: 24 },
  moduleCardCheck: { fontSize: 12, fontWeight: 600 },
  moduleCardTitle: { fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: '#f0f0f8', marginBottom: 6 },
  moduleCardDesc: { color: '#9898b0', fontSize: 12, lineHeight: 1.5, marginBottom: 14 },
  moduleCardFooter: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  xpBadge: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100 },
  doneBadge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100 },

  moduleView: { maxWidth: 800, margin: '0 auto' },
  moduleHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, gap: 20, flexWrap: 'wrap' },
  moduleMeta: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  moduleTag: { padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
  moduleDuration: { color: '#9898b0', fontSize: 12 },
  moduleTitle: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: '#f0f0f8', marginBottom: 8 },
  moduleDesc: { color: '#9898b0', fontSize: 15, lineHeight: 1.6 },
  toggleBtn: { padding: '10px 20px', borderRadius: 10, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 },

  tabs: { display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 },
  tabBtn: { padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" },
  tabContent: { animation: 'fadeIn 0.3s ease' },

  conceptBox: { display: 'flex', flexDirection: 'column', gap: 16 },
  conceptBlock: { border: '1px solid', borderRadius: 14, padding: '20px 24px' },
  conceptLabel: { fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 },
  conceptText: { color: '#d0d0e0', fontSize: 15, lineHeight: 1.8 },

  codeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0e0e16', padding: '10px 16px', borderRadius: '10px 10px 0 0', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  codeFilename: { fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#5a5a72' },
  copyBtn: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#9898b0', padding: '4px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  codeBlock: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '20px 24px', fontFamily: "'DM Mono', monospace", fontSize: 13, color: '#c9d1d9', lineHeight: 1.8, overflowX: 'auto', whiteSpace: 'pre' },

  exercisesBlock: { display: 'flex', flexDirection: 'column', gap: 12 },
  exosIntro: { color: '#9898b0', fontSize: 14, marginBottom: 4, lineHeight: 1.6 },
  exoCard: { display: 'flex', alignItems: 'flex-start', gap: 14, background: '#111118', border: '1px solid', borderRadius: 12, padding: '16px 20px' },
  exoNum: { width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, flexShrink: 0 },
  exoText: { color: '#d0d0e0', fontSize: 14, lineHeight: 1.6 },
  askAIBtn: { marginTop: 8, padding: '12px 20px', borderRadius: 10, border: '1px solid', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' },
};
