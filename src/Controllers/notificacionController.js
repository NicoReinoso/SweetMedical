import { NotificacionService } from "../Services/notificacionService.js";

export class NotificacionController {

    constructor({ notificacionService = new NotificacionService() } = {}) {
    this.notificacionService = notificacionService;
    }

    async getNoLeidas(req, res, next) {
        try {
            const { destinatarioId } = req.params;
            const notificacionesNoLeidas = await this.notificacionService.obtenerNoLeidas(destinatarioId);
            res.status(200).json(notificacionesNoLeidas);
        } catch (error) {
            return next(error);
        }
    }

    async getLeidas(req, res, next) {
        try {
            const { destinatarioId } = req.params;
            const notificacionesLeidas = await this.notificacionService.obtenerLeidas(destinatarioId);
            res.status(200).json(notificacionesLeidas);
        } catch (error) {
            return next(error);
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

