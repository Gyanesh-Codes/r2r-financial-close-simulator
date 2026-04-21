import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import JournalEntry from './components/JournalEntry';
import { GRIRClearance, FXRevaluation, DepreciationRun, CostAllocation } from './components/Steps2345';
import { PeriodLock, FinancialStatements } from './components/Steps67';
import { STEPS, INITIAL_GL_BALANCES, COMPANY } from './data/appData';

const stepDescriptions = {
  1: { phase: 'PRE-CLOSE', tcode: 'FB50 / F-02' },
  2: { phase: 'PRE-CLOSE', tcode: 'MR11 / F-44' },
  3: { phase: 'PRE-CLOSE', tcode: 'FAGL_FC_VAL' },
  4: { phase: 'CLOSE EXECUTION', tcode: 'AFAB' },
  5: { phase: 'CLOSE EXECUTION', tcode: 'KSU5 / KSV5' },
  6: { phase: 'CLOSE EXECUTION', tcode: 'OB52' },
  7: { phase: 'REPORTING', tcode: 'S_ALR_87012284' },
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [glBalances, setGlBalances] = useState({ ...INITIAL_GL_BALANCES });
  const [periodLocked, setPeriodLocked] = useState(false);

  const markComplete = (stepId) => {
    setCompletedSteps(prev => prev.includes(stepId) ? prev : [...prev, stepId]);
  };

  const stepData = STEPS.find(s => s.id === currentStep);
  const isCompleted = completedSteps.includes(currentStep);

  const renderStep = () => {
    const props = { glBalances, setGlBalances, onComplete: () => markComplete(currentStep), isCompleted, completedSteps };
    switch (currentStep) {
      case 1: return <JournalEntry {...props} />;
      case 2: return <GRIRClearance {...props} />;
      case 3: return <FXRevaluation {...props} />;
      case 4: return <DepreciationRun {...props} />;
      case 5: return <CostAllocation {...props} />;
      case 6: return <PeriodLock {...props} periodLocked={periodLocked} setPeriodLocked={setPeriodLocked} />;
      case 7: return <FinancialStatements {...props} />;
      default: return null;
    }
  };

  const allDone = completedSteps.length === STEPS.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header currentStep={currentStep} completedSteps={completedSteps} periodLocked={periodLocked} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar currentStep={currentStep} setCurrentStep={setCurrentStep} completedSteps={completedSteps} />

        {/* Main content */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', maxHeight: 'calc(100vh - 72px)' }}>

          {/* Step header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: stepData.color, background: `${stepData.color}18`,
                padding: '3px 10px', borderRadius: '4px', border: `1px solid ${stepData.color}40`,
                fontFamily: 'var(--font-mono)'
              }}>{stepData.phase}</div>
              <div style={{ fontSize: '10px', color: '#484F58', fontFamily: 'var(--font-mono)' }}>
                Step {currentStep} of {STEPS.length}
              </div>
              {isCompleted && (
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#4CAF50', background: 'rgba(27,107,47,0.15)', padding: '3px 10px', borderRadius: '4px', border: '1px solid rgba(27,107,47,0.3)' }}>
                  ✓ COMPLETED
                </div>
              )}
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#E6EDF3', marginBottom: '4px' }}>{stepData.title}</h1>
            <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6', maxWidth: '700px' }}>{stepData.description}</p>
          </div>

          {/* Step content */}
          {renderStep()}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #21262D' }}>
            <button
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              style={{
                padding: '10px 20px', background: '#21262D', border: '1px solid #30363D',
                borderRadius: '8px', color: currentStep === 1 ? '#484F58' : '#E6EDF3',
                fontSize: '13px', cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
              }}>
              ← Previous
            </button>

            {allDone && currentStep === 7 && (
              <div style={{
                padding: '12px 24px', background: 'rgba(27,107,47,0.15)', border: '1px solid rgba(27,107,47,0.4)',
                borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#4CAF50',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                🎉 Financial Close Complete — {COMPANY.period} Successfully Closed!
              </div>
            )}

            <button
              onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
              disabled={currentStep === STEPS.length}
              style={{
                padding: '10px 20px',
                background: currentStep === STEPS.length ? '#21262D' : `linear-gradient(135deg, ${stepData.color}CC, ${stepData.color})`,
                border: `1px solid ${currentStep === STEPS.length ? '#30363D' : stepData.color}`,
                borderRadius: '8px', color: currentStep === STEPS.length ? '#484F58' : '#fff',
                fontSize: '13px', fontWeight: 600, cursor: currentStep === STEPS.length ? 'not-allowed' : 'pointer',
                boxShadow: currentStep < STEPS.length ? `0 0 12px ${stepData.color}40` : 'none'
              }}>
              Next Step →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
