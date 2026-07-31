import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollObserver from '../../components/ScrollObserver';
import FloatingCTA from '../../components/FloatingCTA';
import WhatsAppButton from '../../components/WhatsAppButton';
import ScrollToTop from '../../components/ScrollToTop';
import { WhatsAppGateProvider } from '../../components/WhatsAppGateProvider';
import { prisma } from '../../lib/prisma';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const mainServices = await prisma.service.findMany({
    where: { isActive: true, type: 'MAIN' },
    orderBy: { displayOrder: 'asc' },
    select: { id: true, icon: true, name: true, slug: true },
  });

  return (
    <WhatsAppGateProvider>
      <div className="bg-base text-soft-white antialiased">
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none fixed inset-0 opacity-40 bg-grid-dots" aria-hidden="true" />
            <div className="pointer-events-none fixed inset-0 bg-noise-texture opacity-10 mix-blend-screen" aria-hidden="true" />
            <div className="relative z-10">
              <Header initialServices={mainServices.filter(s => !s.name.toLowerCase().includes('wedding'))} />
              <main style={{ minHeight: '100vh' }}>
                {children}
              </main>
              <Footer />
            </div>
          </div>
          <FloatingCTA />
          <WhatsAppButton />
          <ScrollObserver />
          <ScrollToTop />
      </div>
    </WhatsAppGateProvider>
  );
}
