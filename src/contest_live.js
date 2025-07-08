import React, { useEffect, useState } from 'react';
import './styles/contest_live.css';

function getProblemUrl(contestId, index) {
  return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
}

const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

function ContestLive({ handle, problems, onEnd }) {
  // Try to restore timeLeft from localStorage, else default to 7200
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('cfvc-contest-timeleft');
    return saved ? parseInt(saved, 10) : 7200;
  });
  const [statuses, setStatuses] = useState(problems.map(() => 'no submission'));
  const [checking, setChecking] = useState(Array(problems.length).fill(false));

  // Save timeLeft to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cfvc-contest-timeleft', timeLeft);
    if (timeLeft <= 0) {
      saveContestDetails();
      localStorage.removeItem('cfvc-contest-timeleft');
      onEnd();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onEnd]);

  // On contest end, clear time from localStorage
  useEffect(() => {
    return () => {
      localStorage.removeItem('cfvc-contest-timeleft');
    };
  }, []);

  const checkSubmission = async (idx) => {
    setChecking(arr => arr.map((v, i) => i === idx ? true : v));
    const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      let verdict = 'no submission';
      if (data.status === 'OK' && data.result.length > 0) {
        const sub = data.result[0];
        if (
          sub.problem &&
          sub.problem.contestId === problems[idx].contestId &&
          sub.problem.index === problems[idx].index
        ) {
          if (sub.verdict === 'OK'){
            verdict = 'ACCEPTED';
            console.log('check');
            //add contest end check here
            saveContestDetails();
          }
          else verdict = 'Wrong Answer';
        } else {
          verdict = 'No submission';
        }
      }
      setStatuses(arr => arr.map((v, i) => i === idx ? verdict : v));
    } catch {
      setStatuses(arr => arr.map((v, i) => i === idx ? 'error' : v));
    }
    setChecking(arr => arr.map((v, i) => i === idx ? false : v));
  };

  // Save contest details to localStorage
  const saveContestDetails = () => {
    let userData;
    try {
      userData = JSON.parse(localStorage.getItem('cfvc-user-data')) || { contests: [], topicStats: {} };
    } catch {
      userData = { contests: [], topicStats: {} };
    }
    const contestResult = {
      date: new Date().toISOString(),
      problems: problems.map((p, i) => ({
        contestId: p.contestId,
        index: p.index,
        tag: p.tag,
        status: statuses[i],
      })),
    };
    userData.contests.push(contestResult);
    for (let i = 0; i < problems.length; ++i) {
      if (statuses[i] === 'ACCEPTED') {
        const tag = problems[i].tag;
        if (!userData.topicStats[tag]) userData.topicStats[tag] = [];
        userData.topicStats[tag].push({
          contestId: problems[i].contestId,
          index: problems[i].index,
          date: contestResult.date
        });
      }
    }
    localStorage.setItem('cfvc-user-data', JSON.stringify(userData));
  };

  // Call saveContestDetails on every status change
  useEffect(() => {
    saveContestDetails();
    // eslint-disable-next-line
  }, [statuses]);

  const handleManualEnd = () => {
    localStorage.removeItem('cfvc-contest-timeleft');
    onEnd();
  };

  return (
    <div className="contest-live-container">
      <h2>Contest Live</h2>
      <div className="contest-live-timer">
        Time Left: <b>{formatTime(timeLeft)}</b>
      </div>
      <table className="contest-live-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Problem</th>
            <th>Status</th>
            <th>Check</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p, idx) => (
            <tr key={idx}>
              <td style={{ textAlign: 'center' }}>{idx + 1}</td>
              <td>
                <a className="contest-live-problem-link" href={getProblemUrl(p.contestId, p.index)} target="_blank" rel="noopener noreferrer">
                  {p.contestId}{p.index} ({p.tag})
                </a>
              </td>
              <td>
                <span className={`contest-live-status${statuses[idx]==='accepted' ? ' accepted' : statuses[idx]==='wrong' ? ' wrong' : ''}`}
                  style={statuses[idx]==='accepted' ? { background: 'rgba(144,238,144,0.3)', borderRadius: '6px', padding: '4px 10px', display: 'inline-block' } : {}}>
                  {statuses[idx]}
                </span>
              </td>
              <td>
                <button className="contest-live-check-btn" onClick={() => checkSubmission(idx)} disabled={checking[idx]}>
                  {checking[idx] ? 'Checking...' : 'Check'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="contest-live-footer">
        The contest will end automatically after 2 hours.<br/>
        <button className="problem-link" style={{marginTop:8}} onClick={handleManualEnd}>End Contest Now</button>
      </div>
    </div>
  );
}

export default ContestLive;
