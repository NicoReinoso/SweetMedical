import { NotificacionRepo } from "../Repositorio/notificacionBd.js";
import { NotFoundError } from "../errors/AppError.js";
import { Notificacion } from "../Models/notificacion.js";

export class NotificacionService{
    
    constructor({ notificacionRepo } = {}) {
    this.notificacionRepo = notificacionRepo;
    }

    async obtenerNotificaciones(destinatarioId, estado) {
        if (estado === "LEIDA") {
            return await this.notificacionRepo.findLeidas(destinatarioId);
        }

        if (estado === "NO_LEIDA") {
            return await this.notificacionRepo.findNoLeidas(destinatarioId);
        }

        return await this.notificacionRepo.obtenerTodas(destinatarioId);
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