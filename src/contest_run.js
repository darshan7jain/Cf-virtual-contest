import React, { useState } from 'react';

function ContestRun({ handle }) {
  const [level, setLevel] = useState('');

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  return (
    <div>
      <h2>Welcome, {handle}!</h2>
      <p>Select question level to start the contest:</p>
      <select value={level} onChange={handleLevelChange}>
        <option value="">Select level</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
      {level && <p>Selected Level: {level}</p>}
    </div>
  );
}

export default ContestRun;
