import { Card, Button } from "react-bootstrap";
import { usePreseleccion } from "../context/PreseleccionContext";

function TurnoCard({ turno, onAgregado }) {
  const { agregarTurno, turnosPreseleccionados } = usePreseleccion();

  const turnoYaPreseleccionado = turnosPreseleccionados.some(
  (t) =>
    t.medicoId === turno.medicoId &&
    t.fechaHora === turno.fechaHora &&
    t.consultaSolicitada?.nombre === turno.consultaSolicitada?.nombre
);

const horarioOcupado = turnosPreseleccionados.some(
  (t) =>
    t.fechaHora === turno.fechaHora &&
    !(
      t.medicoId === turno.medicoId &&
      t.consultaSolicitada?.nombre === turno.consultaSolicitada?.nombre
    )
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
          variant={turnoYaPreseleccionado || horarioOcupado ? "secondary" : "primary"}
          disabled={turnoYaPreseleccionado || horarioOcupado}
          onClick={() => {
            const agregado = agregarTurno(turno);

            if (agregado) {
              onAgregado("Turno agregado a la preselección", "success");
            }
          }}
          className="mt-auto"
          aria-label={
          turnoYaPreseleccionado
            ? `Turno con ${turno.medicoNombre} el ${fecha} ya preseleccionado`
            : horarioOcupado
              ? `Ya tenés otro turno seleccionado para el ${fecha}`
              : `Agregar turno con ${turno.medicoNombre} el ${fecha} a la preselección`
        }
        >
          {turnoYaPreseleccionado
            ? "Turno ya preseleccionado"
            : horarioOcupado
              ? "Horario ocupado"
              : "Agregar a preselección"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default TurnoCard;