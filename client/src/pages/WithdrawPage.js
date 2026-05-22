import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const MOCK_HISTORY = [
  { _id: '1', amount: 120, method: 'mpesa', accountDetails: '+254 7XX XXX XXX', status: 'completed', requestedAt: new Date(Date.now() - 5 * 86400000) },
  { _id: '2', amount: 75, method: 'paypal', accountDetails: 'user@email.com', status: 'processing', requestedAt: new Date(Date.now() - 2 * 86400000) },
];

const methods = [
  { id: 'mpesa', label: 'M-Pesa', icon: '📱', desc: 'Instant mobile money transfer', color: '#00a651' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Processed in 1–3 business days', color: '#003087' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Direct to your bank account', color: 'var(--violet)' },
  { id: 'stripe', label: 'Stripe', icon: '💳', desc: 'Card or bank account', color: '#635bff' },
];

const WithdrawPage = () => {
  const { user, API } = useAuth();
  const [form, setForm] = useState({ amount: '', method: '', accountDetails: '' });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(MOCK_HISTORY);

  useEffect(() => {
    API.get('/withdrawals/my').then(res => { if (res.data.withdrawals?.length) setHistory(res.data.withdrawals); }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.method) return toast.error('Select a payment method');
    if (Number(form.amount) < 50) return toast.error('Minimum withdrawal is $50');
    if (Number(form.amount) > (user?.balance || 0)) return toast.error('Insufficient balance');
    setLoading(true);
    try {
      await API.post('/withdrawals', form);
      toast.success(`Withdrawal of $${form.amount} requested!`);
      setForm({ amount: '', method: '', accountDetails: '' });
      setHistory(prev => [{ _id: Date.now(), amount: Number(form.amount), method: form.method, accountDetails: form.accountDetails, status: 'pending', requestedAt: new Date() }, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = { pending: 'var(--muted)', processing: 'var(--gold)', completed: 'var(--teal)', rejected: 'var(--coral)' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 8 }}>
          Withdraw <span className="glow-text">Earnings</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '0.92rem' }}>Available balance: <strong style={{ color: 'var(--teal)', fontFamily: 'Syne', fontWeight: 800 }}>${(user?.balance || 0).toFixed(2)}</strong> • Minimum withdrawal: $50</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>
          <div>
            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem' }}>Request Withdrawal</h3>

              <div className="form-group">
                <label className="form-label">Amount (USD)</label>
                <input type="number" className="form-input" placeholder="50.00" min="50" max={user?.balance || 0} step="0.01" value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })} required />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {[50, 100, 200, 500].map(amt => (
                    <button key={amt} type="button" onClick={() => setForm({ ...form, amount: Math.min(amt, user?.balance || 0).toString() })}
                      style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.color = 'var(--teal)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {methods.map(m => (
                    <div key={m.id} onClick={() => setForm({ ...form, method: m.id })}
                      style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${form.method === m.id ? m.color : 'var(--border)'}`, background: form.method === m.id ? `${m.color}10` : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.3rem' }}>{m.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem', color: form.method === m.id ? m.color : 'var(--white)' }}>{m.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{m.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {form.method && (
                <div className="form-group">
                  <label className="form-label">
                    {form.method === 'mpesa' ? 'M-Pesa Phone Number' : form.method === 'paypal' ? 'PayPal Email' : form.method === 'bank_transfer' ? 'Bank Account Number' : 'Stripe Account'}
                  </label>
                  <input type="text" className="form-input"
                    placeholder={form.method === 'mpesa' ? '+254 700 000 000' : form.method === 'paypal' ? 'paypal@email.com' : 'Enter account details'}
                    value={form.accountDetails} onChange={e => setForm({ ...form, accountDetails: e.target.value })} required />
                </div>
              )}

              <div style={{ padding: '14px 18px', background: 'rgba(245,197,24,0.06)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 12, fontSize: '0.82rem', color: 'var(--muted)' }}>
                💡 Payments are processed within <strong style={{ color: 'var(--gold)' }}>24–48 hours</strong>. Minimum withdrawal is <strong style={{ color: 'var(--gold)' }}>$50</strong>.
              </div>

              <button type="submit" className="btn-primary" disabled={loading || !form.amount || !form.method} style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                {loading ? 'Processing...' : `Withdraw $${form.amount || '0.00'} →`}
              </button>
            </form>
          </div>

          {/* History */}
          <div>
            <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.05rem', marginBottom: 16 }}>Withdrawal History</h3>
            {history.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>📭</div>
                No withdrawals yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.map(w => (
                  <div key={w._id} className="card" style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--teal)', fontSize: '1.1rem' }}>${w.amount}</span>
                      <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: 50, background: `${statusColor[w.status]}18`, color: statusColor[w.status], fontFamily: 'Syne', fontWeight: 600, textTransform: 'capitalize', border: `1px solid ${statusColor[w.status]}30` }}>
                        {w.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      <div style={{ textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.5px' }}>{w.method.replace('_', ' ')}</div>
                      <div style={{ marginTop: 3 }}>{w.accountDetails}</div>
                      <div style={{ marginTop: 3 }}>{new Date(w.requestedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 1fr 380px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};

export default WithdrawPage;
