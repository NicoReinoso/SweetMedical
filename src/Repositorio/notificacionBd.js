import { NotificacionModel } from "../schemas/notificacionSchema.js";
import mongoose from "mongoose"; 

export class NotificacionRepo{
    
    constructor() {
            this.model = NotificacionModel;
        }

    async findNoLeidas(destinatarioId) {
        if (!mongoose.Types.ObjectId.isValid(destinatarioId)) {
            return null;
        }
        const resultado = await this.model.find({ 
            destinatarioId: new mongoose.Types.ObjectId(destinatarioId), 
            leida: false 
        });
        
        return resultado;
    }

    async findLeidas(destinatarioId) {
        if (!mongoose.Types.ObjectId.isValid(destinatarioId)) {
            return null;
        }
      
        return await this.model.find({ 
            destinatarioId: new mongoose.Types.ObjectId(destinatarioId), 
            leida: true 
        });
    }

    async setLeida(idNotificacion) {
        if (!mongoose.Types.ObjectId.isValid(idNotificacion)) {
            return null;
        }
        return await this.model.findByIdAndUpdate(
            idNotificacion,
            {
                leida: true,
                fechaHoraLeida: new Date()
            },
            { new: true }
        );
    }

    async createNotificacion(notificacion) {
        const nuevaNotificacion = new this.model(notificacion);
        return await nuevaNotificacion.save();
    }
}