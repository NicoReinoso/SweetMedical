import { Card, Button, Row, Col } from "react-bootstrap";
import { useSession } from "../../context/SessionContext";
import { useState, useEffect } from "react";
import api from "../../api/api.js";

function PerfilPaciente() {
  const [paciente, setPaciente] = useState(null);
  const { user } = useSession();

  useEffect(() => {
  if (user?.id) {
    cargarPerfil();
  }
}, [user]);

const cargarPerfil = async () => {
  try {
    const { data } = await api.get(`/pacientes/${user.id}`);
    setPaciente(data);
  } catch (err) {
    console.error(err);
  }
};

  if (!paciente) {
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

          <Row>

            <Col md={6}>
              <p>
                <strong>Nombre:</strong> {paciente.nombre}
              </p>

              <p>
                <strong>DNI:</strong> {paciente.dni}
              </p>

              <p>
                <strong>Teléfono:</strong> {"1234523432"}
              </p>
            </Col>

            <Col md={6}>
              <p>
                <strong>Obra social:</strong> {paciente.obraSocial}
              </p>

              <p>
                <strong>Plan:</strong> {paciente.plan}
              </p>

            </Col>

          </Row>

        </Card.Body>

      </Card>

    </div>
  );
}

export default PerfilPaciente;