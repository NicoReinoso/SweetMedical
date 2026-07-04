import { Card, Button } from "react-bootstrap";
import { usePreseleccion } from "../context/PreseleccionContext";
import { Toast, ToastContainer } from "react-bootstrap";
import { useState } from "react";

function TurnoCard({ turno }) {
  const { agregarTurno, turnosPreseleccionados } = usePreseleccion();
  const [mostrarToast, setMostrarToast] = useState(false);

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
    <div>
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
            onClick={() => {
              agregarTurno(turno);
              setMostrarToast(true);
            }}
            className="mt-auto"
            aria-label={
              yaPreseleccionado
                ? `Turno con ${turno.medicoNombre} el ${fecha} ya preseleccionado`
                : `Agregar turno con ${turno.medicoNombre} el ${fecha} a la preselección`
            }
          >
            {yaPreseleccionado ? "Ya preseleccionado" : "Agregar a preselección"}
          </Button>
        </Card.Body>
      </Card>
        <ToastContainer
          className="position-fixed top-0 start-50 translate-middle-x p-3"
        >
          <Toast
            show={mostrarToast}
            onClose={() => setMostrarToast(false)}
            delay={3000}
            autohide
            bg="success"
          >
            <Toast.Header>
              <strong className="me-auto">Sweet Medical</strong>
            </Toast.Header>

            <Toast.Body className="text-white">
              Turno agregado correctamente
            </Toast.Body>
          </Toast>
      </ToastContainer>
    </div>
  );
}

export default TurnoCard;