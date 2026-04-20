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

const validarFormato = (hora) => {
    const regex = /^([01]?\d|2[0-3]):[0-5]\d$/; //se acepta en formato hh:mm
    return regex.test(hora);
};

const validarCoherenciaHora = (horaDesde, horaHasta) => {
    const desde = convertirHoraAMinutos(horaDesde);
    const hasta = convertirHoraAMinutos(horaHasta);

    if (desde >= hasta) {
        throw new Error("Rango horario inválido");
    }
} ;

const convertirHoraAMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
};

export default {findById, updateDisponibilidad, validarCoherenciaHora, validarFormato};