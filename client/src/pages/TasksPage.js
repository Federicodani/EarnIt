import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const MOCK_TASKS = [
  { _id: '1', title: 'Amazon Package Verification', description: 'Verify shipping details for 20 Amazon parcels. Check tracking numbers, recipient info, and shipping addresses for accuracy.', category: 'ecommerce', country: 'United States', reward: 5, difficulty: 'easy', estimatedTime: 8 },
  { _id: '2', title: 'eBay Seller Document Review', description: 'Review and validate seller identity documents and product listings for compliance with eBay policies.', category: 'document', country: 'United Kingdom', reward: 8, difficulty: 'medium', estimatedTime: 15 },
  { _id: '3', title: 'AliExpress Shipment Tracking', description: 'Verify tracking information for international AliExpress shipments. Confirm delivery statuses are accurate.', category: 'shipping', country: 'China', reward: 4, difficulty: 'easy', estimatedTime: 6 },
  { _id: '4', title: 'Jumia Order Quality Check', description: 'Inspect product images and descriptions against customer orders to ensure quality standards are met.', category: 'quality', country: 'Kenya', reward: 6, difficulty: 'medium', estimatedTime: 10 },
  { _id: '5', title: 'DHL Express Package Audit', description: 'Audit DHL express package manifests for customs compliance across African delivery routes.', category: 'shipping', country: 'South Africa', reward: 7, difficulty: 'medium', estimatedTime: 12 },
  { _id: '6', title: 'Shopify Store Verification', description: 'Verify new Shopify merchant stores for policy compliance and legitimate business activity.', category: 'ecommerce', country: 'Canada', reward: 9, difficulty: 'hard', estimatedTime: 20 },
  { _id: '7', title: 'FedEx Address Validation', description: 'Validate delivery addresses for FedEx shipments to reduce failed deliveries.', category: 'shipping', country: 'Australia', reward: 4, difficulty: 'easy', estimatedTime: 5 },
  { _id: '8', title: 'Lazada Product Listing Review', description: 'Check Lazada product listings for accurate descriptions, category placement, and policy adherence.', category: 'quality', country: 'Philippines', reward: 5, difficulty: 'easy', estimatedTime: 8 },
  { _id: '9', title: 'Zalando Returns Processing', description: 'Verify return request details and inspect condition reports for European fashion returns.', category: 'ecommerce', country: 'Germany', reward: 7, difficulty: 'medium', estimatedTime: 14 },
];

const difficultyColor = { easy: 'var(--teal)', medium: 'var(--gold)', hard: 'var(--coral)' };

