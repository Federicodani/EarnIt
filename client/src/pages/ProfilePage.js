import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const countries = ['Kenya', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Nigeria', 'South Africa', 'Ghana', 'Uganda', 'Tanzania', 'Germany', 'France', 'Netherlands', 'India', 'Philippines', 'Other'];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '', country: user?.country || '', telegramUsername: user?.telegramUsername || '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const tierColors = { basic: 'var(--muted)', silver: '#c0c0c0', gold: 'var(--gold)', platinum: 'var(--teal)' };
  const tier = user?.membershipTier || 'basic';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>

        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40, padding: '32px', background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'var(--navy)' }}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 20, height: 20, borderRadius: '50%', background: 'var(--teal)', border: '2px solid var(--navy-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>✓</div>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', marginBottom: 4 }}>{user?.fullName}</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 8 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ color: tierColors[tier], fontSize: '0.85rem', fontFamily: 'Syne', fontWeight: 600 }}>
                {tier === 'basic' ? '🌱' : tier === 'silver' ? '🥈' : tier === 'gold' ? '🥇' : '💎'} {tier.charAt(0).toUpperCase() + tier.slice(1)} Member
              </span>
              <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{ display: 'none', flexDirection: 'column', gap: 4, textAlign: 'right' }} className="profile-stats">
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.5rem', color: 'var(--teal)' }}>${(user?.totalEarned || 0).toFixed(2)}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Total Earned</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
          {['profile', 'stats', 'security'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: activeTab === tab ? 'var(--teal)' : 'transparent', color: activeTab === tab ? 'var(--navy)' : 'var(--muted)', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.3s' }}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700 }}>Personal Information</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={user?.email} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select className="form-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={{ cursor: 'pointer' }}>
                    <option value="">Select country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Telegram Username</label>
                <input type="text" className="form-input" placeholder="@yourusername" value={form.telegramUsername} onChange={e => setForm({ ...form, telegramUsername: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary" disabled={saving} style={{ width: 'fit-content', padding: '12px 32px' }}>
                {saving ? 'Saving...' : 'Save Changes →'}
              </button>
            </form>

            {/* Side info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card">
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 16, fontSize: '0.92rem' }}>Account Stats</h4>
                {[
                  { label: 'Balance', value: `$${(user?.balance || 0).toFixed(2)}`, color: 'var(--teal)' },
                  { label: 'Total Earned', value: `$${(user?.totalEarned || 0).toFixed(2)}`, color: 'var(--gold)' },
                  { label: 'Tasks Completed', value: user?.tasksCompleted || 0, color: 'var(--violet)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{label}</span>
                    <span style={{ fontFamily: 'Syne', fontWeight: 700, color, fontSize: '0.92rem' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'linear-gradient(135deg,rgba(0,136,204,0.12),rgba(0,229,195,0.06))', border: '1px solid rgba(0,136,204,0.2)', borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✈️</div>
                <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 6, fontSize: '0.9rem' }}>Community</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: 12 }}>Join 5,000+ earners on Telegram for tips and alerts.</p>
                <a href="https://t.me/+3E7iJLy_94MyMzg0" target="_blank" rel="noreferrer">
                  <button style={{ background: '#0088cc', color: '#fff', border: 'none', borderRadius: 50, padding: '8px 16px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Syne', fontWeight: 600, width: '100%' }}>Join Telegram</button>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid-3">
            {[
              { label: 'Total Earned', value: `$${(user?.totalEarned || 0).toFixed(2)}`, icon: '💰', desc: 'Lifetime earnings' },
              { label: 'Available Balance', value: `$${(user?.balance || 0).toFixed(2)}`, icon: '💳', desc: 'Ready to withdraw' },
              { label: 'Tasks Completed', value: user?.tasksCompleted || 0, icon: '✅', desc: 'All time' },
              { label: 'Membership Tier', value: tier.charAt(0).toUpperCase() + tier.slice(1), icon: tier === 'platinum' ? '💎' : tier === 'gold' ? '🥇' : tier === 'silver' ? '🥈' : '🌱', desc: 'Current status' },
              { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString(), icon: '📅', desc: 'Account age' },
              { label: 'Country', value: user?.country || 'Not set', icon: '🌍', desc: 'Location' },
            ].map(({ label, value, icon, desc }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--teal)', marginBottom: 4 }}>{value}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>{label}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{desc}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div style={{ maxWidth: 520 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700 }}>Change Password</h3>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="Enter current password" />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="Min. 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" placeholder="Repeat new password" />
              </div>
              <button className="btn-primary" style={{ width: 'fit-content', padding: '12px 28px' }} onClick={() => toast.success('Password updated!')}>Update Password →</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media(min-width:768px){.profile-stats{display:flex!important}}
        @media(max-width:900px){div[style*="grid-template-columns: 1fr 320px"]{grid-template-columns:1fr!important}}
      `}</style>
    </div>
  );
};

export default ProfilePage;
