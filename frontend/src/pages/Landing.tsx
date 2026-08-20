import React from 'react';
import './Landing.css';

interface LandingProps {
  onOpenWorkspace: () => void;
}

const signalRows = [
  { name: 'Aluminum', value: '2,847', change: '+5.48%', tone: 'up' },
  { name: 'PVC', value: '64.20', change: '+9.44%', tone: 'watch' },
  { name: 'Copper', value: '8,412', change: '-1.20%', tone: 'down' },
];

export const Landing: React.FC<LandingProps> = ({ onOpenWorkspace }) => {
  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Main navigation">
        <button className="brand-mark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-symbol">+</span>
          <span>compass</span>
        </button>
        <div className="landing-links">
          <a href="#method">Methodology</a>
          <a href="#signals">Signals</a>
          <button className="nav-cta" onClick={onOpenWorkspace}>Open workspace <span>{'->'}</span></button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse-dot" /> Procurement intelligence, in focus</p>
          <h1>Buy with the<br /><em>market</em> ahead of you.</h1>
          <p className="hero-description">
            Compass turns volatile commodity markets into clear, confident buying decisions.
            See what is moving, why it matters, and when to act.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onOpenWorkspace}>Explore the workspace <span>{'->'}</span></button>
            <a className="text-link" href="#method">See how it works <span>v</span></a>
          </div>
          <div className="hero-proof">
            <div><strong>92%</strong><span>forecast confidence</span></div>
            <div><strong>6 mo</strong><span>forward visibility</span></div>
            <div><strong>24/7</strong><span>market pulse</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Compass forecast preview">
          <div className="visual-topline"><span>MARKET PULSE / 08:42 UTC</span><span className="live-label">LIVE <i /></span></div>
          <div className="visual-heading"><div><span className="mini-label">PORTFOLIO OUTLOOK</span><h2>Materials are trending higher</h2></div><span className="period">6M</span></div>
          <div className="chart-area">
            <div className="chart-gridline line-one" /><div className="chart-gridline line-two" /><div className="chart-gridline line-three" />
            <svg viewBox="0 0 520 180" role="img" aria-label="Upward price trend chart" preserveAspectRatio="none">
              <path className="chart-fill" d="M0 150 C60 145 70 120 120 132 S190 104 235 118 S300 70 350 90 S420 50 470 62 S500 35 520 42 V180 H0 Z" />
              <path className="chart-line" d="M0 150 C60 145 70 120 120 132 S190 104 235 118 S300 70 350 90 S420 50 470 62 S500 35 520 42" />
              <circle cx="520" cy="42" r="5" className="chart-point" />
            </svg>
            <div className="chart-axis"><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span></div>
          </div>
          <div className="signal-table" id="signals">
            <div className="table-heading"><span>COMMODITY</span><span>SPOT</span><span>OUTLOOK</span></div>
            {signalRows.map((row) => <div className="signal-row" key={row.name}><span>{row.name}</span><strong>{row.value}</strong><span className={`signal-change ${row.tone}`}>{row.change}</span></div>)}
          </div>
          <div className="visual-note"><span className="note-icon">!</span><span>Aluminum: consider buying before next quarter</span><b>85%</b></div>
        </div>
      </section>

      <section className="landing-strip" id="method">
        <p>One clear view of the forces shaping your next purchase.</p>
        <div><span>01</span>Track the market <span>02</span>Understand the drivers <span>03</span>Act at the right moment</div>
      </section>
    </main>
  );
};