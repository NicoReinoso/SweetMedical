import { Card, Button } from "react-bootstrap";
import { usePreseleccion } from "../context/PreseleccionContext";

function TurnoCard({ turno }) {
  const { agregarTurno, turnosPreseleccionados } = usePreseleccion();

  const yaPreseleccionado = turnosPreseleccionados.some(
    (t) =>
      t.medicoId === turno.medicoId &&
      t.fechaHora === turno.fechaHora &&
      t.consultaSolicitada?.nombre === turno.consultaSolicitada?.nombre
  );

  const fecha = new Date(turno.fechaHora).toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const tipoConsulta =
    turno.consultaSolicitada?.tipo === "PRACTICA" ? "Práctica" : "Especialidad";

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{turno.medicoNombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {tipoConsulta}: {turno.consultaSolicitada?.nombre}
        </Card.Subtitle>
        <Card.Text>
          <strong>Fecha:</strong> {fecha}
          <br />
          <strong>Sede:</strong> {turno.sede}
          <br />
          <strong>Costo:</strong>{" "}
          {turno.estadoCobertura === "SIN COBERTURA"
            ? `$${turno.costoEstimado ?? "-"} (sin cobertura)`
            : `$${turno.costoEstimado ?? "-"} (${turno.porcentajeCobertura}% cubierto)`}
        </Card.Text>
        <Button
          variant={yaPreseleccionado ? "secondary" : "primary"}
          disabled={yaPreseleccionado}
          onClick={() => agregarTurno(turno)}
          className="mt-auto"
        >
          {yaPreseleccionado ? "Ya preseleccionado" : "Agregar a preselección"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default TurnoCard;