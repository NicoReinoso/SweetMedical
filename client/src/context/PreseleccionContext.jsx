import { createContext, useContext, useState } from "react";

const PreseleccionContext = createContext(null);

export function PreseleccionProvider({ children }) {
  const [turnosPreseleccionados, setTurnosPreseleccionados] = useState([]);

  const agregarTurno = (turno) => {
    setTurnosPreseleccionados((prev) => {
      const yaExiste = prev.some(
        (t) =>
          t.medicoId === turno.medicoId &&
          t.fechaHora === turno.fechaHora &&
          t.consultaSolicitada?.nombre === turno.consultaSolicitada?.nombre
      );
      if (yaExiste) return prev;
      return [...prev, turno];
    });
  };

  const quitarTurno = (turno) => {
    setTurnosPreseleccionados((prev) =>
      prev.filter(
        (t) =>
          !(
            t.medicoId === turno.medicoId &&
            t.fechaHora === turno.fechaHora &&
            t.consultaSolicitada?.nombre === turno.consultaSolicitada?.nombre
          )
      )
    );
  };

  return (
    <PreseleccionContext.Provider
      value={{ turnosPreseleccionados, agregarTurno, quitarTurno }}
    >
      {children}
    </PreseleccionContext.Provider>
  );
}

export function usePreseleccion() {
  const context = useContext(PreseleccionContext);
  if (!context) {
    throw new Error(
      "usePreseleccion debe usarse dentro de un PreseleccionProvider"
    );
  }
  return context;
}