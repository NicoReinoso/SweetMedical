import { Modal, Button } from "react-bootstrap";

function agruparPorDia(opciones) {
  const grupos = {};

  opciones.forEach((opcion) => {
    const fecha = new Date(opcion.fechaHora);
    const claveDia = fecha.toLocaleDateString("es-AR");

    if (!grupos[claveDia]) {
      grupos[claveDia] = {
        etiqueta: fecha.toLocaleDateString("es-AR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        horarios: [],
      };
    }

    grupos[claveDia].horarios.push(opcion);
  });

  return grupos;
}

function ModalReprogramarTurno({
  show,
  onHide,
  opciones,
  fechaSeleccionada,
  setFechaSeleccionada,
  onConfirmar,
}) {
  const grupos = agruparPorDia(opciones);
  const dias = Object.keys(grupos);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Reprogramar turno</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-muted mb-3">Elegí un nuevo horario disponible:</p>

        {dias.length === 0 && (
          <p className="text-muted fst-italic">
            No hay horarios disponibles.
          </p>
        )}

        {dias.map((claveDia) => (
          <div key={claveDia} className="mb-3">
            <div
              className="fw-semibold mb-2 text-capitalize"
              style={{ fontSize: "0.95rem" }}
            >
              {grupos[claveDia].etiqueta}
            </div>

            <div className="d-flex flex-wrap gap-2">
              {grupos[claveDia].horarios.map((opcion) => {
                const seleccionada = fechaSeleccionada === opcion.fechaHora;

                return (
                  <button
                    key={opcion.fechaHora}
                    type="button"
                    onClick={() => setFechaSeleccionada(opcion.fechaHora)}
                    className={`btn btn-sm ${
                      seleccionada ? "btn-primary" : "btn-outline-secondary"
                    }`}
                    style={{ minWidth: "72px" }}
                  >
                    {new Date(opcion.fechaHora).toLocaleTimeString("es-AR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>

        <Button
          variant="primary"
          disabled={!fechaSeleccionada}
          onClick={onConfirmar}
        >
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalReprogramarTurno;