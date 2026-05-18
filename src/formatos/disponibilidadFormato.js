import { z } from "zod";

export const disponibilidadFormato = z.object({
    diaSemana: z.enum([
        "LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"
    ], {
        required_error: "diaSemana es obligatorio"
    }),

    horaDesde: z.string({ required_error : "horaDesde es obligatorio"}).regex(
        /^([01]?\d|2[0-3]):[0-5]\d$/,
        "Formato de hora inválido (hh:mm)"
    ),

    horaHasta: z.string({ required_error : "horaHasta es obligatorio"}).regex(
        /^([01]?\d|2[0-3]):[0-5]\d$/,
        "Formato de hora inválido (hh:mm)"
    )
}).strict(); //.strict hace que no se pueda mandar nada más aparte de esto