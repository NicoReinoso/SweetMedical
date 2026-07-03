import "../homePublica/HomePublica.css";

function HomeMedico() {
  const nombre = localStorage.getItem("nombre") || "Médico";

  return (
    <div className="hero" id="main-content">
      <h1>Bienvenido, {nombre}</h1>

      <p>
        Administrá tu agenda y consultá tus turnos
        de forma rápida y sencilla.
      </p>
    </div>
  );
}

export default HomeMedico;