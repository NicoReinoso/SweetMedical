import { forwardRef, useState, useEffect } from "react";

// Convierte "dd/mm/yyyy" (string completo) a un objeto Date real.
// Devuelve null si el string no forma una fecha válida (ej: 31/02/2026).
const parsearFecha = (texto) => {
  const partes = texto.split("/");
  if (partes.length !== 3) return null;

  const [dd, mm, yyyy] = partes.map(Number);
  if (!dd || !mm || !yyyy || yyyy < 1000) return null;

  const fecha = new Date(yyyy, mm - 1, dd);

  if (
    fecha.getDate() !== dd ||
    fecha.getMonth() !== mm - 1 ||
    fecha.getFullYear() !== yyyy
  ) {
    return null;
  }

  return fecha;
};

/**
 * Input custom para usar como customInput en <DatePicker />.
 * - Muestra el ícono de calendario (bootstrap-icons) a la derecha.
 * - Autoformatea lo que el usuario tipea, insertando "/" solo (dd/mm/yyyy).
 * - Cuando el texto tipeado forma una fecha válida y completa, llama a la
 *   prop onFechaCompleta(fecha) — un callback nuestro, explícito, que el
 *   padre (BuscarTurnos) usa para actualizar el estado de React directamente
 *   (setFechaDesde / setFechaHasta), sin depender del onChange interno de
 *   react-datepicker.
 *
 * Se usa así:
 *   <DatePicker
 *     customInput={<FechaInput onFechaCompleta={setFechaDesde} />}
 *     ...
 *   />
 */
const FechaInput = forwardRef(({ value, onClick, onChange, onFechaCompleta, placeholder, disabled, id, "aria-label": ariaLabel }, ref) => {
  const [displayValue, setDisplayValue] = useState(value || "");

  // Si el valor cambia desde afuera (se clickeó un día en el calendario,
  // o se limpiaron los filtros), sincronizamos el texto mostrado.
  useEffect(() => {
    setDisplayValue(value || "");
  }, [value]);

  const handleInputChange = (e) => {
    let soloNumeros = e.target.value.replace(/\D/g, "");
    soloNumeros = soloNumeros.slice(0, 8);

    let formateado = soloNumeros;
    if (soloNumeros.length > 4) {
      formateado = `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2, 4)}/${soloNumeros.slice(4)}`;
    } else if (soloNumeros.length > 2) {
      formateado = `${soloNumeros.slice(0, 2)}/${soloNumeros.slice(2)}`;
    }

    setDisplayValue(formateado);

    if (soloNumeros.length === 8) {
      const fecha = parsearFecha(formateado);
      if (fecha && onFechaCompleta) {
        // Actualiza el estado de React directamente en el padre.
        // Esto es lo que realmente selecciona la fecha (mueve el calendario,
        // habilita el otro input, etc.) porque actualiza fechaDesde/fechaHasta.
        onFechaCompleta(fecha);
      }
    }
  };

  return (
    <div className="fecha-input-wrapper">
      <input
        id={id}
        ref={ref}
        type="text"
        className="form-control"
        value={displayValue}
        onChange={handleInputChange}
        onClick={onClick}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        autoComplete="off"
        inputMode="numeric"
      />
      <i className="bi bi-calendar-event fecha-input-icono" aria-hidden="true"></i>
    </div>
  );
});

FechaInput.displayName = "FechaInput";

export default FechaInput;