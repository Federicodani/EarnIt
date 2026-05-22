import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const TILL_NUMBER = '5377179';

const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: 500,
    dailyTasks: 15,
    color: '#00e5c3',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, rgba(0,229,195,0.12), rgba(0,229,195,0.03))',
    border: 'rgba(0,229,195,0.3)',
    perks: [
      '15 tasks per day',
      'Access to all basic tasks',
      'Earn $2–$5 per task',
      '30 days access',
      'Email support',
      'Telegram community access',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 1000,
    dailyTasks: 25,
    color: '#f5c518',
    icon: '⭐',
    gradient: 'linear-gradient(135deg, rgba(245,197,24,0.12), rgba(245,197,24,0.03))',
    border: 'rgba(245,197,24,0.4)',
    popular: true,
    perks: [
      '25 tasks per day',
      'All task categories unlocked',
      'Earn $3–$8 per task',
      '30 days access',
      'Priority live chat support',
      'Telegram community access',
      'Earlier task notifications',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1500,
    dailyTasks: 40,
    color: '#7c5cfc',
    icon: '💎',
    gradient: 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(124,92,252,0.03))',
    border: 'rgba(124,92,252,0.4)',
    perks: [
      '40 tasks per day',
      'All task categories + premium tasks',
      'Earn $5–$10 per task',
      '30 days access',
      'VIP 24/7 support',
      'Telegram VIP channel access',
      'First access to new tasks',
      'Higher reward multipliers',
    ],
  },
];

