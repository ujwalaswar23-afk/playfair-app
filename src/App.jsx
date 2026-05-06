import { useState, useMemo } from 'react';
import './App.css';
import { generatePlayfairMatrix, processPlayfair } from './utils/playfair';

function App() {
  const [keyword, setKeyword] = useState('CYBERSECURITY');
  const [inputText, setInputText] = useState('HELLO WORLD');
  const [mode, setMode] = useState('encrypt');

  const { result: outputText, steps, matrix } = useMemo(() => {
    return processPlayfair(inputText || 'X', keyword || 'A', mode === 'encrypt');
  }, [inputText, keyword, mode]);

  const handleModeChange = (newMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      setInputText(outputText); // Swap logic for seamless use
    }
  };

  return (
    <div className="app-container">
      {/* Left Column: Cipher Controls */}
      <div className="glass-panel">
        <div className="header">
          <h1>PLAYFAIR</h1>
          <p>CYBERSECURITY PROJECT</p>
        </div>

        <div className="input-section">
          <div className="input-group">
            <label>
              KEYWORD
              {keyword && <span className="lbl-status">OK</span>}
            </label>
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter secret key..."
              spellCheck="false"
            />
          </div>

          <div className="input-group">
            <label>
              INPUT TEXT ({mode.toUpperCase()})
            </label>
            <textarea 
              className="mono"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text here..."
              spellCheck="false"
            />
          </div>

          <div className="actions">
            <button 
              className={mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => handleModeChange('encrypt')}
            >
              Encrypt Mode
            </button>
            <button 
              className={mode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}
              onClick={() => handleModeChange('decrypt')}
            >
              Decrypt Mode
            </button>
          </div>

          <div className="input-group">
            <label>
              OUTPUT TEXT
            </label>
            <textarea 
              className="mono"
              value={outputText}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Right Column: Visualizer */}
      <div className="glass-panel">
        <h2 className="matrix-title">PLAYFAIR MATRIX</h2>
        <div className="matrix-container">
          {matrix.map((char, index) => (
            <div key={index} className="matrix-cell">
              {char}
            </div>
          ))}
        </div>

        <h3 className="steps-title">TRANSFORMATION STEPS</h3>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-item">
              <span style={{ color: 'var(--accent-cyan)' }}>{step.pair}</span>
              <span className="step-rule">➔ {step.rule} ➔</span>
              <span style={{ color: 'var(--accent-emerald)' }}>{step.encrypted}</span>
            </div>
          ))}
          {steps.length === 0 && (
            <div className="step-rule" style={{ textAlign: 'left', marginTop: '1rem' }}>
              No alphabet characters found in input.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