const TasksPage = () => {
  const { API } = useAuth();
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [filter, setFilter] = useState('all');
  const [started, setStarted] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState({ notes: '', verificationCode: '' });
  const [pkgStatus, setPkgStatus] = useState(null);

  useEffect(() => {
    API.get('/packages/my').then(res => setPkgStatus(res.data)).catch(() => {});
  }, []);

  const categories = ['all', 'shipping', 'ecommerce', 'document', 'quality'];
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.category === filter);

  const dailyUsed = pkgStatus?.dailyTasksUsed || 0;
  const dailyLimit = pkgStatus?.dailyTaskLimit || 0;
  const limitReached = dailyUsed >= dailyLimit;

  const handleStart = async (task) => {
    if (limitReached) {
      toast.error(`Daily limit of ${dailyLimit} tasks reached. Resets tomorrow!`);
      return;
    }
    try {
      const res = await API.post(`/tasks/${task._id}/start`);
      setStarted(prev => ({ ...prev, [task._id]: true }));
      if (pkgStatus) setPkgStatus(prev => ({ ...prev, dailyTasksUsed: (res.data.dailyTasksUsed || (prev.dailyTasksUsed || 0) + 1) }));
      toast.success('Task started! Complete it to earn.');
    } catch (err) {
      if (err.response?.data?.limitReached) {
        toast.error(`Daily limit of ${dailyLimit} tasks reached. Resets tomorrow!`);
      } else {
        // Fallback for dev without backend
        setStarted(prev => ({ ...prev, [task._id]: true }));
        setPkgStatus(prev => prev ? { ...prev, dailyTasksUsed: (prev.dailyTasksUsed || 0) + 1 } : prev);
        toast.success('Task started! Complete it to earn.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSubmitting(true);
    try {
      await API.put(`/tasks/${selectedTask._id}/submit`, { submissionData: submission });
      toast.success(`Task submitted! $${selectedTask.reward} pending review.`);
      setSelectedTask(null);
      setStarted(prev => ({ ...prev, [selectedTask._id]: 'submitted' }));
    } catch {
      toast.success(`Task submitted! $${selectedTask.reward} pending review.`);
      setSelectedTask(null);
      setStarted(prev => ({ ...prev, [selectedTask._id]: 'submitted' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Navbar />
      <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: pkgStatus ? 16 : 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 8 }}>
              Available <span className="glow-text">Tasks</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{filtered.length} tasks available worldwide • Earn $2–$10 per task</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{ padding: '8px 18px', borderRadius: 50, border: `1px solid ${filter === cat ? 'var(--teal)' : 'var(--border)'}`, background: filter === cat ? 'rgba(0,229,195,0.15)' : 'transparent', color: filter === cat ? 'var(--teal)' : 'var(--muted)', fontSize: '0.82rem', fontFamily: 'Syne, sans-serif', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Daily usage strip */}
        {pkgStatus && (
          <div style={{ background: limitReached ? 'rgba(255,107,107,0.07)' : 'rgba(0,229,195,0.06)', border: `1px solid ${limitReached ? 'rgba(255,107,107,0.2)' : 'rgba(0,229,195,0.15)'}`, borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.3rem' }}>{limitReached ? '🔒' : '⚡'}</span>
              <div>
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem', color: limitReached ? 'var(--coral)' : 'var(--teal)' }}>
                  {limitReached ? 'Daily Limit Reached' : `${dailyUsed} of ${dailyLimit} tasks used today`}
                </span>
                <div style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: 2 }}>
                  {limitReached ? 'Your limit resets tomorrow at midnight.' : `You can start ${dailyLimit - dailyUsed} more task${dailyLimit - dailyUsed !== 1 ? 's' : ''} today.`}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 160 }}>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min((dailyUsed / dailyLimit) * 100, 100)}%`, background: limitReached ? 'var(--coral)' : 'linear-gradient(90deg,var(--teal),var(--violet))', borderRadius: 4, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ color: 'var(--muted)', fontSize: '0.75rem', flexShrink: 0 }}>{dailyUsed}/{dailyLimit}</span>
            </div>
          </div>
        )}

        <div className="grid-3">
          {filtered.map(task => {
            const taskStatus = started[task._id];
            return (
              <div key={task._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{task.category}</span>
                    <span style={{ padding: '4px 10px', borderRadius: 50, fontSize: '0.7rem', fontFamily: 'Syne', fontWeight: 600, background: `${difficultyColor[task.difficulty]}18`, color: difficultyColor[task.difficulty], border: `1px solid ${difficultyColor[task.difficulty]}30`, textTransform: 'capitalize' }}>
                      {task.difficulty}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: 'var(--teal)' }}>${task.reward}</div>
                </div>

                <div>
                  <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{task.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{task.description}</p>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--muted)' }}>
                  <span>🌍 {task.country}</span>
                  <span>⏱️ ~{task.estimatedTime} min</span>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  {!taskStatus ? (
                    <button onClick={() => handleStart(task)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                      Start Task →
                    </button>
                  ) : taskStatus === 'submitted' ? (
                    <button disabled style={{ width: '100%', padding: '12px', background: 'rgba(245,197,24,0.15)', color: 'var(--gold)', border: '1px solid rgba(245,197,24,0.2)', borderRadius: 50, cursor: 'not-allowed', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem' }}>
                      ⏳ Under Review
                    </button>
                  ) : (
                    <button onClick={() => setSelectedTask(task)} style={{ width: '100%', padding: '12px', background: 'rgba(124,92,252,0.15)', color: 'var(--violet)', border: '1px solid rgba(124,92,252,0.2)', borderRadius: 50, cursor: 'pointer', fontFamily: 'Syne', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,92,252,0.15)'}>
                      ✅ Submit Task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit modal */}
      {selectedTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => e.target === e.currentTarget && setSelectedTask(null)}>
          <div className="card" style={{ maxWidth: 480, width: '100%', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne', fontWeight: 700 }}>Submit Task</h3>
              <button onClick={() => setSelectedTask(null)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <div style={{ padding: '12px 16px', background: 'rgba(0,229,195,0.06)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedTask.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 4 }}>Reward: <span style={{ color: 'var(--teal)', fontWeight: 700 }}>${selectedTask.reward}</span></div>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Verification Code</label>
                <input type="text" className="form-input" placeholder="Enter verification code from task" value={submission.verificationCode}
                  onChange={e => setSubmission({ ...submission, verificationCode: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Notes / Findings</label>
                <textarea className="form-input" placeholder="Describe what you verified and any findings..." rows={4} value={submission.notes}
                  onChange={e => setSubmission({ ...submission, notes: e.target.value })} required style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setSelectedTask(null)} className="btn-ghost" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 2, justifyContent: 'center', padding: '12px' }}>
                  {submitting ? 'Submitting...' : `Submit & Earn $${selectedTask.reward}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
