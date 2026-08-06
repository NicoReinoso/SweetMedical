import { useState } from "react";
import { Navbar, Nav, Container, Badge, Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { usePreseleccion } from "../../context/PreseleccionContext";
import "./Navbar.css";
import { useSession } from "../../context/SessionContext";
import { useNotificaciones } from "../../context/NotificacionesContext";

function AppNavbar() {
  const navigate = useNavigate();
  const { turnosPreseleccionados } = usePreseleccion();
  const { user, logout } = useSession();
  const { noLeidasCount, refrescarConteo } = useNotificaciones();
  const rol = user?.rol ?? "publico";

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const handleLogout = () => {
    setMostrarConfirmacion(false);

    logout(); // elimina el token y pone user = null

    localStorage.removeItem("preseleccion");
    navigate("/");
  };
  return (
    <>
      <Navbar bg="light" expand="md" className="mb-0 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/logo.png"
              alt="Sweet Medical"
              height="50"
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
                    Confirmar Turnos
                    {turnosPreseleccionados.length > 0 && (
                      <Badge bg="success" className="ms-1">
                        {turnosPreseleccionados.length}
                        <span className="visually-hidden">
                          {" "}turnos pendientes de confirmar
                        </span>
                      </Badge>
                    )}
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/paciente/notificaciones"
                    title="Notificaciones"
                    aria-label="Notificaciones"
                  >
                    <span className="position-relative d-inline-block">
                      <i className="bi bi-bell" aria-hidden="true"></i>
                      {noLeidasCount > 0 && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-light rounded-circle"
                        >
                          <span className="visually-hidden">
                            Tenés notificaciones nuevas sin leer
                          </span>
                        </span>
                      )}
                    </span>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/paciente/perfil" title="Mi perfil" aria-label="Mi perfil">
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
                  <Nav.Link
                    as={Link}
                    to="/paciente/notificaciones"
                    title="Notificaciones"
                    aria-label="Notificaciones"
                  >
                    <span className="position-relative d-inline-block">
                      <i className="bi bi-bell" aria-hidden="true"></i>
                      {noLeidasCount > 0 && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-light rounded-circle"
                        >
                          <span className="visually-hidden">
                            Tenés notificaciones nuevas sin leer
                          </span>
                        </span>
                      )}
                    </span>
                  </Nav.Link>
                  <Nav.Link as={Link} to="/medico/perfil" title="Mi perfil" aria-label="Mi perfil">
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