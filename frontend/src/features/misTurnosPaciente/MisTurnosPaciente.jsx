import { Card, Button, Row, Col, Badge, Modal, Form } from "react-bootstrap";
import { useSession } from "../../context/SessionContext.jsx";
import { useState, useEffect } from "react";
import api from "../../api/api.js";
import ToastNotificacion from "../../components/ToastNotificacion.jsx";

function MisTurnosPaciente() {
  const [turnos, setTurnos] = useState([]);
  const { user } = useSession();
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
  const [turnoCancelar, setTurnoCancelar] = useState(null);
  const [verHistorial, setVerHistorial] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [toast, setToast] = useState({
    show: false,
    mensaje: "",
    variant: "success",
  });

  const mostrarToast = (mensaje, variant = "success") => {
    setToast({
      show: true,
      mensaje,
      variant,
    });
  };

  useEffect(() => {
      if (!user?.id) return;

      if (verHistorial) {
          cargarHistorial();
      } else {
          cargarTurnos();
      }
  }, [user, verHistorial]);

  const cargarTurnos = async () => {
    try {
      const { data } = await api.get(`/pacientes/${user?.id}/misTurnos`);
      setTurnos(data);
    } catch (err) {
      console.error(err);
    }
  }

  const cargarHistorial = async () => {
    try {
      const { data } = await api.get(
        `/pacientes/${user.id}/historialTurnos`
      );

      setTurnos(data);

    } catch (err) {
      console.error(err);
    }
  };

  const reprogramarTurno = async (idTurno, medico, consulta) => {
    try {
      const fechaFutura = new Date();
      fechaFutura.setMonth(fechaFutura.getMonth() + 1);

      const query =
        consulta.tipo === "Especialidad"
          ? `especialidad=${consulta.nombre}`
          : `practica=${consulta.nombre}`;

      const { data } = await api.get(
        `/turnos/disponibles?medicoNombre=${medico.nombre}&${query}&fechaHasta=${fechaFutura.toISOString()}`
      );

      setTurnoSeleccionado(idTurno);
      setOpciones(data.resultados);
      setMostrarModal(true);

    } catch (err) {
      console.error(err);
    }
  };

  const confirmarReprogramacion = async () => {
    try {
      await api.patch(`/turnos/${turnoSeleccionado}/fecha`, {
        fechaHora: fechaSeleccionada
      });

      setMostrarModal(false);

      cargarTurnos();

    } catch (err) {
      mostrarToast(
      err.response?.data?.message || "No se pudo reprogramar el turno",
      "danger");
    }
  };

  const confirmarCancelacion = async () => {
    try {
      await api.delete(`/turnos/${turnoCancelar}`, {
        data: {
          motivo: motivoCancelacion
        }
      });

      setMostrarModalCancelar(false);

      cargarTurnos();

    } catch (err) {
      mostrarToast(
      err.response?.data?.message || "No se pudo reprogramar el turno",
      "danger");
    }
  };

  return (
    <div className="container py-4" id="main-content">
      <div className="page-header">
        <h1>Mis Turnos</h1>
        <p className="text-muted mb-0">
          Consultá y gestioná los turnos que reservaste.
        </p>
      </div>

      <Button
        variant={verHistorial ? "secondary" : "primary"}
        onClick={() => setVerHistorial(!verHistorial)}
      >
        {verHistorial ? "Ver turnos pendientes" : "Ver historial"}
      </Button>

      <Row className="g-3 mt-2">
        {turnos.length === 0 ? (
        <Card className="text-center p-4">
        <Card.Body>
          <Card.Title>
            {verHistorial
              ? "No hay turnos en el historial"
              : "No hay turnos pendientes"}
          </Card.Title>

          <Card.Text>
            {verHistorial
              ? "Todavía no existen turnos finalizados."
              : "No tenés turnos pendientes por el momento."}
          </Card.Text>
        </Card.Body>
      </Card>
      ) : (
        turnos.map((turno) => (

          <Col md={6} key={turno.id}>

            <Card className="shadow-sm">

              <Card.Body>

                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0">
                    {turno.medicoId.nombre}
                  </Card.Title>

                  <Badge
                      bg={
                      turno.estado === "CONFIRMADO"
                        ? "success"
                        : turno.estado === "REALIZADO"
                        ? "primary"
                        : turno.estado === "CANCELADO"
                        ? "danger"
                        : turno.estado === "REPROGRAMADO"
                        ? "info"
                        : "warning" // RESERVADO
                    }
                  >
                    {turno.estado}
                  </Badge>
                </div>

                <Card.Text className="mt-2">

                  <strong>Consulta:</strong>{" "}
                  {turno.consultaSolicitada.nombre}

                  <br />

                  <strong>Fecha:</strong>{" "}
                  {new Date(turno.fechaHora).toLocaleString()}

                </Card.Text>

                {!verHistorial && (<div className="mt-3">

                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => reprogramarTurno(turno._id, turno.medicoId, turno.consultaSolicitada)}
                  >
                    Reprogramar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setTurnoCancelar(turno._id);
                      setMotivoCancelacion("");
                      setMostrarModalCancelar(true);
                    }}
                  >
                    Cancelar
                  </Button>

                </div>
                )}
              </Card.Body>

            </Card>

          </Col>

        )))}
      </Row>
      <Modal

        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
    >
        <Modal.Header closeButton>
            <Modal.Title>
                Reprogramar turno
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>

            <p>Elegí un nuevo horario:</p>

            {opciones.map((opcion) => (

                <div key={opcion.fechaHora}>

                    <input
                        type="radio"
                        name="fecha"
                        value={opcion.fechaHora}
                        onChange={(e) =>
                            setFechaSeleccionada(e.target.value)
                        }
                    />

                    {" "}

                    {new Date(opcion.fechaHora)
                        .toLocaleString("es-AR")}

                </div>

            ))}

        </Modal.Body>

        <Modal.Footer>

            <Button
                variant="secondary"
                onClick={() => setMostrarModal(false)}
            >
                Cancelar
            </Button>

            <Button
                variant="primary"
                disabled={!fechaSeleccionada}
                onClick={confirmarReprogramacion}
            >
                Confirmar
            </Button>

        </Modal.Footer>

    </Modal>

    <Modal
      show={mostrarModalCancelar}
      onHide={() => setMostrarModalCancelar(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Cancelar turno</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        <p>Ingresá el motivo de la cancelación.</p>

        <Form.Control
          as="textarea"
          rows={3}
          value={motivoCancelacion}
          onChange={(e) => setMotivoCancelacion(e.target.value)}
          placeholder="Motivo..."
        />

      </Modal.Body>

      <Modal.Footer>

        <Button
          variant="secondary"
          onClick={() => setMostrarModalCancelar(false)}
        >
          Volver
        </Button>

        <Button
          variant="danger"
          disabled={!motivoCancelacion.trim()}
          onClick={confirmarCancelacion}
        >
          Cancelar turno
        </Button>

      </Modal.Footer>
    </Modal>

    <ToastNotificacion
      show={toast.show}
      mensaje={toast.mensaje}
      variant={toast.variant}
      onClose={() => setToast((t) => ({ ...t, show: false }))}
    />

    </div>

    
  );
}

export default MisTurnosPaciente;