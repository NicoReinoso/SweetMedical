export class Paciente {
    usuario;
    contrasenia;
    nombre;
    obraSocial;
    plan;
    notificaciones;

    constructor(usuario, nombre, obraSocial, plan) {
        this.usuario = usuario;
        this.nombre = nombre;
        this.obraSocial = obraSocial;
        this.plan = plan;
        this.notificaciones = [];
    }
}