import { useState } from 'react';
import './styles/contest_enter.css';

function ContestEnter({ onVerify }) {
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyClick = async () => {
    if (handle.trim() === '') {
      setError('Please enter your Codeforces handle.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.result.length > 0) {
        const sub = data.result[0];
        if(sub.problem && sub.problem.contestId === 4 && sub.problem.index === 'A'){
          setLoading(false);
          onVerify(handle);
          return;
        }
      }
      setError('Submission for problem 4A not found. Please make a submission and try again.');
    } catch (e) {
      setError('Error verifying handle. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="contest-enter-container">
      <h2>Enter Codeforces Handle</h2>
      <div className="contest-enter-instructions">
        <p>1. Open the below question link and make a submission (compilation error works).</p>
        <a href="https://codeforces.com/problemset/problem/4/A" target="_blank">Codeforces Handle Verification Question</a>
        <p>2. Enter your handle and click Check.</p>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          placeholder="Codeforces handle"
          disabled={loading}
        />
        <button onClick={handleVerifyClick} disabled={loading}>{loading ? 'Checking...' : 'Check'}</button>
      </div>
    </div>
  );
}

export default ContestEnter;
