import React, { useEffect, useState } from 'react';

function Analysis() {
  const [userData, setUserData] = useState({ contests: [], topicStats: {} });

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('cfvc-user-data'));
      if (data) setUserData(data);
    } catch {}
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Analysis</h2>
      <h3>Contest History</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            <th style={{ border: '1px solid #e2e8f0', padding: 8 }}>Date</th>
            <th style={{ border: '1px solid #e2e8f0', padding: 8 }}>Problems</th>
          </tr>
        </thead>
        <tbody>
          {userData.contests.length === 0 && (
            <tr><td colSpan={2} style={{ textAlign: 'center', color: '#888' }}>No contests attempted yet.</td></tr>
          )}
          {userData.contests.map((c, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>{new Date(c.date).toLocaleString()}</td>
              <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {c.problems.map((p, i) => (
                    <li key={i} style={{ color: p.status === 'ACCEPTED' ? 'green' : p.status === 'Wrong Answer' ? 'red' : '#555' }}>
                      {p.contestId}{p.index} [{p.tag}] - {p.status}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Topic-wise Successful Submissions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9fafb' }}>
            <th style={{ border: '1px solid #e2e8f0', padding: 8 }}>Topic</th>
            <th style={{ border: '1px solid #e2e8f0', padding: 8 }}>Problems Solved</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(userData.topicStats).length === 0 && (
            <tr><td colSpan={2} style={{ textAlign: 'center', color: '#888' }}>No successful submissions yet.</td></tr>
          )}
          {Object.entries(userData.topicStats).map(([tag, arr]) => (
            <tr key={tag}>
              <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>{tag}</td>
              <td style={{ border: '1px solid #e2e8f0', padding: 8 }}>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {arr.map((p, i) => (
                    <li key={i}>{p.contestId}{p.index} ({new Date(p.date).toLocaleDateString()})</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Analysis;
