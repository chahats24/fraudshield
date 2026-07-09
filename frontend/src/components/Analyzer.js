import React, { useState } from 'react';
import axios from 'axios';

function Analyzer() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!input.trim()) {
      setError('Please enter a message or describe the call.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('http://localhost:5000/api/analyze', { input });
      setResult(res.data);
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    if (verdict === 'SCAM') return '#ff4444';
    if (verdict === 'SUSPICIOUS') return '#ff9900';
    return '#00cc44';
  };

  const getVerdictEmoji = (verdict) => {
    if (verdict === 'SCAM') return '🚨';
    if (verdict === 'SUSPICIOUS') return '⚠️';
    return '✅';
  };

  return (
    <div className="analyzer">
      <div className="analyzer-card">
        <h2>🔍 Scam Message Analyzer</h2>
        <p className="subtitle">Paste a suspicious message or describe a suspicious call below</p>

        <textarea
          className="input-box"
          rows="6"
          placeholder="Example: I got a call from someone saying they are from CBI and my Aadhaar is linked to illegal activities. They asked me to pay Rs 50,000..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button
          className="analyze-btn"
          onClick={analyze}
          disabled={loading}
        >
          {loading ? '🤖 Analyzing...' : '🔍 Analyze Now'}
        </button>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>AI is analyzing your message...</p>
          </div>
        )}

        {result && (
          <div className="result-card">
            <div className="verdict" style={{ backgroundColor: getVerdictColor(result.verdict) }}>
              <span className="verdict-emoji">{getVerdictEmoji(result.verdict)}</span>
              <span className="verdict-text">{result.verdict}</span>
            </div>

            <div className="result-details">
              <div className="detail-row">
                <span className="label">Scam Type</span>
                <span className="value">{result.scamType}</span>
              </div>
              <div className="detail-row">
                <span className="label">Confidence</span>
                <span className="value">{result.confidence}</span>
              </div>
            </div>

            <div className="explanation">
              <h3>📋 Explanation</h3>
              <p>{result.explanation}</p>
            </div>

            <div className="explanation hindi">
              <h3>📋 हिंदी में समझें</h3>
              <p>{result.explanationHindi}</p>
            </div>

            <div className="what-to-do">
              <h3>✅ What To Do</h3>
              <p>{result.whatToDo}</p>
            </div>

            <div className="helpline">
              <p>🆘 Report this at <strong>cybercrime.gov.in</strong> or call <strong>1930</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyzer;