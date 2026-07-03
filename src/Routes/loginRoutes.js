import express from "express";
import { loginController } from "../container";

const router = express.Router();

router.post('/', loginController);

export default router;