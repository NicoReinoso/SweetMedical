import medicoService from "../Services/medicoService.js"

const getDisponibilidad = (req, res) => {
    try {
        const { id } = req.params; // Obtenemos el ID de la URL
        const disponibilidad = medicoService.obtenerDisponibilidad(id);
        res.status(200).json(disponibilidad); // Enviamos JSON con código 200 [cite: 102]
    } catch (error) {
        res.status(404).json({ message: error.message }); // 404 si no existe [cite: 104]
    }
};

export default {getDisponibilidad};