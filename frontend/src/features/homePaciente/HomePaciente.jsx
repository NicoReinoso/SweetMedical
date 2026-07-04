import "../homePublica/HomePublica.css";

function HomePaciente() {
  const nombre = localStorage.getItem("nombre") || "Paciente";

  return (
    <div className="hero" id="main-content">
      <h1>Bienvenido, {nombre}</h1>

      <p>
        Encontrá especialistas y reservá tus turnos
        de forma rápida y sencilla.
      </p>
    </div>
  );
}

export default HomePaciente;