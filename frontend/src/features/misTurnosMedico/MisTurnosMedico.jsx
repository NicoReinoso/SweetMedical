import { Card, Button, Row, Col, Badge } from "react-bootstrap";

function MisTurnosMedico() {

    //MOCK
  const turnos = [
  {
    id: 1,
    paciente: "Juan Pérez",
    especialidad: "Cardiología",
    fecha: "2026-06-20 14:00",
    estado: "CONFIRMADO"
  },
  {
    id: 2,
    paciente: "Ana García",
    especialidad: "Clínica Médica",
    fecha: "2026-06-25 10:30",
    estado: "RESERVADO"
  },
  {
    id: 3,
    paciente: "Carlos López",
    especialidad: "Dermatología",
    fecha: "2026-06-28 09:00",
    estado: "REPROGRAMADO"
  }
];

  return (
    <div className="container py-4">

      <div className="page-header">
        <h1>Mis Turnos</h1>
        <p className="text-muted mb-0">
          Consultá y gestioná los turnos que te han solicitado.
        </p>
      </div>

      <Row className="g-3 mt-2">

        {turnos.map((turno) => (

          <Col md={6} key={turno.id}>

            <Card className="shadow-sm">

              <Card.Body>

                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0">
                    {turno.paciente}
                  </Card.Title>

                  <Badge
                    bg={
                      turno.estado === "CONFIRMADO"
                        ? "success"
                        : turno.estado === "REPROGRAMADO"
                        ? "info"
                        : "warning"
                    }
                  >
                    {turno.estado}
                  </Badge>
                </div>

                <Card.Text>

                  <strong>Especialidad:</strong>{" "}
                  {turno.especialidad}

                  <br />

                  <strong>Fecha:</strong>{" "}
                  {turno.fecha}

                </Card.Text>

                <div className="mt-3">

                  {(turno.estado === "RESERVADO" ||
                    turno.estado === "REPROGRAMADO") && (
                    <Button variant="success" size="sm" className="me-2">
                      Confirmar
                    </Button>
                  )}

                  {turno.estado === "CONFIRMADO" && (
                    <Button variant="primary" size="sm" className="me-2">
                      Atendido
                    </Button>
                  )}

                  <Button variant="secondary" size="sm" className="me-2">
                    Modificar
                  </Button>

                  {(turno.estado === "RESERVADO" ||
                    turno.estado === "REPROGRAMADO" ||
                    turno.estado === "CONFIRMADO") && (
                    <Button variant="danger" size="sm">
                      Cancelar
                    </Button>
                  )}

                </div>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

    </div>
  );
}

export default MisTurnosMedico;