import { z } from "zod";

export const especialidadFormato = z.object({
    nombre: z.string({
        required_error: "El nombre de la especialidad es obligatorio",
        invalid_type_error: "El nombre debe ser un texto"
    }),

    costo: z.number({
        required_error: "El costo de la consulta de la especialidad es obligatorio",
        invalid_type_error: "El costo debe ser un número"
    }).nonnegative("El costo no puede ser negativo")
    
}).strict(); 