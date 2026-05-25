import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--navy-light)', borderTop: '1px solid var(--border)', padding: '60px 24px 32px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00e5c3,#00a3e0)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>Earn<span style={{ color: 'var(--teal)' }}>It</span></span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 260 }}>
            Turn package verification into real income. Work from anywhere, anytime.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {['𝕏', 'f', 'in', '📱'].map((icon, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.85rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal)'; e.currentTarget.style.color = 'var(--teal)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Quick Links</h4>
          {[['Home', '/'], ['How It Works', '/#how-it-works'], ['Testimonials', '/#testimonials'], ['FAQ', '/#faq'], ['Contact Us', '/#contact']].map(([label, href]) => (
            <Link key={label} to={href} style={{ display: 'block', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--teal)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{label}</Link>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Legal</h4>
          {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'].map(item => (
            <a key={item} href="#" style={{ display: 'block', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--teal)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}>{item}</a>
          ))}
        </div>

        <div>
          <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Stay Updated</h4>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>Subscribe for the latest opportunities and tips.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="your@email.com" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--white)', fontSize: '0.85rem', outline: 'none' }} />
            <button className="btn-primary" style={{ padding: '10px 16px', borderRadius: 8, fontSize: '0.85rem' }}>→</button>
          </div>
          <div style={{ marginTop: 20 }}>
            <a href="https://t.me/+3E7iJLy_94MyMzg0" target="_blank" rel="noreferrer">
              <button style={{ background: 'linear-gradient(135deg,#0088cc,#006699)', color: '#fff', border: 'none', borderRadius: 50, padding: '10px 20px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                ✈️ Join 5,000+ on Telegram
              </button>
            </a>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>© 2025 Earn It. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['🔒 Secure Payments', '🛡️ Data Protection', '💬 24/7 Support', '✅ Verified Companies'].map(item => (
            <span key={item} style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
