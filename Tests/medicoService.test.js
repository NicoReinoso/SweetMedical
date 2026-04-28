// tests/medicoService.test.js
import Disponibilidad from '../src/Models/disponibilidad.js';
import { MedicoService } from '../src/Services/medicoService.js';


test("debería devolver las disponibilidades de un médico existente", () => {
    const service = new MedicoService();
    
    const disponibilidad = service.obtenerDisponibilidad("med-1");

    expect(disponibilidad).toBeDefined();
    expect(disponibilidad.length).toBeGreaterThan(0);
});

test("debería lanzar error si el médico no existe", () => {
    const service = new MedicoService();

    expect(() => {
        service.obtenerDisponibilidad("med-X");
    }).toThrow("Médico no encontrado");
});

test("debería agregar una nueva disponibilidad", () => {
    const service = new MedicoService();

    const nueva = new Disponibilidad ("VIERNES", "10:00", "11:00");


    service.agregarDisponibilidad("med-1", nueva);

    const disponibilidad = service.obtenerDisponibilidad("med-1");

    expect(
        disponibilidad.some(d =>
            d.diaSemana === "VIERNES" &&
            d.horaDesde === "10:00" && d.horaHasta == "11:00"
        )
    ).toBe(true);
});

test("no debería permitir agregar una disponibilidad duplicada", () => {
    const service = new MedicoService();

    const duplicada = new Disponibilidad("LUNES", "08:00", "09:00");

    expect(() => {
        service.agregarDisponibilidad("med-1", duplicada);
    }).toThrow("La disponibilidad ya existe");
});

test("debería lanzar error si la disponibilidad no existe", () => {
    const service = new MedicoService();

    const fake = new Disponibilidad("DOMINGO", "10:00", "11:00");

    expect(() => {
        service.bajaDisponibilidad("med-1", fake);
    }).toThrow("Disponibilidad no encontrada");
});