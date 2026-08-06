import { PacienteRepo } from "./Repositorio/pacienteBd.js";
import { MedicoRepo } from "./Repositorio/medicoBd.js";
import { TurnoRepo } from "./Repositorio/turnoBd.js";
import { NotificacionRepo } from "./Repositorio/notificacionBd.js";

import { PacienteService } from "./Services/pacienteService.js";
import { MedicoService } from "./Services/medicoService.js";
import { TurnoService } from "./Services/turnoService.js";
import { NotificacionService } from "./Services/notificacionService.js";
import { LoginService } from "./Services/loginService.js";

import { PacienteController } from "./Controllers/pacienteController.js";
import { MedicoController } from "./Controllers/medicoController.js";
import { TurnoController } from "./Controllers/turnoController.js";
import { NotificacionController } from "./Controllers/notificacionController.js";
import { LoginController } from "./Controllers/loginController.js";

// Repos
const pacienteRepo = new PacienteRepo();
const medicoRepo = new MedicoRepo();
const turnoRepo = new TurnoRepo();
const notificacionRepo = new NotificacionRepo();

// Services
const notificacionService = new NotificacionService({
    notificacionRepo
});


const turnoService = new TurnoService({
    turnoRepo,
    pacienteRepo,
    medicoRepo,
    notificacionService
});

const pacienteService = new PacienteService({
    pacienteRepo,
    turnoService
});

const medicoService = new MedicoService({
    medicoRepo,
    turnoService
});

const loginService = new LoginService(
    pacienteService,
    medicoService
);

// Controllers
export const pacienteController = new PacienteController(pacienteService);

export const medicoController = new MedicoController(medicoService);

export const turnoController = new TurnoController(turnoService);

export const notificacionController = new NotificacionController(notificacionService);

export const loginController = new LoginController(loginService);