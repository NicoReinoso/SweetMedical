import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { PreseleccionProvider } from './context/PreseleccionContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/global.css";
import "./styles/headers.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { SessionProvider } from './context/SessionContext';
import { NotificacionesProvider } from './context/NotificacionesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <NotificacionesProvider>
          <PreseleccionProvider>
            <App />
          </PreseleccionProvider>
        </NotificacionesProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
);