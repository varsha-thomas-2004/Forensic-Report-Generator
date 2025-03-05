import React, { useState } from 'react';

// Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    cursor: 'not-allowed',
  },
  reportContainer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f4f4f4',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
};

// Spinner Component
const Spinner = () => (
  <div style={{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '40px'
  }}>
    <div style={{
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #3498db',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite'
    }}></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const ForensicReportGenerator = () => {
  const [logInput, setLogInput] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    // Reset previous states
    setReport('');
    setError('');
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:5000/forensic_report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ log: logInput }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
  
      const data = await response.json();
      setReport(data.forensic_report);
    } catch (err) {
      setError('Error generating forensic report. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Forensic Report Generator</h1>
      
      <textarea
        style={styles.textarea}
        placeholder="Paste your forensic log here..."
        value={logInput}
        onChange={(e) => setLogInput(e.target.value)}
      />

      <button 
        style={{
          ...styles.button,
          ...((!logInput || isLoading) ? styles.buttonDisabled : {})
        }}
        onClick={generateReport}
        disabled={!logInput || isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Forensic Report'}
      </button>

      {isLoading && <Spinner />}

      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}

      {report && (
        <div style={styles.reportContainer}>
          <h2>Generated Forensic Report:</h2>
          <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>
            {report}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ForensicReportGenerator;