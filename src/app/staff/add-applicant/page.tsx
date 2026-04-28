import { getServices } from '@/app/actions/queue';
import QueueTicketForm from '@/components/QueueTicketForm';
import { UserPlus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AddApplicantPage() {
  const services = await getServices();

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <UserPlus size={32} color="var(--primary)" /> Manual Intake
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Register a walk-in applicant and generate their queue ticket.</p>
      </header>

      <div style={{ maxWidth: '600px' }}>
        <QueueTicketForm services={services} />
      </div>
    </div>
  );
}
