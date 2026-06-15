import { Card, Button } from "react-bootstrap";
import { usePreseleccion } from "../../context/PreseleccionContext";

function Preseleccion() {

  const {
    turnosPreseleccionados,
    quitarTurno
  } = usePreseleccion();

  const total = turnosPreseleccionados.reduce(
    (acc, t) => acc + (t.costoEstimado || 0),
    0
  );

  return (
    <div className="container py-4">

      <h1>Turnos Preseleccionados</h1>
      <h5>Turnos seleccionados: {turnosPreseleccionados.length}</h5>
      <p>Total estimado: ${total}</p>

      {turnosPreseleccionados.length === 0 ? (
        <p>No hay turnos seleccionados.</p>
      ) : (
        turnosPreseleccionados.map((turno, index) => (
          <Card key={index} className="mb-3">

          <Card.Body>
            <Card.Title>
              {turno.medicoNombre}
            </Card.Title>

            <p>
              <strong>Consulta:</strong>{" "}
              {turno.consultaSolicitada.nombre}
            </p>

            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(turno.fechaHora).toLocaleString()}
            </p>

            <p>
            <strong>Costo:</strong>{" "}
            {turno.estadoCobertura === "SIN COBERTURA"
              ? `$${turno.costoEstimado}`
              : `$${turno.costoEstimado} (${turno.porcentajeCobertura}% cubierto)`}
            </p>

            <Button
              variant="danger"
              onClick={() => quitarTurno(turno)}
            >
              Eliminar
            </Button>
          </Card.Body>

          </Card>
        ))
      )}

    </div>
  );
}

export default Preseleccion;