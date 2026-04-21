import React, { useState } from 'react';
import { FIXED_ASSETS, COST_CENTERS, GL_ACCOUNTS } from '../data/appData';

// ── Step 2: GR/IR Clearance ──────────────────────────────────────────────────
export function GRIRClearance({ glBalances, setGlBalances, onComplete, isCompleted }) {
  const [items, setItems] = useState([
    { id: 1, vendor: 'V-1023 — Reliance Supplies', grDoc: 'GR5000123', irDoc: '', grAmt: 185000, irAmt: 185000, status: 'OPEN' },
    { id: 2, vendor: 'V-2041 — Tata Power Ltd', grDoc: 'GR5000124', irDoc: 'IV9003210', grAmt: 62000, irAmt: 62000, status: 'OPEN' },
    { id: 3, vendor: 'V-3015 — Mahanadi Steels', grDoc: 'GR5000125', irDoc: '', grAmt: 340000, irAmt: 340000, status: 'OPEN' },
    { id: 4, vendor: 'V-1088 — Odisha IT Park', grDoc: 'GR5000126', irDoc: 'IV9003215', grAmt: 28500, irAmt: 28500, status: 'OPEN' },
  ]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runClearance = () => {
    setRunning(true);
    let idx = 0;
    const interval = setInterval(() => {
      setItems(prev => prev.map((item, i) => i === idx ? { ...item, status: 'CLEARED', irDoc: item.irDoc || `IV${900000 + item.id * 7}` } : item));
      idx++;
      if (idx >= items.length) {
        clearInterval(interval);
        setRunning(false);
        setDone(true);
        // update GR/IR balance
        const total = items.reduce((s, i) => s + i.grAmt, 0);
        setGlBalances(prev => ({ ...prev, '560000': (prev['560000'] || 0) - total }));
        onComplete();
      }
    }, 500);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#7C3AED', background: 'rgba(124,58,237,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(124,58,237,0.3)' }}>T-CODE: MR11 / F-44</span>
        </div>
        <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6' }}>
          Match Goods Receipts (GR) against Invoice Receipts (IR) to clear the GR/IR account. All open items must be cleared before the period can be locked.
        </p>
      </div>

      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#E6EDF3' }}>Open GR/IR Items</span>
          <span style={{ fontSize: '11px', color: '#8B949E', fontFamily: 'var(--font-mono)' }}>
            GR/IR Balance: <span style={{ color: '#F59E0B' }}>₹{((glBalances['560000'] || 0)).toLocaleString('en-IN')}</span>
          </span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#21262D' }}>
              {['Vendor', 'GR Document', 'IR Document', 'Amount (₹)', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#8B949E', fontWeight: 500, fontSize: '11px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ borderTop: '1px solid #21262D', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <td style={{ padding: '10px 14px', color: '#8B949E', fontSize: '11px' }}>{item.vendor}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#60A5FA', fontSize: '11px' }}>{item.grDoc}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: item.irDoc ? '#4CAF50' : '#484F58', fontSize: '11px' }}>{item.irDoc || '—'}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#E6EDF3', textAlign: 'right' }}>₹{item.grAmt.toLocaleString('en-IN')}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    fontSize: '10px', padding: '2px 7px', borderRadius: '4px', fontWeight: 600,
                    background: item.status === 'CLEARED' ? 'rgba(27,107,47,0.2)' : 'rgba(220,38,38,0.12)',
                    color: item.status === 'CLEARED' ? '#4CAF50' : '#F85149',
                    border: `1px solid ${item.status === 'CLEARED' ? '#2E7D32' : '#DC2626'}`
                  }}>{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isCompleted && (
        <button onClick={runClearance} disabled={running || done} style={{
          padding: '11px 28px', alignSelf: 'flex-start',
          background: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
          border: '1px solid #7C3AED', borderRadius: '8px', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: running || done ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 0 16px rgba(124,58,237,0.3)'
        }}>
          {running && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
          {running ? 'Clearing Items...' : done ? '✓ All Items Cleared' : '▶ Execute GR/IR Clearance (MR11)'}
        </button>
      )}
    </div>
  );
}

// ── Step 3: FX Revaluation ───────────────────────────────────────────────────
export function FXRevaluation({ glBalances, setGlBalances, onComplete, isCompleted }) {
  const [rates] = useState([
    { currency: 'USD', rate: 83.42, prevRate: 82.15 },
    { currency: 'EUR', rate: 91.18, prevRate: 89.73 },
    { currency: 'GBP', rate: 106.25, prevRate: 104.80 },
  ]);
  const [openItems] = useState([
    { desc: 'AR - Export Invoice #EXP-2401', currency: 'USD', amount: 25000, type: 'Receivable' },
    { desc: 'AP - Import Material PO#IMP-789', currency: 'EUR', amount: 12000, type: 'Payable' },
    { desc: 'Loan from UK Subsidiary', currency: 'GBP', amount: 50000, type: 'Payable' },
  ]);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);

  const runRevaluation = () => {
    setRunning(true);
    setTimeout(() => {
      let totalGainLoss = 0;
      const revalItems = openItems.map(item => {
        const rate = rates.find(r => r.currency === item.currency);
        const prevINR = item.amount * rate.prevRate;
        const newINR = item.amount * rate.rate;
        const diff = newINR - prevINR;
        const gl = item.type === 'Receivable' ? diff : -diff;
        totalGainLoss += gl;
        return { ...item, prevINR, newINR, gainLoss: gl };
      });
      setResult({ items: revalItems, totalGainLoss: Math.round(totalGainLoss) });
      setGlBalances(prev => ({ ...prev, '570000': (prev['570000'] || 0) + Math.round(totalGainLoss) }));
      setRunning(false);
      onComplete();
    }, 1000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', padding: '16px 20px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0891B2', background: 'rgba(8,145,178,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(8,145,178,0.3)' }}>T-CODE: FAGL_FC_VAL</span>
        <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6', marginTop: '8px' }}>
          Per IAS 21, all monetary items in foreign currencies must be restated at the period-end closing rate. Exchange differences are recognized in the income statement.
        </p>
      </div>

      {/* Exchange rates */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {rates.map(r => {
          const change = r.rate - r.prevRate;
          return (
            <div key={r.currency} style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#E6EDF3', fontFamily: 'var(--font-mono)' }}>{r.currency}/INR</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#0891B2', marginTop: '4px' }}>₹{r.rate}</div>
              <div style={{ fontSize: '11px', color: change > 0 ? '#4CAF50' : '#F85149', marginTop: '4px' }}>
                {change > 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)} from prev. period
              </div>
            </div>
          );
        })}
      </div>

      {result && (
        <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262D' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#E6EDF3' }}>Revaluation Results</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#21262D' }}>
                {['Open Item', 'Currency', 'FC Amount', 'Prev INR', 'New INR', 'FX Gain/Loss'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#8B949E', fontWeight: 500, fontSize: '11px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.items.map((item, i) => (
                <tr key={i} style={{ borderTop: '1px solid #21262D' }}>
                  <td style={{ padding: '10px 14px', color: '#8B949E', fontSize: '11px' }}>{item.desc}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#0891B2' }}>{item.currency}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#E6EDF3' }}>{item.amount.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#8B949E' }}>₹{Math.round(item.prevINR).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#E6EDF3' }}>₹{Math.round(item.newINR).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: item.gainLoss >= 0 ? '#4CAF50' : '#F85149', fontWeight: 600 }}>
                    {item.gainLoss >= 0 ? '+' : ''}₹{Math.round(item.gainLoss).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 20px', borderTop: '1px solid #21262D', display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: result.totalGainLoss >= 0 ? '#4CAF50' : '#F85149' }}>
              Net FX {result.totalGainLoss >= 0 ? 'Gain' : 'Loss'}: ₹{Math.abs(result.totalGainLoss).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {!isCompleted && (
        <button onClick={runRevaluation} disabled={running || !!result} style={{
          padding: '11px 28px', alignSelf: 'flex-start',
          background: 'linear-gradient(135deg, #0E4F6B, #0891B2)',
          border: '1px solid #0891B2', borderRadius: '8px', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: running || result ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 0 16px rgba(8,145,178,0.3)'
        }}>
          {running && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
          {running ? 'Running Revaluation...' : '▶ Execute FX Revaluation (FAGL_FC_VAL)'}
        </button>
      )}
    </div>
  );
}

// ── Step 4: Depreciation Run ─────────────────────────────────────────────────
export function DepreciationRun({ glBalances, setGlBalances, onComplete, isCompleted }) {
  const initialAssets = FIXED_ASSETS.map(a => ({
    ...a,
    status: 'PENDING',
    deprAmount: Math.round((a.acquisitionValue * a.rate) / 100 / 12)
  }));

  const [assets, setAssets] = useState(initialAssets);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const runAFAB = () => {
    if (running || complete) return;
    setRunning(true);
    setProgress(0);

    const totalDepr = FIXED_ASSETS.reduce((s, a) => s + Math.round((a.acquisitionValue * a.rate) / 100 / 12), 0);

    const processAsset = (idx) => {
      if (idx >= FIXED_ASSETS.length) {
        setGlBalances(prev => ({
          ...prev,
          '520000': (prev['520000'] || 0) + totalDepr,
          '155000': (prev['155000'] || 0) - totalDepr
        }));
        setRunning(false);
        setComplete(true);
        onComplete();
        return;
      }
      setAssets(prev =>
        prev.map((a, i) => i === idx ? { ...a, status: 'PROCESSED' } : a)
      );
      setProgress(Math.round(((idx + 1) / FIXED_ASSETS.length) * 100));
      setTimeout(() => processAsset(idx + 1), 500);
    };

    setTimeout(() => processAsset(0), 200);
  };

  const totalDepr = assets.filter(a => a.deprAmount).reduce((s, a) => s + a.deprAmount, 0);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', padding: '16px 20px' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#D97706', background: 'rgba(217,119,6,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(217,119,6,0.3)' }}>T-CODE: AFAB</span>
        <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6', marginTop: '8px' }}>
          SAP FI-AA automatically calculates monthly depreciation for all active fixed assets based on their acquisition value, useful life, and depreciation method. Posts to GL accounts 520000 (Depreciation Expense) and 155000 (Acc. Depreciation).
        </p>
      </div>

      {running && (
        <div style={{ background: '#1C2128', border: '1px solid rgba(217,119,6,0.3)', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 600 }}>AFAB Processing...</span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#8B949E' }}>{progress}%</span>
          </div>
          <div style={{ height: '6px', background: '#21262D', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #D97706, #F59E0B)', transition: 'width 0.3s', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
          </div>
        </div>
      )}

      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#E6EDF3' }}>Fixed Asset Register</span>
          {totalDepr > 0 && (
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#D97706' }}>
              Total Depreciation: ₹{totalDepr.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#21262D' }}>
              {['Asset ID', 'Description', 'Method', 'Rate', 'Acq. Value', 'Monthly Depr.', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#8B949E', fontWeight: 500, fontSize: '11px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => (
              <tr key={a.id} style={{ borderTop: '1px solid #21262D', background: i % 2 ? 'rgba(255,255,255,0.01)' : 'transparent', transition: 'background 0.3s' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#D97706', fontSize: '11px' }}>{a.id}</td>
                <td style={{ padding: '10px 14px', color: '#8B949E', fontSize: '11px' }}>{a.name}</td>
                <td style={{ padding: '10px 14px', color: '#484F58', fontSize: '11px' }}>{a.method}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#8B949E' }}>{a.rate}%</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#E6EDF3', textAlign: 'right' }}>₹{a.acquisitionValue.toLocaleString('en-IN')}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#F59E0B', fontWeight: 600, textAlign: 'right' }}>
                  {a.deprAmount ? `₹${a.deprAmount.toLocaleString('en-IN')}` : '—'}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    fontSize: '10px', padding: '2px 7px', borderRadius: '4px', fontWeight: 600,
                    background: a.status === 'PROCESSED' ? 'rgba(27,107,47,0.2)' : 'rgba(217,119,6,0.12)',
                    color: a.status === 'PROCESSED' ? '#4CAF50' : '#D97706',
                    border: `1px solid ${a.status === 'PROCESSED' ? '#2E7D32' : '#D97706'}`
                  }}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isCompleted && (
        <button onClick={runAFAB} disabled={running || complete} style={{
          padding: '11px 28px', alignSelf: 'flex-start',
          background: 'linear-gradient(135deg, #78350F, #D97706)',
          border: '1px solid #D97706', borderRadius: '8px', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: running || complete ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 0 16px rgba(217,119,6,0.3)'
        }}>
          {running && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
          {running ? 'Running AFAB...' : complete ? '✓ Depreciation Posted' : '▶ Execute Depreciation Run (AFAB)'}
        </button>
      )}
    </div>
  );
}

// ── Step 5: Cost Allocation ──────────────────────────────────────────────────
export function CostAllocation({ onComplete, isCompleted }) {
  const [cycles, setCycles] = useState([
    { id: 1, name: 'IT Cost Assessment', tcode: 'KSU5', sender: 'CC400 — IT', receiver: 'CC100, CC200', basis: 'Headcount', amount: 185000, status: 'PENDING' },
    { id: 2, name: 'HR Cost Assessment', tcode: 'KSU5', sender: 'CC300 — HR', receiver: 'All Cost Centers', basis: 'Headcount', amount: 120000, status: 'PENDING' },
    { id: 3, name: 'Finance Distribution', tcode: 'KSV5', sender: 'CC500 — Finance', receiver: 'CC100, CC200', basis: 'Revenue Share', amount: 95000, status: 'PENDING' },
  ]);
  const [running, setRunning] = useState(false);

  const runCycles = () => {
    setRunning(true);
    let idx = 0;
    const interval = setInterval(() => {
      setCycles(prev => prev.map((c, i) => i === idx ? { ...c, status: 'COMPLETED' } : c));
      idx++;
      if (idx >= cycles.length) {
        clearInterval(interval);
        setRunning(false);
        onComplete();
      }
    }, 600);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#DB2777', background: 'rgba(219,39,119,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(219,39,119,0.3)' }}>T-CODE: KSU5</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#DB2777', background: 'rgba(219,39,119,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(219,39,119,0.3)' }}>KSV5</span>
        </div>
        <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6' }}>
          Overhead cost center costs are redistributed to production/revenue cost centers using predefined allocation keys. Assessment cycles (KSU5) use summary postings; Distribution cycles (KSV5) maintain cost element detail.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {cycles.map((cycle, i) => (
          <div key={cycle.id} style={{
            background: '#1C2128', border: `1px solid ${cycle.status === 'COMPLETED' ? 'rgba(27,107,47,0.4)' : '#30363D'}`,
            borderRadius: '10px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            transition: 'border-color 0.4s'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#E6EDF3', marginBottom: '4px' }}>{cycle.name}</div>
              <div style={{ fontSize: '11px', color: '#8B949E' }}>
                Sender: <span style={{ color: '#DB2777' }}>{cycle.sender}</span> &nbsp;→&nbsp; Receivers: <span style={{ color: '#60A5FA' }}>{cycle.receiver}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#484F58', marginTop: '2px' }}>Allocation Basis: {cycle.basis} &nbsp;|&nbsp; Amount: <span style={{ color: '#E6EDF3', fontFamily: 'var(--font-mono)' }}>₹{cycle.amount.toLocaleString('en-IN')}</span></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#484F58' }}>{cycle.tcode}</span>
              <span style={{
                fontSize: '11px', padding: '4px 10px', borderRadius: '4px', fontWeight: 600,
                background: cycle.status === 'COMPLETED' ? 'rgba(27,107,47,0.2)' : 'rgba(219,39,119,0.12)',
                color: cycle.status === 'COMPLETED' ? '#4CAF50' : '#DB2777',
                border: `1px solid ${cycle.status === 'COMPLETED' ? '#2E7D32' : '#DB2777'}`
              }}>{cycle.status === 'COMPLETED' ? '✓ DONE' : running ? '⟳ RUNNING' : 'PENDING'}</span>
            </div>
          </div>
        ))}
      </div>

      {!isCompleted && (
        <button onClick={runCycles} disabled={running || cycles.every(c => c.status === 'COMPLETED')} style={{
          padding: '11px 28px', alignSelf: 'flex-start',
          background: 'linear-gradient(135deg, #831843, #DB2777)',
          border: '1px solid #DB2777', borderRadius: '8px', color: '#fff',
          fontSize: '13px', fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: '0 0 16px rgba(219,39,119,0.3)'
        }}>
          {running && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
          {running ? 'Running Allocation Cycles...' : '▶ Execute Allocation Cycles (KSU5 / KSV5)'}
        </button>
      )}
    </div>
  );
}
