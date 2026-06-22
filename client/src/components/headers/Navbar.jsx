import { useState } from "react";
import { Navbar, Nav, Container, Badge, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { usePreseleccion } from "../../context/PreseleccionContext";
import "./Navbar.css";

function AppNavbar({ rol = "publico", setRol }) {
  const navigate = useNavigate();
  const { turnosPreseleccionados } = usePreseleccion();

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleLogout = () => {
    setMostrarConfirmacion(false);
    localStorage.clear();
    setRol("publico");
    navigate("/");
  };

  return (
    <>
      <Navbar bg="light" expand="md" className="mb-3 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/logo.png"
              alt="Sweet Medical"
              height="32"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto">

              {/* PUBLICO */}
              {rol === "publico" && (
                <>
                  <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                  <Nav.Link as={Link} to="/login">Ingresar</Nav.Link>
                </>
              )}

              {/* PACIENTE */}
              {rol === "paciente" && (
                <>
                  <Nav.Link as={Link} to="/paciente">Inicio</Nav.Link>
                  <Nav.Link as={Link} to="/paciente/buscar">Buscar Turnos</Nav.Link>
                  <Nav.Link as={Link} to="/paciente/mis-turnos">Mis Turnos</Nav.Link>
                  <Nav.Link as={Link} to="/paciente/preseleccion">
                    Preselección
                    {turnosPreseleccionados.length > 0 && (
                      <Badge bg="success" className="ms-1">
                        {turnosPreseleccionados.length}
                      </Badge>
                    )}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/paciente/notificaciones" title="Notificaciones">
                    <i className="bi bi-bell" aria-hidden="true"></i>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/paciente/perfil" title="Mi perfil">
                    <i className="bi bi-person-circle" aria-hidden="true"></i>
                  </Nav.Link>
                  <Nav.Link onClick={() => setMostrarConfirmacion(true)}>Salir</Nav.Link>
                </>
              )}

              {/* MEDICO */}
              {rol === "medico" && (
                <>
                  <Nav.Link as={Link} to="/medico">Inicio</Nav.Link>
                  <Nav.Link as={Link} to="/medico/mis-turnos">Mis Turnos</Nav.Link>
                  <Nav.Link as={Link} to="/medico/notificaciones" title="Notificaciones">
                    <i className="bi bi-bell" aria-hidden="true"></i>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/medico/perfil" title="Mi perfil">
                    <i className="bi bi-person-circle" aria-hidden="true"></i>
                  </Nav.Link>
                  <Nav.Link onClick={() => setMostrarConfirmacion(true)}>Salir</Nav.Link>
                </>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        show={mostrarConfirmacion}
        onHide={() => setMostrarConfirmacion(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cerrar sesión</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Está seguro que desea cerrar sesión?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AppNavbar;