class Disponibilidad {
    constructor(diaSemana, horaDesde, horaHasta) {
        this.diaSemana = diaSemana; // Lunes, Martes, etc. 
        this.horaDesde = horaDesde;
        this.horaHasta = horaHasta;
        this.ocupado = false;
    }
}
export default Disponibilidad

