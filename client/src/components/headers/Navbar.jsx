import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      {" | "}
      <Link to="/buscar">Buscar Turnos</Link>
      {" | "}
      <Link to="/preseleccion">Preselección</Link>
    </nav>
  );
}

export default Navbar;