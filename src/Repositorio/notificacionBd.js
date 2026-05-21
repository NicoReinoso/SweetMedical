import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepo{
    
    constructor() {
            this.model = NotificacionModel;
        }

    async findNoLeidas(destinatarioId){
        return await this.model.find({ destinatarioId, leida: false });
    }

    async findLeidas(destinatarioId){
        return await this.model.find({ destinatarioId, leida: true });
    }

    async setLeida(idNotificacion){
        return await this.model.findByIdAndUpdate(idNotificacion,
        {
            leida: true,
            fechaHoraLeida: new Date()
        },{
            new: true
        });
    }

    async createNotificacion(notificacion){
        const nuevaNotificacion = new this.model(notificacion);
        return await nuevaNotificacion.save();
    }
}