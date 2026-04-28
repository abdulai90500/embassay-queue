'use client';

import { useState } from 'react';
import { resetQueue } from '@/app/actions/queue';
import { RefreshCcw, Loader2 } from 'lucide-react';

export default function ResetQueueButton() {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm('CRITICAL: This will delete ALL tickets and reset the queue sequence. This action is permanent. Proceed?')) {
      return;
    }

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
    <button 
      onClick={handleReset}
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
  );
}
