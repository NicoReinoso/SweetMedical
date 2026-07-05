import dotenv from "dotenv";
import mongoose from "mongoose";
import { MedicoModel } from "./schemas/medicoSchema.js";
import { PacienteModel } from "./schemas/pacienteSchema.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/BD-SweetMedical";

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB:", MONGO_URI);

    await MedicoModel.deleteMany({});
    await PacienteModel.deleteMany({});
    console.log("Colecciones limpiadas.");

    await MedicoModel.insertMany([
        {
            usuario: "house",
            password: "password",
            matricula: 1001,
            nombre: "Dr. House",
            especialidades: [
                { nombre: "Cardiología", costoBase: 5000, coberturas: [{ obraSocial: "OSDE", plan: "210", porcentaje: 80 }] }
            ],
            practicas: [
                { nombre: "Electrocardiograma", costoBase: 3000, coberturas: [{ obraSocial: "OSDE", plan: "210", porcentaje: 70 }] }
            ],
            sedes: ["Medrano"],
            disponibilidad: [
                { diaSemana: "LUNES", horaDesde: "08:00", horaHasta: "09:00" },
                { diaSemana: "LUNES", horaDesde: "09:00", horaHasta: "10:00" },
                { diaSemana: "LUNES", horaDesde: "10:00", horaHasta: "11:00" },
                { diaSemana: "LUNES", horaDesde: "11:00", horaHasta: "12:00" },
                { diaSemana: "MIERCOLES", horaDesde: "14:00", horaHasta: "15:00" },
                { diaSemana: "MIERCOLES", horaDesde: "15:00", horaHasta: "16:00" },
                { diaSemana: "MIERCOLES", horaDesde: "16:00", horaHasta: "17:00" },
            ],
            turnosSolicitados: [],
            turnosAceptados: []
        },
        {
            usuario: "octavio",
            password: "password",
            matricula: 1002,
            nombre: "Dr. Octavio",
            especialidades: [
                { nombre: "Neurología", costoBase: 6000, coberturas: [{ obraSocial: "Swiss Medical", plan: "Gold", porcentaje: 90 }] }
            ],
            practicas: [
                { nombre: "Resonancia magnética", costoBase: 8000, coberturas: [{ obraSocial: "Swiss Medical", plan: "Gold", porcentaje: 85 }] }
            ],
            sedes: ["Palermo"],
            disponibilidad: [
                { diaSemana: "MARTES", horaDesde: "08:00", horaHasta: "09:00" },
                { diaSemana: "MARTES", horaDesde: "09:00", horaHasta: "10:00" },
                { diaSemana: "MARTES", horaDesde: "10:00", horaHasta: "11:00" },
                { diaSemana: "MARTES", horaDesde: "11:00", horaHasta: "12:00" },
                { diaSemana: "JUEVES", horaDesde: "14:00", horaHasta: "15:00" },
                { diaSemana: "JUEVES", horaDesde: "15:00", horaHasta: "16:00" },
                { diaSemana: "JUEVES", horaDesde: "16:00", horaHasta: "17:00" },
            ],
            turnosSolicitados: [],
            turnosAceptados: []
        },
        {
            usuario: "mariano",
            password: "password",
            matricula: 1003,
            nombre: "Mariano García",
            especialidades: [
                { nombre: "Traumatología", costoBase: 4500, coberturas: [] }
            ],
            practicas: [
                { nombre: "Radiografía", costoBase: 2500, coberturas: [] }
            ],
            sedes: ["Campus"],
            disponibilidad: [
                { diaSemana: "VIERNES", horaDesde: "09:00", horaHasta: "10:00" },
                { diaSemana: "VIERNES", horaDesde: "10:00", horaHasta: "11:00" },
            ],
            turnosSolicitados: [],
            turnosAceptados: []
        }
    ]);
    console.log("Médicos insertados.");

    await PacienteModel.insertMany([
        {
            usuario: "juanperez",
            password: "password",
            nombre: "Juan Pérez",
            obraSocial: "OSDE",
            plan: "210",
            notificaciones: []
        },
        {
            usuario: "mariagomez",
            password: "password",
            nombre: "María Gómez",
            obraSocial: "Swiss Medical",
            plan: "Gold",
            notificaciones: []
        }
    ]);
    console.log("Pacientes insertados.");

    await mongoose.disconnect();
    console.log("\n✓ Seed completado.");
    console.log("  Médicos:   house / octavio / mariano   (password: 123)");
    console.log("  Pacientes: juanperez / mariagomez      (password: 123)");
}

seed().catch((err) => {
    console.error("Error en seed:", err);
    process.exit(1);
});
