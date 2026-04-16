const medicoRepo = require('../Bd/medicoBd');

const obtenerDisponibilidad = (medicoId) => {
    const medico = medicoRepo.findById(medicoId);
    if (!medico) {
        throw new Error("Médico no encontrado");
    }
    return medico.disponibilidades;
};

module.exports = { obtenerDisponibilidad };