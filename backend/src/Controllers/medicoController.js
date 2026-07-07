import {MedicoService} from "../Services/medicoService.js"
import Disponibilidad from "../Models/disponibilidad.js";
import Especialidad from "../Models/especialidad.js";
import Practica from "../Models/practica.js";

export class MedicoController{

    constructor(medicoService) {
        this.medicoService = medicoService;
    }

    async getMisTurnos(req, res, next) {
        try {
            const { id } = req.params;

            const turnos = await this.medicoService.obtenerTurnosSinCompletarMedico(id);

            res.status(200).json(turnos);
        } catch (error) {
            next(error);
        }
    }

    async getDisponibilidad(req, res, next) {
        try {
            const { id } = req.params;

            const disponibilidad = await this.medicoService.obtenerDisponibilidad(id);

            res.status(200).json(disponibilidad);
        } catch (error) {
            next(error);
        }
    };

    async getSugerencias(req, res, next) {
        try {
            const { nombre } = req.query;

            const sugerencia = await this.medicoService.obtenerSugerencias(nombre);

            res.status(200).json(sugerencia);
        } catch (error) {
            next(error);
        }
    };

    async addDisponibilidad(req, res, next) {
        try {
            const { id } = req.params; //ID del medico
            const disponibilidadAAgregar = new Disponibilidad(req.body.diaSemana, req.body.horaDesde, req.body.horaHasta); //transformo el body a Disponibilidad
            
            const nuevaDisponibilidad = await this.medicoService.agregarDisponibilidad(id, disponibilidadAAgregar);
            res.status(201).json(nuevaDisponibilidad);
        } catch (error) {
            return next(error);   
        }
    };

    async deleteDisponibilidad(req, res, next) {
        try{
            const { id } = req.params; // Obtenemos el ID de la URL
            const horariosABorrar = new Disponibilidad(req.body.diaSemana, req.body.horaDesde, req.body.horaHasta);

            const nuevaDisponibilidad = await this.medicoService.bajaDisponibilidad(id, horariosABorrar);
            
            res.status(200).json(nuevaDisponibilidad);
        } catch (error) {
            return next(error);
        }
    }

    async addEspecialidad(req, res, next){
        try{
            const { id } = req.params;
            
            const especialidadAAgregar = new Especialidad(req.body.nombre, req.body.costo);

            const nuevaEspecialidad = await this.medicoService.agregarEspecialidad(id, especialidadAAgregar);

            res.status(201).json(nuevaEspecialidad);
        } catch(error) {
            return next(error);
        }
    }

    async patchEspecialidad(req, res, next) {
        try {
            const { id, especialidadId} = req.params;

            const especialidadModificada = {
                _id: especialidadId,
                nombre: req.body.nombre,
                costoConsulta: req.body.costoConsulta
            };

            const resultado = await this.medicoService.modificarEspecialidad(id, especialidadModificada);

            res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    }

    async deleteEspecialidad(req, res, next){
        try{
            const { id, especialidadId } = req.params;

            const nuevaEspecialidad = await this.medicoService.bajaEspecialidad(id, especialidadId);

            res.status(200).json(nuevaEspecialidad);
        } catch(error) {
            return next(error);
        }
    }

    async addPractica(req, res, next) {
        try {
            const { id } = req.params;

            const practicaAAgregar = new Practica(req.body.nombre, req.body.costo);

            const nuevaPractica = await this.medicoService.agregarPractica(id, practicaAAgregar);

            res.status(201).json(nuevaPractica);
        } catch (error) {
            return next(error);
        }
    }


    async patchPractica(req, res, next) {
        try {
            const { id, practicaId } = req.params;

            const practicaModificada = {
                _id: practicaId,
                costo: req.body.costo
            };

            const resultado = await this.medicoService.modificarPractica(id, practicaModificada);

            res.status(200).json(resultado);
        } catch (error) {
            return next(error);
        }
    }

    async deletePractica(req, res, next) {
        try {
            const { id, practicaId } = req.params;

            const practicasFiltradas = await this.medicoService.bajaPractica(id, practicaId);

            res.status(200).json(practicasFiltradas);
        } catch (error) {
            return next(error);
        }
    }

}
