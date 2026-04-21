import React, { useState } from 'react';
import { GL_ACCOUNTS } from '../data/appData';

const inputStyle = {
  background: '#21262D', border: '1px solid #30363D', borderRadius: '6px',
  color: '#E6EDF3', padding: '8px 10px', fontSize: '12px',
  fontFamily: 'var(--font-mono)', outline: 'none', width: '100%',
  transition: 'border-color 0.2s'
};

const labelStyle = { fontSize: '11px', color: '#8B949E', marginBottom: '4px', display: 'block', fontWeight: 500 };

export default function JournalEntry({ glBalances, setGlBalances, onComplete, isCompleted }) {
  const [entries, setEntries] = useState([
    { id: 1, account: '210000', desc: 'Accrual - Utility Expense (March 2026)', debit: '', credit: '45000', posted: false },
    { id: 2, account: '540000', desc: 'Accrual - Utility Expense (March 2026)', debit: '45000', credit: '', posted: false },
    { id: 3, account: '210000', desc: 'Accrual - Legal Fees Payable', debit: '', credit: '28000', posted: false },
    { id: 4, account: '550000', desc: 'Accrual - Legal Fees Expense', debit: '28000', credit: '', posted: false },
  ]);
  const [newEntry, setNewEntry] = useState({ account: '', desc: '', debit: '', credit: '' });
  const [postedDocs, setPostedDocs] = useState([]);
  const [posting, setPosting] = useState(false);
  const [msg, setMsg] = useState('');

  const totalDebits = entries.filter(e => !e.posted).reduce((s, e) => s + (parseFloat(e.debit) || 0), 0);
  const totalCredits = entries.filter(e => !e.posted).reduce((s, e) => s + (parseFloat(e.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01 && totalDebits > 0;

  const addEntry = () => {
    if (!newEntry.account || !newEntry.desc) return;
    setEntries(prev => [...prev, { ...newEntry, id: Date.now(), posted: false }]);
    setNewEntry({ account: '', desc: '', credit: '', debit: '' });
  };

  const removeEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id));

  const postDocument = () => {
    if (!isBalanced) { setMsg('Document not balanced — debits must equal credits.'); return; }
    setPosting(true);
    setMsg('');
    setTimeout(() => {
      const docNum = `1800${Date.now().toString().slice(-5)}`;
      const unposted = entries.filter(e => !e.posted);
      const newBalances = { ...glBalances };
      unposted.forEach(e => {
        const acc = e.account;
        if (!newBalances[acc]) newBalances[acc] = 0;
        newBalances[acc] += (parseFloat(e.debit) || 0) - (parseFloat(e.credit) || 0);
      });
      setGlBalances(newBalances);
      setEntries(prev => prev.map(e => ({ ...e, posted: true })));
      setPostedDocs(prev => [...prev, { docNum, date: new Date().toLocaleDateString('en-IN'), entries: unposted }]);
      setPosting(false);
      setMsg(`✓ Document ${docNum} posted successfully.`);
      onComplete();
    }, 1200);
  };

  const getAccName = (code) => GL_ACCOUNTS.find(a => a.code === code)?.name || code;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Step info */}
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#1D4ED8', background: 'rgba(29,78,216,0.12)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(29,78,216,0.3)' }}>T-CODE: FB50 / F-02</span>
          <span style={{ fontSize: '11px', color: '#484F58' }}>SAP FI — General Ledger</span>
        </div>
        <p style={{ fontSize: '13px', color: '#8B949E', lineHeight: '1.6' }}>
          Post all accruals, prepayments, and correction entries into the General Ledger before the period closes. Each FI document must be balanced — debits must equal credits.
        </p>
      </div>

      {/* Journal Entry Table */}
      <div style={{ background: '#1C2128', border: '1px solid #30363D', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#E6EDF3' }}>Journal Entry Document</span>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#8B949E' }}>Dr: <span style={{ color: totalDebits > 0 ? '#60A5FA' : '#484F58' }}>₹{totalDebits.toLocaleString('en-IN')}</span></span>
            <span style={{ color: '#8B949E' }}>Cr: <span style={{ color: totalCredits > 0 ? '#F59E0B' : '#484F58' }}>₹{totalCredits.toLocaleString('en-IN')}</span></span>
            <span style={{ color: isBalanced ? '#4CAF50' : '#F85149', fontWeight: 600 }}>{isBalanced ? '✓ Balanced' : '✗ Unbalanced'}</span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#21262D' }}>
              {['GL Account', 'Description', 'Debit (₹)', 'Credit (₹)', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#8B949E', fontWeight: 500, fontSize: '11px', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e.id} style={{ borderTop: '1px solid #21262D', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#60A5FA', fontSize: '11px' }}>{e.account}</span>
                  <div style={{ fontSize: '10px', color: '#484F58', marginTop: '2px' }}>{getAccName(e.account)}</div>
                </td>
                <td style={{ padding: '10px 14px', color: '#8B949E', fontSize: '11px', maxWidth: '200px' }}>{e.desc}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#60A5FA', textAlign: 'right' }}>
                  {e.debit ? `₹${parseFloat(e.debit).toLocaleString('en-IN')}` : '-'}
                </td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: '#F59E0B', textAlign: 'right' }}>
                  {e.credit ? `₹${parseFloat(e.credit).toLocaleString('en-IN')}` : '-'}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    fontSize: '10px', padding: '2px 7px', borderRadius: '4px',
                    background: e.posted ? 'rgba(27,107,47,0.2)' : 'rgba(217,119,6,0.12)',
                    color: e.posted ? '#4CAF50' : '#F59E0B',
                    border: `1px solid ${e.posted ? '#2E7D32' : '#D97706'}`,
                    fontWeight: 600
                  }}>{e.posted ? 'POSTED' : 'PENDING'}</span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {!e.posted && (
                    <button onClick={() => removeEntry(e.id)} style={{ background: 'none', border: 'none', color: '#484F58', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add new line */}
        {!entries.every(e => e.posted) && (
          <div style={{ padding: '12px 14px', borderTop: '1px solid #21262D', background: '#161B22', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>GL Account</label>
              <select value={newEntry.account} onChange={e => setNewEntry(p => ({ ...p, account: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select...</option>
                {GL_ACCOUNTS.map(a => <option key={a.code} value={a.code}>{a.code} — {a.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <input style={inputStyle} placeholder="Entry description..." value={newEntry.desc} onChange={e => setNewEntry(p => ({ ...p, desc: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Debit (₹)</label>
              <input style={inputStyle} type="number" placeholder="0" value={newEntry.debit} onChange={e => setNewEntry(p => ({ ...p, debit: e.target.value, credit: '' }))} />
            </div>
            <div>
              <label style={labelStyle}>Credit (₹)</label>
              <input style={inputStyle} type="number" placeholder="0" value={newEntry.credit} onChange={e => setNewEntry(p => ({ ...p, credit: e.target.value, debit: '' }))} />
            </div>
            <button onClick={addEntry} style={{
              padding: '8px 14px', background: '#21262D', border: '1px solid #30363D',
              borderRadius: '6px', color: '#E6EDF3', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
            }}>+ Add Line</button>
          </div>
        )}
      </div>

      {/* Post button */}
      {!isCompleted && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={postDocument} disabled={posting || !isBalanced} style={{
            padding: '11px 28px',
            background: isBalanced ? 'linear-gradient(135deg, #1B6B2F, #2E7D32)' : '#21262D',
            border: `1px solid ${isBalanced ? '#2E7D32' : '#30363D'}`,
            borderRadius: '8px', color: isBalanced ? '#fff' : '#484F58',
            fontSize: '13px', fontWeight: 600, cursor: isBalanced ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: isBalanced ? '0 0 16px rgba(27,107,47,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>
            {posting && <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />}
            {posting ? 'Posting...' : '▶ Post FI Document (FB50)'}
          </button>
          {msg && <span style={{ fontSize: '12px', color: msg.startsWith('✓') ? '#4CAF50' : '#F85149' }}>{msg}</span>}
        </div>
      )}

      {/* Posted docs */}
      {postedDocs.length > 0 && (
        <div style={{ background: 'rgba(27,107,47,0.08)', border: '1px solid rgba(27,107,47,0.3)', borderRadius: '8px', padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#4CAF50', marginBottom: '8px' }}>Posted Documents</div>
          {postedDocs.map(doc => (
            <div key={doc.docNum} style={{ display: 'flex', gap: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#8B949E', alignItems: 'center' }}>
              <span style={{ color: '#4CAF50' }}>✓</span>
              <span>Doc# <span style={{ color: '#E6EDF3' }}>{doc.docNum}</span></span>
              <span>Date: {doc.date}</span>
              <span>{doc.entries.length} line items posted to GL</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
