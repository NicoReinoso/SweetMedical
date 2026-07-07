import { Card, Button, Badge, ListGroup, Modal } from "react-bootstrap";
import { useSession } from "../../context/SessionContext";
import { useState, useEffect } from "react";
import api from "../../api/api.js";


function PerfilMedico() {

  const [medico, setMedico] = useState(null);
  const { user } = useSession();
  const [mostrarModalEspecialidad, setMostrarModalEspecialidad] = useState(false);
  const [especialidadesDisponibles, setEspecialidadesDisponibles] = useState([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState("");

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
    await api.post(`/medicos/${user.id}/especialidad`, {
        nombre: especialidadSeleccionada
    });

    setMostrarModalEspecialidad(false);

    cargarPerfil();
};

const abrirModalEspecialidad = async () => {
    const { data } = await api.get("/medicos/especialidades");

    setEspecialidadesDisponibles(data);
    setMostrarModalEspecialidad(true);
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
          >
            Agregar práctica
          </Button>

          <h5>Disponibilidad</h5>

          <ListGroup className="mb-3">
            {medico.disponibilidad.map((d, index) => (
              <ListGroup.Item key={index}>
                {d}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Button
            variant="outline-primary"
            size="sm"
            className="mb-4"
          >
            Agregar disponibilidad
          </Button>

          <hr />


        </Card.Body>

      </Card>

      

    </div>
    
    
  );
  
  
}

export default PerfilMedico;