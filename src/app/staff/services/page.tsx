import { getServices } from '@/app/actions/queue';
import ServiceManager from '@/components/ServiceManager';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="animate-fade-in">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Embassy Services</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Configure and manage embassy service categories.</p>
      </header>

      <ServiceManager initialServices={services} />
    </div>
  );
}
