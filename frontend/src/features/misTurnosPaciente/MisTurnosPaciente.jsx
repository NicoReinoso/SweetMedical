import { Card, Button, Row, Col, Badge } from "react-bootstrap";

function MisTurnosPaciente() {

    //MOCK
  const turnos = [
    {
      id: 1,
      medico: "Dr. Ramón García",
      especialidad: "Cardiología",
      fecha: "2026-06-20 14:00",
      estado: "CONFIRMADO"
    },
    {
      id: 2,
      medico: "Dra. María Gómez",
      especialidad: "Clínica Médica",
      fecha: "2026-06-25 10:30",
      estado: "PENDIENTE"
    }
  ];

  return (
    <div className="container py-4" id="main-content">
      <div className="page-header">
        <h1>Mis Turnos</h1>
        <p className="text-muted mb-0">
          Consultá y gestioná los turnos que reservaste.
        </p>
      </div>

      <Row className="g-3 mt-2">

        {turnos.map((turno) => (

          <Col md={6} key={turno.id}>

            <Card className="shadow-sm">

              <Card.Body>

                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title className="mb-0">
                    {turno.medico}
                  </Card.Title>

                  <Badge
                    bg={
                      turno.estado === "CONFIRMADO"
                        ? "success"
                        : "warning"
                    }
                  >
                    {turno.estado}
                  </Badge>
                </div>

                <Card.Text className="mt-2">

                  <strong>Especialidad:</strong>{" "}
                  {turno.especialidad}

                  <br />

                  <strong>Fecha:</strong>{" "}
                  {turno.fecha}

                </Card.Text>

                <div className="mt-3">

                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                  >
                    Reprogramar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                  >
                    Cancelar
                  </Button>

                </div>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

    </div>
  );
}

export default MisTurnosPaciente;