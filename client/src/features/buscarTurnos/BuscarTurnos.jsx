import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import api from "../../api/api";
import TurnoCard from "../../mockdata/TurnoCard";
import { Pagination } from "react-bootstrap";

function BuscarTurnos() {
  const [filtros, setFiltros] = useState({
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
    setCargando(true);
    setError(null);
    setBusquedaRealizada(true);
    handleBusqueda();

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
          "Ocurrió un error al buscar turnos. Intentá nuevamente."
      );
      setResultados([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!busquedaRealizada){
       return;
      }
    handleBusqueda();
  }, [page]);

  return (
    <div className="container py-4">
      <h1>Buscar Turnos</h1>
      <p className="text-muted">
        Encontrá el turno que mejor se adapte a tus necesidades. Filtrá por
        especialidad, práctica, sede o rango de fechas.
      </p>

      <Form onSubmit={handleSubmit} className="bg-white border rounded p-3 mb-4">
        <Row className="g-3">
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

        </Row>

      <Row className="mb-3">
      <Col md={3}>
        <Form.Select
          name="sortBy"
          value={filtros.sortBy}
          onChange={handleChange}
          >
          <option value="fechaHora">Ordenar por fecha</option>
          <option value="costoEstimado">Ordenar por costo</option>
        </Form.Select>
      </Col>

      <Col md={3}>
        <Form.Select
          name="order"
          value={filtros.order}
          onChange={handleChange}
          >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </Form.Select>
      </Col>
      <Col xs={12} sm={6} lg={4} className="d-flex align-items-end">
        <Button type="submit" variant="success" disabled={cargando} className="w-100">
          {cargando ? (
            <>
          <Spinner animation="border" size="sm" className="me-2" />
          Buscando...
          </>
          ) : ( "Buscar")}
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
          <h2>Resultados</h2>
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