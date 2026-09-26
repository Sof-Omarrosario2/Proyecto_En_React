import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EvaluationProvider } from './context/EvaluationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EvaluationProvider>
      <App />
    </EvaluationProvider>
  </React.StrictMode>
);
