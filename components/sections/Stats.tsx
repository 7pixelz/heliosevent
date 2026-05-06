export default function Stats() {
  return (
    <section className="stats">
      <div className="stats-title fade-up">Numbers That Tell Our Story</div>
      <div className="stats-inner">
        <div className="stat-item fade-up"><div className="stat-num">750+</div><div className="stat-label">Events</div></div>
        <div className="stat-item fade-up" style={{ transitionDelay: '.1s' }}><div className="stat-num">900+</div><div className="stat-label">Happy Customers</div></div>
        <div className="stat-item fade-up" style={{ transitionDelay: '.2s' }}><div className="stat-num">20+</div><div className="stat-label">Years of Service</div></div>
        <div className="stat-item fade-up" style={{ transitionDelay: '.3s' }}><div className="stat-num">50+</div><div className="stat-label">Events Venue</div></div>
      </div>
    </section>
  );
}