const PackagesPage = () => {
  const { user, API } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('select'); // select | pay | submitted
  const [form, setForm] = useState({ mpesaNumber: '', mpesaTransactionCode: '' });
  const [submitting, setSubmitting] = useState(false);
  const [packageStatus, setPackageStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    API.get('/packages/my')
      .then(res => setPackageStatus(res.data))
      .catch(() => {})
      .finally(() => setLoadingStatus(false));
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleProceedToPay = (pkg) => {
    setSelected(pkg);
    setStep('pay');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!form.mpesaNumber.trim()) return toast.error('Enter your M-Pesa number');
    if (!form.mpesaTransactionCode.trim()) return toast.error('Enter your M-Pesa transaction code');
    setSubmitting(true);
    try {
      await API.post('/packages/purchase', {
        packageId: selected.id,
        mpesaNumber: form.mpesaNumber,
        mpesaTransactionCode: form.mpesaTransactionCode,
      });
      setStep('submitted');
      toast.success('Payment submitted! Your package will be activated shortly.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isPackageActive = packageStatus?.isActive;
  const activePkg = PACKAGES.find(p => p.id === packageStatus?.activePackage);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />

      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,229,195,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,92,252,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div className="container" style={{ paddingTop: 100, paddingBottom: 80, position: 'relative', zIndex: 1 }}>

        {/* ── Active package banner ── */}
        {!loadingStatus && isPackageActive && (
          <div style={{ background: 'linear-gradient(135deg,rgba(0,229,195,0.12),rgba(0,229,195,0.04))', border: '1px solid rgba(0,229,195,0.3)', borderRadius: 18, padding: '24px 32px', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: '2.5rem' }}>{activePkg?.icon || '✅'}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.15rem' }}>{activePkg?.name} Package — Active</h3>
                  <span className="badge badge-teal">● LIVE</span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                  {packageStatus.dailyTasksUsed} / {packageStatus.dailyTaskLimit} tasks used today
                  &nbsp;·&nbsp; Expires {new Date(packageStatus.packageExpiresAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/tasks')} className="btn-primary" style={{ padding: '12px 28px' }}>
              Browse Tasks →
            </button>
          </div>
        )}

        {/* ── Pending payment banner ── */}
        {!loadingStatus && !isPackageActive && packageStatus?.pendingPurchase?.status === 'pending' && (
          <div style={{ background: 'rgba(245,197,24,0.08)', border: '1px solid rgba(245,197,24,0.25)', borderRadius: 18, padding: '20px 28px', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: '2rem' }}>⏳</div>
            <div>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>Payment Under Review</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                Your {packageStatus.pendingPurchase.packageName} payment (M-Pesa code: <strong>{packageStatus.pendingPurchase.mpesaTransactionCode}</strong>) is being verified. 
                Your package will be activated within 1–2 hours.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP: SELECT ── */}
        {step === 'select' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="badge badge-teal" style={{ marginBottom: 16, display: 'inline-flex' }}>💳 Choose Your Plan</span>
              <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: 16 }}>
                Unlock Your <span className="glow-text">Earning Potential</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
                Purchase a package to start completing tasks and earning real money. All plans include full platform access for 30 days.
              </p>
            </div>

            {/* Package cards */}
            <div className="grid-3" style={{ marginBottom: 56, alignItems: 'stretch' }}>
              {PACKAGES.map((pkg) => (
                <div key={pkg.id} style={{ background: pkg.gradient, border: `2px solid ${pkg.popular ? pkg.color : pkg.border}`, borderRadius: 22, padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 60px ${pkg.color}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>

                  {pkg.popular && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: pkg.color, color: '#000', fontFamily: 'Syne', fontWeight: 800, fontSize: '0.72rem', padding: '6px', textAlign: 'center', letterSpacing: '1px' }}>
                      ✨ MOST POPULAR
                    </div>
                  )}

                  <div style={{ marginTop: pkg.popular ? 24 : 0 }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>{pkg.icon}</div>
                    <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: pkg.color, marginBottom: 4 }}>{pkg.name}</h2>
                    <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.5rem', lineHeight: 1, marginBottom: 4 }}>
                      KSh {pkg.price.toLocaleString()}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 24 }}>per 30 days</div>

                    {/* Highlight */}
                    <div style={{ background: `${pkg.color}15`, border: `1px solid ${pkg.color}30`, borderRadius: 12, padding: '14px 18px', marginBottom: 24, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: pkg.color, lineHeight: 1 }}>{pkg.dailyTasks}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 4 }}>tasks per day</div>
                    </div>

                    {/* Perks */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
                      {pkg.perks.map(perk => (
                        <div key={perk} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.88rem' }}>
                          <span style={{ color: pkg.color, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                          <span style={{ color: 'rgba(240,244,255,0.85)' }}>{perk}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleProceedToPay(pkg)}
                      disabled={isPackageActive && packageStatus?.activePackage === pkg.id}
                      style={{ width: '100%', padding: '15px', borderRadius: 50, border: `2px solid ${pkg.color}`, background: pkg.popular ? pkg.color : 'transparent', color: pkg.popular ? (pkg.id === 'standard' ? '#000' : 'var(--navy)') : pkg.color, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s', letterSpacing: '0.3px' }}
                      onMouseEnter={e => { if (!isPackageActive) { e.currentTarget.style.background = pkg.color; e.currentTarget.style.color = pkg.id === 'standard' ? '#000' : 'var(--navy)'; e.currentTarget.style.transform = 'scale(1.02)'; } }}
                      onMouseLeave={e => { if (!isPackageActive || packageStatus?.activePackage !== pkg.id) { e.currentTarget.style.background = pkg.popular ? pkg.color : 'transparent'; e.currentTarget.style.color = pkg.popular ? (pkg.id === 'standard' ? '#000' : 'var(--navy)') : pkg.color; e.currentTarget.style.transform = 'scale(1)'; } }}>
                      {isPackageActive && packageStatus?.activePackage === pkg.id ? '✓ Current Plan' : `Get ${pkg.name} →`}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* How payment works */}
            <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '36px 40px' }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', marginBottom: 24, textAlign: 'center' }}>
                💳 How to Pay — M-Pesa
              </h3>
              <div className="grid-4">
                {[
                  { num: '1', icon: '📱', title: 'Open M-Pesa', desc: 'Go to Lipa na M-Pesa → Buy Goods & Services' },
                  { num: '2', icon: '🔢', title: 'Enter Till Number', desc: `Till Number: ${TILL_NUMBER}` },
                  { num: '3', icon: '💰', title: 'Enter Amount', desc: 'KSh 500, 1,000 or 1,500 based on your plan' },
                  { num: '4', icon: '📋', title: 'Copy Code & Submit', desc: 'Copy your M-Pesa confirmation code and submit here' },
                ].map(({ num, icon, title, desc }) => (
                  <div key={num} style={{ textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(0,229,195,0.1)', border: '2px solid rgba(0,229,195,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 12px' }}>{icon}</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>{title}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── STEP: PAY ── */}
        {step === 'pay' && selected && (
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <button onClick={() => { setStep('select'); setSelected(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--teal)', cursor: 'pointer', fontSize: '0.9rem', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Syne', fontWeight: 600 }}>
              ← Back to Plans
            </button>

            {/* Order summary */}
            <div style={{ background: selected.gradient, border: `2px solid ${selected.border}`, borderRadius: 20, padding: '28px 32px', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ fontSize: '2.5rem' }}>{selected.icon}</div>
                <div>
                  <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.3rem', color: selected.color }}>{selected.name} Package</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{selected.dailyTasks} tasks/day · 30 days access</p>
                </div>
                <div style={{ marginLeft: 'auto', fontFamily: 'Syne', fontWeight: 800, fontSize: '1.8rem', color: selected.color }}>
                  KSh {selected.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* M-Pesa instructions */}
            <div style={{ background: 'rgba(0,176,61,0.06)', border: '1px solid rgba(0,176,61,0.2)', borderRadius: 18, padding: '24px 28px', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <span style={{ fontSize: '1.8rem' }}>📱</span>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.05rem', color: '#4caf50' }}>Send M-Pesa Payment</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
                {[
                  { step: '1', instruction: 'Open M-Pesa on your phone' },
                  { step: '2', instruction: 'Go to Lipa na M-Pesa → Buy Goods & Services (Paybill/Till)' },
                  { step: '3', instruction: `Enter Till Number and send KSh ${selected.price.toLocaleString()}` },
                  { step: '4', instruction: 'Copy the M-Pesa confirmation code (e.g., SGA123XYZ)' },
                  { step: '5', instruction: 'Fill in the form below and click Submit' },
                ].map(({ step: s, instruction }) => (
                  <div key={s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.75rem', color: '#4caf50', flexShrink: 0 }}>{s}</div>
                    <span style={{ color: 'rgba(240,244,255,0.85)', fontSize: '0.9rem', paddingTop: 2 }}>{instruction}</span>
                  </div>
                ))}
              </div>

              {/* Till number highlight */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '18px 22px', border: '1px solid rgba(76,175,80,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>Buy Goods Till Number</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: '#4caf50', letterSpacing: 2 }}>{TILL_NUMBER}</div>
                </div>
                <button onClick={() => handleCopy(TILL_NUMBER)}
                  style={{ background: copied ? 'rgba(76,175,80,0.2)' : 'rgba(255,255,255,0.08)', border: `1px solid ${copied ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.15)'}`, borderRadius: 10, padding: '10px 18px', color: copied ? '#4caf50' : 'var(--white)', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.2s' }}>
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>

              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(245,197,24,0.07)', border: '1px solid rgba(245,197,24,0.15)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--gold)' }}>
                ⚠️ Send exactly <strong>KSh {selected.price.toLocaleString()}</strong> — other amounts cannot be verified
              </div>
            </div>

            {/* Submission form */}
            <div className="card">
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 20 }}>Submit Payment Confirmation</h3>
              <form onSubmit={handleSubmitPayment} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label">Your M-Pesa Phone Number</label>
                  <input type="tel" className="form-input" placeholder="e.g. 0712 345 678" value={form.mpesaNumber}
                    onChange={e => setForm({ ...form, mpesaNumber: e.target.value })} required />
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 5 }}>The number you used to send the payment</div>
                </div>
                <div className="form-group">
                  <label className="form-label">M-Pesa Transaction Code</label>
                  <input type="text" className="form-input" placeholder="e.g. SGA4X9KL2P" value={form.mpesaTransactionCode}
                    onChange={e => setForm({ ...form, mpesaTransactionCode: e.target.value.toUpperCase() })} required
                    style={{ fontFamily: 'monospace', letterSpacing: '2px', textTransform: 'uppercase' }} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 5 }}>Found in your M-Pesa confirmation SMS (e.g. "SGA4X9KL2P Confirmed")</div>
                </div>

                {/* Package summary */}
                <div style={{ padding: '14px 18px', background: 'rgba(0,229,195,0.05)', border: '1px solid rgba(0,229,195,0.12)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--muted)' }}>Package</span>
                    <span style={{ fontWeight: 600 }}>{selected.name} ({selected.dailyTasks} tasks/day)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: 6 }}>
                    <span style={{ color: 'var(--muted)' }}>Duration</span>
                    <span style={{ fontWeight: 600 }}>30 Days</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700 }}>Total Paid</span>
                    <span style={{ fontFamily: 'Syne', fontWeight: 800, color: 'var(--teal)', fontSize: '1.05rem' }}>KSh {selected.price.toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" className="btn-primary" disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem' }}>
                  {submitting ? 'Submitting...' : '✅ Confirm Payment Submission →'}
                </button>
                <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.78rem' }}>
                  Your package will be activated within 1–2 hours after manual verification
                </p>
              </form>
            </div>
          </div>
        )}

        {/* ── STEP: SUBMITTED ── */}
        {step === 'submitted' && (
          <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: 20, animation: 'float 2s ease-in-out infinite' }}>🎉</div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>Payment Submitted!</h1>
            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: 32 }}>
              Your payment for the <strong style={{ color: selected?.color }}>{selected?.name} Package</strong> has been received.
              Our team will verify your M-Pesa transaction and activate your account within <strong style={{ color: 'var(--teal)' }}>1–2 hours</strong>.
            </p>

            <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: 18, padding: '28px', marginBottom: 28 }}>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 16 }}>What happens next?</h4>
              {[
                { icon: '🔍', text: 'Our team verifies your M-Pesa transaction code' },
                { icon: '✅', text: 'Your package is activated (within 1–2 hours)' },
                { icon: '📧', text: 'You can log in and start completing tasks immediately' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, textAlign: 'left' }}>
                  <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '14px 32px' }}>
                Go to Dashboard →
              </button>
              <a href="https://t.me/+3E7iJLy_94MyMzg0" target="_blank" rel="noreferrer">
                <button style={{ background: '#0088cc', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 24px', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>
                  ✈️ Join Telegram
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesPage;
