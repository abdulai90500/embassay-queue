import { getAllTickets, getServices } from '@/app/actions/queue';
import ApplicationsTable from '@/components/ApplicationsTable';
import { FileText, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const tickets = await getAllTickets();
  const services = await getServices();

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={32} color="var(--primary)" /> Application Records
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Comprehensive report and management of all queue applications.</p>
        </div>
        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Export CSV
        </button>
      </header>

      <div style={{ marginBottom: '2rem' }} className="grid grid-cols-4">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Total records</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{tickets.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Completed</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>
            {tickets.filter((t: any) => t.status === 'COMPLETED').length}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>In Waiting</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>
            {tickets.filter((t: any) => t.status === 'WAITING').length}
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>In Service</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fbbf24' }}>
            {tickets.filter((t: any) => t.status === 'SERVING').length}
          </div>
        </div>
      </div>

      <ApplicationsTable tickets={tickets} services={services} />
    </div>
  );
}
