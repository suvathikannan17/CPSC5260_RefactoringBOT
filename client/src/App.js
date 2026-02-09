import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRefactoredCode('');

    try {
      const response = await fetch('http://localhost:5001/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const data = await response.json();
      setRefactoredCode(data.refactoredCode);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1 className='title'>Refactor BOT</h1>

      <form onSubmit={handleSubmit}>
        <div className="main-container">
          <textarea
            className = "code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
          />

          <button type="submit" className="submit-btn" onClick={handleSubmit}>Refactor</button>

          <textarea
            className = "code-textarea"
            value={refactoredCode}
            onChange={(e) => setRefactoredCode(e.target.value)}
            placeholder="Refactored code will appear here..."
          />
        </div>
      </form>
    </div>
  );
}

export default App;
