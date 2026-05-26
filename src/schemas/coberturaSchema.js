import mongoose from "mongoose";
import { Cobertura } from "../Models/cobertura.js";

const coberturaSchema = new mongoose.Schema({
    obraSocial: {
        type: String,
        required: true,
        trim: true
    },
    plan: {
        type: String,
        required: true,
        trim: true
    },
    tipoPrestacion: {
        type: String,
        enum: ["ESPECIALIDAD", "PRACTICA"],
        required: true
    },
    prestacion: {
        type: String,
        required: true,
        trim: true
    },
    porcentajeCobertura: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});

coberturaSchema.index(
    { obraSocial: 1, plan: 1, tipoPrestacion: 1, prestacion: 1 },
    { unique: true }
);

coberturaSchema.loadClass(Cobertura);

export const CoberturaModel = mongoose.model("Cobertura", coberturaSchema);
