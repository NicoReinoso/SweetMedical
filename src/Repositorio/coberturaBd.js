import mongoose from "mongoose";
import { CoberturaModel } from "../schemas/coberturaSchema.js";

export class CoberturaRepo {
    constructor() {
        this.model = CoberturaModel;
    }

    async findByObraSocialPlanYPrestacion(obraSocial, plan, tipoPrestacion, prestacion) {
        return await this.model.findOne({
            obraSocial,
            plan,
            tipoPrestacion,
            prestacion
        });
    }

    async create(cobertura) {
        const doc = new this.model(cobertura);
        return await doc.save();
    }

    async findById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        return await this.model.findById(id);
    }
}
