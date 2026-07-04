import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import HomePublica from "../features/homePublica/HomePublica";
import BuscarTurnos from "../features/buscarTurnos/BuscarTurnos";
import Preseleccion from "../features/preseleccion/Preseleccion";
import Navbar from "../components/headers/Navbar";
import HomePaciente from "../features/homePaciente/HomePaciente";
import HomeMedico from "../features/homeMedico/HomeMedico";
import Login from "../features/login/Login";  
import MisTurnosPaciente from "../features/misTurnosPaciente/MisTurnosPaciente";
import MisTurnosMedico from "../features/misTurnosMedico/MisTurnosMedico";
import PerfilPaciente from "../features/perfilPaciente/PerfilPaciente";
import PerfilMedico from "../features/perfilMedico/PerfilMedico";
import Notificaciones from "../features/notificaciones/Notificaciones";

function AppRouter() {
  const handleSkipClick = (e) => {
    e.preventDefault();
    const main = document.getElementById("main-content");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus();
    }
  };

  const [rol, setRol] = useState(localStorage.getItem("rol") || "publico");

  return (
    <>
      <a
        href="#main-content"
        className="visually-hidden-focusable"
        onClick={handleSkipClick}
      >
        Saltar al contenido principal
      </a>
      
      <Navbar rol={rol} setRol={setRol} />
      
      <Routes>
        <Route path="/" element={<HomePublica />} />

         <Route path="/login" element={<Login setRol={setRol} />} />

        <Route path="/paciente" element={<HomePaciente />} />
        <Route path="/paciente/buscar" element={<BuscarTurnos />} />
        <Route path="/paciente/preseleccion" element={<Preseleccion />} />
        <Route path="/paciente/mis-turnos" element={<MisTurnosPaciente />} />
        <Route path="/paciente/perfil" element={<PerfilPaciente />} />
        <Route path="/paciente/notificaciones" element={<Notificaciones />} />

        <Route path="/medico" element={<HomeMedico />} />
        <Route path="/medico/mis-turnos" element={<MisTurnosMedico />} />
        <Route path="/medico/perfil" element={<PerfilMedico />} />
        <Route path="/medico/notificaciones" element={<Notificaciones />} />
      </Routes>
    </>
  );
}

export default AppRouter;