import Image from 'next/image';
import Link from 'next/link';
import WhatsAppSocialLink from './WhatsAppSocialLink';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Image src="/assets/heliosevent_logo_white.webp" alt="Helios Event" width={220} height={60} sizes="(max-width:640px) 160px, 220px" style={{ height: '60px', width: 'auto' }} />
          <p className="fb-desc">Chennai's leading premium event production agency. Cinematic experiences for global brands and private clients.</p>
          <div className="socials">
            {/* Facebook */}
            <a className="soc" href="https://www.facebook.com/helioseventproductions/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* LinkedIn */}
            <a className="soc" href="https://www.linkedin.com/company/heliosevent/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            {/* Instagram */}
            <a className="soc" href="https://www.instagram.com/heliosevent/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
            </a>
            {/* WhatsApp */}
            <WhatsAppSocialLink />
          </div>
        </div>
        <div>
          <div className="fc-title">Quick Links</div>
          <ul className="flinks">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/portfolio">Our Portfolio</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/get-quote">Get a Quote</Link></li>
          </ul>
        </div>
        <div>
          <div className="fc-title">Our Services</div>
          <ul className="flinks">
            <li><Link href="/corporate-event-management-in-chennai">Corporate Events</Link></li>
            <li><Link href="/entertainment-event-organizer-in-chennai">Entertainment Events</Link></li>
            <li><Link href="/exhibition-organizer-in-chennai">Exhibitions</Link></li>
            <li><Link href="/government-events-planner-in-chennai">Government Protocol Events</Link></li>
            <li><Link href="/business-meeting-organizer-in-chennai">MICE Events</Link></li>
            <li><Link href="/sports-event-management-company-in-chennai">Sports Events</Link></li>
            <li><a href="https://www.nakshatrawedding.com/" target="_blank" rel="noopener noreferrer nofollow">Wedding &amp; Social Events</a></li>
            <li><Link href="/virtual-hybrid-event-management-in-chennai">Virtual &amp; Hybrid Events</Link></li>
            <li><Link href="/gen-z-centric-event-management-in-chennai">Gen Z-Centric Events</Link></li>
          </ul>
        </div>
        <div>
          <div className="fc-title">Get In Touch</div>
          <div className="fci"><div className="fci-icon">📍</div><div className="fci-text">28, Judge Jambulingam Road, Mylapore, Chennai – 600 004</div></div>
          <div className="fci"><div className="fci-icon">📞</div><div className="fci-text"><a href="tel:+917401030000" style={{ color: 'inherit', textDecoration: 'none' }}>+91 74010 30000</a></div></div>
          <div className="fci"><div className="fci-icon">✉️</div><div className="fci-text"><a href="mailto:plan@heliosevent.net" style={{ color: 'inherit', textDecoration: 'none' }}>plan@heliosevent.net</a></div></div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="fcopy">© 2026 Helios Event Productions. All Rights Reserved.</div>
        <div className="flegal"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
      </div>
    </footer>
  );
}
