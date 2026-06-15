import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { PreseleccionProvider } from './context/PreseleccionContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/global.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <PreseleccionProvider>
        <App />
      </PreseleccionProvider>
    </HashRouter>
  </React.StrictMode>
);