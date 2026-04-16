// tests/medicoService.test.js
const medicoService = require('../src/Services/medicoService');

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