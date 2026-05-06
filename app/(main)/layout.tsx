import RecaptchaProvider from '../../components/RecaptchaProvider';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollObserver from '../../components/ScrollObserver';
import FloatingCTA from '../../components/FloatingCTA';
import WhatsAppButton from '../../components/WhatsAppButton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecaptchaProvider>
      <div className="bg-base text-soft-white antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none fixed inset-0 opacity-40 bg-grid-dots" aria-hidden="true" />
          <div className="pointer-events-none fixed inset-0 bg-noise-texture opacity-10 mix-blend-screen" aria-hidden="true" />
          <div className="relative z-10">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
        <FloatingCTA />
        <WhatsAppButton />
        <ScrollObserver />
      </div>
    </RecaptchaProvider>
  );
}
