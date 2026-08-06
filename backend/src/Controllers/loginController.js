import { LoginService } from "../Services/loginService.js";

export class LoginController {

    constructor(loginService) {
        this.loginService = loginService;
    }

    async login(req, res, next) {

        try {
            const { usuario, password } = req.body;

            const token = await this.loginService.login(usuario, password);

            res.status(200).json({ token });
        } catch(error) {

            next(error);
        }
    }
}