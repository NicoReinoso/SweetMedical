const medicosCargados = [
    {
        id: "med-1",
        nombre: "Dr House",
        disponibilidad: [
            { diaSemana: "LUNES", horaDesde: "08:00", horaHasta: "12:00" },
            { diaSemana: "MIERCOLES", horaDesde: "14:00", horaHasta: "18:00" }
        ]
    }
];

const findById = (id) => medicosCargados.find(m => m.id === id);

const updateDisponibilidad = (id, nuevaDisponibilidad) => {
    const index = medicosCargados.findIndex(m=> m.id == id);
    
    if(index !=-1){
        medicosCargados[index].disponibilidad = nuevaDisponibilidad;
        return medicosCargados[index].disponibilidad;
    }
}
export default {findById, updateDisponibilidad};