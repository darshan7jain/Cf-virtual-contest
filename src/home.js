import React, { useState, useEffect } from 'react';
import './styles/home.css';
import ContestEnter from './contest_enter';
import ContestRun from './contest_run';
import Analysis from './analysis';
import About from './about';

function Home() {
  const [activeTab, setActiveTab] = useState('contest');
  const [handle, setHandle] = useState(() => localStorage.getItem('cfvc-handle') || '');
  const [isVerified, setIsVerified] = useState(() => !!localStorage.getItem('cfvc-handle'));

  useEffect(() => {
    if (isVerified && handle) {
      localStorage.setItem('cfvc-handle', handle);
    } else {
      localStorage.removeItem('cfvc-handle');
    }
  }, [handle, isVerified]);

  const tabChanger = (tab) => {
    setActiveTab(tab);
  };

  const handleVerify = (enteredHandle) => {
    setHandle(enteredHandle);
    setIsVerified(true);
  };

  const handleLogout = () => {
    setHandle('');
    setIsVerified(false);
    setActiveTab('contest');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="navbar-title">CF Virtual Contest</span>
          <button className={`navbar-link${activeTab === 'contest' ? ' active' : ''}`} onClick={() => tabChanger('contest')}>
            {isVerified ? 'Contest Run' : 'Contest'}
          </button>
          <button className={`navbar-link${activeTab === 'analysis' ? ' active' : ''}`} onClick={() => tabChanger('analysis')}>Analysis</button>
          <button className={`navbar-link${activeTab === 'about' ? ' active' : ''}`} onClick={() => tabChanger('about')}>About</button>
        </div>
        <div className="navbar-right">
          <span className="navbar-handle">Handle: <b>{handle || 'Not verified'}</b></span>
          {isVerified && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>
      <div className="tab-content">
        {activeTab === 'contest' && (
          isVerified ? <ContestRun handle={handle} /> : <ContestEnter onVerify={handleVerify} />
        )}
        {activeTab === 'analysis' && <Analysis />}
        {activeTab === 'about' && <About />}
      </div>
    </div>
  );
}

export default Home;