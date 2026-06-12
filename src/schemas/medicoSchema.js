import mongoose from "mongoose";
import { Medico } from "../Models/medico.js";
import Especialidad from "../Models/especialidad.js";
import Practica from "../Models/practica.js";

const disponibilidadSchema = new mongoose.Schema({
    diaSemana: {
        type: String,
        enum: [
        "LUNES",
        "MARTES",
        "MIERCOLES",
        "JUEVES",
        "VIERNES",
        "SABADO",
        "DOMINGO"
        ],
        required: true
    },

    horaDesde: {
        type: String,
        required: true,
        match: /^([01]?\d|2[0-3]):[0-5]\d$/
    },

    horaHasta: {
        type: String,
        required: true,
        match: /^([01]?\d|2[0-3]):[0-5]\d$/
    }
}, { _id: false });

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

    porcentaje: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }

}, {_id: false})

const especialidadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim:true
    },

    costoBase: {
        type: Number,
        required: true,
        min: 0
    },

    coberturas: [coberturaSchema]
});

especialidadSchema.loadClass(Especialidad);

const practicaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim:true
    },

    costoBase: {
        type: Number,
        required: true,
        min: 0
    },

    coberturas: [coberturaSchema]
});

practicaSchema.loadClass(Practica);

const medicoSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        trim:true
    },

    matricula: {
        type: Number,
        required: true,
        min: 0
    },

    nombre: {
        type: String,
        required: true,
        trim:true
    },

    especialidades: [especialidadSchema],

    practicas: [practicaSchema],

    sedes: {
        type: [{
            type: String,
            trim: true
        }],
        required: true,
        validate: {
            validator: arr => arr.length > 0,
            message: "Debe tener al menos una sede"
        }
    },
    disponibilidad: [disponibilidadSchema],

    turnosSolicitados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turno"
    }],

    turnosAceptados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turno"
    }]
});

//CARGAMOS EL ESQUEMA MEDICO (MONGOOSE) A LA ENTIDAD MEDICO (NUESTRO DOMINIO)
medicoSchema.loadClass(Medico);

//EXPORTAMOS EL MODELO MONGOOSE QUE SE USARA CORRESPONDIENTE AL ESQUEMA
export const MedicoModel = mongoose.model("Medico", medicoSchema);