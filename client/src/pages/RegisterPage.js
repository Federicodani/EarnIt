import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const countries = ['Kenya', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Nigeria', 'South Africa', 'Ghana', 'Uganda', 'Tanzania', 'Germany', 'France', 'Netherlands', 'India', 'Philippines', 'Other'];

const RegisterPage = () => {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', country: '', telegramUsername: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) return toast.error('Please fill all fields');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!form.country) return toast.error('Please select your country');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to Earn It!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#00e5c3,#00a3e0)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚡</div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem' }}>Earn<span style={{ color: 'var(--teal)' }}>It</span></span>
            </Link>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', marginBottom: 8 }}>Create Your Account</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>Join 15,000+ verifiers earning from home</p>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div style={{ flex: s === 1 ? 'none' : 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= s ? 'var(--teal)' : 'rgba(255,255,255,0.1)', border: `2px solid ${step >= s ? 'var(--teal)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', color: step >= s ? 'var(--navy)' : 'var(--muted)', transition: 'all 0.3s' }}>
                    {step > s ? '✓' : s}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: step >= s ? 'var(--white)' : 'var(--muted)', fontWeight: step >= s ? 600 : 400 }}>
                    {s === 1 ? 'Personal Info' : 'Account Setup'}
                  </span>
                </div>
                {s === 1 && <div style={{ flex: 1, height: 2, background: step >= 2 ? 'var(--teal)' : 'rgba(255,255,255,0.1)', borderRadius: 2, transition: 'background 0.3s' }} />}
              </React.Fragment>
            ))}
          </div>

          <div className="card">
            {step === 1 ? (
              <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="John Doe" value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" placeholder="+254 700 000 000" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Telegram Username (Optional)</label>
                  <input type="text" className="form-input" placeholder="@yourusername" value={form.telegramUsername}
                    onChange={e => setForm({ ...form, telegramUsername: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                  Continue →
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required
                    style={{ cursor: 'pointer', appearance: 'none' }}>
                    <option value="">Select your country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Min. 6 characters" value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem' }}>
                      {showPass ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-input" placeholder="Repeat your password" value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
                <div style={{ padding: '12px 16px', background: 'rgba(0,229,195,0.05)', borderRadius: 10, border: '1px solid rgba(0,229,195,0.1)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                  By creating an account, you agree to our <a href="#" style={{ color: 'var(--teal)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--teal)' }}>Privacy Policy</a>.
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1, padding: '16px' }}>← Back</button>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, justifyContent: 'center', padding: '16px' }}>
                    {loading ? 'Creating Account...' : 'Create Account →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 20, fontSize: '0.88rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>Sign in →</Link>
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28, flexWrap: 'wrap' }}>
            {['🔒 Secure', '💯 Free', '⚡ Instant Setup', '🌍 Global'].map(b => (
              <span key={b} style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
