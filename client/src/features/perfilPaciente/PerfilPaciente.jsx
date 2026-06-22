import { Card, Button, Row, Col } from "react-bootstrap";

function PerfilPaciente() {

  // MOCK
  const paciente = {
    nombre: "Juan Pérez",
    dni: "35.123.456",
    email: "juan.perez@gmail.com",
    telefono: "11 5555-1234",
    obraSocial: "OSDE",
    plan: "210",
    numeroAfiliado: "123456789"
  };

  return (
    <div className="container py-4">

      <h1>Mi Perfil</h1>

      <Card className="shadow-sm mt-3">

        <Card.Body>

          <Row>

            <Col md={6}>
              <p>
                <strong>Nombre:</strong> {paciente.nombre}
              </p>

              <p>
                <strong>DNI:</strong> {paciente.dni}
              </p>

              <p>
                <strong>Email:</strong> {paciente.email}
              </p>

              <p>
                <strong>Teléfono:</strong> {paciente.telefono}
              </p>
            </Col>

            <Col md={6}>
              <p>
                <strong>Obra social:</strong> {paciente.obraSocial}
              </p>

              <p>
                <strong>Plan:</strong> {paciente.plan}
              </p>

              <p>
                <strong>Número de afiliado:</strong>{" "}
                {paciente.numeroAfiliado}
              </p>
            </Col>

          </Row>

          <div className="mt-3">
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
          </div>

        </Card.Body>

      </Card>

    </div>
  );
}

export default PerfilPaciente;