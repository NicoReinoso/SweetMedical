import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import api from "../../api/api";
import TurnoCard from "../../mockdata/TurnoCard";
import { Pagination } from "react-bootstrap";
import "./BuscarTurnos.css";

function BuscarTurnos() {
  const [filtros, setFiltros] = useState({
    medicoNombre: "",
    especialidad: "",
    practica: "",
    sede: "",
    fechaDesde: "",
    fechaHasta: "",
    sortBy: "fechaHora",
    order: "asc"
  });

  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleChange = (e) => {
    setFiltros((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBusqueda = async () => {
    setCargando(true);
    try {
      const params = {
        ...Object.fromEntries(
          Object.entries(filtros).filter(([, value]) => value !== "")
        ),
        page,
        limit: 10
      };

      const { data } = await api.get("/turnos/disponibles", { params });

      setResultados(data.resultados || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Ocurrió un error al buscar turnos."
      );
    } finally {
      setCargando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusquedaRealizada(true);

    if (page !== 1) {
      setPage(1); // cuando se cambia page hay un useEffect que ejecuta handleBusqueda
    } else {
      await handleBusqueda();
    }
  };

  useEffect(() => {
    if (!busquedaRealizada){
       return;
      }
    handleBusqueda();
  }, [page, filtros.sortBy, filtros.order]);

  return (
      <div className="container py-4">
      <div className="buscar-header">
        <h1>Buscar Turnos</h1>
        <p className="text-muted mb-0">
          Encontrá el turno que mejor se adapte a tus necesidades. Filtrá por
          especialidad, práctica, sede o rango de fechas.
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="bg-white border rounded p-3 mb-4">
        <Row className="g-3">
          <Col xs={12} sm={6} lg={4}>
            <Form.Group controlId="medicoNombre">
              <Form.Label>Médico</Form.Label>
              <Form.Control
                type="text"
                name="medicoNombre"
                value={filtros.medicoNombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} lg={4}>
            <Form.Group controlId="especialidad">
              <Form.Label>Especialidad</Form.Label>
              <Form.Control
                type="text"
                name="especialidad"
                value={filtros.especialidad}
                onChange={handleChange}
                placeholder="Ej: Cardiología"
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} lg={4}>
            <Form.Group controlId="practica">
              <Form.Label>Práctica</Form.Label>
              <Form.Control
                type="text"
                name="practica"
                value={filtros.practica}
                onChange={handleChange}
                placeholder="Ej: Electrocardiograma"
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} lg={4}>
            <Form.Group controlId="sede">
              <Form.Label>Sede</Form.Label>
              <Form.Control
                type="text"
                name="sede"
                value={filtros.sede}
                onChange={handleChange}
                placeholder="Ej: Medrano"
              />
            </Form.Group>
          </Col>
        </Row>

      <Row className="g-3 mt-1">
          <Col xs={12} sm={6} lg={4}>
            <Form.Group controlId="fechaDesde">
              <Form.Label>Desde</Form.Label>
              <Form.Control
                type="date"
                name="fechaDesde"
                value={filtros.fechaDesde}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} lg={4}>
            <Form.Group controlId="fechaHasta">
              <Form.Label>Hasta</Form.Label>
              <Form.Control
                type="date"
                name="fechaHasta"
                value={filtros.fechaHasta}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} lg={4} className="d-flex align-items-end">
            <Button type="submit" variant="success" disabled={cargando} className="w-100 btn-buscar-turnos">
              {cargando ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Buscando...
                </>
              ) : (
                "Buscar"
              )}
            </Button>
          </Col>
        </Row>
    </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {!cargando && busquedaRealizada && resultados.length === 0 && !error && (
        <Alert variant="info">
          No se encontraron turnos disponibles con esos filtros.
        </Alert>
      )}

      {resultados.length > 0 && (
        <>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h2 className="mb-0">Resultados</h2>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="filtro-label me-1">Ordenar por:</span>
              <Button
                size="sm"
                variant={filtros.sortBy === "fechaHora" ? "primary" : "outline-secondary"}
                onClick={() => setFiltros((prev) => ({ ...prev, sortBy: "fechaHora" }))}
              >
                Fecha
              </Button>
              <Button
                size="sm"
                variant={filtros.sortBy === "costoEstimado" ? "primary" : "outline-secondary"}
                onClick={() => setFiltros((prev) => ({ ...prev, sortBy: "costoEstimado" }))}
              >
                Costo
              </Button>

              <span className="filtro-label ms-3 me-1">Dirección:</span>
              <Button
                size="sm"
                variant={filtros.order === "asc" ? "primary" : "outline-secondary"}
                onClick={() => setFiltros((prev) => ({ ...prev, order: "asc" }))}
              >
                Ascendente
              </Button>
              <Button
                size="sm"
                variant={filtros.order === "desc" ? "primary" : "outline-secondary"}
                onClick={() => setFiltros((prev) => ({ ...prev, order: "desc" }))}
              >
                Descendente
              </Button>

              <Button
                size="sm"
                variant="outline-danger"
                className="ms-3"
                onClick={() => {
                  setFiltros({
                    medicoNombre: "",
                    especialidad: "",
                    practica: "",
                    sede: "",
                    fechaDesde: "",
                    fechaHasta: "",
                    sortBy: "fechaHora",
                    order: "asc"
                  });
                  setBusquedaRealizada(false);
                  setResultados([]);
                  setPage(1);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>

          <Row className="g-3">
            {resultados.map((turno, index) => (
              <Col xs={12} sm={6} lg={4} key={index}>
                <TurnoCard turno={turno} />
              </Col>
            ))}
          </Row>
        </>
      )}

      {totalPages > 1 && (
      <Pagination className="justify-content-center mt-4">

        <Pagination.Prev
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        />

        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={page === index + 1}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        />

      </Pagination>
    )}
    </div>
  );
}

export default BuscarTurnos;