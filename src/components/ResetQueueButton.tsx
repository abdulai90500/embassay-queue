'use client';

import { useState } from 'react';
import { resetQueue } from '@/app/actions/queue';
import { RefreshCcw, Loader2 } from 'lucide-react';

export default function ResetQueueButton() {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    setShowConfirm(false);
    setLoading(true);
    const result = await resetQueue();
    if (result.success) {
      alert('Queue has been successfully reset.');
    } else {
      alert('Error: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <>
      {showConfirm && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div className="card animate-sweet-scale" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
            <RefreshCcw size={48} color="var(--danger)" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--danger)' }}>Reset Entire Queue?</h2>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
              CRITICAL: This will permanently delete ALL tickets and reset the queue sequence to 0. You cannot undo this.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowConfirm(false)} className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>
                Cancel
              </button>
              <button onClick={handleReset} className="btn" style={{ background: 'var(--danger)', color: 'white', flex: 1, padding: '0.75rem' }}>
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    <button 
      onClick={() => setShowConfirm(true)}
      disabled={loading}
      className="btn" 
      style={{ 
        background: 'var(--danger)', 
        color: 'white', 
        padding: '0.75rem 1.5rem',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
      }}
    >
      {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw size={18} />}
      Reset Queue
    </button>
    </>
  );
}
