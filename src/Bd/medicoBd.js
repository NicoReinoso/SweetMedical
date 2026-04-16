const medicosCargados = [
    {
        id: "med-1",
        nombre: "Dr House",
        disponibilidades: [
            { diaSemana: "LUNES", horaDesde: "08:00", horaHasta: "12:00" },
            { diaSemana: "MIERCOLES", horaDesde: "14:00", horaHasta: "18:00" }
        ]
    }
];

const findById = (id) => medicosCargados.find(m => m.id === id);

module.exports = { findById };