import { Cobertura } from "./cobertura.js";
import { UnprocessableEntityError } from "../errors/AppError.js";

//logica repetida con practica. Son lo mismo?
class Especialidad{
    nombre;
    costoBase;
    coberturas;

    constructor(nombre, costoConsulta) {
        this.nombre = nombre;
        this.costoBase = costoConsulta;
        this.coberturas = [];
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
            return this.costoBase;
        }

        const porcentaje = coberturaPaciente.porcentaje;

        const descuento = this.costoBase * (porcentaje / 100);

        const montoFinal = this.costoBase - descuento;

        return montoFinal;
    }
}


export default Especialidad