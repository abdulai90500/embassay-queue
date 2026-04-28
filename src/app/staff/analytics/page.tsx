import { getAnalytics } from '@/app/actions/queue';
import { BarChart3, TrendingUp, Clock, Ticket } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const data = await getAnalytics();

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Performance Analytics</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Monitor system performance and visitor metrics.</p>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
            <Ticket size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Total Tickets Today</div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data.totalToday}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '12px' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Completed Sessions</div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data.completedCount}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px' }}>
            <Clock size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Avg. Wait Time</div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>{data.avgWaitTime} <span style={{ fontSize: '1rem', fontWeight: '500' }}>mins</span></div>
          </div>
        </div>
      </div>

      {/* SERVICE DISTRIBUTION */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={20} color="var(--primary)" /> Service Distribution
        </h2>
        <div className="grid" style={{ gap: '1.5rem' }}>
          {data.serviceStats.map((stat) => {
            const percentage = data.totalToday > 0 ? (stat.count / data.totalToday) * 100 : 0;
            return (
              <div key={stat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  <span style={{ fontWeight: '600' }}>{stat.name}</span>
                  <span style={{ color: 'var(--muted-foreground)' }}>{stat.count} tickets ({Math.round(percentage)}%)</span>
                </div>
                <div style={{ height: '12px', background: 'var(--muted)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${percentage}%`, 
                    background: 'var(--primary)',
                    borderRadius: '6px',
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
