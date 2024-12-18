import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Add CSRF token to all requests
axios.defaults.withCredentials = true;
axios.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';
axios.defaults.xsrfCookieName = 'csrf_access_token';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
