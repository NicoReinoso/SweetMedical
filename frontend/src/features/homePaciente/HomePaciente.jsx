import './HomePaciente.css';
import { useNavigate } from "react-router-dom";


function HomePaciente() {
  const nombre = localStorage.getItem("nombre") || "Paciente";
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="page-header">
          <h1>Hola, {nombre} 👋</h1>
          <p>¿Qué necesitás hoy?</p>
          <div className="hero-actions">
            <button className="btn-mis-turnos" onClick={() => navigate('/paciente/buscar')}>
              Buscar Turno
            </button>

            <button className="btn-mis-turnos" onClick={() => navigate('/paciente/mis-turnos')}>
              Mis Turnos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePaciente;