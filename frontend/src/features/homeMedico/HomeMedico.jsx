import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";

function HomeMedico() {
  const navigate = useNavigate();
  const { user } = useSession();

  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-card">
          <h1>Hola, {user?.nombre} 👋</h1>
          <p>¿Qué necesitás hoy?</p>
          <div>
            <button className="btn-mis-turnos" onClick={() => navigate('/medico/mis-turnos')}>
              Mis Turnos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeMedico;