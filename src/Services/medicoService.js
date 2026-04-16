import medicoRepo from "../Bd/medicoBd.js" 

const obtenerDisponibilidad = (medicoId) => {
    const medico = medicoRepo.findById(medicoId);
    if (!medico) {
        throw new Error("Médico no encontrado");
    }
    return medico.disponibilidades;
};

export default {obtenerDisponibilidad};