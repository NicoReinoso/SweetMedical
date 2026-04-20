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
    
    const disponibilidadActualizada = medico.disponibilidad.filter(h => 
        h.diaSemana !== horarioABorrar.diaSemana ||
        h.horaDesde !== horarioABorrar.horaDesde ||
        h.horaHasta !== horarioABorrar.horaHasta
    ); // comparamos campo a campo, pues al comparar objetos con !== en JS siempre obtenemos true

    if (disponibilidadActualizada.length === medico.disponibilidad.length) {
        throw new Error("Disponibilidad no encontrada, revisar informacion de entrada");
    } // comparamos longitud, pues no sirve directamente hacer disponibilidadActualizada === medico.disponibilidad por cuestiones de JS

    return medicoRepo.updateDisponibilidad(id, disponibilidadActualizada);
}


export default {obtenerDisponibilidad, agregarDisponibilidad, bajaDisponibilidad};