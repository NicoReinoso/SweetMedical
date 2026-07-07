import { Card, Button, Badge, ListGroup, Modal, Form, Toast } from "react-bootstrap";
import { useSession } from "../../context/SessionContext";
import ToastNotificacion from "../../components/ToastNotificacion.jsx";
import { useState, useEffect } from "react";
import api from "../../api/api.js";


function PerfilMedico() {

  const [medico, setMedico] = useState(null);
  const { user } = useSession();
  const [mostrarModalEspecialidad, setMostrarModalEspecialidad] = useState(false);
  const [mostrarModalPractica, setMostrarModalPractica] = useState(false);

  // Disponibilidad
  const [mostrarModalDisponibilidad, setMostrarModalDisponibilidad] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const diasSemana = [
  { value: "LUNES", label: "Lunes" },
  { value: "MARTES", label: "Martes" },
  { value: "MIERCOLES", label: "Miércoles" },
  { value: "JUEVES", label: "Jueves" },
  { value: "VIERNES", label: "Viernes" },
  { value: "SABADO", label: "Sábado" }
];

const horarios = [];

for (let h = 8; h < 20; h++) {
  const desde = `${String(h).padStart(2, "0")}:00`;
  const hasta = `${String(h + 1).padStart(2, "0")}:00`;

  horarios.push({
    desde,
    hasta,
    label: `${desde} - ${hasta}`
  });
}

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

  const [nombreEspecialidad, setNombreEspecialidad] = useState("");
  const [costoEspecialidad, setCostoEspecialidad] = useState("");

  const [nombrePractica, setNombrePractica] = useState("");
  const [costoPractica, setCostoPractica] = useState("");

  useEffect(() => {
  if (user?.id) {
    cargarPerfil();
  }
}, [user]);

const cargarPerfil = async () => {
  try {
    const { data } = await api.get(`/medicos/${user.id}`);
    setMedico(data);
  } catch (err) {
    console.error(err);
  }
};

const confirmarEspecialidad = async () => {
  try {
    await api.post(`/medicos/${user.id}/especialidad`, {
      nombre: nombreEspecialidad,
      costo: Number(costoEspecialidad)
    });

    setNombreEspecialidad("");
    setCostoEspecialidad("");
    setMostrarModalEspecialidad(false);
    mostrarToast("Especialidad agregada correctamente");

    cargarPerfil();
  } catch (err) {
    mostrarToast(
        err.response?.data?.message || "No se pudo agregar la especialidad",
        "danger"
      );
  }
};

const confirmarPractica = async () => {
  try {
    await api.post(`/medicos/${user.id}/practica`, {
      nombre: nombrePractica,
      costo: Number(costoPractica)
    });

    setNombrePractica("");
    setCostoPractica("");
    setMostrarModalPractica(false);
    mostrarToast("Practica agregada correctamente");

    cargarPerfil();
  } catch (err) {
    mostrarToast(
        err.response?.data?.message || "No se pudo agregar la practica",
        "danger"
      );
  }
};

const abrirModalEspecialidad = () => {
  setMostrarModalEspecialidad(true);
};

// DISPONIBILIDAD
const abrirModalDisponibilidad = () => {
    setDiaSeleccionado("");
    setHoraSeleccionada("");
    setMostrarModalDisponibilidad(true);
};

const confirmarDisponibilidad = async () => {
  try {
    const horario = horarios.find(
      h => h.desde === horaSeleccionada
    );

    await api.post(`/medicos/${user.id}/disponibilidad`, {
      diaSemana: diaSeleccionado,
      horaDesde: horario.desde,
      horaHasta: horario.hasta
    });

    setMostrarModalDisponibilidad(false);
    cargarPerfil();

    mostrarToast("Disponibilidad agregada correctamente");
  } catch (err) {
    mostrarToast(
      err.response?.data?.message || "No se pudo agregar la disponibilidad",
      "danger"
    );
  }
};

const cerrarModalDisponibilidad = () => {
    setDiaSeleccionado("");
    setHoraSeleccionada("");
    setMostrarModalDisponibilidad(false);
};


  if (!medico) {
    return (
      <div className="container py-4">
        <p>Cargando perfil...</p>
      </div>
    );
  }
  return (
    <div className="container py-4">

      <div className="page-header">
        <h1>Mi Perfil</h1>
      </div>

      <Card className="shadow-sm mt-3">

        <Card.Body>

          <Card.Title>
            {medico.nombre}
          </Card.Title>

          <p>
            <strong>Matrícula:</strong>{" "}
            {medico.matricula}
          </p>

          <p>
            <strong>Teléfono:</strong>{" "}
            {"1234563223"}
          </p>

          <hr />

          <h5>Especialidades</h5>

          <div className="mb-3">
            {medico.especialidades.map((e, index) => (
              <Badge
                bg="primary"
                className="me-2 mb-2"
                key={index}
              >
                {e.nombre}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline-primary"
            size="sm"
            className="mb-4"
            onClick={abrirModalEspecialidad}
          >
            Agregar especialidad
          </Button>

          <h5>Prácticas</h5>

          <div className="mb-3">
            {medico.practicas.map((p, index) => (
              <Badge
                bg="primary"
                className="me-2 mb-2"
                key={index}
              >
                {p.nombre}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline-primary"
            size="sm"
            className="mb-4"
            onClick={() => setMostrarModalPractica(true)}
          >
            Agregar práctica
          </Button>

          <h5>Disponibilidad</h5>

          <ListGroup className="mb-3">
            {medico.disponibilidad.map((d, index) => (
              <ListGroup.Item key={index}>
                <strong>{d.diaSemana}</strong> — {d.horaDesde} a {d.horaHasta}
            </ListGroup.Item>
            ))}
          </ListGroup>

          <Button
            variant="outline-primary"
            size="sm"
            className="mb-4"
             onClick={abrirModalDisponibilidad}
          >
            Agregar disponibilidad
          </Button>

          <hr />


        </Card.Body>

      </Card>

      <Modal
    show={mostrarModalDisponibilidad}
    onHide={cerrarModalDisponibilidad}
>

    <Modal.Header closeButton>
        <Modal.Title>
            Agregar disponibilidad
        </Modal.Title>
    </Modal.Header>

    <Modal.Body>

        <Form.Group className="mb-3">

            <Form.Label>Día</Form.Label>

            <Form.Select
                value={diaSeleccionado}
                onChange={(e) => setDiaSeleccionado(e.target.value)}
            >

                <option value="">
                    Seleccione...
                </option>

                {diasSemana.map((dia) => (
                    <option key={dia.value} value={dia.value}>
                        {dia.label}
                    </option>
                ))}

            </Form.Select>

        </Form.Group>

        <Form.Group>

            <Form.Label>Horario</Form.Label>

            <Form.Select
              value={horaSeleccionada}
              onChange={(e) => setHoraSeleccionada(e.target.value)}
            >
              <option value="">
                Seleccione...
              </option>

              {horarios.map((horario) => (
                <option
                  key={horario.desde}
                  value={horario.desde}
                >
                  {horario.label}
                </option>
              ))}
            </Form.Select>

        </Form.Group>

    </Modal.Body>

    <Modal.Footer>

        <Button
            variant="secondary"
            onClick={cerrarModalDisponibilidad}
        >
            Cancelar
        </Button>

        <Button
            variant="primary"
            disabled={!diaSeleccionado || !horaSeleccionada}
            onClick={confirmarDisponibilidad}
        >
            Agregar
        </Button>

    </Modal.Footer>

</Modal>
<Modal
  show={mostrarModalEspecialidad}
  onHide={() => setMostrarModalEspecialidad(false)}
>
  <Modal.Header closeButton>
    <Modal.Title>Agregar especialidad</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form.Group className="mb-3">
      <Form.Label>Nombre</Form.Label>
      <Form.Control
        value={nombreEspecialidad}
        onChange={(e) => setNombreEspecialidad(e.target.value)}
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Costo</Form.Label>
      <Form.Control
        type="number"
        min={0}
        step={100}
        value={costoEspecialidad}
        onChange={(e) => setCostoEspecialidad(e.target.value)}
      />
    </Form.Group>
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setMostrarModalEspecialidad(false)}
    >
      Cancelar
    </Button>

    <Button
      variant="primary"
      onClick={confirmarEspecialidad}
    >
      Guardar
    </Button>
  </Modal.Footer>
</Modal>
<Modal
  show={mostrarModalPractica}
  onHide={() => setMostrarModalPractica(false)}
>
  <Modal.Header closeButton>
    <Modal.Title>Agregar práctica</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form.Group className="mb-3">
      <Form.Label>Nombre</Form.Label>
      <Form.Control
        value={nombrePractica}
        onChange={(e) => setNombrePractica(e.target.value)}
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Costo</Form.Label>
      <Form.Control
        type="number"
        min={0}
        step={100}
        value={costoPractica}
        onChange={(e) => setCostoPractica(e.target.value)}
      />
    </Form.Group>
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setMostrarModalPractica(false)}
    >
      Cancelar
    </Button>

    <Button
      variant="primary"
      onClick={confirmarPractica}
    >
      Guardar
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

export default PerfilMedico;