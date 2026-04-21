import express from "express";
import medicoRoutes from "./Routes/medicoRoutes.js";
import pacienteRoutes from "./Routes/pacienteRoutes.js";
import turnoRoutes from "./Routes/turnoRoutes.js";


const app = express();
app.use(express.json());


app.get('/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Sweet Medical API operando correctamente"
    });
});

app.use('/medicos', medicoRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/turnos', turnoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Probá el health check en Postman usando esa URL`);
    console.log(`==========================================`);
});