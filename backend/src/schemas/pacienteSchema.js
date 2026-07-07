import mongoose from "mongoose";
import { Paciente } from "../Models/paciente.js";

const pacienteSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim:true
    },

    nombre: {
        type: String,
        required: true
    },

    dni: {
        type: String,
        required: true
    },

    obraSocial: {
        type: String,
        required: true
    },

    plan: {
        type: String,
        required: true
    },

    notificaciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notificacion"
    }]
});

pacienteSchema.loadClass(Paciente);

export const PacienteModel = mongoose.model("Paciente", pacienteSchema);