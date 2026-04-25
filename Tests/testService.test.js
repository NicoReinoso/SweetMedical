// Tests/testTurno.test.js
import { TurnoService } from "../src/Services/turnoService.js";

// TEST 1: Alta de turno exitosa
test("debería crear un turno si el médico tiene disponibilidad", () => {
    const service = new TurnoService(); // Siguiendo el formato solicitado
    
    const data = {
        medicoId: "med-1", 
        fechaHora: "2026-10-12T09:00:00", 
        sede: "Medrano", 
        practica: "Cardio",
        pacienteId: "pac-100",
        costo: 1500
    };

    const turno = service.crearTurno(data);

    expect(turno).toBeDefined();
    expect(turno.medicoId).toBe("med-1");
    expect(turno.estado).toBeDefined();
});

// TEST 2: Error por falta de disponibilidad (Regla obligatoria)
test("debería lanzar error si el médico no tiene disponibilidad para ese horario", () => {
    const service = new TurnoService();

    const dataErronea = {
        medicoId: "med-1",
        fechaHora: "2026-10-12T03:00:00" // Horario fuera de disponibilidad
    };

    expect(() => {
        service.crearTurno(dataErronea);
    }).toThrow("El medico solicitado no tiene disponibilidad para ese horario");
});
