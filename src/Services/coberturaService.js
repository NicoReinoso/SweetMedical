import { CoberturaRepo } from "../Repositorio/coberturaBd.js";
import { EstadoCobertura, TipoPrestacion } from "../Models/cobertura.js";

export class CoberturaService {
    constructor({ coberturaRepo = new CoberturaRepo() } = {}) {
        this.coberturaRepo = coberturaRepo;
    }

    async calcularCostoPaciente(paciente, tipoPrestacion, prestacionNombre, costoBase) {
        const regla = await this.coberturaRepo.findByObraSocialPlanYPrestacion(
            paciente.obraSocial,
            paciente.plan,
            tipoPrestacion,
            prestacionNombre
        );

        if (!regla) {
            return {
                estadoCobertura: EstadoCobertura.NO_CUBIERTA,
                costoEstimado: costoBase,
                costoBase,
                porcentajeCobertura: 0
            };
        }

        return {
            estadoCobertura: regla.obtenerEstado(),
            costoEstimado: regla.calcularCostoPaciente(costoBase),
            costoBase,
            porcentajeCobertura: regla.porcentajeCobertura
        };
    }
}

export { EstadoCobertura, TipoPrestacion };
