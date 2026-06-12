import mongoose from "mongoose";
import { Notificacion } from "../Models/notificacion.js";

const notificacionSchema = new mongoose.Schema({
    destinatarioId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    remitenteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    mensaje: {
        type: String,
        required: true,
        trim: true
    },
    fechaHoraCreacion: {
        type: Date,
        required: true
    },
    fechaHoraLeida: {
        type: Date,
        default: null
    },
    leida: {
        type: Boolean,
        required: true,
        default: false
    }
});

notificacionSchema.loadClass(Notificacion);

export const NotificacionModel = mongoose.model("Notificacion", notificacionSchema);