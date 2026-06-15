import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usePreseleccion } from "../../context/PreseleccionContext";

function AppNavbar() {
  const { turnosPreseleccionados } = usePreseleccion();

  return (
    <Navbar bg="light" expand="md" className="mb-3 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Sweet Medical
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            <Nav.Link as={Link} to="/buscar">Buscar Turnos</Nav.Link>
            <Nav.Link as={Link} to="/preseleccion">
              Preselección
              {turnosPreseleccionados.length > 0 && (
                <Badge bg="success">{turnosPreseleccionados.length}</Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;