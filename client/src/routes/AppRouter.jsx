import { Routes, Route } from "react-router-dom";

import Home from "../features/home/Home";
import BuscarTurnos from "../features/buscarTurnos/BuscarTurnos";
import Preseleccion from "../features/preseleccion/Preseleccion";
import Navbar from "../components/headers/Navbar";

function AppRouter() {
  const handleSkipClick = (e) => {
    e.preventDefault();
    const main = document.getElementById("main-content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="visually-hidden-focusable"
        onClick={handleSkipClick}
      >
        Saltar al contenido principal
      </a>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<BuscarTurnos />} />
        <Route path="/preseleccion" element={<Preseleccion />} />
      </Routes>
    </>
  );
}

export default AppRouter;