'use client';

import { useState, useEffect } from 'react';
import { callNext, completeService, getQueueData } from '@/app/actions/queue';
import { Play, CheckCircle, Users, Bell, Loader2 } from 'lucide-react';

export default function StaffDashboard({ initialQueue, services }: { initialQueue: any, services: any[] }) {
  const [queue, setQueue] = useState(initialQueue);
  const [loading, setLoading] = useState<string | null>(null);
  const [counterNumber, setCounterNumber] = useState('1');

  const refreshData = async () => {
    const newData = await getQueueData();
    setQueue(newData);
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCallNext = async (serviceId?: string) => {
    setLoading('call');
    await callNext(serviceId, counterNumber);
    await refreshData();
    setLoading(null);
  };

  const handleComplete = async (ticketId: string) => {
    setLoading(ticketId);
    await completeService(ticketId);
    // Automatically call the next person in line after completing
    await callNext(undefined, counterNumber);
    await refreshData();
    setLoading(null);
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2.5rem', alignItems: 'start' }}>
      {/* ACTION PANEL */}
      <aside className="grid animate-sweet-slide staggered-1" style={{ gap: '1.25rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--primary)', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)' }}>
            <Bell size={18} color="var(--primary)" /> Call Controls
          </h2>

          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--muted-foreground)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
              Your Counter
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Counter #</span>
              <input 
                type="text" 
                value={counterNumber} 
                onChange={(e) => setCounterNumber(e.target.value)}
                style={{ width: '40px', padding: '2px 4px', border: '1px solid var(--border)', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '700' }}
              />
            </div>
          </div>

          <div className="grid" style={{ gap: '0.75rem' }}>
            <button 
              onClick={() => handleCallNext()}
              disabled={!!loading || queue.waiting.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {loading === 'call' ? <Loader2 className="animate-spin" /> : <Play size={18} />}
              Call Next
            </button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '1.25rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>System Insights</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{queue.waiting.length}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: '600' }}>Waiting</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{queue.serving.length}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.9, fontWeight: '600' }}>Serving</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--muted-foreground)' }}>By Service</h3>
          <div className="grid" style={{ gap: '0.5rem' }}>
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleCallNext(service.id)}
                disabled={!!loading || !queue.waiting.find((t: any) => t.serviceId === service.id)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'space-between', padding: '0.65rem 1rem', fontSize: '0.85rem' }}
              >
                <span>{service.name}</span>
                <span style={{ padding: '2px 6px', background: 'var(--border)', borderRadius: '4px', fontSize: '0.7rem' }}>
                  {queue.waiting.filter((t: any) => t.serviceId === service.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* QUEUE MANAGEMENT AREA */}
      <div className="grid animate-sweet-fade staggered-2" style={{ gap: '2rem' }}>
        <section className="animate-sweet-fade staggered-3">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
            Active Sessions
          </h2>
          <div className="grid" style={{ gap: '1rem' }}>
            {queue.serving.length > 0 ? (
              queue.serving.map((ticket: any) => (
                <div key={ticket.id} className="card glass animate-sweet-scale" style={{ borderLeft: '4px solid var(--primary)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                      <span className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                      LIVE SESSION
                    </div>
                    <button 
                      onClick={() => handleComplete(ticket.id)}
                      disabled={loading === ticket.id}
                      className="btn btn-primary"
                      style={{ background: 'var(--success)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      {loading === ticket.id ? <Loader2 className="animate-spin" /> : <CheckCircle size={18} />}
                      Complete Service
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)', letterSpacing: '-1px' }}>{ticket.tokenNumber}</div>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.2rem' }}>{ticket.customerName || 'Anonymous Applicant'}</div>
                      <div style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ padding: '2px 8px', background: 'rgba(37,99,235,0.1)', borderRadius: '4px' }}>{ticket.service.name}</span>
                      </div>
                      {ticket.customerDetails && (
                        <div style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', marginTop: '0.5rem', background: 'var(--muted)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                          Ref: {ticket.customerDetails}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)', borderStyle: 'dashed' }}>
                No active sessions. Call an applicant to begin.
              </div>
            )}
          </div>
        </section>

        <section className="animate-sweet-fade staggered-4">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} /> Upcoming Applicants
          </h2>
          <div className="grid" style={{ gap: '0.75rem' }}>
            {queue.waiting.length > 0 ? (
              queue.waiting.map((ticket: any, index: number) => (
                <div key={ticket.id} className="card queue-item animate-sweet-fade" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '1rem 1.5rem',
                  opacity: index === 0 ? 1 : 0.7,
                  transition: 'all 0.3s ease',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: 'var(--muted-foreground)', fontWeight: '600', width: '25px', fontSize: '0.75rem' }}>#{index + 1}</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--foreground)' }}>{ticket.tokenNumber}</span>
                    <div>
                      <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{ticket.customerName || 'Anonymous'}</span>
                      <span style={{ marginLeft: '1rem', color: 'var(--muted-foreground)', fontSize: '0.8rem', fontWeight: '500' }}>{ticket.service.name}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.65rem', background: 'var(--muted)', padding: '3px 10px', borderRadius: '20px', fontWeight: '600', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
                    Waiting
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)', borderStyle: 'dashed' }}>
                Queue is currently empty.
              </div>
            )}
          </div>
        </section>
      </div>
    <style jsx>{`
      .pulse {
        animation: pulse-animation 2s infinite;
      }
      @keyframes pulse-animation {
        0% { transform: scale(0.95); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.5; }
      }
      .queue-item:hover {
        transform: translateX(8px);
        border-color: var(--primary) !important;
        background: var(--background) !important;
        opacity: 1 !important;
        transition: all 0.3s ease;
      }
    `}</style>
    </div>
  );
}
