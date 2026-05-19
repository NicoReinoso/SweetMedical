import express from "express";
import cors from "cors";
import router from "./Routes/router.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js"
import { errorLogger } from "./middlewares/errorLogger.js"
import { errorHandler } from "./middlewares/errorHandler.js"

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Probá el health check en Postman usando esa URL`);
    console.log(`-------------------------------------------`);
    console.log(`Docs en http://localhost:${PORT}/api-docs`);
    console.log(`==========================================`);
});

export default app