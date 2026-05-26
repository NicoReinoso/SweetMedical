export const EstadoCobertura = {
    TOTAL: "TOTAL",
    PARCIAL: "PARCIAL",
    NO_CUBIERTA: "NO_CUBIERTA"
};

export const TipoPrestacion = {
    ESPECIALIDAD: "ESPECIALIDAD",
    PRACTICA: "PRACTICA"
};

export class Cobertura {
    obraSocial;
    plan;
    tipoPrestacion;
    prestacion;
    porcentajeCobertura;

    constructor(obraSocial, plan, tipoPrestacion, prestacion, porcentajeCobertura) {
        this.obraSocial = obraSocial;
        this.plan = plan;
        this.tipoPrestacion = tipoPrestacion;
        this.prestacion = prestacion;
        this.porcentajeCobertura = porcentajeCobertura;
    }

    calcularCostoPaciente(costoBase) {
        const monto = costoBase * (1 - this.porcentajeCobertura / 100);
        return Math.round(monto * 100) / 100;
    }

    obtenerEstado() {
        if (this.porcentajeCobertura >= 100) {
            return EstadoCobertura.TOTAL;
        }
        if (this.porcentajeCobertura <= 0) {
            return EstadoCobertura.NO_CUBIERTA;
        }
        return EstadoCobertura.PARCIAL;
    }
}
