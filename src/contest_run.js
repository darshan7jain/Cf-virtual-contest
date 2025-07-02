import React, { useState } from 'react';
import { ratingOptions, topicOptions } from './problemset/options';
import './styles/contest_run.css';

function getProblemUrl(contestId, index) {
  return `https://codeforces.com/contest/${contestId}/problem/${index}`;
}

function ContestRun({ handle }) {
  const [questions, setQuestions] = useState([
    { rating: '', topic: '', problem: null },
    { rating: '', topic: '', problem: null },
    { rating: '', topic: '', problem: null },
    { rating: '', topic: '', problem: null },
  ]);
  const [started, setStarted] = useState(false);

  // Store selected problems for contest_live
  const [selectedProblems, setSelectedProblems] = useState([]);

  const handleChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    updated[idx].problem = null; // reset problem if selection changes
    setQuestions(updated);
    if (field === 'rating' || field === 'topic') {
      if (updated[idx].rating && updated[idx].topic) {
        fetchProblem(idx, updated[idx].rating, updated[idx].topic);
      }
    }
  };

  const fetchProblem = async (idx, rating, topic) => {
    try {
      const data = await import(`./problemset/${rating}.json`);
      let tag = topic;
      if (topic === 'random') {
        // pick a random tag with at least one problem
        const tagsWithProblems = Object.keys(data.default).filter(t => data.default[t].length > 0);
        tag = tagsWithProblems[Math.floor(Math.random() * tagsWithProblems.length)];
      }
      const problems = data.default[tag] || [];
      if (problems.length > 0) {
        const problem = problems[Math.floor(Math.random() * problems.length)];
        setQuestions(qs => {
          const newQs = [...qs];
          newQs[idx].problem = { ...problem, tag };
          return newQs;
        });
      } else {
        setQuestions(qs => {
          const newQs = [...qs];
          newQs[idx].problem = { error: 'No problem found for this selection.' };
          return newQs;
        });
      }
    } catch (e) {
      setQuestions(qs => {
        const newQs = [...qs];
        newQs[idx].problem = { error: 'Problem data not found.' };
        return newQs;
      });
    }
  };

  const handleStart = () => {
    // Only start if all questions have a valid problem
    const allReady = questions.every(q => q.problem && !q.problem.error);
    if (!allReady) {
      alert('Please select rating and topic for all questions and ensure all problems are loaded.');
      return;
    }
    setSelectedProblems(questions.map(q => ({
      contestId: q.problem.contestId,
      index: q.problem.index,
      tag: q.problem.tag
    })));
    setStarted(true);
  };

  const handleContestEnd = () => {
    setStarted(false);
    // Optionally, you can reset questions or show a summary here
  };

  if (started) {
    const ContestLive = require('./contest_live').default;
    return <ContestLive handle={handle} problems={selectedProblems} onEnd={handleContestEnd} />;
  }

  return (
    <div className="contest-run-container">
      <h2>Welcome, {handle}!</h2>
      <p>Select question level and corresponding topic to start the contest:</p>
      {questions.map((q, idx) => (
        <div key={idx} className="question-block">
          <h4>Question {idx + 1}</h4>
          <label>
            Rating:
            <select value={q.rating} onChange={e => handleChange(idx, 'rating', e.target.value)}>
              <option value="">Select rating</option>
              {ratingOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <label style={{ marginLeft: '16px' }}>
            Topic:
            <select value={q.topic} onChange={e => handleChange(idx, 'topic', e.target.value)}>
              <option value="">Select topic</option>
              {topicOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <div style={{ marginTop: '8px' }}>
            {q.problem && q.problem.error && <span className="error-message">{q.problem.error}</span>}
            {q.problem && !q.problem.error && (
              <a className="problem-link" href={getProblemUrl(q.problem.contestId, q.problem.index)} target="_blank" rel="noopener noreferrer">
                Go to Problem ({q.problem.tag})
              </a>
            )}
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button className="problem-link" style={{ fontSize: '18px', padding: '10px 32px' }} onClick={handleStart}>
          Start Contest
        </button>
      </div>
    </div>
  );
}

export default ContestRun;
