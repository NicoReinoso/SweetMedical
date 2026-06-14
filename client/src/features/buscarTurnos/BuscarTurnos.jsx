import TurnoCard from "../../mockdata/TurnoCard";

function BuscarTurnos() {
  return (
    <div>
      <h1>Buscar Turnos</h1>

      <form>
        <input
          type="text"
          placeholder="Especialidad"
        />

        <input
          type="text"
          placeholder="Práctica"
        />

        <input type="date" />

        <input type="date" />

        <button>
          Buscar
        </button>
      </form>

      <h2>Resultados</h2>

      <TurnoCard />
        <TurnoCard />
        <TurnoCard />
    </div>
  );
}

export default BuscarTurnos;