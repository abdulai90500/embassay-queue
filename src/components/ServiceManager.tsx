'use client';

import { useState } from 'react';
import { addService, deleteService } from '@/app/actions/queue';
import { Plus, Trash2, Tag, Layout, Loader2 } from 'lucide-react';

export default function ServiceManager({ initialServices }: { initialServices: any[] }) {
  const [services, setServices] = useState(initialServices);
  const [name, setName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prefix) return;
    setLoading(true);
    const result = await addService(name, prefix);
    if (result.success) {
      setServices([...services, result.service]);
      setName('');
      setPrefix('');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? All tickets for this service will be affected.')) return;
    const result = await deleteService(id);
    if (result.success) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: '2.5rem', alignItems: 'start' }}>
      {/* SERVICE LIST */}
      <div className="grid" style={{ gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Active Services</h2>
        {services.map((service) => (
          <div key={service.id} className="card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1.25rem 2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ 
                background: 'rgba(37, 99, 235, 0.1)', 
                color: 'var(--primary)', 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800'
              }}>
                {service.prefix}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{service.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Token format: {service.prefix}-XXX</div>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(service.id)}
              style={{ color: 'var(--danger)', opacity: 0.6 }}
              className="btn btn-secondary"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {services.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', borderStyle: 'dashed' }}>
            No services configured yet.
          </div>
        )}
      </div>

      {/* ADD SERVICE FORM */}
      <aside className="card" style={{ position: 'sticky', top: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} color="var(--primary)" /> Add New Service
        </h2>
        <form onSubmit={handleAdd} className="grid" style={{ gap: '1.25rem' }}>
          <div className="grid" style={{ gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>Service Name</label>
            <div style={{ position: 'relative' }}>
              <Layout size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Passport Renewal"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', 
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          </div>

          <div className="grid" style={{ gap: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>Prefix Code</label>
            <div style={{ position: 'relative' }}>
              <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
              <input 
                type="text" 
                maxLength={1}
                value={prefix}
                onChange={(e) => setPrefix(e.target.value.toUpperCase())}
                placeholder="e.g. P"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 2.5rem', 
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !name || !prefix}
            style={{ marginTop: '1rem' }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
            Create Service
          </button>
        </form>
      </aside>
    </div>
  );
}
