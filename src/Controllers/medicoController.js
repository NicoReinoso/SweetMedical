import {MedicoService} from "../Services/medicoService.js"
import Disponibilidad from "../Models/disponibilidad.js";

export class MedicoController{

    constructor({medicoService = new MedicoService()} = {}) {
        this.medicoService = medicoService;
    }

    getDisponibilidad = (req, res, next) => {
        try {
            const { id } = req.params;
            const { ocupado } = req.query;

            const soloDisponibles = ocupado === "false";

            const disponibilidad = this.medicoService.obtenerDisponibilidad(id, soloDisponibles);

            res.status(200).json(disponibilidad);
        } catch (error) {
            next(error);
        }
    };

    addDisponibilidad = (req, res, next) => {
        try {
            const { id } = req.params; //ID del medico
            const disponibilidadAAgregar = new Disponibilidad(req.body.diaSemana, req.body.horaDesde, req.body.horaHasta); //transformo el body a Disponibilidad
            
            const nuevaDisponibilidad = this.medicoService.agregarDisponibilidad(id, disponibilidadAAgregar);
            res.status(201).json(nuevaDisponibilidad);
        } catch (error) {
            return next(error);   
        }
    };

    deleteDisponibilidad = (req, res, next) => {
        try{
            const { id } = req.params; // Obtenemos el ID de la URL
            const horariosABorrar = new Disponibilidad(req.body.diaSemana, req.body.horaDesde, req.body.horaHasta);

            const nuevaDisponibilidad = this.medicoService.bajaDisponibilidad(id, horariosABorrar);
            
            res.status(200).json(nuevaDisponibilidad);
        } catch (error) {
            return next(error);
        }
    }
}
