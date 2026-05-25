import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left panel */}
        <div style={{ background: 'linear-gradient(135deg, var(--navy-light), rgba(0,229,195,0.05))', padding: '120px 60px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
          <div style={{ position: 'absolute', top: '15%', right: '-40px', width: 280, height: 280, background: 'radial-gradient(circle, rgba(0,229,195,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '-40px', width: 220, height: 220, background: 'radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#00e5c3,#00a3e0)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem' }}>Earn<span style={{ color: 'var(--teal)' }}>It</span></span>
            </Link>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', lineHeight: 1.2, marginBottom: 16 }}>
              Welcome to<br /><span className="glow-text">Earn It</span>
            </h1>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: 40, fontSize: '1rem' }}>
              Join our global network of verifiers and start earning money today by completing simple e-commerce verification tasks.
            </p>
            {['⏰ Flexible work hours — verify on your schedule', '💰 Get paid for each completed verification', '🌍 Access tasks from around the world', '🎓 No special skills or experience required'].map(feat => (
              <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: 'rgba(240,244,255,0.8)', fontSize: '0.92rem' }}>
                {feat}
              </div>
            ))}
            <div style={{ marginTop: 48, padding: '20px 24px', background: 'rgba(0,229,195,0.06)', border: '1px solid rgba(0,229,195,0.15)', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: '2rem' }}>💬</div>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 4, fontSize: '0.92rem' }}>Join 5,000+ members on Telegram!</div>
                  <a href="https://t.me/+3E7iJLy_94MyMzg0" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)', fontSize: '0.82rem', textDecoration: 'none' }}>Join the Community →</a>
                </div>
              </div>
            </div>
          </div>

          <style>{`@media(max-width:768px){.auth-left{display:none!important}}`}</style>
        </div>

        {/* Right panel — form */}
        <div style={{ padding: '120px 60px 60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 420 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 32 }}>
              {['login', 'register'].map(tab => (
                <Link key={tab} to={tab === 'login' ? '/login' : '/register'} style={{ flex: 1 }}>
                  <button
                    style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: activeTab === tab ? 'var(--teal)' : 'transparent', color: activeTab === tab ? 'var(--navy)' : 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.3s' }}
                    onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </Link>
              ))}
            </div>

            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', marginBottom: 8 }}>Sign In</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.9rem' }}>Welcome back! Enter your credentials to continue.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Enter your password" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem' }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--muted)', fontSize: '0.88rem' }}>
                  <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                    style={{ accentColor: 'var(--teal)', width: 16, height: 16 }} />
                  Remember me
                </label>
                <Link to="/forgot-password" style={{ color: 'var(--teal)', fontSize: '0.88rem', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '16px' }}>
                {loading ? 'Signing In...' : 'Login →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 24, fontSize: '0.88rem' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 600 }}>Create one free →</Link>
            </p>

            <div style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(0,136,204,0.08)', border: '1px solid rgba(0,136,204,0.2)', borderRadius: 12, textAlign: 'center' }}>
              <a href="https://t.me/+3E7iJLy_94MyMzg0" target="_blank" rel="noreferrer">
                <button style={{ background: 'linear-gradient(135deg,#0088cc,#006699)', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 24px', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                  ✈️ Join 5,000+ members on Telegram!
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          div[style*="grid-template-columns: 1fr 1fr"]{
            grid-template-columns: 1fr !important;
          }
          div[style*="borderRight"]{display:none}
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
