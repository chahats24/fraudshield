import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const COLORS = ['#ff4444', '#ff9900', '#00cc44'];

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reports')
      .then(res => {
        setReports(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);


  const verdictCounts = reports.reduce((acc, r) => {
    acc[r.verdict] = (acc[r.verdict] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(verdictCounts).map(([name, value]) => ({ name, value }));


  const scamTypeCounts = reports.reduce((acc, r) => {
    if (r.scamType && r.scamType !== 'None') {
      acc[r.scamType] = (acc[r.scamType] || 0) + 1;
    }
    return acc;
  }, {});

  const barData = Object.entries(scamTypeCounts).map(([name, value]) => ({ name, value }));

  if (loading) return <div className="loading"><p>Loading dashboard...</p></div>;

  return (
    <div className="dashboard">
      <h2>📊 Scam Intelligence Dashboard</h2>
      <p className="subtitle">Real-time analysis of reported scams</p>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{reports.length}</span>
          <span className="stat-label">Total Analyzed</span>
        </div>
        <div className="stat-card red">
          <span className="stat-number">{verdictCounts['SCAM'] || 0}</span>
          <span className="stat-label">Scams Detected</span>
        </div>
        <div className="stat-card orange">
          <span className="stat-number">{verdictCounts['SUSPICIOUS'] || 0}</span>
          <span className="stat-label">Suspicious</span>
        </div>
        <div className="stat-card green">
          <span className="stat-number">{verdictCounts['SAFE'] || 0}</span>
          <span className="stat-label">Safe</span>
        </div>
      </div>

      {pieData.length > 0 && (
        <div className="charts-row">
          <div className="chart-card">
            <h3>Verdict Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {barData.length > 0 && (
            <div className="chart-card">
              <h3>Scam Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ff4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="recent-reports">
        <h3>🕒 Recent Reports</h3>
        {reports.length === 0 ? (
          <p>No reports yet. Start analyzing messages!</p>
        ) : (
          reports.map((r, i) => (
            <div key={i} className={`report-item ${r.verdict?.toLowerCase()}`}>
              <div className="report-header">
                <span className="report-verdict">{r.verdict}</span>
                <span className="report-type">{r.scamType}</span>
                <span className="report-date">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <p className="report-input">"{r.input?.substring(0, 100)}..."</p>
              <p className="report-explanation">{r.explanation}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;