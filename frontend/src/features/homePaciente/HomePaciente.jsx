import './HomePaciente.css';
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

function HomePaciente() {
  const navigate = useNavigate();
  const { user } = useSession();

  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-card">
          <h1>Hola, {user?.nombre} 👋</h1>
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