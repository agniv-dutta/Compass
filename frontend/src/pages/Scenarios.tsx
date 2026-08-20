import React, { useState } from 'react';
import { Header } from '../components/Common/Header';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GlassCard } from '../components/Common/GlassCard';

const scenarios = [
  { title: 'Base case', detail: 'Current market consensus', impact: '+5.4%', tone: 'steady', confidence: '78%', action: 'Stage purchases across the next 60 days.', drivers: ['Stable LME aluminum pricing', 'Energy costs remain contained', 'Demand follows seasonal norms'] },
  { title: 'Supply squeeze', detail: 'Energy and freight costs rise', impact: '+12.8%', tone: 'risk', confidence: '64%', action: 'Bring forward 30-45 days of planned volume.', drivers: ['European smelter curtailments', 'Freight rates move above baseline', 'Bauxite supply becomes constrained'] },
  { title: 'Demand cooling', detail: 'Industrial demand softens', impact: '-3.1%', tone: 'relief', confidence: '59%', action: 'Hold discretionary volume and replenish closer to need.', drivers: ['Construction orders slow', 'Inventory coverage rises', 'Regional premiums compress'] },
];

type Scenario = (typeof scenarios)[number];

export const Scenarios: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Header title="Scenario planning" subtitle="Stress-test your next buying decision" />
        {!selectedScenario ? (
          <>
            <div className="scenario-intro"><p className="section-kicker">Decision room</p><h2>What changes if the market moves?</h2><p>Compare the signals behind each outlook before you commit budget or inventory.</p></div>
            <div className="scenario-grid">
              {scenarios.map((scenario) => (
                <GlassCard key={scenario.title} elevated className={`scenario-card ${scenario.tone}`}>
                  <p className="section-kicker">OUTLOOK</p><h3>{scenario.title}</h3><p>{scenario.detail}</p><strong>{scenario.impact}</strong>
                  <button type="button" onClick={() => setSelectedScenario(scenario)}>Review scenario <span>{'->'}</span></button>
                </GlassCard>
              ))}
            </div>
          </>
        ) : (
          <section className="scenario-detail" aria-live="polite">
            <button className="scenario-back" type="button" onClick={() => setSelectedScenario(null)}><span>{'<-'}</span> All scenarios</button>
            <div className={`scenario-detail-header ${selectedScenario.tone}`}><div><p className="section-kicker">Scenario review</p><h2>{selectedScenario.title}</h2><p>{selectedScenario.detail}</p></div><div className="scenario-impact"><span>Expected 6M impact</span><strong>{selectedScenario.impact}</strong></div></div>
            <div className="scenario-detail-grid">
              <GlassCard elevated><p className="section-kicker">Recommended move</p><h3>{selectedScenario.action}</h3><div className="scenario-confidence"><span>Model confidence</span><strong>{selectedScenario.confidence}</strong></div><div className="confidence-bar"><div className="confidence-fill" style={{ width: selectedScenario.confidence }} /></div></GlassCard>
              <GlassCard elevated><p className="section-kicker">Key market drivers</p><ul className="driver-list">{selectedScenario.drivers.map((driver) => <li key={driver}><span>+</span>{driver}</li>)}</ul></GlassCard>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};