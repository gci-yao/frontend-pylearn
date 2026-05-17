import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const onChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
    setGlobalError('');
  };

  const parseErrors = (err) => {
    const data = err?.response?.data;
    if (!data) return;
    if (typeof data === 'object') {
      const errs = {};
      let global = '';
      for (const [key, val] of Object.entries(data)) {
        const msg = Array.isArray(val) ? val[0] : val;
        if (key === 'non_field_errors' || key === 'detail') global += msg + ' ';
        else errs[key] = msg;
      }
      if (global) setGlobalError(global.trim());
      if (Object.keys(errs).length) setErrors(errs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError('');
    try {
      if (isLogin) {
        await login({ username: form.username, password: form.password });
      } else {
        await register(form);
      }
      navigate('/dashboard');
    } catch (err) {
      parseErrors(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* BG decorations */}
      <div style={styles.bg}>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
      </div>

      <Link to="/" style={styles.logoLink}>
        Py<span style={{ color: '#22c55e' }}>Learn</span>
      </Link>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h1 style={styles.title}>{isLogin ? 'Bon retour 👋' : 'Rejoins PyLearn'}</h1>
          <p style={styles.subtitle}>
            {isLogin
              ? 'Connecte-toi pour reprendre ta progression'
              : 'Crée ton compte gratuit en 30 secondes'}
          </p>
        </div>

        {globalError && (
          <div style={styles.errorBanner}>
            <span>⚠</span> {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.row}>
              <Field label="Prénom" name="first_name" value={form.first_name} onChange={onChange} error={errors.first_name} placeholder="Charles" />
              <Field label="Nom" name="last_name" value={form.last_name} onChange={onChange} error={errors.last_name} placeholder="Yao" />
            </div>
          )}
          <Field
            label={isLogin ? "Nom d'utilisateur ou email" : "Nom d'utilisateur"}
            name="username" value={form.username} onChange={onChange}
            error={errors.username} placeholder="charles_yao"
          />
          {!isLogin && (
            <Field label="Adresse email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} placeholder="charles@email.com" />
          )}
          <Field label="Mot de passe" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} placeholder="Min. 6 caractères" />
          {!isLogin && (
            <Field label="Confirmer le mot de passe" name="password2" type="password" value={form.password2} onChange={onChange} error={errors.password2} placeholder="Répète le mot de passe" />
          )}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? <span style={styles.spinner} /> : null}
            {loading ? 'Chargement…' : isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        <p style={styles.switchText}>
          {isLogin ? "Pas encore de compte ? " : "Déjà inscrit ? "}
          <Link to={isLogin ? '/register' : '/login'} style={styles.switchLink}>
            {isLogin ? 'S\'inscrire gratuitement' : 'Se connecter'}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          ...styles.input,
          borderColor: error ? '#ef4444' : focused ? '#22c55e' : 'rgba(255,255,255,0.1)',
          boxShadow: focused && !error ? '0 0 0 3px rgba(34,197,94,0.1)' : 'none',
        }}
      />
      {error && <span style={styles.fieldError}>{error}</span>}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0a0a0f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' },
  bg: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  orb1: { position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)' },
  orb2: { position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' },
  logoLink: { position: 'fixed', top: 24, left: 32, fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, zIndex: 10, textDecoration: 'none', color: '#f0f0f8' },
  card: { width: '100%', maxWidth: 440, background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '40px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1, animation: 'fadeIn 0.4s ease' },
  cardHeader: { marginBottom: 28 },
  title: { fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#f0f0f8' },
  subtitle: { color: '#9898b0', fontSize: 14, lineHeight: 1.5 },
  errorBanner: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: 13, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start' },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#9898b0' },
  input: { background: '#16161f', border: '1px solid', borderRadius: 10, padding: '11px 14px', color: '#f0f0f8', fontSize: 14, transition: 'all 0.2s', width: '100%' },
  fieldError: { fontSize: 12, color: '#f87171', marginTop: 2 },
  submitBtn: { marginTop: 8, padding: '13px', background: '#22c55e', color: '#0a0a0f', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  spinner: { width: 16, height: 16, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#0a0a0f', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' },
  switchText: { marginTop: 24, textAlign: 'center', color: '#5a5a72', fontSize: 14 },
  switchLink: { color: '#22c55e', fontWeight: 600 },
};
