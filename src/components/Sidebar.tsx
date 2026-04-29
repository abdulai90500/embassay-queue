'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  Settings, 
  LogOut, 
  Ticket, 
  Building2,
  FileText
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Queue Dashboard', href: '/staff', icon: LayoutDashboard },
  { name: 'Add Applicant', href: '/staff/add-applicant', icon: Users },
  { name: 'Applications', href: '/staff/applications', icon: FileText },
  { name: 'Public Display', href: '/display', icon: Monitor },
  { name: 'Services', href: '/staff/services', icon: Building2 },
  { name: 'Analytics', href: '/staff/analytics', icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar animate-sweet-slide">
      <div className="sidebar-logo animate-sweet-fade staggered-1">
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, #0056b3 100%)', 
          color: 'white', 
          width: '36px', 
          height: '36px', 
          borderRadius: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 122, 255, 0.3)'
        }}>
          <Ticket size={20} />
        </div>
        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--foreground)', letterSpacing: '-0.5px' }}>EmbassyFlow</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`nav-link ${isActive ? 'active' : ''} animate-sweet-slide staggered-${index + 2}`}
              style={{ padding: '0.65rem 0.85rem' }}
            >
              <Icon size={18} />
              <span style={{ fontSize: '0.85rem' }}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer animate-sweet-fade staggered-5">
        <Link href="/staff/settings" className="nav-link" style={{ padding: '0.65rem 0.85rem' }}>
          <Settings size={18} />
          <span style={{ fontSize: '0.85rem' }}>Settings</span>
        </Link>
        <Link href="/" className="nav-link" style={{ color: 'var(--danger)', padding: '0.65rem 0.85rem' }}>
          <LogOut size={18} />
          <span style={{ fontSize: '0.85rem' }}>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}
