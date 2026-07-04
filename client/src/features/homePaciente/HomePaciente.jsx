import "../homePublica/HomePublica.css";
import { useSession } from "../../context/SessionContext";

function HomePaciente() {
  const { user } = useSession();

  return (
    <div className="hero" id="main-content">
      <h1>Bienvenido, {user?.nombre}</h1>

      <p>
        Encontrá especialistas y reservá tus turnos
        de forma rápida y sencilla.
      </p>
    </div>
  );
}

export default HomePaciente;