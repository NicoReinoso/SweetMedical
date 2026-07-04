import "../homePublica/HomePublica.css";
import { useSession } from "../../context/SessionContext";

function HomeMedico() {
  const { user } = useSession();

  return (
    <div className="hero" id="main-content">
      <h1>Bienvenido, {user?.nombre}</h1>

      <p>
        Administrá tu agenda y consultá tus turnos
        de forma rápida y sencilla.
      </p>
    </div>
  );
}

export default HomeMedico;