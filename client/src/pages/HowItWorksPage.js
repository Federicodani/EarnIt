import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const steps = [
  { num: '01', icon: '📝', title: 'Sign Up & Set Up', desc: 'Create your free account in under 2 minutes. Fill in your name, email, phone number and country. No credit card required — ever.', color: 'var(--teal)' },
  { num: '02', icon: '🔍', title: 'Browse Available Tasks', desc: 'Explore verification tasks from e-commerce companies across 30+ countries. Filter by category, reward, or country. Each task shows estimated time and pay.', color: 'var(--violet)' },
  { num: '03', icon: '✅', title: 'Complete Verification', desc: 'Follow simple instructions to verify shipping details, product listings, or seller documents. Submit your findings through our easy-to-use interface.', color: 'var(--gold)' },
  { num: '04', icon: '👀', title: 'Review Process', desc: 'Our quality team reviews your submissions within 24 hours. Approved submissions are credited to your wallet instantly.', color: 'var(--coral)' },
  { num: '05', icon: '💸', title: 'Withdraw Earnings', desc: 'Once your balance reaches $50, withdraw via M-Pesa, PayPal, Stripe, or direct bank transfer. Payments processed within 24–48 hours.', color: 'var(--teal)' },
];

const tiers = [
  { name: 'Basic', icon: '🌱', tasks: '0+', bonus: 'Standard rates', perks: ['Access to all basic tasks', 'Weekly payouts', 'Email support'], color: 'var(--muted)' },
  { name: 'Silver', icon: '🥈', tasks: '50+', bonus: '+10% bonus', perks: ['Priority task access', 'Faster payouts', 'Live chat support', 'Exclusive task categories'], color: '#c0c0c0' },
  { name: 'Gold', icon: '🥇', tasks: '200+', bonus: '+25% bonus', perks: ['First access to premium tasks', 'Daily payouts', 'Dedicated support', 'Higher reward tasks', 'Referral bonuses'], color: 'var(--gold)' },
  { name: 'Platinum', icon: '💎', tasks: '500+', bonus: '+50% bonus', perks: ['Exclusive high-value tasks', 'Instant payouts', 'Priority review', 'VIP support 24/7', 'Team earnings dashboard'], color: 'var(--teal)' },
];

const HowItWorksPage = () => (
  <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
    <Navbar />

    {/* Hero */}
    <section style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(0,229,195,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <span className="badge badge-teal" style={{ marginBottom: 20, display: 'inline-flex' }}>Simple & Transparent Process</span>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: 16, lineHeight: 1.1 }}>
          How <span className="glow-text">Earn It</span> Works
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.8 }}>
          From sign-up to your first payout — here's everything you need to know about earning with us.
        </p>
        <Link to="/register"><button className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>Get Started Free →</button></Link>
      </div>
    </section>

    {/* Steps */}
    <section className="section">
      <div className="container">
        <h2 className="section-title">The <span>5-Step</span> Process</h2>
        <p className="section-subtitle">Everything laid out so you know exactly what to expect.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          {/* Vertical connector */}
          <div style={{ position: 'absolute', left: 39, top: 60, bottom: 60, width: 2, background: 'linear-gradient(to bottom, var(--teal), var(--violet), var(--gold), var(--coral), var(--teal))', opacity: 0.2, zIndex: 0 }} />

          {steps.map(({ num, icon, title, desc, color }, i) => (
            <div key={num} style={{ display: 'flex', gap: 24, marginBottom: 40, position: 'relative', zIndex: 1, animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
              <div style={{ flexShrink: 0, width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${color}15`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', position: 'relative' }}>
                  {icon}
                  <div style={{ position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 800, fontSize: '0.65rem', color: 'var(--navy)' }}>{num.slice(-1)}</div>
                </div>
              </div>
              <div className="card" style={{ flex: 1, background: `linear-gradient(135deg, ${color}05, transparent)` }}>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color }}>{title}</h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.93rem' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Membership Tiers */}
    <section className="section" id="pricing" style={{ background: 'rgba(0,229,195,0.02)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <h2 className="section-title">Membership <span>Tiers</span></h2>
        <p className="section-subtitle">The more tasks you complete, the better your rewards. Level up as you earn!</p>

        <div className="grid-4">
          {tiers.map(({ name, icon, tasks, bonus, perks, color }) => (
            <div key={name} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, border: name === 'Gold' ? `2px solid ${color}` : undefined, position: 'relative', overflow: 'hidden' }}>
              {name === 'Gold' && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.65rem', fontFamily: 'Syne', fontWeight: 800, padding: '3px 8px', borderRadius: 50 }}>POPULAR</div>
              )}
              <div style={{ fontSize: '2.5rem' }}>{icon}</div>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.2rem', color }}>{name}</h3>
                <div style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 4 }}>{tasks} tasks completed</div>
              </div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, color, fontSize: '1rem' }}>{bonus}</div>
              <div style={{ flex: 1 }}>
                {perks.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.82rem', color: 'var(--muted)' }}>
                    <span style={{ color, flexShrink: 0 }}>✓</span> {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ-style tips */}
    <section className="section">
      <div className="container">
        <h2 className="section-title">Tips for <span>Success</span></h2>
        <div className="grid-3">
          {[
            { icon: '⏰', title: 'Work at Your Own Pace', desc: 'There are no deadlines or minimum hours. Verify packages when it suits you — morning, afternoon, or late at night.' },
            { icon: '🎯', title: 'Focus on Quality', desc: 'Accurate submissions get approved faster and help you level up your membership tier, unlocking higher-paying tasks.' },
            { icon: '📱', title: 'Use the Telegram Community', desc: 'Join 5,000+ members to get first-hand tips, task alerts, and connect with top earners on the platform.' },
            { icon: '💡', title: 'Diversify Task Categories', desc: 'Try different task types — shipping, documents, e-commerce — to find what you\'re fastest at and maximize hourly earnings.' },
            { icon: '🔄', title: 'Stay Consistent', desc: 'Verifiers who complete at least 5 tasks per week see the fastest membership tier progression and unlock better opportunities.' },
            { icon: '🌍', title: 'Pick High-Reward Countries', desc: 'Tasks from certain countries pay more due to complexity. Explore all regions to find the highest-paying available work.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card">
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>{icon}</div>
              <h4 style={{ fontFamily: 'Syne', fontWeight: 700, marginBottom: 8, fontSize: '0.98rem' }}>{title}</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.87rem', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container">
        <div style={{ background: 'linear-gradient(135deg, rgba(0,229,195,0.08), rgba(124,92,252,0.08))', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(40px, 6vw, 80px)' }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', marginBottom: 16 }}>
            Ready to Start Earning?
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: '1rem' }}>Join 15,000+ verifiers. Free to join. No experience needed.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register"><button className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>Create Free Account →</button></Link>
            <Link to="/login"><button className="btn-outline" style={{ fontSize: '1rem', padding: '16px 36px' }}>Sign In</button></Link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default HowItWorksPage;
