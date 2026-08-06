import { Cobertura } from "./cobertura.js";
import { UnprocessableEntityError } from "../errors/AppError.js";

//logica repetida con especialidad. Son lo mismo?
class Practica{
    nombre;
    costo;
    coberturas;
    tipo;

    constructor(nombre, costo) {
        this.nombre = nombre;
        this.costoBase = costo
        this.coberturas = [];
        this.tipo = "Practica";
    }

    agregarCobertura(cobertura) {
        if (!cobertura || !(cobertura instanceof Cobertura)) {
            throw new UnprocessableEntityError("La cobertura es inválida");
        }
        this.coberturas.push(cobertura);
    }

    calcularCostoFinal(paciente) {
       const coberturaPaciente = this.coberturas.find(c => c.obraSocial === paciente.obraSocial && c.plan === paciente.plan);

        // sin cobertura
        if (!coberturaPaciente) {
            return {
                cobertura: "SIN COBERTURA",
                porcentajeCobertura: 0,
                costoFinal: this.costoBase
            };
        }

        const porcentaje = coberturaPaciente.porcentaje;

        const descuento = this.costoBase * (porcentaje / 100);

        const montoFinal = this.costoBase - descuento;

        let tipoCobertura = "PARCIAL";

        if (porcentaje === 100) {
            tipoCobertura = "TOTAL";
        }

        return {
            cobertura: tipoCobertura,
            porcentajeCobertura: porcentaje,
            costoFinal: montoFinal
        };
    }
}

export default Practica