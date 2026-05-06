import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '../../lib/auth';
import AdminSidebar from '../../components/admin/AdminSidebar';

export const metadata = { title: 'Helios Admin' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) return <>{children}</>;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '240px 1fr',
      minHeight: '100vh',
      fontFamily: "'Inter',sans-serif",
    }}>
      <AdminSidebar user={user} />
      <main style={{
        background: '#f5f6fa',
        padding: '32px',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}>
        {children}
      </main>
    </div>
  );
}
