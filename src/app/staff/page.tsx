import { getQueueData, getServices } from '../actions/queue';
import StaffDashboard from '@/components/StaffDashboard';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const queueData = await getQueueData();
  const services = await getServices();

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Queue Management</h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>Monitor and control the applicant flow in real-time.</p>
      </header>

      <StaffDashboard initialQueue={queueData} services={services} />
    </div>
  );
}
