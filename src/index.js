import express from "express";
import {z} from "zod";
import medicoRoutes from "./Routes/medicoRoutes.js"


const app = express();
app.use(express.json());


app.get('/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Sweet Medical API operando correctamente"
    });
});

app.use('/medicos', medicoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Probá el health check en Postman usando esa URL`);
    console.log(`==========================================`);
});