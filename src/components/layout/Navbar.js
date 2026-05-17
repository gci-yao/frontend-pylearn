import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Accueil', icon: '⌂' },
  { to: '/cours',     label: 'Cours',   icon: '📚' },
  { to: '/profil',    label: 'Profil',  icon: '👤' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const xp = user?.profile?.xp_total || 0;
  const badge = user?.profile?.level_badge || 'Débutant';
  const BADGE_COLOR = { 'Débutant': '#22c55e', 'Intermédiaire': '#3b82f6', 'Avancé': '#a855f7', 'Expert': '#f97316' };
  const badgeColor = BADGE_COLOR[badge] || '#22c55e';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* LOGO */}
        <Link to="/dashboard" style={styles.logo}>
          Py<span style={{ color: '#22c55e' }}>Learn</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div style={styles.links}>
          {NAV_LINKS.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} style={{
                ...styles.link,
                color: active ? '#f0f0f8' : '#9898b0',
                background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}>
                <span style={{ fontSize: 14 }}>{l.icon}</span>
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          {/* XP PILL */}
          <div style={{ ...styles.xpPill, background: `${badgeColor}15`, border: `1px solid ${badgeColor}30`, color: badgeColor }}>
            ⚡ {xp} XP
          </div>

          {/* USER MENU */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} style={styles.userBtn}>
              <div style={{ ...styles.userAvatar, background: `${badgeColor}20`, border: `1px solid ${badgeColor}40` }}>
                <span>{(user?.username || '?')[0].toUpperCase()}</span>
              </div>
              <span style={styles.userName}>{user?.first_name || user?.username}</span>
              <span style={{ color: '#5a5a72', fontSize: 10 }}>{menuOpen ? '▲' : '▼'}</span>
            </button>
            {menuOpen && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <p style={styles.dropdownName}>{user?.full_name || user?.username}</p>
                  <p style={styles.dropdownEmail}>{user?.email}</p>
                  <span style={{ ...styles.dropdownBadge, background: `${badgeColor}15`, color: badgeColor }}>
                    {badge}
                  </span>
                </div>
                <div style={styles.dropdownDivider} />
                <Link to="/profil" onClick={() => setMenuOpen(false)} style={styles.dropdownItem}>
                  👤 Mon profil
                </Link>
                <button onClick={handleLogout} style={{ ...styles.dropdownItem, color: '#f87171', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: 'inherit' }}>
                  ↗ Déconnexion
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button onClick={() => setMenuOpen(o => !o)} style={styles.mobileToggle}>
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              style={{ ...styles.mobileLink, color: location.pathname === l.to ? '#22c55e' : '#9898b0' }}>
              {l.icon} {l.label}
            </Link>
          ))}
          <button onClick={handleLogout} style={styles.mobileLogout}>
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', gap: 16 },
  logo: { fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, textDecoration: 'none', color: '#f0f0f8', marginRight: 16, flexShrink: 0 },
  links: { display: 'flex', gap: 4, flex: 1 },
  link: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' },
  right: { display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' },
  xpPill: { padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 },
  userBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, cursor: 'pointer', transition: 'all 0.2s' },
  userAvatar: { width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: '#f0f0f8' },
  userName: { fontSize: 13, fontWeight: 500, color: '#f0f0f8', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  dropdown: { position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 220, background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', overflow: 'hidden', animation: 'fadeIn 0.15s ease', zIndex: 300 },
  dropdownHeader: { padding: '16px' },
  dropdownName: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: '#f0f0f8', marginBottom: 2 },
  dropdownEmail: { color: '#9898b0', fontSize: 12, marginBottom: 8 },
  dropdownBadge: { display: 'inline-block', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600 },
  dropdownDivider: { height: 1, background: 'rgba(255,255,255,0.06)' },
  dropdownItem: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', color: '#9898b0', fontSize: 13, textDecoration: 'none', transition: 'background 0.15s' },
  mobileToggle: { display: 'none', background: 'transparent', border: 'none', color: '#f0f0f8', fontSize: 20, cursor: 'pointer', padding: '4px' },
  mobileMenu: { display: 'none', flexDirection: 'column', padding: '12px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,10,15,0.98)' },
  mobileLink: { padding: '10px 0', fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' },
  mobileLogout: { marginTop: 12, padding: '10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' },
};
