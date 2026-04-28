'use client';

import { useState, useEffect } from 'react';
import { createTicket } from '@/app/actions/queue';
import { CheckCircle2, Loader2, Ticket, ChevronDown, Printer } from 'lucide-react';

export default function QueueTicketForm({ services }: { services: any[] }) {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (ticket) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [ticket]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;
    
    setLoading(true);
    const result = await createTicket(
      selectedServiceId, 
      customerName, 
      customerDetails,
      phoneNumber,
      emailAddress
    );
    if (result.success) {
      setTicket(result.ticket);
    }
    setLoading(false);
  };

  if (ticket) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.id)}`;

    return (
      <div className="card animate-sweet-fade glass" style={{ 
        textAlign: 'center', 
        borderColor: 'var(--success)', 
        borderWidth: '2px', 
        padding: '3.5rem 2.5rem',
        background: 'linear-gradient(135deg, var(--card) 0%, rgba(16, 185, 129, 0.05) 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div className="print-area" style={{ color: 'black' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'black', marginBottom: '0.5rem' }}>EMBASSY QUEUE SYSTEM</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <img 
              src={qrUrl} 
              alt="Ticket QR Code" 
              style={{ width: '100px', height: '100px', margin: '0 auto', display: 'block', filter: 'grayscale(100%)' }} 
            />
          </div>

          {ticket.customerName && (
            <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'black' }}>
              {ticket.customerName.toUpperCase()}
            </div>
          )}

          <p style={{ fontSize: '0.75rem', color: 'black', marginBottom: '1rem', lineHeight: '1.4' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            <br />
            <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>
              TIME: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </p>
          
          <div style={{ 
            fontSize: '3.5rem', 
            fontWeight: '700', 
            background: 'white', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius)',
            margin: '0.5rem 0',
            color: 'black',
            letterSpacing: '1px',
            border: '2px solid black'
          }}>
            {ticket.tokenNumber}
          </div>
          
          <div style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem', color: 'black' }}>
            {ticket.service.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'black', marginBottom: '1rem', opacity: 0.8 }}>
            Ref: {ticket.id.slice(0, 8).toUpperCase()}
          </div>
        </div>

        <div className="grid no-print" style={{ gap: '1rem', marginTop: '2rem' }}>
          <button 
            onClick={handlePrint}
            className="btn btn-primary pulse-success" 
            style={{ width: '100%', padding: '1.25rem', background: 'var(--success)', borderRadius: '1rem', fontWeight: '700' }}
          >
            <Printer size={20} />
            PRINT TICKET NOW
          </button>
          <button 
            onClick={() => { setTicket(null); setSelectedServiceId(''); setCustomerName(''); setCustomerDetails(''); setPhoneNumber(''); setEmailAddress(''); }}
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '1rem', borderRadius: '1rem' }}
          >
            Finish & Done
          </button>
        </div>
        <style jsx>{`
          .pulse-success {
            animation: pulse-success-animation 2s infinite;
          }
          @keyframes pulse-success-animation {
            0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="card animate-sweet-fade" style={{ padding: '2.5rem' }}>
      <div className="animate-sweet-scale staggered-1" style={{ 
        background: 'rgba(0, 122, 255, 0.1)', 
        color: 'var(--primary)', 
        width: '56px', 
        height: '56px', 
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem'
      }}>
        <Ticket size={28} />
      </div>

      <form onSubmit={handleGenerate} className="grid" style={{ gap: '1.25rem' }}>
        <div className="grid animate-sweet-fade staggered-2" style={{ gap: '0.5rem' }}>
          <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
            FULL NAME
          </label>
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your name"
            required
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem', 
              borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--foreground)'
            }}
          />
        </div>

        <div className="grid grid-cols-2 animate-sweet-fade staggered-3" style={{ gap: '1rem' }}>
          <div className="grid" style={{ gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PHONE NUMBER
            </label>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+234..."
              style={{ 
                width: '100%', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.9rem'
              }}
            />
          </div>
          <div className="grid" style={{ gap: '0.5rem' }}>
            <label style={{ fontWeight: '600', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              EMAIL ADDRESS
            </label>
            <input 
              type="email" 
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="name@example.com"
              style={{ 
                width: '100%', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        <div className="grid" style={{ gap: '0.75rem' }}>
          <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
            ADDITIONAL DETAILS (OPTIONAL)
          </label>
          <input 
            type="text" 
            value={customerDetails}
            onChange={(e) => setCustomerDetails(e.target.value)}
            placeholder="e.g. Passport number or Case ID"
            style={{ 
              width: '100%', 
              padding: '1rem 1.25rem', 
              borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--foreground)'
            }}
          />
        </div>

        <div className="grid animate-sweet-fade staggered-4" style={{ gap: '0.5rem' }}>
          <label style={{ fontWeight: '600', fontSize: '0.75rem', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            SELECT SERVICE
          </label>
          <div style={{ position: 'relative' }}>
            <select 
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.9rem',
                fontWeight: '500',
                appearance: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>Choose a service...</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.prefix})
                </option>
              ))}
            </select>
            <ChevronDown 
              size={18} 
              style={{ 
                position: 'absolute', 
                right: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                pointerEvents: 'none',
                color: 'var(--muted-foreground)'
              }} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary animate-sweet-fade staggered-5" 
          disabled={loading || !selectedServiceId}
          style={{ 
            width: '100%', 
            padding: '1rem', 
            fontSize: '0.95rem',
            fontWeight: '600',
            marginTop: '0.5rem'
          }}
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Generate Queue Number'}
        </button>
      </form>
      
      <style jsx>{`
        input:focus, select:focus {
          outline: none;
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}
