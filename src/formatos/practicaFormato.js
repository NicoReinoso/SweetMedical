import { z } from "zod";

export const practicaFormato = z.object({
    codigo: z.string({
        required_error: "El codigo de la practica es obligatorio",
        invalid_type_error: "El codigo debe ser un texto, el cual puede incluir numeros"
    }),
    
    nombre: z.string({
        required_error: "El nombre de la practica es obligatorio",
        invalid_type_error: "El nombre debe ser un texto"
    }),

    duracionTurnoEnMins: z.number({
        required_error: "La duracion de la practica en minutos es obligatoria",
        invalid_type_error: "La duración debe ser un número"
    }),

    costo: z.number({
        required_error: "El costo de la practica es obligatorio",
        invalid_type_error: "El costo debe ser un número"
    }).nonnegative("El costo no puede ser negativo")
    
}).strict(); 