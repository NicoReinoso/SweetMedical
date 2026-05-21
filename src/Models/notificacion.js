export class Notificacion{
    destinatarioId;
    remitenteId;
    mensaje;
    fechaHoraCreacion;
    fechaHoraLeida;
    leida;

    constructor (destinatarioId, remitenteId, mensaje){
        this.destinatarioId = destinatarioId;
        this.remitenteId = remitenteId;
        this.mensaje = mensaje;
        this.fechaHoraCreacion = new Date();
        this.fechaHoraLeida = null 
        this.leida = false 
    }
};

