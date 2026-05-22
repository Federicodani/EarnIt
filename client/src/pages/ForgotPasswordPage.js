import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ForgotPasswordPage = () => {
  const [form, setForm] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [step, setStep] = useState(1);
  const { forgotPassword, resetPassword } = useAuth();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await forgotPassword(form.email, form.phone);
      setResetToken(data.resetToken);
      setStep(2);
      toast.success('Identity verified! Set your new password.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(0,229,195,0.1)', border: '2px solid rgba(0,229,195,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px', animation: 'pulse-glow 2s ease-in-out infinite' }}>
              🔐
            </div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', marginBottom: 8 }}>
              {success ? 'Password Reset!' : 'Reset Your Password'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
              {success ? 'Your password has been reset successfully.' : 'Please verify your identity by entering your email address and phone number.'}
            </p>
          </div>

          {success ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 8 }}>All Done!</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.9rem' }}>You can now log in with your new password.</p>
              <Link to="/login"><button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>Back to Login →</button></Link>
            </div>
          ) : (
            <div className="card">
              {step === 1 ? (
                <>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 20, fontSize: '1.1rem' }}>Verify Your Identity</h3>
                  <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                      {loading ? 'Verifying...' : 'Verify Identity →'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div style={{ padding: '12px 16px', background: 'rgba(0,229,195,0.06)', border: '1px solid rgba(0,229,195,0.2)', borderRadius: 10, marginBottom: 20, fontSize: '0.85rem', color: 'var(--teal)' }}>
                    ✅ Identity verified! Now set your new password.
                  </div>
                  <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-input" placeholder="Min. 6 characters" value={newPassword}
                        onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                      {loading ? 'Resetting...' : 'Reset Password →'}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 20, fontSize: '0.88rem' }}>
            Remember your password? <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>Back to Login →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
