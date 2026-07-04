import mongoose from "mongoose";
import { Turno } from "../Models/turno.js";

const turnoSchema = new mongoose.Schema({

    medicoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medico",
        required: true
    },
    pacienteId:{
        type: String,
        required: true,
        trim: true
    },

    fechaHora:{
        type: Date,
        required: true
    },
    
    sede:{
        type: String,
        trim: true,
        required: true
    },
    
    consultaSolicitada:{
        type: String,
        trim: true,
        required: true
    },

    estado:{
        type: String,
        enum: [
        "RESERVADO",
        "CONFIRMADO",
        "CANCELADO",
        "REALIZADO",
        "REPROGRAMADO"
        ],
        required: true
    },

    historialEstados:{
        type:[{type: String,
        enum: [
        "RESERVADO",
        "CONFIRMADO",
        "CANCELADO",
        "REALIZADO",
        "REPROGRAMADO"
        ],
        trim: true
        }],
        required: true
    },

    costo:{
        type: Number,
        required: true,
        min: 0
    },

    motivoCancelacion: {
        type: String,
        trim: true,
        default: null
    }
});

turnoSchema.loadClass(Turno);

export const TurnoModel = mongoose.model("Turno", turnoSchema);