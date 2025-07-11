import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // <-- Import this
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n/i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>          {/* Wrap here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// rest unchanged
reportWebVitals();
