import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FechaInput from "./FechaInput";
import api from "../../api/api";
import TurnoCard from "../../mockdata/TurnoCard";
import { Pagination } from "react-bootstrap";
import "./BuscarTurnos.css";
import ToastNotificacion from "../../components/ToastNotificacion";
import { useSession } from "../../context/SessionContext";

// Helpers de fecha (trabajamos con objetos Date porque react-datepicker los necesita así)
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const sumarMeses = (fecha, meses) => {
  const d = new Date(fecha);
  d.setMonth(d.getMonth() + meses);
  return d;
};

// Convierte Date -> "YYYY-MM-DD" para mandar al backend, sin problemas de timezone
const formatearParaApi = (fecha) => {
  if (!fecha) return "";
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

function BuscarTurnos() {
  const { user } = useSession();
  const [filtros, setFiltros] = useState({
    medicoNombre: "",
    especialidad: "",
    practica: "",
    sede: "",
    sortBy: "fechaHora",
    order: "asc"
  });

  // Fechas separadas como objetos Date para el datepicker
  const [fechaDesde, setFechaDesde] = useState(null);
  const [fechaHasta, setFechaHasta] = useState(null);

  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sugerencias, setSugerencias] = useState([]);
  const [toast, setToast] = useState({ show: false, mensaje: "", variant: "success" });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "medicoNombre") {
      if (value.length < 2) {
        setSugerencias([]);
        return;
      }

      try {
        const { data } = await api.get("/medicos/sugerencias", {
          params: { nombre: value }
        });

        setSugerencias(Array.isArray(data) ? data : []);
      } catch {
        setSugerencias([]);
      }
    }
  };

  // Al elegir "Desde", si "Hasta" quedó fuera del nuevo rango válido, la reseteamos
  const handleFechaDesdeChange = (fecha) => {
    setFechaDesde(fecha);
    if (fecha && fechaHasta) {
      const limite = sumarMeses(fecha, 6);
      if (fechaHasta < fecha || fechaHasta > limite) {
        setFechaHasta(null);
      }
    }
  };

  const handleBusqueda = async () => {
    setCargando(true);
    try {
      const params = {
        ...Object.fromEntries(
          Object.entries(filtros).filter(([, value]) => value !== "")
        ),
        ...(fechaDesde ? { fechaDesde: formatearParaApi(fechaDesde) } : {}),
        ...(fechaHasta ? { fechaHasta: formatearParaApi(fechaHasta) } : {}),
        ...(user?.rol === "paciente" ? { pacienteId: user.id } : {}),
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
    setMostrarFiltros(false);

    if (page !== 1) {
      setPage(1); // cuando se cambia page hay un useEffect que ejecuta handleBusqueda
    } else {
      await handleBusqueda();
    }
  };

  useEffect(() => {
    if (!busquedaRealizada) {
      return;
    }
    handleBusqueda();
  }, [page, filtros.sortBy, filtros.order]);

  const limpiarFiltros = () => {
    setFiltros({
      medicoNombre: "",
      especialidad: "",
      practica: "",
      sede: "",
      sortBy: "fechaHora",
      order: "asc"
    });
    setFechaDesde(null);
    setFechaHasta(null);
    setBusquedaRealizada(false);
    setResultados([]);
    setPage(1);
    setMostrarFiltros(true);
  };

  const quitarFiltro = (campo) => {
    if (campo === "fechaDesde") {
      setFechaDesde(null);
      if (fechaHasta) setFechaHasta(null); // si sacás "desde", "hasta" pierde sentido/validez
    } else if (campo === "fechaHasta") {
      setFechaHasta(null);
    } else {
      setFiltros((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  useEffect(() => {
    if (!busquedaRealizada) return;
    handleBusqueda();
  }, [filtros.medicoNombre, filtros.especialidad, filtros.practica, filtros.sede, fechaDesde, fechaHasta]);

  const chipsActivos = [
        filtros.medicoNombre && { campo: "medicoNombre", label: `Médico: ${filtros.medicoNombre}` },
        filtros.especialidad && { campo: "especialidad", label: `Especialidad: ${filtros.especialidad}` },
        filtros.practica && { campo: "practica", label: `Práctica: ${filtros.practica}` },
        filtros.sede && { campo: "sede", label: `Sede: ${filtros.sede}` },
        fechaDesde && { campo: "fechaDesde", label: `Desde: ${formatearParaApi(fechaDesde)}` },
        fechaHasta && { campo: "fechaHasta", label: `Hasta: ${formatearParaApi(fechaHasta)}` },
      ].filter(Boolean);

  const mostrarToast = (mensaje, variant = "success") => {
    setToast({ show: true, mensaje, variant });
  };

  const cerrarToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <div className="container py-4" id="main-content">
      <div className="page-header">
        <h1>Buscar Turnos</h1>
        <p className="text-muted mb-0">
          Encontrá el turno que mejor se adapte a tus necesidades. Filtrá por
          especialidad, práctica, sede o rango de fechas.
        </p>
      </div>
      {mostrarFiltros && (
        <Form
          onSubmit={handleSubmit}
          className="bg-white border rounded p-3 mb-4"
          aria-label="Filtros de búsqueda de turnos"
        >
          <Row className="g-3">
            <Col xs={12} sm={6} lg={4}>
              <Form.Group controlId="medicoNombre" className="position-relative">
                <Form.Label>Médico</Form.Label>
                <Form.Control
                  type="text"
                  name="medicoNombre"
                  value={filtros.medicoNombre}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                />
                {sugerencias.length > 0 && (
                    <ListGroup className="autocomplete-list">
                      {sugerencias.map((nombre) => (
                        <ListGroup.Item
                          key={nombre}
                          action
                          onClick={() => {
                            setFiltros(prev => ({
                              ...prev,
                              medicoNombre: nombre
                            }));
                            setSugerencias([]);
                          }}
                        >
                          {nombre}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
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
          </Row>

          <Row className="g-3 mt-1">
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
                <DatePicker
                  id="fechaDesde"
                  selected={fechaDesde}
                  onChange={handleFechaDesdeChange}
                  selectsStart
                  startDate={fechaDesde}
                  endDate={fechaHasta}
                  minDate={hoy}
                  maxDate={fechaHasta || sumarMeses(hoy, 6)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/aaaa"
                  autoComplete="off"
                  aria-label="Fecha desde"
                  customInput={<FechaInput onFechaCompleta={handleFechaDesdeChange} />}
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <Form.Group controlId="fechaHasta">
                <Form.Label>Hasta</Form.Label>
                <DatePicker
                  id="fechaHasta"
                  selected={fechaHasta}
                  onChange={(fecha) => setFechaHasta(fecha)}
                  selectsEnd
                  startDate={fechaDesde}
                  endDate={fechaHasta}
                  minDate={fechaDesde || hoy}
                  maxDate={sumarMeses(fechaDesde || hoy, 6)}
                  // Esto es lo que hace que el calendario "Hasta" abra
                  // parado en el mes de la fecha elegida en "Desde"
                  openToDate={fechaDesde || hoy}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/aaaa"
                  autoComplete="off"
                  aria-label="Fecha hasta"
                  disabled={!fechaDesde}
                  customInput={<FechaInput onFechaCompleta={setFechaHasta} />}
                />
                {!fechaDesde && (
                  <Form.Text className="text-muted">
                    Elegí primero la fecha "Desde".
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row className="g-3 mt-1">
            <Col xs={12} className="d-flex justify-content-end">
              <Button
                type="submit"
                variant="success"
                disabled={cargando}
                className="btn-buscar-turnos"
              >
                {cargando ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="visually-hidden">Buscando turnos, por favor esperá.</span>
                    Buscando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2" aria-hidden="true"></i>
                    Buscar
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      )}

      {!mostrarFiltros && (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          {chipsActivos.map((chip) => (
            <Button
              key={chip.campo}
              size="sm"
              variant="primary"
              className="rounded-pill"
              onClick={() => quitarFiltro(chip.campo)}
              aria-label={`Quitar filtro ${chip.label}`}
            >
              {chip.label} <i className="bi bi-x ms-1" aria-hidden="true"></i>
            </Button>
          ))}

          <Button
            size="sm"
            variant="link"
            onClick={() => setMostrarFiltros(true)}
            aria-label="Editar filtros de búsqueda"
          >
            Editar filtros
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="danger" role="alert">
          {error}
        </Alert>
      )}

      {/* Región viva: anuncia a lectores de pantalla cambios en el estado de la búsqueda */}
      <div aria-live="polite" aria-atomic="true">
        {!cargando && busquedaRealizada && resultados.length === 0 && !error && (
          <Alert variant="info">
            No se encontraron turnos disponibles con esos filtros.
          </Alert>
        )}

        {!cargando && busquedaRealizada && resultados.length > 0 && (
          <span className="visually-hidden">
            {resultados.length} turnos encontrados.
          </span>
        )}
      </div>

      {resultados.length > 0 && (
        <>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <h2 className="mb-0">Resultados</h2>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <div role="group" aria-label="Ordenar resultados por fecha o costo" className="d-flex align-items-center gap-2">
                <span className="filtro-label me-1">Ordenar por:</span>
                <Button
                  size="sm"
                  variant={filtros.sortBy === "fechaHora" ? "primary" : "outline-secondary"}
                  aria-pressed={filtros.sortBy === "fechaHora"}
                  onClick={() => setFiltros((prev) => ({ ...prev, sortBy: "fechaHora" }))}
                >
                  Fecha
                </Button>
                <Button
                  size="sm"
                  variant={filtros.sortBy === "costoEstimado" ? "primary" : "outline-secondary"}
                  aria-pressed={filtros.sortBy === "costoEstimado"}
                  onClick={() => setFiltros((prev) => ({ ...prev, sortBy: "costoEstimado" }))}
                >
                  Costo
                </Button>
              </div>

              <div role="group" aria-label="Dirección del ordenamiento" className="d-flex align-items-center gap-2">
                <span className="filtro-label ms-3 me-1">Dirección:</span>
                <Button
                  size="sm"
                  variant={filtros.order === "asc" ? "primary" : "outline-secondary"}
                  aria-pressed={filtros.order === "asc"}
                  onClick={() => setFiltros((prev) => ({ ...prev, order: "asc" }))}
                >
                  Ascendente
                </Button>
                <Button
                  size="sm"
                  variant={filtros.order === "desc" ? "primary" : "outline-secondary"}
                  aria-pressed={filtros.order === "desc"}
                  onClick={() => setFiltros((prev) => ({ ...prev, order: "desc" }))}
                >
                  Descendente
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline-danger"
                className="ms-3"
                onClick={limpiarFiltros}
                aria-label="Limpiar todos los filtros y resultados de búsqueda"
              >
                Limpiar filtros
              </Button>
            </div>
          </div>

          <Row className="g-3">
            {resultados.map((turno, index) => (
              <Col xs={12} sm={6} lg={4} key={index}>
                <TurnoCard
                  turno={turno}
                  onAgregado={mostrarToast}
                />
              </Col>
            ))}
          </Row>
        </>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4" aria-label="Paginación de resultados">
          <Pagination.Prev
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            aria-label="Ir a la página anterior"
          />

          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={page === index + 1}
              onClick={() => setPage(index + 1)}
              aria-label={`Ir a la página ${index + 1}`}
              aria-current={page === index + 1 ? "page" : undefined}
            >
              {index + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            aria-label="Ir a la página siguiente"
          />
        </Pagination>
      )}

      <ToastNotificacion
        show={toast.show}
        mensaje={toast.mensaje}
        variant={toast.variant}
        onClose={cerrarToast}
      />
    </div>
  );
}

export default BuscarTurnos;