import mongoose from "mongoose";
import { CoberturaModel } from "../schemas/coberturaSchema.js";

export class CoberturaRepo {
    constructor() {
        this.model = CoberturaModel;
    }

    async findByObraSocialYPlan(obraSocial, plan) {
        return await this.model.findOne({
            obraSocial,
            plan,
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