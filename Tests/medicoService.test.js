// tests/medicoService.test.js
import medicoService from '../src/Services/medicoService.js';

test('Debería devolver la disponibilidad si el médico existe', () => {
    const disp = medicoService.obtenerDisponibilidad("med-1");
    expect(disp.length).toBeGreaterThan(0);
    expect(disp[0]).toHaveProperty('diaSemana');
});

test('Debería lanzar un error si el médico no existe', () => {
    expect(() => {
        medicoService.obtenerDisponibilidad("id-falso");
    }).toThrow("Médico no encontrado");
});