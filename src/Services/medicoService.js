import medicoRepo from "../Repositorio/medicoBd.js" 

const obtenerDisponibilidad = (medicoId) => {
    const medico = medicoRepo.findById(medicoId);
    if (!medico) {
        throw new Error("Médico no encontrado");
    }
    return medico.disponibilidad;
};

const agregarDisponibilidad = (medicoId, disponibilidad) => {
    const medico = medicoRepo.findById(medicoId);
    if (!medico) {
        throw new Error("Médico no encontrado");
    }
    if (disponibilidad.horaDesde >= disponibilidad.horaHasta) {
        throw new Error("Rango horario inválido");
    }

    medico.disponibilidad.push(disponibilidad);

    return disponibilidad;
};


const bajaDisponibilidad = (id, horarioABorrar) => {
    
    const medico = medicoRepo.findById(id);
    if(!medico){
        throw Error("Medico no encontrado");        
    }
    
    const disponibilidadActualizada = medico.disponibilidad.filter(h => h!=medico.disponibilidad);

    return medicoRepo.updateDisponibilidad(id,horarioABorrar)
}


export default {obtenerDisponibilidad, agregarDisponibilidad, bajaDisponibilidad};