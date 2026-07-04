import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/config.js";
import { MongoDBClient } from "./config/database.js";
import "./container.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { errorLogger } from "./middlewares/errorLogger.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import router from "./Routes/router.js";
import { swaggerSpec } from "./swagger.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

const port = config.port;
MongoDBClient.connect().then(() => {
    app.listen(port, () => {
        console.log(`==========================================`);
        console.log(`Servidor corriendo en http://localhost:${port}`);
        console.log(`Probá el health check en Postman usando esa URL`);
        console.log(`-------------------------------------------`);
        console.log(`Docs en http://localhost:${port}/api-docs`);
        console.log(`==========================================`);
    });
});

export default app