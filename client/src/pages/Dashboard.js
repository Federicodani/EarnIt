import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const PACKAGE_META = {
  starter:  { name: 'Starter',  icon: '🚀', color: '#00e5c3', dailyTasks: 15  },
  standard: { name: 'Standard', icon: '⭐', color: '#f5c518', dailyTasks: 25  },
  premium:  { name: 'Premium',  icon: '💎', color: '#7c5cfc', dailyTasks: 40  },
};

const Dashboard = () => {
  const { user, API } = useAuth();
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pkgStatus, setPkgStatus] = useState(null);

  useEffect(() => {
    API.get('/tasks/my-tasks').then(res => setUserTasks(res.data.userTasks || [])).catch(() => {}).finally(() => setLoading(false));
    API.get('/packages/my').then(res => setPkgStatus(res.data)).catch(() => {});
  }, []);

  const hasActivePackage = pkgStatus?.isActive;
  const activeMeta = hasActivePackage ? PACKAGE_META[pkgStatus?.activePackage] : null;
  const tierColors = { basic: 'var(--muted)', silver: '#c0c0c0', gold: 'var(--gold)', platinum: 'var(--teal)' };
  const tierEmojis = { basic: '🌱', silver: '🥈', gold: '🥇', platinum: '💎' };
  const pendingTasks = userTasks.filter(t => t.status === 'in_progress' || t.status === 'submitted').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>

        {/* ── NO PACKAGE BANNER ── */}
        {pkgStatus && !hasActivePackage && pkgStatus?.pendingPurchase?.status !== 'pending' && (
          <div style={{ background: 'linear-gradient(135deg,rgba(245,197,24,0.1),rgba(124,92,252,0.08))', border: '2px dashed rgba(245,197,24,0.3)', borderRadius: 20, padding: '32px 36px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ fontSize: '2.8rem' }}>🔒</div>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', marginBottom: 6 }}>No Active Package</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Purchase a package to unlock task access and start earning money.<br />
                  Plans start from <strong style={{ color: 'var(--gold)' }}>KSh 500</strong> for 15 tasks/day.
                </p>
              </div>
            </div>
            <Link to="/packages">
              <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                Buy a Package →
              </button>
            </Link>
          </div>
        )}

        {/* ── PENDING PAYMENT BANNER ── */}
        {pkgStatus?.pendingPurchase?.status === 'pending' && !hasActivePackage && (
          <div style={{ background: 'rgba(245,197,24,0.07)', border: '1px solid rgba(245,197,24,0.25)', borderRadius: 20, padding: '20px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '1.8rem' }}>⏳</span>
            <div>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>Payment Under Review</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                Your <strong>{pkgStatus.pendingPurchase.packageName}</strong> payment is being verified. Your account will be activated within 1–2 hours.
              </p>
            </div>
          </div>
        )}

        {/* ── ACTIVE PACKAGE STRIP ── */}
        {hasActivePackage && activeMeta && (
          <div style={{ background: `linear-gradient(135deg,${activeMeta.color}10,${activeMeta.color}04)`, border: `1px solid ${activeMeta.color}30`, borderRadius: 16, padding: '16px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.6rem' }}>{activeMeta.icon}</span>
              <div>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, color: activeMeta.color, fontSize: '0.92rem' }}>{activeMeta.name} Package Active</span>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 2 }}>
                  {pkgStatus.dailyTasksUsed || 0} / {pkgStatus.dailyTaskLimit} tasks used today
                  &nbsp;·&nbsp; Expires {new Date(pkgStatus.packageExpiresAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {/* Daily usage bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(((pkgStatus.dailyTasksUsed || 0) / pkgStatus.dailyTaskLimit) * 100, 100)}%`, background: `linear-gradient(90deg,${activeMeta.color},${activeMeta.color}90)`, borderRadius: 4, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ color: 'var(--muted)', fontSize: '0.75rem', flexShrink: 0 }}>{pkgStatus.dailyTasksUsed || 0}/{pkgStatus.dailyTaskLimit}</span>
            </div>
          </div>
        )}

        {/* Welcome banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,229,195,0.1), rgba(124,92,252,0.08))', border: '1px solid var(--border)', borderRadius: 20, padding: '32px 36px', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 200, height: 200, background: 'radial-gradient(circle, rgba(0,229,195,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, color: 'var(--navy)', fontSize: '1.2rem' }}>
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem' }}>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span style={{ color: tierColors[user?.membershipTier || 'basic'], fontSize: '0.88rem' }}>
                        {tierEmojis[user?.membershipTier || 'basic']} {(user?.membershipTier || 'basic').charAt(0).toUpperCase() + (user?.membershipTier || 'basic').slice(1)} Member
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>You have {pendingTasks} task{pendingTasks !== 1 ? 's' : ''} in progress.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 4 }}>Available Balance</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'var(--teal)' }}>${(user?.balance || 0).toFixed(2)}</div>
                <Link to="/withdraw"><button className="btn-primary" style={{ marginTop: 10, padding: '10px 24px', fontSize: '0.85rem' }}>Withdraw Funds</button></Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: 'Total Earned', value: `$${(user?.totalEarned || 0).toFixed(2)}`, icon: '💰', color: 'var(--teal)' },
            { label: 'Tasks Completed', value: user?.tasksCompleted || 0, icon: '✅', color: 'var(--violet)' },
            { label: 'Available Balance', value: `$${(user?.balance || 0).toFixed(2)}`, icon: '💳', color: 'var(--gold)' },
            { label: 'Active Tasks', value: pendingTasks, icon: '⚡', color: 'var(--coral)' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="stat-card" style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color }}>{value}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Recent tasks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem' }}>My Tasks</h3>
              {hasActivePackage
                ? <Link to="/tasks"><button className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>Browse Tasks</button></Link>
                : <Link to="/packages"><button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>Get Package →</button></Link>
              }
            </div>

            {loading ? (
              <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Loading tasks...</div>
            ) : !hasActivePackage ? (
              <div className="card" style={{ textAlign: 'center', padding: 48, background: 'rgba(245,197,24,0.04)', border: '1px dashed rgba(245,197,24,0.2)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 8 }}>Tasks Locked</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 20 }}>
                  Purchase a package to unlock tasks and start earning money daily.
                </p>
                <Link to="/packages"><button className="btn-primary" style={{ padding: '12px 28px' }}>View Packages →</button></Link>
              </div>
            ) : userTasks.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: 48 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>📦</div>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 8 }}>No tasks yet</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 20 }}>Start earning by picking up your first verification task.</p>
                <Link to="/tasks"><button className="btn-primary" style={{ padding: '12px 28px' }}>Browse Available Tasks →</button></Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {userTasks.slice(0, 6).map(ut => (
                  <div key={ut._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(0,229,195,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📦</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{ut.task?.title || 'Task'}</div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 2 }}>{ut.task?.country || ''}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ fontFamily: 'Syne', fontWeight: 700, color: 'var(--teal)' }}>${ut.reward}</div>
                      <span className={`badge ${ut.status === 'approved' ? 'badge-teal' : ut.status === 'rejected' ? 'badge-coral' : ut.status === 'submitted' ? 'badge-gold' : 'badge-violet'}`}>
                        {ut.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick actions */}
            <div className="card">
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Quick Actions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  hasActivePackage
                    ? { label: 'Browse Tasks', icon: '🔍', to: '/tasks', color: 'var(--teal)' }
                    : { label: 'Buy a Package', icon: '🛒', to: '/packages', color: 'var(--gold)' },
                  { label: 'My Packages', icon: '📦', to: '/packages', color: 'var(--violet)' },
                  { label: 'Withdraw Earnings', icon: '💸', to: '/withdraw', color: 'var(--gold)' },
                  { label: 'Update Profile', icon: '👤', to: '/profile', color: 'var(--coral)' },
                ].map(({ label, icon, to, color }) => (
                  <Link key={label} to={to}>
                    <button style={{ width: '100%', background: `${color}0f`, border: `1px solid ${color}25`, borderRadius: 10, padding: '12px 16px', color: 'var(--white)', fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s', textAlign: 'left', fontFamily: 'DM Sans, sans-serif' }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.borderColor = `${color}50`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${color}0f`; e.currentTarget.style.borderColor = `${color}25`; }}>
                      <span>{icon}</span> {label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Package CTA if none */}
            {!hasActivePackage && (
              <div style={{ background: 'linear-gradient(135deg,rgba(245,197,24,0.1),rgba(124,92,252,0.08))', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>🛒</div>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 6, fontSize: '0.92rem' }}>Get Started Today</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 14, lineHeight: 1.5 }}>
                  From <strong style={{ color: 'var(--gold)' }}>KSh 500</strong> — unlock tasks and start earning daily!
                </p>
                <Link to="/packages">
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px 20px', fontSize: '0.85rem' }}>
                    View Packages →
                  </button>
                </Link>
              </div>
            )}

            {/* Telegram CTA */}
            <div style={{ background: 'linear-gradient(135deg,rgba(0,136,204,0.15),rgba(0,229,195,0.08))', border: '1px solid rgba(0,136,204,0.2)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>✈️</div>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 6, fontSize: '0.92rem' }}>Join Our Telegram</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 14, lineHeight: 1.5 }}>Get early task alerts and exclusive tips from 5,000+ members.</p>
              <a href="https://t.me/+3E7iJLy_94MyMzg0" target="_blank" rel="noreferrer">
                <button style={{ background: 'linear-gradient(135deg,#0088cc,#006699)', color: '#fff', border: 'none', borderRadius: 50, padding: '9px 18px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, width: '100%' }}>
                  Join Telegram →
                </button>
              </a>
            </div>

            {/* Progress bar */}
            <div className="card">
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 12, fontSize: '0.92rem' }}>Membership Progress</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8rem', color: 'var(--muted)' }}>
                <span>Tasks completed</span>
                <span style={{ color: 'var(--teal)' }}>{user?.tasksCompleted || 0} / 50 for Silver</span>
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(((user?.tasksCompleted || 0) / 50) * 100, 100)}%`, background: 'linear-gradient(90deg,var(--teal),var(--violet))', borderRadius: 4, transition: 'width 1s ease' }} />
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 8 }}>Complete 50 tasks to unlock Silver membership and higher task rewards!</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 1fr 340px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
};

export default Dashboard;
