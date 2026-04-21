import React from 'react';
import { STEPS } from '../data/appData';

const phaseColors = {
  'PRE-CLOSE': '#1D4ED8',
  'CLOSE EXECUTION': '#D97706',
  'REPORTING': '#1B6B2F'
};

export default function Sidebar({ currentStep, setCurrentStep, completedSteps }) {
  const phases = ['PRE-CLOSE', 'CLOSE EXECUTION', 'REPORTING'];

  return (
    <aside style={{
      width: '260px',
      minWidth: '260px',
      background: '#161B22',
      borderRight: '1px solid #30363D',
      padding: '20px 0',
      overflowY: 'auto',
      height: 'calc(100vh - 72px)',
      position: 'sticky',
      top: '72px'
    }}>
      <div style={{ padding: '0 16px 12px', fontSize: '10px', fontWeight: 700, color: '#484F58', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
        Close Checklist
      </div>

      {phases.map(phase => {
        const phaseSteps = STEPS.filter(s => s.phase === phase);
        return (
          <div key={phase} style={{ marginBottom: '8px' }}>
            <div style={{
              padding: '6px 16px',
              fontSize: '10px',
              fontWeight: 700,
              color: phaseColors[phase],
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{ height: '1px', flex: 1, background: phaseColors[phase], opacity: 0.3 }} />
              {phase}
              <div style={{ height: '1px', flex: 1, background: phaseColors[phase], opacity: 0.3 }} />
            </div>

            {phaseSteps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isDone = completedSteps.includes(step.id);
              const stepNum = STEPS.findIndex(s => s.id === step.id) + 1;

              return (
                <div
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    background: isActive ? '#1C2128' : 'transparent',
                    borderLeft: isActive ? `3px solid ${step.color}` : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#1C2128'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Step indicator */}
                  <div style={{
                    width: '22px',
                    height: '22px',
                    minWidth: '22px',
                    borderRadius: '50%',
                    background: isDone ? '#1B6B2F' : isActive ? step.color : '#21262D',
                    border: `1px solid ${isDone ? '#2E7D32' : isActive ? step.color : '#30363D'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: isDone || isActive ? '#fff' : '#8B949E',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isActive ? `0 0 8px ${step.color}60` : 'none',
                    transition: 'all 0.2s ease',
                    marginTop: '1px'
                  }}>
                    {isDone ? '✓' : stepNum}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#E6EDF3' : isDone ? '#4CAF50' : '#8B949E',
                      lineHeight: '1.4',
                      transition: 'color 0.2s'
                    }}>
                      {step.title}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: '#484F58',
                      fontFamily: 'var(--font-mono)',
                      marginTop: '2px'
                    }}>
                      {step.tcode}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Bottom info */}
      <div style={{
        margin: '20px 16px 0',
        padding: '12px',
        background: '#1C2128',
        borderRadius: '8px',
        border: '1px solid #30363D'
      }}>
        <div style={{ fontSize: '10px', color: '#484F58', fontFamily: 'var(--font-mono)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Progress
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: '#E6EDF3', fontFamily: 'var(--font-mono)' }}>
          {completedSteps.length}<span style={{ fontSize: '14px', color: '#484F58' }}>/{STEPS.length}</span>
        </div>
        <div style={{ marginTop: '8px', height: '4px', background: '#21262D', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(completedSteps.length / STEPS.length) * 100}%`,
            background: 'linear-gradient(90deg, #1B6B2F, #4CAF50)',
            borderRadius: '2px',
            transition: 'width 0.4s ease'
          }} />
        </div>
        <div style={{ fontSize: '10px', color: '#8B949E', marginTop: '4px' }}>Steps completed</div>
      </div>
    </aside>
  );
}
