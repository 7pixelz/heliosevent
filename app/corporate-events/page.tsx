'use client'

import { useEffect, useState } from 'react'

export default function CorporateEvents() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<number | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(el => {
          if (el.isIntersecting) el.target.classList.add('vis')
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el))
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const toggleFaq = (index: number) => {
    setActiveTab(activeTab === index ? null : index)
  }

  const faqItems = [
    {
      q: 'How does Helios create unique, immersive experiences for corporate events in Chennai?',
      a: "We go beyond basic event setups by blending creative concepts with technology — like interactive LED installations, AR/VR zones, dynamic stage designs, and themed décor. Our goal is to turn every event into a brand story your guests live and remember, whether it's in Chennai or elsewhere.",
    },
    {
      q: 'What is the typical timeline to plan a large-scale corporate event in Chennai?',
      a: 'While timelines can vary, we generally recommend a 2-3 month lead time for conferences and award nights. For exhibitions and large-scale multi-day events, a 4-6 month window allows optimal planning, custom fabrication, and flawless execution in Chennai or any other location.',
    },
    {
      q: 'Do you handle government protocol or high-security events in Chennai?',
      a: 'Yes, Helios has extensive experience managing high-profile events with government dignitaries, requiring strict protocols and security clearances. We coordinate with local authorities in Chennai to ensure all compliance and safety measures are in place.',
    },
    {
      q: 'How does Helios ensure brand consistency in corporate events in Chennai?',
      a: 'We work closely with your marketing and branding teams to align every element — from stage design and collateral to digital screens and delegate kits — ensuring your brand story is communicated consistently and memorably at your Chennai event.',
    },
    {
      q: 'What types of corporate events do you specialise in Chennai?',
      a: 'At Helios Event Productions, we specialise in a wide range of corporate events including conferences, dealer meets, award ceremonies, product launches, MICE events, and trade shows in Chennai. We also execute large-scale entertainment acts and unique themed experiences tailored to your brand.',
    },
    {
      q: 'Can Helios manage end-to-end event planning and execution in Chennai?',
      a: 'Absolutely. From conceptualisation, venue sourcing, stage & technical setups, to guest management and post-event reporting — we provide comprehensive turnkey solutions, ensuring your event in Chennai is seamless and impactful.',
    },
  ]

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <img
            src="/assets/heliosevent_logo_white.webp"
            alt="Helios Event Productions"
            style={{ height: '56px', width: 'auto' }}
          />
        </div>
        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="/" onClick={closeMobileMenu}>
              Home
            </a>
          </li>
          <li>
            <a href="#" className="active" onClick={closeMobileMenu}>
              Services
            </a>
          </li>
          <li>
            <a href="/#portfolio" onClick={closeMobileMenu}>
              Portfolio
            </a>
          </li>
          <li>
            <a href="/#contact" onClick={closeMobileMenu}>
              Contact
            </a>
          </li>
          <li className="mobile-cta">
            <button className="nav-btn" onClick={closeMobileMenu}>
              Plan Your Event
            </button>
          </li>
        </ul>
        <button className="nav-btn hide-mobile">Plan Your Event</button>
        <button className="hamburger" onClick={toggleMobileMenu}>
          <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`ham-line ${mobileMenuOpen ? 'active' : ''}`}></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero" style={{ minHeight: '92vh' }}>
        <div className="hero-bg"></div>
        <div className="hero-beams">
          <div className="beam b1"></div>
          <div className="beam b2"></div>
          <div className="beam b3"></div>
          <div className="beam b4"></div>
          <div className="beam b5"></div>
        </div>
        <div className="hero-shade"></div>
        <div className="hero-breadcrumb">
          <a href="/">Home</a>
          <span className="sep">/</span>
          <a href="#">Services</a>
          <span className="sep">/</span>
          <span className="cur">Corporate Events</span>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Corporate <span className="ac">Events</span> Done Right.
          </h1>
          <p className="hero-desc">
            From high-stakes product launches to immersive employee engagement
            programs — we craft corporate experiences that align with your
            brand, energise your people, and leave lasting impressions.
          </p>
          <div className="hero-btns">
            <button
              className="btn-cta"
              onClick={() =>
                document
                  .getElementById('contact')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Get a Custom Quote
            </button>
            <button
              className="btn-ghost"
              onClick={() =>
                document
                  .getElementById('portfolio')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              View Our Work
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <video autoPlay muted loop playsInline className="hero-video">
            <source
              src="/assets/videos/HYUNDAI_Partnership.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="hero-stats">
          <div className="h-stat">
            <div className="h-stat-n">750+</div>
            <div className="h-stat-l">Events</div>
          </div>
          <div className="h-stat">
            <div className="h-stat-n">900+</div>
            <div className="h-stat-l">Happy Customers</div>
          </div>
          <div className="h-stat">
            <div className="h-stat-n">20+</div>
            <div className="h-stat-l">Years of Service</div>
          </div>
          <div className="h-stat">
            <div className="h-stat-n">50+</div>
            <div className="h-stat-l">Events Venue</div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="overview" id="overview">
        <div className="ov-inner">
          <div className="ov-text fade-up">
            <div className="sec-label">What We Do</div>
            <h2 className="sec-title">
              Chennai's Most Trusted Corporate Event Partner
            </h2>
            <p>
              Helios Event Productions specialises in creating{' '}
              <b>high-impact corporate experiences</b> that resonate with your
              audience. Whether it's a boardroom strategy offsite or a
              3,000-person national conference, we bring the same obsessive
              attention to detail.
            </p>
            <p>
              We've delivered events for{' '}
              <b>MRF, Philips, TCS, Royal Enfield, Adani</b> and 200+ other
              brands. Our in-house team handles everything — concept, creative,
              production, logistics, and on-ground execution.
            </p>
          </div>
          <div className="ov-cards fade-up" style={{ transitionDelay: '.15s' }}>
            <div className="ovc">
              <span className="ovc-icon">🎯</span>
              <div className="ovc-title">Strategic Concept</div>
              <div className="ovc-desc">
                Every event starts with your objectives. We build backwards from
                outcomes.
              </div>
            </div>
            <div className="ovc orange">
              <span className="ovc-icon">🎬</span>
              <div className="ovc-title">End-to-End Production</div>
              <div className="ovc-desc">
                Venue, AV, décor, catering, entertainment — all under one roof.
              </div>
            </div>
            <div className="ovc">
              <span className="ovc-icon">📐</span>
              <div className="ovc-title">Custom Creative</div>
              <div className="ovc-desc">
                No templates. Every design, stage, and experience is built for
                your brand.
              </div>
            </div>
            <div className="ovc">
              <span className="ovc-icon">✅</span>
              <div className="ovc-title">Flawless Execution</div>
              <div className="ovc-desc">
                On-ground teams ensure zero surprises on event day.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT TYPES */}
      <section className="event-types" id="event-types">
        <div className="et-inner">
          <div className="et-header fade-up">
            <div className="sec-label cl">Corporate Event Types</div>
            <h2 className="sec-title">Events We Deliver Under Corporate</h2>
            <p>
              Each format is a specialisation — built from years of execution
              experience and a deep understanding of what makes corporate
              audiences engage.
            </p>
          </div>
          <div className="et-grid">
            {[
              {
                num: '01',
                title: 'Employee Engagement',
                desc: 'Annual days, town halls, team-building events, and cultural programs that unite and energise your workforce at any scale.',
              },
              {
                num: '02',
                title: 'Seminars & Conferences',
                desc: 'End-to-end conference management — from multi-track summits to intimate leadership roundtables and industry forums.',
              },
              {
                num: '03',
                title: 'Brand & Product Launches',
                desc: 'Create maximum buzz — from press-ready unveilings to large-scale consumer activations that put your product centre stage.',
              },
              {
                num: '04',
                title: 'Dealer & Channel Partner Meet',
                desc: 'Celebrate and motivate your partner network with high-energy meets that strengthen loyalty and drive business results.',
              },
              {
                num: '05',
                title: 'Press Meets',
                desc: 'Strategically designed media events that command attention and generate the right headlines for your brand story.',
              },
              {
                num: '06',
                title: 'BTL Activations',
                desc: 'Below-the-line activations that forge direct, tangible connections between your brand and your target audience on the ground.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="et-card fade-up"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="et-thumb">
                  <div
                    className="et-placeholder"
                    style={{
                      background: `linear-gradient(135deg, rgba(13,16,37,.5), rgba(26,13,58,.5))`,
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255,255,255,.2)',
                        fontSize: '48px',
                        fontWeight: 'bold',
                      }}
                    >
                      ●
                    </span>
                  </div>
                  <div className="et-thumb-overlay"></div>
                  <span className="et-badge">{item.num}</span>
                </div>
                <div className="et-body">
                  <div className="et-title">{item.title}</div>
                  <div className="et-desc">{item.desc}</div>
                  <a href="#" className="et-explore">
                    Explore <span className="et-arrow">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process" id="process">
        <div className="process-inner">
          <div className="process-header fade-up">
            <div className="sec-label cl">How We Work</div>
            <h2 className="sec-title">Our Proven 5-Step Process</h2>
          </div>
          <div className="steps">
            {[
              {
                num: '01',
                icon: '💬',
                title: 'Discovery Call',
                desc: 'We learn your goals, audience, budget, and brand vision.',
              },
              {
                num: '02',
                icon: '✏️',
                title: 'Concept & Design',
                desc: 'Custom event blueprint built for your objectives and brand identity.',
              },
              {
                num: '03',
                icon: '🏗️',
                title: 'Production',
                desc: 'Venue, AV, stage, décor, and vendor coordination — fully managed.',
              },
              {
                num: '04',
                icon: '🎤',
                title: 'Event Day',
                desc: 'On-ground team ensures flawless execution from setup to close.',
              },
              {
                num: '05',
                icon: '📊',
                title: 'Post-Event Report',
                desc: 'Detailed debrief with highlights, metrics, and learnings.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="step fade-up"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="step-circle">{step.num}</div>
                <span className="step-icon">{step.icon}</span>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery" id="portfolio">
        <div className="gallery-inner">
          <div className="gallery-header fade-up">
            <div className="sec-label">Our Portfolio</div>
            <h2 className="sec-title">Moments That Made Every Event Special</h2>
          </div>
          <div className="gallery-grid">
            <div className="gi tall fade-up">
              <div
                className="gi-bg g1"
                style={{
                  background: 'linear-gradient(135deg,#0d1025,#1a0d3a)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,.15)',
                    fontSize: '72px',
                  }}
                >
                  ●
                </div>
              </div>
              <div className="gi-bar"></div>
              <div className="gi-overlay"></div>
              <div className="gi-info">
                <div className="gi-title">
                  Annual Employee Day — Philips India
                </div>
                <a href="#" className="gi-link">
                  View Project <span className="gi-arr">→</span>
                </a>
              </div>
            </div>

            <div className="gi fade-up" style={{ transitionDelay: '.08s' }}>
              <div
                className="gi-bg g2"
                style={{
                  background: 'linear-gradient(135deg,#101a0d,#1a3010)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,.15)',
                    fontSize: '72px',
                  }}
                >
                  ●
                </div>
              </div>
              <div className="gi-bar"></div>
              <div className="gi-overlay"></div>
              <div className="gi-info">
                <div className="gi-title">Leadership Summit — TCS India</div>
                <a href="#" className="gi-link">
                  View Project <span className="gi-arr">→</span>
                </a>
              </div>
            </div>

            <div className="gi fade-up" style={{ transitionDelay: '.14s' }}>
              <div
                className="gi-bg g3"
                style={{
                  background: 'linear-gradient(135deg,#1a0d00,#351a00)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,.15)',
                    fontSize: '72px',
                  }}
                >
                  ●
                </div>
              </div>
              <div className="gi-bar"></div>
              <div className="gi-overlay"></div>
              <div className="gi-info">
                <div className="gi-title">New Model Unveil — Royal Enfield</div>
                <a href="#" className="gi-link">
                  View Project <span className="gi-arr">→</span>
                </a>
              </div>
            </div>

            <div className="gi fade-up" style={{ transitionDelay: '.2s' }}>
              <div
                className="gi-bg g4"
                style={{
                  background: 'linear-gradient(135deg,#080d18,#0d1828)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,.15)',
                    fontSize: '72px',
                  }}
                >
                  ●
                </div>
              </div>
              <div className="gi-bar"></div>
              <div className="gi-overlay"></div>
              <div className="gi-info">
                <div className="gi-title">
                  Annual Partner Meet — Adani Group
                </div>
                <a href="#" className="gi-link">
                  View Project <span className="gi-arr">→</span>
                </a>
              </div>
            </div>

            <div className="gi fade-up" style={{ transitionDelay: '.26s' }}>
              <div
                className="gi-bg g5"
                style={{
                  background: 'linear-gradient(135deg,#100820,#200d35)',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,.15)',
                    fontSize: '72px',
                  }}
                >
                  ●
                </div>
              </div>
              <div className="gi-bar"></div>
              <div className="gi-overlay"></div>
              <div className="gi-info">
                <div className="gi-title">Pan-India Activation — MRF Tyres</div>
                <a href="#" className="gi-link">
                  View Project <span className="gi-arr">→</span>
                </a>
              </div>
            </div>
          </div>
          <div className="gallery-more fade-up">
            <button className="btn-cta">View All Corporate Projects →</button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" id="testimonials">
        <div className="testi-inner">
          <div className="testi-header fade-up">
            <div className="sec-label cl">Client Stories</div>
            <h2 className="sec-title">Hear It Straight From Our Clients</h2>
          </div>
          <div className="testi-grid">
            {[
              {
                q: 'Thanks for all your support for the huge success of the South Hub Event. Everyone appreciated the stage setup and the evening lawn setup. Feedback from participants is really good — thank you once again.',
                av: 'C',
                name: 'Mr. Christopher',
                role: 'Marriott Hotel, Chennai',
                brand: 'Airtel',
              },
              {
                q: 'We had the factory inauguration done by Helios Event Productions and we are very satisfied. We expect we will have more interactions with them in the future.',
                av: 'B',
                name: 'Mr. Babu',
                role: 'Country Head',
                brand: 'Hydra Specma',
              },
              {
                q: 'Helios Event Productions did an incredible job building the Tamil Nadu State Pavilion for Med Tech Expo. They were efficient and supportive, even meeting tight deadlines. The pavilion has been a huge hit! Thanks, Helios!',
                av: 'C',
                name: 'Mr. Chidambaram',
                role: 'Marcom',
                brand: 'SIPCOT',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="tc fade-up"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="tc-q">"</div>
                <p className="tc-text">{t.q}</p>
                <div className="tc-author">
                  <div className="tc-av">{t.av}</div>
                  <div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-role">{t.role}</div>
                    <span className="tc-brand">{t.brand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="faq-inner">
          <div className="faq-header fade-up">
            <div className="sec-label cl">FAQs</div>
            <h2 className="sec-title">Frequently Asked Questions</h2>
          </div>
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${activeTab === i ? 'open' : ''}`}
            >
              <button className="faq-btn" onClick={() => toggleFaq(i)}>
                <span className="faq-btn-text">{item.q}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-ans">
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact" id="contact">
        <div className="contact-inner">
          <div className="contact-left fade-up">
            <div className="sec-label">Let's Talk</div>
            <h2 className="sec-title">
              Ready to Plan Your Next Corporate Event?
            </h2>
            <p>
              Tell us about your event. Our team will respond within 24 hours
              with a custom proposal tailored to your objectives.
            </p>
            <div className="cinfo">
              <div className="ci">
                <div className="ci-icon">📍</div>
                <div>
                  <div className="ci-lbl">Location</div>
                  <div className="ci-val">
                    26, Judge Jambulingam Road, Mylapore, Chennai, Tamil Nadu
                  </div>
                </div>
              </div>
              <div className="ci">
                <div className="ci-icon">📞</div>
                <div>
                  <div className="ci-lbl">Phone</div>
                  <div className="ci-val">+91 98765 43210</div>
                </div>
              </div>
              <div className="ci">
                <div className="ci-icon">✉️</div>
                <div>
                  <div className="ci-lbl">Email</div>
                  <div className="ci-val">plan@heliosevent.co</div>
                </div>
              </div>
            </div>
          </div>
          <div className="cform fade-up" style={{ transitionDelay: '.15s' }}>
            <div className="cform-intro">
              <h3>Quick Enquiry</h3>
              <p>Drop your details and we'll call you back within 24 hours.</p>
            </div>
            <div className="form-row">
              <div className="fg">
                <label>Your Name *</label>
                <input type="text" placeholder="e.g. Arun Kumar" />
              </div>
              <div className="fg">
                <label>Phone Number *</label>
                <input type="tel" placeholder="+91 98765 43210" />
              </div>
            </div>
            <button className="fsub">Get a Free Consultation →</button>
          </div>
        </div>
      </section>

      {/* FOOTER — REUSED FROM HOMEPAGE */}
      <footer>
        <div className="footer-grid">
          <div>
            <img
              src="/assets/heliosevent_logo_white.webp"
              alt="Helios Event"
              style={{ height: '60px', width: 'auto' }}
            />
            <p className="fb-desc">
              Chennai's leading premium event production agency. Cinematic
              experiences for global brands and private clients.
            </p>
            <div className="socials">
              <div className="soc">f</div>
              <div className="soc">in</div>
              <div className="soc">yt</div>
            </div>
          </div>
          <div>
            <div className="fc-title">Quick Links</div>
            <ul className="flinks">
              <li>
                <a href="/">About</a>
              </li>
              <li>
                <a href="/#portfolio">Our Portfolio</a>
              </li>
              <li>
                <a href="/#testimonials">Client Stories</a>
              </li>
              <li>
                <a href="#">Become a Vendor</a>
              </li>
              <li>
                <a href="#">Career Openings</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="fc-title">Our Services</div>
            <ul className="flinks">
              <li>
                <a href="/corporate-events">Corporate Events</a>
              </li>
              <li>
                <a href="#">Wedding Design</a>
              </li>
              <li>
                <a href="#">Exhibition Stands</a>
              </li>
              <li>
                <a href="#">Live Entertainment</a>
              </li>
              <li>
                <a href="#">MICE Management</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="fc-title">Get In Touch</div>
            <div className="fci">
              <div className="fci-icon">📍</div>
              <div className="fci-text">
                26, Judge Jambulingam Road, Mylapore, Chennai, Tamil Nadu
              </div>
            </div>
            <div className="fci">
              <div className="fci-icon">📞</div>
              <div className="fci-text">+91 98765 43210</div>
            </div>
            <div className="fci">
              <div className="fci-icon">✉️</div>
              <div className="fci-text">plan@heliosevent.co</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="fcopy">
            © 2026 Helios Event Productions. All Rights Reserved.
          </div>
          <div className="flegal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  )
}
