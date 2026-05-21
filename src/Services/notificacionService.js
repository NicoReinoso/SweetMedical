import { NotificacionRepo } from "../Repositorio/notificacionBd.js";
import { NotFoundError } from "../errors/AppError.js";
import { Notificacion } from "../Models/notificacion.js";

export class NotificacionService{
    
    constructor({ notificacionRepo = new NotificacionRepo() } = {}) {
    this.notificacionRepo = notificacionRepo;
    }

    async obtenerNoLeidas(destinatarioId){
        return await this.notificacionRepo.findNoLeidas(destinatarioId);
    }

    async obtenerLeidas(destinatarioId){
        return await this.notificacionRepo.findLeidas(destinatarioId);
    }

    async marcarComoLeida(idNotificacion) {
        
        const notificacion = await this.notificacionRepo.setLeida(idNotificacion);
       
        if (!notificacion) {
            throw new NotFoundError("Notificación no encontrada");
        }

        return notificacion;
    }

    // respetamos arq. en capas, dado que los otros services no pueden crear notificaciones comunicandose 
    // directamente con el repo de notificacion.
    async crear(destinatarioId, remitenteId, mensaje) {
       
        const notificacion = new Notificacion(destinatarioId, remitenteId, mensaje);

        return await this.notificacionRepo.createNotificacion(notificacion);
    } 
}