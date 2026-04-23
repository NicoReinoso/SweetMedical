import {MedicoService} from "../Services/medicoService.js"
import Disponibilidad from "../Models/disponibilidad.js";

export class MedicoController{

    constructor({medicoService = new MedicoService()} = {}) {
        this.medicoService = medicoService;
    }

    getDisponibilidad = (req, res) => {
        try {
            const { id } = req.params; // Obtenemos el ID de la URL
            const disponibilidad = this.medicoService.obtenerDisponibilidad(id);
            res.status(200).json(disponibilidad); // Enviamos JSON con código 200 [cite: 102]
        } catch (error) {
            res.status(404).json({ message: error.message }); // 404 si no existe [cite: 104]
        }
    };

    addDisponibilidad = (req, res) => {
        try {
            const { id } = req.params; //ID del medico
            const disponibilidadAAgregar = new Disponibilidad(req.body.diaSemana, req.body.horaDesde, req.body.horaHasta); //transformo el body a Disponibilidad
            
            const nuevaDisponibilidad = this.medicoService.agregarDisponibilidad(id, disponibilidadAAgregar);
            res.status(201).json(nuevaDisponibilidad);
        } catch (error) {
            if (error.message === "Médico no encontrado"){
                return res.status(404).json({ message: error.message });
            }
            res.status(400).json({ message: error.message });
        }
    };

    deleteDisponibilidad = (req, res) => {
        try{
            const { id } = req.params; // Obtenemos el ID de la URL
            const horariosABorrar = new Disponibilidad(req.body.diaSemana, req.body.horaDesde, req.body.horaHasta);

            const nuevaDisponibilidad = this.medicoService.bajaDisponibilidad(id, horariosABorrar);
            
            res.status(200).json(nuevaDisponibilidad);
        } catch (error) {
            res.status(404).json({message: error.message});
        }
    }
}
