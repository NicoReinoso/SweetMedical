import React from "react";
import './HomePublica.css';
import { useNavigate } from "react-router-dom";

function HomePublica() {
  const navigate = useNavigate();
  
    return (
    <div className="hero" id="main-content">
  <div className="hero-overlay" />
  <div className="hero-card">
    <h1>Bienvenido a SWEET MEDICAL</h1>
    <p>Encontrá especialistas y reservá tus turnos de forma rápida y sencilla.</p>
    <div className="hero-actions">
      <button className="btn-ingresar" onClick={() => navigate('/login')}>
        Ingresar
      </button>
    </div>
  </div>
</div>
  );
}

export default HomePublica;