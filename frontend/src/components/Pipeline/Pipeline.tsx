import React from 'react';
import { GlassCard } from '../Common/GlassCard';
import './Pipeline.css';

interface PipelineStage {
  id: string;
  label: string;
  sublabel: string;
  status: 'completed' | 'active' | 'pending';
  timestamp?: string;
  icon: string;
}

const stages: PipelineStage[] = [
  { id: 'ingest', label: 'Data Ingestion', sublabel: 'Market feeds & APIs', status: 'completed', timestamp: '2 min ago', icon: '\u21BB' },
  { id: 'features', label: 'Feature Engineering', sublabel: '5 indicators processed', status: 'completed', timestamp: '1 min ago', icon: '\u2699' },
  { id: 'model', label: 'Model Training', sublabel: 'XGBoost ensemble', status: 'completed', timestamp: '45s ago', icon: '\u2618' },
  { id: 'forecast', label: 'Forecast Generation', sublabel: '6-month horizon', status: 'active', timestamp: 'Live', icon: '\u25B6' },
  { id: 'signal', label: 'Signal Classification', sublabel: 'Buy / Hold / Wait', status: 'pending', icon: '\u25C6' },
  { id: 'action', label: 'Procurement Action', sublabel: 'Approve & execute', status: 'pending', icon: '\u2713' },
];

export const ProcurementPipeline: React.FC = () => {
  return (
    <GlassCard elevated>
      <div className="pipeline-panel">
        <div className="pipeline-header">
          <p className="section-kicker">System Status</p>
          <h3 style={{ margin: '4px 0 0', fontSize: '1rem', fontWeight: 600, color: '#f5f1e8' }}>
            Procurement Pipeline
          </h3>
        </div>

        <div className="pipeline-flow">
          {stages.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              <div className={`pipeline-node ${stage.status}`}>
                <div className="node-icon">
                  <span>{stage.icon}</span>
                </div>
                <div className="node-content">
                  <span className="node-label">{stage.label}</span>
                  <span className="node-sublabel">{stage.sublabel}</span>
                  {stage.timestamp && (
                    <span className={`node-timestamp ${stage.status === 'active' ? 'live' : ''}`}>
                      {stage.status === 'active' && <span className="live-dot" />}
                      {stage.timestamp}
                    </span>
                  )}
                </div>
              </div>
              {idx < stages.length - 1 && (
                <div className={`pipeline-connector ${stage.status === 'completed' ? 'completed' : ''}`}>
                  <div className="connector-line" />
                  <div className="connector-arrow" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
