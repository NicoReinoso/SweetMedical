import { NotificacionService } from "../Services/notificacionService.js";

export class NotificacionController {

    constructor(notificacionService) {
        this.notificacionService = notificacionService;
    }

    async getNotificaciones(req, res, next) {
        try {
            const { destinatarioId } = req.params;
            const { estado } = req.query;

            const notificaciones =await this.notificacionService.obtenerNotificaciones(destinatarioId,estado);

            res.status(200).json(notificaciones);
        } catch (error) {
            next(error);
        }
    }


    async leer(req, res, next) {
        try {
            const { id } = req.params;
            const notificacionAhoraLeida = await this.notificacionService.marcarComoLeida(id);
            res.status(200).json(notificacionAhoraLeida);
        } catch (error) {
            return next(error);
        }
    }
}

