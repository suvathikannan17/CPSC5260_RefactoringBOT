import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [error, setError] = useState('');
  const [fileExtension, setFileExtension] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRefactoredCode('');

    try {
      const response = await fetch('http://localhost:5005/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code }),
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const nameParts = file.name.split('.');
    const extension = nameParts.length > 1 ? nameParts.pop() : 'txt';
    const validExtensions = ['js', 'java', 'py', 'cpp', 'c', 'cs', 'rb', 'go', 'ts'];
    setFileExtension(extension);
    
    if (!validExtensions.includes(extension)) {
      setError('Unsupported file type. Please upload a code file (e.g., .js, .java, .py).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      setError(''); // Clear any previous errors when a file is successfully loaded
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([refactoredCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `refactored_code.${fileExtension}`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="App">
      <h1 className='title'>Refactor BOT</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="main-container">
          <div className="editor-wrapper">
            <textarea
              className="code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
            />
            <input 
              type="file" 
              id="file-upload" 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
            <button 
              type="button" 
              className="submit-btn" 
              onClick={() => document.getElementById('file-upload').click()}
            >
              Upload File
            </button>
          </div>
          

          <button type="submit" className="submit-btn">Refactor</button>

          <div className="editor-wrapper">
            <textarea
            className = "code-textarea"
            value={refactoredCode}
            onChange={(e) => setRefactoredCode(e.target.value)}
            placeholder="Refactored code will appear here..."
            />
            <button 
              type="button" 
              className="submit-btn" 
              onClick={handleDownload}
              disabled={!refactoredCode}>
                Download Refactored Code
              </button>
          </div>   
        </div>
      </form>
    </div>
  );
}

export default App;
