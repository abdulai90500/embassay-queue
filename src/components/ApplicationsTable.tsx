'use client';

import { useState } from 'react';
import { deleteTicket, updateTicket } from '@/app/actions/queue';
import { Trash2, Edit2, Check, X, FileText, User, Search, Eye, Phone, Mail, Hash, Layers, Clock, BadgeCheck, Printer } from 'lucide-react';

type Ticket = {
  id: string;
  tokenNumber: string;
  status: string;
  position: number;
  customerName?: string | null;
  customerDetails?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  counterNumber?: string | null;
  serviceId: string;
  service: { id: string; name: string; prefix: string };
  createdAt: string | Date;
  updatedAt: string | Date;
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  COMPLETED: { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  SERVING:   { bg: 'rgba(37,99,235,0.12)',  color: '#3b82f6' },
  WAITING:   { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' },
  CANCELLED: { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
};

function ViewModal({ ticket, onClose }: { ticket: Ticket | null; onClose: () => void }) {
  if (!ticket) return null;
  const statusStyle = STATUS_COLORS[ticket.status] ?? STATUS_COLORS.WAITING;

  return (
    <div
      onClick={onClose}
      className="modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content printable-content animate-sweet-scale"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '1.5rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
          position: 'relative',
        }}
      >
        {/* Buttons */}
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.5rem' }} className="no-print">
          <button
            onClick={() => window.print()}
            style={{
              background: 'var(--primary)', border: 'none', borderRadius: '50%',
              width: '2.25rem', height: '2.25rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
            }}
            title="Print Details"
          >
            <Printer size={16} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'var(--muted)', border: 'none', borderRadius: '50%',
              width: '2.25rem', height: '2.25rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--muted-foreground)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '50%',
            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <User size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {ticket.customerName || 'Anonymous'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
              {ticket.customerDetails || 'No reference ID'}
            </div>
          </div>
          <span style={{
            marginLeft: 'auto',
            padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600',
            background: statusStyle.bg, color: statusStyle.color,
          }}>
            {ticket.status}
          </span>
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <InfoRow icon={<Hash size={16} />} label="Token" value={ticket.tokenNumber} highlight />
          <InfoRow icon={<Layers size={16} />} label="Service" value={ticket.service.name} />
          <InfoRow
            icon={<Phone size={16} />}
            label="Phone"
            value={ticket.phoneNumber || <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>Not provided</span>}
          />
          <InfoRow
            icon={<Mail size={16} />}
            label="Email"
            value={ticket.email || <span style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>Not provided</span>}
          />
          <InfoRow
            icon={<Clock size={16} />}
            label="Registered"
            value={new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          />
          {ticket.counterNumber && (
            <InfoRow icon={<BadgeCheck size={16} />} label="Counter" value={`Counter ${ticket.counterNumber}`} />
          )}
        </div>

        {/* QR Code Section */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(ticket.id)}`}
            alt="Ticket QR"
            style={{ width: '120px', height: '120px', border: '1px solid var(--border)', padding: '5px', borderRadius: '8px', background: 'white' }}
          />
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Reference ID: {ticket.id.slice(0, 8).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div style={{
      background: 'var(--muted)',
      borderRadius: '0.75rem',
      padding: '0.75rem 0.85rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.2rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--muted-foreground)', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: highlight ? '700' : '600', fontSize: highlight ? '1rem' : '0.875rem', color: highlight ? 'var(--primary)' : 'inherit' }}>
        {value}
      </div>
    </div>
  );
}

export default function ApplicationsTable({ tickets, services }: { tickets: any[]; services: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ customerName: '', customerDetails: '', serviceId: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);

  const filteredTickets = tickets.filter((t) => {
    const ticketDate = new Date(t.createdAt);
    const now = new Date();
    let matchesDate = true;
    if (dateFilter === 'TODAY') matchesDate = ticketDate.toDateString() === now.toDateString();
    else if (dateFilter === 'WEEK') matchesDate = ticketDate >= new Date(now.getTime() - 7 * 86400000);
    else if (dateFilter === 'MONTH') matchesDate = ticketDate >= new Date(now.getTime() - 30 * 86400000);

    const matchesSearch =
      t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      t.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.phoneNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || t.serviceId === serviceFilter;
    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const exportToCSV = () => {
    const headers = ['Token,Customer,Phone,Email,Service,Date,Status,Details'];
    const rows = filteredTickets.map(
      (t) =>
        `${t.tokenNumber},"${t.customerName || 'Anonymous'}",${t.phoneNumber || ''},${t.email || ''},${t.service.name},${new Date(t.createdAt).toLocaleString()},${t.status},"${t.customerDetails || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `embassy_report_${dateFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startEditing = (ticket: any) => {
    setEditingId(ticket.id);
    setEditForm({ customerName: ticket.customerName || '', customerDetails: ticket.customerDetails || '', serviceId: ticket.serviceId });
  };

  const handleSave = async (id: string) => {
    const result = await updateTicket(id, editForm);
    if (result.success) setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application record?')) {
      await deleteTicket(id);
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 20mm;
          }

          body {
            background: white !important;
            color: black !important;
            width: 100% !important;
          }

          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          
          /* Show only the printable content */
          .printable-content, .printable-content *, .printable-content table {
            visibility: visible !important;
            display: block;
          }

          .printable-content table {
            display: table !important;
            width: 100% !important;
            border-collapse: collapse !important;
          }

          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Reset grids for print */
          .grid {
            display: block !important;
          }

          .card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
          }

          th, td {
            border-bottom: 1px solid #eee !important;
            padding: 10px !important;
            color: black !important;
            font-size: 10pt !important;
          }

          .no-print, .sidebar, header, .sidebar-footer {
            display: none !important;
          }

          .print-header {
            display: block !important;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }

          /* Specifically for the modal if open */
          .modal-overlay {
            background: white !important;
            position: absolute !important;
            inset: 0 !important;
            padding: 0 !important;
            visibility: visible !important;
            display: block !important;
          }
          
          .modal-content {
            box-shadow: none !important;
            border: none !important;
            max-width: none !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 2rem !important;
            visibility: visible !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        .print-header {
          display: none;
        }
      `}</style>

      <ViewModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} />

      <div className={`printable-content animate-sweet-fade ${viewingTicket ? 'no-print' : ''}`}>
        <div className="print-header">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Embassy Queue System - Applications Report</h1>
          <p>Generated on: {new Date().toLocaleString()}</p>
        </div>

        <div className="grid" style={{ gap: '1.5rem' }}>
          <div className="card no-print" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Search name, token or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--background)' }}
              />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="btn-secondary"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minWidth: '150px' }}>
              <option value="ALL">All Statuses</option>
              <option value="WAITING">Waiting</option>
              <option value="SERVING">Serving</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="btn-secondary"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minWidth: '150px' }}>
              <option value="ALL">All Services</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="btn-secondary"
              style={{ padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minWidth: '150px' }}>
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>

            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
              <button
                onClick={() => window.print()}
                className="btn btn-secondary"
                style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Printer size={16} /> Print PDF
              </button>
              <button onClick={exportToCSV} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                Export CSV
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                  <tr>
                    <th style={{ padding: '1rem 1.25rem' }}>Token</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Phone</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Service</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Date</th>
                    <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.25rem' }} className="no-print">Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.875rem' }}>
                  {filteredTickets.map((ticket) => {
                    const statusStyle = STATUS_COLORS[ticket.status] ?? STATUS_COLORS.WAITING;
                    return (
                      <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                          {ticket.tokenNumber}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          {editingId === ticket.id ? (
                            <div className="grid" style={{ gap: '0.5rem' }}>
                              <input className="btn-secondary"
                                style={{ padding: '0.4rem', border: '1px solid var(--border)', fontSize: '0.9rem' }}
                                value={editForm.customerName}
                                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} />
                              <input className="btn-secondary"
                                style={{ padding: '0.4rem', border: '1px solid var(--border)', fontSize: '0.8rem' }}
                                value={editForm.customerDetails}
                                onChange={(e) => setEditForm({ ...editForm, customerDetails: e.target.value })} />
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontWeight: '600' }}>{ticket.customerName || 'Anonymous'}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{ticket.customerDetails}</div>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          {ticket.phoneNumber ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                              <Phone size={14} color="var(--primary)" />
                              {ticket.phoneNumber}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', fontStyle: 'italic' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          {editingId === ticket.id ? (
                            <select className="btn-secondary"
                              style={{ padding: '0.4rem', border: '1px solid var(--border)', fontSize: '0.9rem', width: '100%' }}
                              value={editForm.serviceId}
                              onChange={(e) => setEditForm({ ...editForm, serviceId: e.target.value })}>
                              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                          ) : (
                            ticket.service.name
                          )}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                          {new Date(ticket.createdAt).toLocaleDateString()}<br />
                          {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: statusStyle.bg, color: statusStyle.color }}>
                            {ticket.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }} className="no-print">
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {editingId === ticket.id ? (
                              <>
                                <button onClick={() => handleSave(ticket.id)} className="btn btn-primary" style={{ padding: '0.4rem' }}><Check size={16} /></button>
                                <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ padding: '0.4rem' }}><X size={16} /></button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => setViewingTicket(ticket)}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.4rem 0.75rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: '600' }}
                                  title="View Details"
                                >
                                  <Eye size={15} /> View
                                </button>
                                <button onClick={() => startEditing(ticket)} className="btn btn-secondary" style={{ padding: '0.4rem' }} title="Edit"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(ticket.id)} className="btn" style={{ padding: '0.4rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }} title="Delete"><Trash2 size={16} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredTickets.length === 0 && (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                <p>No matching applications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
