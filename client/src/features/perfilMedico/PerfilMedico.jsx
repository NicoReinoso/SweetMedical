import { Card, Button, Badge, ListGroup } from "react-bootstrap";

function PerfilMedico() {

  // MOCK
  const medico = {
    nombre: "Dra. María Gómez",
    matricula: "MN 123456",
    email: "maria.gomez@sweetmedical.com",
    telefono: "11 4444-5555",
    especialidades: [
      "Cardiología",
      "Clínica Médica"
    ],
    practicas: [
      "Electrocardiograma",
      "Ergometría"
    ],
    disponibilidad: [
      "Lunes 09:00 - 10:00",
      "Miércoles 14:00 - 15:00",
      "Viernes 11:00 - 12:00"
    ]
  };

  return (
    <div className="container py-4">

      <h1>Mi Perfil</h1>

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
            <strong>Email:</strong>{" "}
            {medico.email}
          </p>

          <p>
            <strong>Teléfono:</strong>{" "}
            {medico.telefono}
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
                {e}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline-primary"
            size="sm"
            className="mb-4"
          >
            Agregar especialidad
          </Button>

          <h5>Prácticas</h5>

          <div className="mb-3">
            {medico.practicas.map((p, index) => (
              <Badge
                bg="success"
                className="me-2 mb-2"
                key={index}
              >
                {p}
              </Badge>
            ))}
          </div>

          <Button
            variant="outline-success"
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
            variant="outline-warning"
            size="sm"
            className="mb-4"
          >
            Agregar disponibilidad
          </Button>

          <hr />

          <Button
            variant="primary"
            className="me-2"
          >
            Editar perfil
          </Button>

          <Button
            variant="outline-secondary"
          >
            Cambiar contraseña
          </Button>

        </Card.Body>

      </Card>

    </div>
  );
}

export default PerfilMedico;