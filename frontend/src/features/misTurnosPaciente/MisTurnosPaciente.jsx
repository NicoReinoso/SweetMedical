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
    <div className="container py-4">

      <h1>Mis Turnos</h1>

      <Row className="g-3 mt-2">

        {turnos.map((turno) => (

          <Col md={6} key={turno.id}>

            <Card className="shadow-sm">

              <Card.Body>

                <Card.Title>
                  {turno.medico}
                </Card.Title>

                <Card.Text>

                  <strong>Especialidad:</strong>{" "}
                  {turno.especialidad}

                  <br />

                  <strong>Fecha:</strong>{" "}
                  {turno.fecha}

                </Card.Text>

                <Badge
                  bg={
                    turno.estado === "CONFIRMADO"
                      ? "success"
                      : "warning"
                  }
                >
                  {turno.estado}
                </Badge>

                <div className="mt-3">

                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    Reprogramar
                  </Button>

                  <Button
                    variant="outline-danger"
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