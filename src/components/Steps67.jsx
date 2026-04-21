import React, { useState } from 'react';
import { INITIAL_GL_BALANCES, GL_ACCOUNTS, COMPANY } from '../data/appData';

// ── Step 6: Period Lock ──────────────────────────────────────────────────────
export function PeriodLock({ periodLocked, setPeriodLocked, onComplete, isCompleted, completedSteps }) {
  const [locking, setLocking] = useState(false);
  const [log, setLog] = useState([]);
  const preReqsDone = [1, 2, 3, 4, 5].every(id => completedSteps.includes(id));

  const executeLock = () => {
    setLocking(true);
    const steps = [
      'Validating all FI documents...',
      'Checking open item clearance...',
      'Verifying depreciation posting...',
      'Confirming allocation cycles...',
      'Writing period lock to T009B...',
      `Period ${COMPANY.period} LOCKED successfully.`
    ];
    steps.forEach((msg, i) => {
      setTimeout(() => {
        setLog(prev => [...prev, { msg, ok: true }]);
        if (i === steps.length - 1) {
          setPeriodLocked(true);
          setLocking(false);
          onComplete();
        }
      }, i * 350);
    });
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', padding: '16px 20px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#059669', background: 'rgba(5,150,105,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(5,150,105,0.3)' }}>T-CODE: OB52</span>
        <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6', marginTop: '8px' }}>
          Once all period-end activities are completed, the posting period is locked via Posting Period Variant (OB52). This prevents any further document postings to the closed period, preserving data integrity.
        </p>
      </div>

      {!preReqsDone && (
        <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '14px 18px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#F87171', marginBottom: '8px' }}>⚠ Prerequisites Not Met</div>
          {[1, 2, 3, 4, 5].map(id => (
            <div key={id} style={{ fontSize: '12px', color: completedSteps.includes(id) ? '#4CAF50' : '#F85149', marginBottom: '4px' }}>
              {completedSteps.includes(id) ? '✓' : '✗'} Step {id} completed
            </div>
          ))}
        </div>
      )}

      {/* Pre-requisite checklist */}
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262D' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#E6EDF3' }}>Period Close Prerequisites (OB52 Checklist)</span>
        </div>
        {[
          { id: 1, label: 'All FI documents posted (FB50)' },
          { id: 2, label: 'GR/IR accounts cleared (MR11)' },
          { id: 3, label: 'FX revaluation executed (FAGL_FC_VAL)' },
          { id: 4, label: 'Depreciation run completed (AFAB)' },
          { id: 5, label: 'Cost allocation cycles run (KSU5/KSV5)' },
        ].map(item => (
          <div key={item.id} style={{
            padding: '12px 20px', borderBottom: '1px solid #21262D', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: completedSteps.includes(item.id) ? '#1B6B2F' : '#21262D',
              border: `1px solid ${completedSteps.includes(item.id) ? '#2E7D32' : '#30363D'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', color: '#fff', transition: 'all 0.3s'
            }}>
              {completedSteps.includes(item.id) ? '✓' : ''}
            </div>
            <span style={{ fontSize: '13px', color: completedSteps.includes(item.id) ? '#E6EDF3' : '#484F58', transition: 'color 0.3s' }}>{item.label}</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: completedSteps.includes(item.id) ? '#4CAF50' : '#484F58', fontFamily: 'var(--font-mono)' }}>
              {completedSteps.includes(item.id) ? 'DONE' : 'PENDING'}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal output */}
      {log.length > 0 && (
        <div style={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: '8px', padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
          <div style={{ color: '#4CAF50', marginBottom: '8px', fontSize: '11px' }}>$ SAP OB52 — Period Lock Execution Log</div>
          {log.map((entry, i) => (
            <div key={i} style={{ color: entry.ok ? '#8B949E' : '#F85149', marginBottom: '4px', animation: 'slideIn 0.2s ease forwards' }}>
              <span style={{ color: '#4CAF50' }}>[OK]</span> {entry.msg}
            </div>
          ))}
        </div>
      )}

      {!isCompleted && (
        <button onClick={executeLock} disabled={!preReqsDone || locking || periodLocked} style={{
          padding: '11px 28px', alignSelf: 'flex-start',
          background: preReqsDone ? 'linear-gradient(135deg, #064E3B, #059669)' : '#21262D',
          border: `1px solid ${preReqsDone ? '#059669' : '#30363D'}`,
          borderRadius: '8px', color: preReqsDone ? '#fff' : '#484F58',
          fontSize: '13px', fontWeight: 600, cursor: preReqsDone ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: preReqsDone ? '0 0 16px rgba(5,150,105,0.3)' : 'none'
        }}>
          {locking && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
          🔒 {locking ? 'Locking Period...' : periodLocked ? 'Period Locked' : 'Execute Period Lock (OB52)'}
        </button>
      )}
    </div>
  );
}

// ── Step 7: Financial Statements ─────────────────────────────────────────────
export function FinancialStatements({ glBalances, onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('bs');
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); onComplete(); }, 1500);
  };

  // Build statements from GL balances
  const bal = glBalances;

  // Balance Sheet
  const assets = {
    current: {
      cash: Math.abs(bal['100000'] || INITIAL_GL_BALANCES['100000']),
      ar: Math.abs(bal['110000'] || INITIAL_GL_BALANCES['110000']),
      inventory: Math.abs(bal['120000'] || INITIAL_GL_BALANCES['120000']),
      grIR: Math.abs(bal['560000'] || INITIAL_GL_BALANCES['560000']),
    },
    fixed: {
      gross: Math.abs(bal['150000'] || INITIAL_GL_BALANCES['150000']),
      accDepr: Math.abs(bal['155000'] || INITIAL_GL_BALANCES['155000']),
    }
  };
  const totalCurrentAssets = Object.values(assets.current).reduce((s, v) => s + v, 0);
  const netFixed = assets.fixed.gross - assets.fixed.accDepr;
  const totalAssets = totalCurrentAssets + netFixed;

  const liabilities = {
    ap: Math.abs(bal['200000'] || INITIAL_GL_BALANCES['200000']),
    accrued: Math.abs(bal['210000'] || INITIAL_GL_BALANCES['210000']),
    loans: Math.abs(bal['220000'] || INITIAL_GL_BALANCES['220000']),
  };
  const totalLiabilities = Object.values(liabilities).reduce((s, v) => s + v, 0);

  const equity = {
    capital: Math.abs(bal['300000'] || INITIAL_GL_BALANCES['300000']),
    retained: Math.abs(bal['310000'] || INITIAL_GL_BALANCES['310000']),
  };
  const totalEquity = Object.values(equity).reduce((s, v) => s + v, 0);

  // P&L
  const revenue = Math.abs(bal['400000'] || INITIAL_GL_BALANCES['400000']) + Math.abs(bal['410000'] || INITIAL_GL_BALANCES['410000']) + Math.abs(bal['570000'] || 0);
  const cogs = Math.abs(bal['500000'] || INITIAL_GL_BALANCES['500000']);
  const grossProfit = revenue - cogs;
  const opex = Math.abs(bal['510000'] || INITIAL_GL_BALANCES['510000']) + Math.abs(bal['520000'] || 0) + Math.abs(bal['530000'] || INITIAL_GL_BALANCES['530000']) + Math.abs(bal['540000'] || INITIAL_GL_BALANCES['540000']) + Math.abs(bal['550000'] || 0);
  const ebit = grossProfit - opex;
  const tax = Math.round(ebit * 0.25);
  const netProfit = ebit - tax;

  const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

  const BSRow = ({ label, value, bold, indent, negative, highlight }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: `${bold ? '10px' : '8px'} ${indent ? '32px' : '16px'}`,
      borderBottom: '1px solid #21262D',
      background: highlight ? 'rgba(27,107,47,0.08)' : 'transparent'
    }}>
      <span style={{ fontSize: bold ? '13px' : '12px', fontWeight: bold ? 700 : 400, color: bold ? '#E6EDF3' : '#8B949E' }}>{label}</span>
      {value !== undefined && (
        <span style={{ fontSize: bold ? '13px' : '12px', fontFamily: 'var(--font-mono)', fontWeight: bold ? 700 : 400, color: negative ? '#F85149' : bold ? (highlight ? '#4CAF50' : '#E6EDF3') : '#8B949E' }}>
          {fmt(value)}
        </span>
      )}
    </div>
  );

  const PLRow = ({ label, value, bold, indent, color, borderTop }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: `${bold ? '10px' : '8px'} ${indent ? '32px' : '16px'}`,
      borderBottom: '1px solid #21262D',
      borderTop: borderTop ? '2px solid #30363D' : 'none'
    }}>
      <span style={{ fontSize: bold ? '13px' : '12px', fontWeight: bold ? 700 : 400, color: bold ? '#E6EDF3' : '#8B949E' }}>{label}</span>
      {value !== undefined && (
        <span style={{ fontSize: bold ? '13px' : '12px', fontFamily: 'var(--font-mono)', fontWeight: bold ? 700 : 400, color: color || (bold ? '#E6EDF3' : '#8B949E') }}>
          {value < 0 ? '-' : ''}{fmt(value)}
        </span>
      )}
    </div>
  );

  const tabStyle = (id) => ({
    padding: '8px 20px', border: 'none', cursor: 'pointer',
    background: activeTab === id ? '#1C2128' : 'transparent',
    color: activeTab === id ? '#4CAF50' : '#8B949E',
    fontSize: '12px', fontWeight: activeTab === id ? 600 : 400,
    borderBottom: activeTab === id ? '2px solid #4CAF50' : '2px solid transparent',
    transition: 'all 0.2s'
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', padding: '16px 20px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#1B6B2F', background: 'rgba(27,107,47,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(27,107,47,0.3)' }}>T-CODE: S_ALR_87012284</span>
        <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6', marginTop: '8px' }}>
          Generate Balance Sheet and Profit & Loss Statement using the Financial Statement Version (FSV). All period-end adjustments are reflected in the final figures below.
        </p>
      </div>

      {!isCompleted && !generated && (
        <button onClick={generate} disabled={generating} style={{
          padding: '11px 28px', alignSelf: 'flex-start',
          background: 'linear-gradient(135deg, #1B6B2F, #2E7D32)',
          border: '1px solid #2E7D32', borderRadius: '8px', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 0 16px rgba(27,107,47,0.4)'
        }}>
          {generating && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
          {generating ? 'Generating Statements...' : '▶ Generate Financial Statements'}
        </button>
      )}

      {generated && (
        <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #30363D', background: '#161B22' }}>
            <button style={tabStyle('bs')} onClick={() => setActiveTab('bs')}>Balance Sheet</button>
            <button style={tabStyle('pl')} onClick={() => setActiveTab('pl')}>Profit & Loss</button>
            <button style={tabStyle('sum')} onClick={() => setActiveTab('sum')}>KPI Summary</button>
          </div>

          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #21262D', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#E6EDF3' }}>{COMPANY.name}</div>
              <div style={{ fontSize: '11px', color: '#8B949E', fontFamily: 'var(--font-mono)' }}>Company Code: {COMPANY.code} | Period: {COMPANY.period} | FY {COMPANY.fiscalYear}</div>
            </div>
            <div style={{ fontSize: '11px', color: '#4CAF50', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
              <div>Generated: {new Date().toLocaleString('en-IN')}</div>
              <div>Report: S_ALR_87012284</div>
            </div>
          </div>

          {/* Balance Sheet */}
          {activeTab === 'bs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <div style={{ borderRight: '1px solid #30363D' }}>
                <div style={{ padding: '10px 16px', background: 'rgba(29,78,216,0.12)', borderBottom: '1px solid #21262D' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#60A5FA' }}>ASSETS</span>
                </div>
                <BSRow label="Current Assets" bold />
                <BSRow label="Cash & Cash Equivalents" value={assets.current.cash} indent />
                <BSRow label="Accounts Receivable" value={assets.current.ar} indent />
                <BSRow label="Inventory" value={assets.current.inventory} indent />
                <BSRow label="GR/IR Clearing" value={assets.current.grIR} indent />
                <BSRow label="Total Current Assets" value={totalCurrentAssets} bold highlight />
                <BSRow label="Fixed Assets" bold />
                <BSRow label="Gross Fixed Assets" value={assets.fixed.gross} indent />
                <BSRow label="Less: Accumulated Depreciation" value={assets.fixed.accDepr} indent negative />
                <BSRow label="Net Fixed Assets" value={netFixed} bold />
                <BSRow label="TOTAL ASSETS" value={totalAssets} bold highlight />
              </div>
              <div>
                <div style={{ padding: '10px 16px', background: 'rgba(245,158,11,0.1)', borderBottom: '1px solid #21262D' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B' }}>LIABILITIES & EQUITY</span>
                </div>
                <BSRow label="Current Liabilities" bold />
                <BSRow label="Accounts Payable" value={liabilities.ap} indent />
                <BSRow label="Accrued Liabilities" value={liabilities.accrued} indent />
                <BSRow label="Short-Term Loans" value={liabilities.loans} indent />
                <BSRow label="Total Liabilities" value={totalLiabilities} bold highlight />
                <BSRow label="Shareholders' Equity" bold />
                <BSRow label="Share Capital" value={equity.capital} indent />
                <BSRow label="Retained Earnings" value={equity.retained} indent />
                <BSRow label="Total Equity" value={totalEquity} bold />
                <BSRow label="TOTAL LIABILITIES & EQUITY" value={totalLiabilities + totalEquity} bold highlight />
              </div>
            </div>
          )}

          {/* P&L */}
          {activeTab === 'pl' && (
            <div>
              <PLRow label="Revenue from Operations" value={Math.abs(bal['400000'] || INITIAL_GL_BALANCES['400000'])} bold />
              <PLRow label="Other Income" value={Math.abs(bal['410000'] || INITIAL_GL_BALANCES['410000'])} indent />
              <PLRow label="FX Gain / (Loss)" value={bal['570000'] || 0} indent color={(bal['570000'] || 0) >= 0 ? '#4CAF50' : '#F85149'} />
              <PLRow label="Total Revenue" value={revenue} bold color="#4CAF50" />
              <PLRow label="Cost of Goods Sold" value={-cogs} bold />
              <PLRow label="Gross Profit" value={grossProfit} bold color="#60A5FA" borderTop />
              <PLRow label="Operating Expenses" bold />
              <PLRow label="Salaries & Wages" value={-Math.abs(bal['510000'] || INITIAL_GL_BALANCES['510000'])} indent />
              <PLRow label="Depreciation Expense" value={-(bal['520000'] || 0)} indent color="#D97706" />
              <PLRow label="Rent Expense" value={-Math.abs(bal['530000'] || INITIAL_GL_BALANCES['530000'])} indent />
              <PLRow label="Utilities Expense" value={-Math.abs(bal['540000'] || INITIAL_GL_BALANCES['540000'])} indent />
              <PLRow label="Accrued Expenses" value={-(bal['550000'] || 0)} indent />
              <PLRow label="Total Operating Expenses" value={-opex} bold />
              <PLRow label="EBIT" value={ebit} bold color={ebit >= 0 ? '#4CAF50' : '#F85149'} borderTop />
              <PLRow label="Income Tax (25%)" value={-tax} indent />
              <PLRow label="NET PROFIT / (LOSS)" value={netProfit} bold color={netProfit >= 0 ? '#4CAF50' : '#F85149'} borderTop />
            </div>
          )}

          {/* KPI Summary */}
          {activeTab === 'sum' && (
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              {[
                { label: 'Total Revenue', value: fmt(revenue), color: '#60A5FA' },
                { label: 'Gross Profit', value: fmt(grossProfit), color: '#4CAF50' },
                { label: 'Net Profit', value: fmt(netProfit), color: netProfit >= 0 ? '#4CAF50' : '#F85149' },
                { label: 'Gross Margin', value: `${((grossProfit / revenue) * 100).toFixed(1)}%`, color: '#F59E0B' },
                { label: 'Net Margin', value: `${((netProfit / revenue) * 100).toFixed(1)}%`, color: '#F59E0B' },
                { label: 'Total Assets', value: fmt(totalAssets), color: '#8B949E' },
                { label: 'Total Liabilities', value: fmt(totalLiabilities), color: '#F85149' },
                { label: 'Total Equity', value: fmt(totalEquity), color: '#60A5FA' },
                { label: 'Depreciation Posted', value: fmt(bal['520000'] || 0), color: '#D97706' },
              ].map(kpi => (
                <div key={kpi.label} style={{ background: '#161B22', border: '1px solid #30363D', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#484F58', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: kpi.color, fontFamily: 'var(--font-mono)' }}>{kpi.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
