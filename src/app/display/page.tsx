import { getQueueData } from '../actions/queue';
import DisplayBoard from '@/components/DisplayBoard';

export const dynamic = 'force-dynamic';

export default async function DisplayPage() {
  const initialData = await getQueueData();

  return (
    <main className="container" style={{ maxWidth: '1400px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="animate-sweet-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px', color: 'var(--foreground)' }}>Embassy Display System</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Live queue status and announcements</p>
        </div>
        <div style={{ padding: '0.5rem 1.25rem', background: 'rgba(52, 199, 89, 0.1)', color: 'var(--success)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
          LIVE UPDATES
        </div>
      </header>
      
      <DisplayBoard initialData={initialData} />
    </main>
  );
}
