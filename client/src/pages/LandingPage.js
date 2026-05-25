import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CountUp = ({ end, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [end]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
};

const testimonials = [
  { name: 'Sarah J.', role: 'Full-time mom, Chicago', quote: "I've been with Earn It for 6 months and consistently earn $1,200/month working just 3 hours daily. The flexibility allows me to care for my kids while earning a real income.", avatar: 'SJ', color: '#00e5c3' },
  { name: 'David M.', role: 'College student, Boston', quote: "Earn It has been a game-changer. I verify packages between classes and earn enough to cover my rent. The tasks are simple and payments are always on time.", avatar: 'DM', color: '#7c5cfc' },
  { name: 'Melissa T.', role: 'Marketing professional, Austin', quote: "After losing my job, I needed something flexible. Earn It provided steady income while I searched for a new position. Now I keep it as a side hustle bringing in $700+ monthly.", avatar: 'MT', color: '#f5c518' },
];

const faqs = [
  { q: 'How much can I really earn?', a: 'Most active verifiers earn between $500–$2000 per month, depending on time invested and tasks completed. Each verification task pays $2–$10.' },
  { q: 'Do I need special equipment or skills?', a: "No special equipment or skills required! You just need a smartphone or computer with internet access. Our platform is designed to be intuitive and user-friendly." },
  { q: 'How and when do I get paid?', a: 'Payments are processed weekly via PayPal, Stripe, M-Pesa, or direct bank transfer. Once you reach the $50 threshold, you can request a payout anytime.' },
  { q: 'Is this available in my country?', a: 'Earn It operates in over 30 countries worldwide, including the US, UK, Canada, Australia, Kenya, and most European countries.' },
  { q: 'How much time do I need to commit?', a: "That's completely up to you! There are no minimum hours required. Some users verify packages for just 1–2 hours daily, while others treat it as a full-time opportunity." },
  { q: 'Are there any fees to join?', a: "Absolutely not! Earn It is 100% free to join. We make our revenue from e-commerce companies, not from our verifiers." },
];


const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar transparent />

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(0,229,195,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: '40%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: 500, height: 200, background: 'radial-gradient(ellipse, rgba(0,229,195,0.05) 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00e5c3" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 760, animation: 'fadeUp 0.8s ease forwards' }}>
            <div className="badge badge-teal" style={{ marginBottom: 24 }}>
              🚀 Join 15,000+ active earners worldwide
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, fontFamily: 'Syne, sans-serif' }}>
              Turn Package<br />Verification Into<br /><span className="glow-text">Real Income</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--muted)', maxWidth: 560, lineHeight: 1.8, marginBottom: 40 }}>
              Join thousands of verifiers earning $500–$2000 monthly by completing simple e-commerce verification tasks from major distributors worldwide. No special skills required.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
              <Link to="/register"><button className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>Start Earning Now →</button></Link>
              <a href="#how-it-works"><button className="btn-outline" style={{ fontSize: '1rem', padding: '16px 36px' }}>See How It Works</button></a>
            </div>

            {/* Key features */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['⏰ Flexible work hours', '💰 Per-task earnings', '🌍 Global access', '🎓 No experience needed'].map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontSize: '0.9rem' }}>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(0,229,195,0.02)' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { num: 2500000, prefix: '$', suffix: '+', label: 'Paid to Verifiers' },
              { num: 15000, prefix: '', suffix: '+', label: 'Active Users' },
              { num: 500000, prefix: '', suffix: '+', label: 'Tasks Completed' },
              { num: 30, prefix: '', suffix: '+', label: 'Countries Served' },
            ].map(({ num, prefix, suffix, label }) => (
              <div key={label} className="stat-card">
                <div className="stat-number"><CountUp end={num} prefix={prefix} suffix={suffix} /></div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How <span>Earn It</span> Works</h2>
          <p className="section-subtitle">Get started in minutes and begin earning from verified e-commerce tasks worldwide.</p>
          <div className="grid-4">
            {[
              { num: '01', icon: '📝', title: 'Sign Up & Set Up', desc: 'Create your account and set up your profile in minutes. No special skills required.' },
              { num: '02', icon: '🔍', title: 'Choose Tasks', desc: 'Browse and select verification tasks from various countries based on your preferences.' },
              { num: '03', icon: '✅', title: 'Verify Details', desc: 'Complete simple verification checks on shipping packages and submit your results.' },
              { num: '04', icon: '💸', title: 'Get Paid', desc: 'Earn money for each completed task. Withdraw your earnings anytime via multiple methods.' },
            ].map(({ num, icon, title, desc }) => (
              <div key={num} className="card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', color: 'rgba(0,229,195,0.08)' }}>{num}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 10, fontSize: '1rem' }}>{title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" id="testimonials" style={{ background: 'rgba(0,229,195,0.02)' }}>
        <div className="container">
          <h2 className="section-title">What Our <span>Verifiers</span> Say</h2>
          <p className="section-subtitle">Real earnings from real people. Join the growing community of home-based verifiers.</p>
          <div className="grid-3">
            {testimonials.map(({ name, role, quote, avatar, color }) => (
              <div key={name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ fontSize: '2rem', color: color }}>"</div>
                <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.92rem', flex: 1 }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.85rem', color }}>
                    {avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>{name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{role}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#f5c518', fontSize: '0.8rem' }}>★★★★★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
          <p className="section-subtitle">Everything you need to know before getting started.</p>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="card" style={{ cursor: 'pointer', padding: '20px 24px' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontFamily: 'Syne', fontWeight: 600, fontSize: '0.95rem' }}>{q}</h4>
                  <span style={{ color: 'var(--teal)', fontSize: '1.2rem', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
                {openFaq === i && <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginTop: 12 }}>{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Telegram CTA */}
      <section style={{ padding: '40px 24px', background: 'linear-gradient(135deg,rgba(0,136,204,0.1),rgba(0,229,195,0.05))', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', marginBottom: 12 }}>Join 5,000+ members on Telegram!</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.9rem' }}>Get exclusive tips, early task alerts, and connect with the community.</p>
          <a href="https://t.me/+3E7iJLy_94MyMzg0" target="_blank" rel="noreferrer">
            <button style={{ background: 'linear-gradient(135deg,#0088cc,#006699)', color: '#fff', border: 'none', borderRadius: 50, padding: '14px 36px', cursor: 'pointer', fontSize: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>
              ✈️ Join Telegram Community
            </button>
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, rgba(0,229,195,0.08), rgba(124,92,252,0.08))', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(40px, 6vw, 80px)', position: 'relative', overflow: 'hidden' }}>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 16 }}>
              Ready to Start Earning With<br /><span className="glow-text">Earn It?</span>
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: '1.05rem' }}>Join 15,000+ verifiers already making money. Sign up takes less than 2 minutes!</p>
            <Link to="/register"><button className="btn-primary" style={{ fontSize: '1.05rem', padding: '18px 44px' }}>Create Your Free Account →</button></Link>
            <p style={{ color: 'var(--muted)', marginTop: 16, fontSize: '0.82rem' }}>No credit card required. Start verifying and earning today!</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
