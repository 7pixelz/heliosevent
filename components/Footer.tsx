export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <img src="/assets/heliosevent_logo_white.webp" alt="Helios Event" style={{ height: '60px', width: 'auto' }} />
          <p className="fb-desc">Chennai's leading premium event production agency. Cinematic experiences for global brands and private clients.</p>
          <div className="socials">
            {/* Facebook */}
            <a className="soc" href="https://www.facebook.com/helioseventproductions/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* LinkedIn */}
            <a className="soc" href="https://www.linkedin.com/company/helios-event/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            {/* Instagram */}
            <a className="soc" href="https://www.instagram.com/heliosevent/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>
            </a>
            {/* WhatsApp */}
            <a className="soc" href="https://wa.me/917401030000?text=Hi%2C%20Website%20Enquiry" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.054 23.454a.75.75 0 0 0 .918.919l5.7-1.493A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.697 9.697 0 0 1-4.964-1.362l-.355-.212-3.684.965.984-3.595-.232-.371A9.697 9.697 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <div className="fc-title">Quick Links</div>
          <ul className="flinks">
            <li><a href="/about">About Us</a></li>
            <li><a href="/portfolio">Our Portfolio</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/get-quote">Get a Quote</a></li>
          </ul>
        </div>
        <div>
          <div className="fc-title">Our Services</div>
          <ul className="flinks">
            <li><a href="/services/corporate-event-management-in-chennai">Corporate Events</a></li>
            <li><a href="/services/entertainment-event-organizer-in-chennai">Entertainment Events</a></li>
            <li><a href="/services/exhibition-organizer-in-chennai">Exhibitions</a></li>
            <li><a href="/services/government-events-planner-in-chennai">Government Protocol Events</a></li>
            <li><a href="/services/business-meeting-organizer-in-chennai">MICE Events</a></li>
            <li><a href="/services/sports-event-management-company-in-chennai">Sports Events</a></li>
            <li><a href="/services/wedding-event-planner-in-chennai">Wedding &amp; Social Events</a></li>
            <li><a href="/services/virtual-hybrid-event-management-in-chennai">Virtual &amp; Hybrid Events</a></li>
            <li><a href="/services/gen-z-centric-event-management-in-chennai">Gen Z-Centric Events</a></li>
          </ul>
        </div>
        <div>
          <div className="fc-title">Get In Touch</div>
          <div className="fci"><div className="fci-icon">📍</div><div className="fci-text">28, Judge Jubilee Hills Road, Jagadambal Colony, Mylapore, Chennai – 600 004</div></div>
          <div className="fci"><div className="fci-icon">📞</div><div className="fci-text"><a href="tel:+917401030000" style={{ color: 'inherit', textDecoration: 'none' }}>+91 7401 030 000</a></div></div>
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
