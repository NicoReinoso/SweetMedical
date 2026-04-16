const express = require('express');
const app = express();

const medicoRoutes = require('./Routes/medicoRoutes'); 

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