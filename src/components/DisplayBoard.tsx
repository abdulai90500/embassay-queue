'use client';

import { useEffect, useState } from 'react';
import { getQueueData } from '@/app/actions/queue';
import { Users, Clock } from 'lucide-react';

export default function DisplayBoard({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(async () => {
      const newData = await getQueueData();
      setData(newData);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2" style={{ flex: 1, gap: '2.5rem' }}>
      {/* NOW SERVING SECTION */}
      <section className="card" style={{ 
        background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '-20%', 
          right: '-10%', 
          width: '300px', 
          height: '300px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '50%' 
        }}></div>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', opacity: 0.9, marginBottom: '2.5rem', letterSpacing: '8px', textTransform: 'uppercase' }}>Now Serving</h2>
        <div className="grid" style={{ width: '100%', gap: '2rem', zIndex: 1 }}>
          {data.serving.length > 0 ? (
            data.serving.map((ticket: any) => (
              <div key={ticket.id} className="animate-sweet-scale" style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', padding: '3rem 2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="sweet-token-pulse" style={{ 
                  fontSize: '8rem', 
                  fontWeight: '700', 
                  lineHeight: 1, 
                  marginBottom: '1.5rem',
                  letterSpacing: '-4px'
                }}>
                  {ticket.tokenNumber}
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                  {ticket.service.name}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '500', color: '#ffd60a', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Please proceed to Counter {ticket.counterNumber || '1'}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '2.5rem', opacity: 0.4, textAlign: 'center' }}>Waiting for next...</div>
          )}
        </div>
      </section>

      {/* NEXT IN QUEUE SECTION */}
      <section className="grid" style={{ gridTemplateRows: 'auto 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.5rem', fontWeight: '800' }}>
            <Users size={32} color="var(--primary)" /> UPCOMING
          </h2>
          <div id="clock" style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="grid grid-cols-1" style={{ overflowY: 'auto', alignContent: 'start', gap: '0.75rem' }}>
          {data.waiting.length > 0 ? (
            data.waiting.map((ticket: any, index: number) => (
              <div key={ticket.id} className={`card animate-sweet-fade staggered-${(index % 5) + 1}`} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1.25rem 2rem',
                borderLeft: index === 0 ? '6px solid var(--primary)' : '1px solid var(--border)',
                background: index === 0 ? 'rgba(0, 122, 255, 0.03)' : 'var(--card)',
                borderRadius: '1.25rem'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: index === 0 ? 'var(--primary)' : 'var(--foreground)' }}>{ticket.tokenNumber}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600' }}>{ticket.service.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.2rem', textTransform: 'uppercase', fontWeight: '600' }}>
                    <Clock size={14} /> Please wait
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '6rem', color: 'var(--muted-foreground)', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '1.25rem' }}>Queue is currently clear</div>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Next applicants will appear here</p>
            </div>
          )}
        </div>
      </section>
    <style jsx>{`
      .sweet-token-pulse {
        animation: token-pulse 3s infinite;
      }
      @keyframes token-pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
    </div>
  );
}
