import { useNavigate } from "react-router-dom";


function HomeMedico() {
  const nombre = localStorage.getItem("nombre") || "Paciente";
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-card">
          <h1>Hola, {nombre} 👋</h1>
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