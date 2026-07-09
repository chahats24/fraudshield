import React, { useState } from 'react';
import Analyzer from './components/Analyzer';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [page, setPage] = useState('analyzer');

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          🛡️ FraudShield
        </div>
        <p className="tagline">AI-Powered Scam Detection for Every Indian Citizen</p>
        <nav className="nav">
          <button
            className={page === 'analyzer' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setPage('analyzer')}
          >
            🔍 Analyze
          </button>
          <button
            className={page === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setPage('dashboard')}
          >
            📊 Dashboard
          </button>
        </nav>
      </header>

      <main className="main">
        {page === 'analyzer' ? <Analyzer /> : <Dashboard />}
      </main>

      <footer className="footer">
        <p>Report cybercrime at <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a> | Helpline: 1930</p>
      </footer>
    </div>
  );
}

export default App;