import { NotificacionRepo } from "../Repositorio/notificacionBd.js";
import { NotFoundError } from "../errors/AppError.js";
import { Notificacion } from "../Models/notificacion.js";

export class NotificacionService{
    
    constructor({ notificacionRepo = new NotificacionRepo() } = {}) {
    this.notificacionRepo = notificacionRepo;
    }

    async obtenerNoLeidas(destinatarioId) {
        const notificaciones = await this.notificacionRepo.findNoLeidas(destinatarioId);
        if (notificaciones === null) {
            throw new NotFoundError("Usuario no encontrado");
        }
        return notificaciones;
    }

    async obtenerLeidas(destinatarioId) {
        const notificaciones = await this.notificacionRepo.findLeidas(destinatarioId);
        if (notificaciones === null) {
            throw new NotFoundError("Usuario no encontrado");
        }
        return notificaciones;
    }

    async marcarComoLeida(idNotificacion) {
        
        const notificacion = await this.notificacionRepo.setLeida(idNotificacion);
       
        if (!notificacion) {
            throw new NotFoundError("Notificación no encontrada");
        }

        return notificacion;
    }

    async crear(destinatarioId, remitenteId, mensaje) {
       
        const notificacion = new Notificacion(destinatarioId, remitenteId, mensaje);

        return await this.notificacionRepo.createNotificacion(notificacion);
    } 
}