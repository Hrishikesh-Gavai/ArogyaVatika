import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/AppClean.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
// ensure fetch wrapper runs early to capture failed API calls in production
import './services/fetchWrapper';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);