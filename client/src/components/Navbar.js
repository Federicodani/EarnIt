import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    padding: '0 24px',
    transition: 'all 0.3s ease',
    background: scrolled || !transparent ? 'rgba(10,15,30,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(0,229,195,0.1)' : 'none',
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#00e5c3,#00a3e0)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--white)' }}>Earnova<span style={{ color: 'var(--teal)' }}>Station</span></span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {!user ? (
            <>
              <Link to="/#how-it-works" style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--white)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}>How It Works</Link>
              <Link to="/#faq" style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--white)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}>Support</Link>
              <Link to="/login"><button className="btn-outline" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>Login</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>Get Started</button></Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" style={{ color: location.pathname === '/dashboard' ? 'var(--teal)' : 'var(--muted)', fontSize: '0.9rem', fontWeight: 500 }}>Dashboard</Link>
              <Link to="/packages" style={{ color: location.pathname === '/packages' ? 'var(--teal)' : 'var(--muted)', fontSize: '0.9rem', fontWeight: 500 }}>Packages</Link>
              <Link to="/tasks" style={{ color: location.pathname === '/tasks' ? 'var(--teal)' : 'var(--muted)', fontSize: '0.9rem', fontWeight: 500 }}>Tasks</Link>
              <Link to="/withdraw" style={{ color: location.pathname === '/withdraw' ? 'var(--teal)' : 'var(--muted)', fontSize: '0.9rem', fontWeight: 500 }}>Withdraw</Link>
              <Link to="/profile">
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),var(--violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem', cursor: 'pointer' }}>
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Logout</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', fontSize: '1.5rem' }} className="mobile-menu-btn">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'var(--navy-card)', border: '1px solid var(--border)', borderRadius: 16, margin: '0 16px 16px', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!user ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: 'var(--muted)' }}>How It Works</Link>
              <Link to="/" onClick={() => setMenuOpen(false)} style={{ color: 'var(--muted)' }}>Support</Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}><button className="btn-outline" style={{ width: '100%' }}>Login</button></Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}><button className="btn-primary" style={{ width: '100%' }}>Get Started</button></Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'var(--muted)' }}>Dashboard</Link>
              <Link to="/packages" onClick={() => setMenuOpen(false)} style={{ color: 'var(--muted)' }}>Packages</Link>
              <Link to="/tasks" onClick={() => setMenuOpen(false)} style={{ color: 'var(--muted)' }}>Tasks</Link>
              <Link to="/withdraw" onClick={() => setMenuOpen(false)} style={{ color: 'var(--muted)' }}>Withdraw</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: 'var(--muted)' }}>Profile</Link>
              <button onClick={handleLogout} className="btn-ghost" style={{ width: '100%' }}>Logout</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
