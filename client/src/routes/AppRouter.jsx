import { Routes, Route } from "react-router-dom";

import Home from "../features/home/Home";
import BuscarTurnos from "../features/buscarTurnos/BuscarTurnos";
import Preseleccion from "../features/preseleccion/Preseleccion";
import Navbar from "../components/headers/Navbar";

function AppRouter() {
  return (
    <>
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