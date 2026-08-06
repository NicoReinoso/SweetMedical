import express from "express";
import { loginController } from "../container.js";

const router = express.Router();

router.post('/', loginController.login.bind(loginController));

export default router;