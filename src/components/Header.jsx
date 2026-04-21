import React from 'react';
import { COMPANY, STEPS } from '../data/appData';

export default function Header({ currentStep, completedSteps, periodLocked }) {
  const completionPct = Math.round((completedSteps.length / STEPS.length) * 100);

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)',
      borderBottom: '1px solid #30363D',
      padding: '0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)'
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 28px',
        borderBottom: '1px solid #21262D'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #1B6B2F, #2E7D32)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 700, color: '#fff',
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 0 12px rgba(27,107,47,0.5)'
          }}>R2R</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#E6EDF3', letterSpacing: '0.02em' }}>
              SAP R2R Financial Close Simulator
            </div>
            <div style={{ fontSize: '11px', color: '#8B949E', fontFamily: 'var(--font-mono)', marginTop: '1px' }}>
              {COMPANY.name} &nbsp;·&nbsp; {COMPANY.code} &nbsp;·&nbsp; FY {COMPANY.fiscalYear}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Period badge */}
          <div style={{
            padding: '5px 12px',
            background: '#21262D',
            border: '1px solid #30363D',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#8B949E',
            fontFamily: 'var(--font-mono)'
          }}>
            Period: <span style={{ color: '#E6EDF3', fontWeight: 600 }}>{COMPANY.period}</span>
          </div>

          {/* Lock status */}
          <div style={{
            padding: '5px 12px',
            background: periodLocked ? 'rgba(220,38,38,0.15)' : 'rgba(59,130,246,0.12)',
            border: `1px solid ${periodLocked ? '#DC2626' : '#1D4ED8'}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: periodLocked ? '#F87171' : '#60A5FA',
            display: 'flex', alignItems: 'center', gap: '5px'
          }}>
            <span>{periodLocked ? '🔒' : '🔓'}</span>
            {periodLocked ? 'Period LOCKED' : 'Period OPEN'}
          </div>

          {/* Progress */}
          <div style={{
            padding: '5px 14px',
            background: completionPct === 100 ? 'rgba(27,107,47,0.2)' : '#21262D',
            border: `1px solid ${completionPct === 100 ? '#2E7D32' : '#30363D'}`,
            borderRadius: '6px',
            fontSize: '12px',
            color: completionPct === 100 ? '#4CAF50' : '#8B949E',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600
          }}>
            {completionPct}% Complete
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '3px', background: '#21262D', position: 'relative' }}>
        <div style={{
          height: '100%',
          width: `${completionPct}%`,
          background: 'linear-gradient(90deg, #1B6B2F, #4CAF50)',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 8px rgba(76,175,80,0.6)'
        }} />
      </div>
    </header>
  );
}
