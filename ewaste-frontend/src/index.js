import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Εδώ ξεκινάει όλη η εφαρμογή! Το index.js είναι η αρχή του κόσμου μας
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Το στοιχείο App περιέχει όλη την εφαρμογή μας */}
    <App />
  </React.StrictMode>
);

// Μέτρηση επίδοσης
reportWebVitals(); 