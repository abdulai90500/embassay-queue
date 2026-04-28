import { Settings, RefreshCcw, ShieldAlert, Database } from 'lucide-react';
import ResetQueueButton from '@/components/ResetQueueButton';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>System Settings</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Global configuration and maintenance controls.</p>
      </header>

      <div className="grid" style={{ gap: '2rem' }}>
        {/* DATABASE MAINTENANCE */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '10px' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Danger Zone</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Actions that cannot be undone. Please be careful.</p>
            </div>
          </div>

          <div style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Reset Daily Queue</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>This will delete all current tickets and reset the sequence to 001.</p>
            </div>
            <ResetQueueButton />
          </div>
        </section>

        {/* SYSTEM INFO */}
        <section className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '10px' }}>
              <Database size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>System Information</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Version and connectivity status.</p>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '1px' }}>Prisma Version</div>
              <div style={{ fontWeight: '700' }}>7.8.0</div>
            </div>
            <div style={{ background: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '1px' }}>Database Status</div>
              <div style={{ fontWeight: '700', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></span>
                Connected
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
