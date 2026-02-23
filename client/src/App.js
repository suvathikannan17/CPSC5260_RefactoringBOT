import React, { useState } from 'react';
import './App.css';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { Upload } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [refactoredCode, setRefactoredCode] = useState('');
  const [error, setError] = useState('');
  const [fileExtension, setFileExtension] = useState('txt');
  const [originalName, setOriginalName] = useState('refactored_code');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [justification, setJustification] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!code.trim()) {
      setError('Please enter or upload code to refactor.');
      return;
    };

    setError('');
    setRefactoredCode('');
    setJustification('');
    setIsLoading(true);
    setIsEditing(false);

    try {
      const response = await fetch('http://localhost:5006/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }

      const data = await response.json();
      if (!data.refactoredCode) {
        throw new Error('Invalid response from server: Missing refactored code');
      }

      setRefactoredCode(data.refactoredCode);
      setJustification(data.justification || '');
    } catch (err) {
      const errorMessage = err.message === 'Failed to fetch' ? 'An error occurred while processing your request. Please try again later.' : err.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setRefactoredCode('');
    setError('');

    const nameParts = file.name.split('.');
    const extension = nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'txt';

    const baseName = nameParts.length > 1 ? nameParts.slice(0, -1).join('.') : nameParts[0];
    const validExtensions = ['js', 'java', 'py', 'cpp', 'c', 'cs', 'rb', 'go', 'ts', 'rs', 'txt'];
    setFileExtension(extension);
    setOriginalName(baseName);
    
    if (!validExtensions.includes(extension)) {
      setError('Unsupported file type. Please upload a suppported code file (js, java, py, cpp, c, cs, rb, go, ts, txt).');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    }
    reader.onload = (event) => {
      setCode(event.target.result);
      setError('');
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([refactoredCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);

    let finalName;
    if(originalName === 'refactored_code') {
      finalName = `refactored_code.${fileExtension}`;
    } else {
      finalName = `${originalName}_refactored.${fileExtension}`;
    }

    element.download = finalName;
    
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handleClear = () => {
    setCode('');
    setRefactoredCode('');
    setError('');
    setJustification('');
    setIsEditing(false);
    setOriginalName('refactored_code');
    setFileExtension('txt');
  };

  const handleEditOriginal = () => {
    setIsEditing(true);
  }

  const handleDownloadJustification = () => {
    const element = document.createElement("a");
    const file = new Blob([justification], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);

    let finalName;
    if(originalName === 'refactored_code') {
      finalName = `refactoring_justification.txt`;
    } else {
      finalName = `${originalName}_refactoring_justification.txt`;
    }

    element.download = finalName;
    
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="App">
      <h1 className='title'>REFACTOR BOT</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className='layout'>
        <div className="main-container">
          {(!isEditing && refactoredCode) ? (
            <div className = "full-diff-wrapper">
              <ReactDiffViewer 
                oldValue={code}
                newValue={refactoredCode}
                splitView={true}
                compareMethod={DiffMethod.LINES}
                leftTitle="Original Code"
                rightTitle="Refactored Code"
                styles={{
                  variables: {
                    addedBackground: 'transparent',
                    wordAddedBackground: 'transparent',
                    removedBackground: '#ffeef0',
                    wordRemovedBackground: '#ffeef0'
                  },
                  diffContainer: {width: '100%'},
                  rightSide: {display: 'none'},
                  contentText: {fontSize: '14px', lineHeight: '20px'},
                  titleBlock: {fontSize: '24px', fontWeight: 'bold', padding: '10px', fontFamily: "Great Vibes, cursive", color: '#4a5568' }
                }}
              />
            </div>
          ) : (
            <>
            <div className='editor-wrapper'>
              <div className = 'label-container'>
                <h3 className='section-label'>Original Code</h3>
                <button type='button' className='clear-btn' onClick={handleClear}>CLEAR</button>
              </div>    
              <textarea
                    className="code-textarea"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                    }}
                    placeholder="Paste your code here..."
              />
              {originalName !== 'refactored_code' && (
                <div className='file-info'>
                  <span>Uploaded: {originalName}.{fileExtension}</span>
                </div>
              )}
            </div>

          <div className='button-container'>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : 'REFACTOR'}
            </button>
            <div className='input-footer'>
                <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
                <button type="button" className="secondary-btn" onClick={() => document.getElementById('file-upload').click()}>
                  <Upload className="upload-icon" size={20} strokeWidth={3}/>UPLOAD FILE
                </button>
            </div>
          </div>

          <div className='editor-wrapper'>
            <div className = 'label-container'>
                <h3 className='section-label'>Refactored Code</h3>
              </div> 
            <div className='full-diff-wrapper'>
              {refactoredCode ? (
                isEditing ? (
                  <div className='refactored-code-view'>
                    <pre>{refactoredCode}</pre>
                  </div>
                ):(
                <ReactDiffViewer 
                oldValue={code}
                newValue={refactoredCode}
                splitView={true}
                compareMethod={DiffMethod.LINES}
                leftTitle="Original Code"
                rightTitle="Refactored Code"
                styles={{
                  variables: {
                    addedBackground: '#e6ffec',
                    wordAddedBackground: '#e6ffec',
                    removedBackground: 'transparent',
                    wordRemovedBackground: 'transparent'
                  },
                  diffContainer: {width: '100%'},
                  leftSide: {display: 'none'},
                  contentText: {fontSize: '14px', lineHeight: '20px'}
                }}
              />
              )) : (
              <div> {isLoading ?  "Processing..." : "Refactored code will appear here..."}</div>
              )}
            </div>
          </div>
          </>
          )}
        </div>
        {refactoredCode && !isEditing && (
          (
            <div className='justification-container'>
              <h3 className='justification-title'>Refactoring Justification</h3>
              <div className='justification-wrapper'>
                <pre className='justification-text'>{justification || "No smells detected."}</pre>
              </div>
            </div>
          )
        )}
        </div>
          
        {refactoredCode && !isEditing && (
          <div className='input-footer'>
            <button type='button' className='tertiary-btn' onClick={handleClear}>CLEAR</button>
            <button type='button' className='tertiary-btn' onClick={handleEditOriginal}>EDIT ORIGINAL</button>
            <button type="button" className="tertiary-btn" onClick={handleDownload} disabled={!refactoredCode}>
                DOWNLOAD REFACTORED CODE
            </button>
            <button type="button" className="tertiary-btn" onClick={handleDownloadJustification} disabled={!justification}>
                DOWNLOAD REFACTORED JUSTIFICATION
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
