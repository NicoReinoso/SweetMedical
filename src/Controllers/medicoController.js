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

const addDisponibilidad = (req, res) => {
    try {
        const { id } = req.params; //ID del medico
        const { diaSemana, horaDesde, horaHasta } = req.body; //podriamos agregar un verificador que se fije si el body tiene formato de disponibilidad
        
        const nuevaDisponibilidad = medicoService.agregarDisponibilidad(id, { diaSemana, horaDesde, horaHasta });
        res.status(201).json(nuevaDisponibilidad);
    } catch (error) {
        if (res.status === "Médico no encontrado"){
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: error.message });
    }
};

const deleteDisponibilidad = (req, res) => {
    try{
        const { id } = req.params; // Obtenemos el ID de la URL
        const horariosABorrar = req.body;

        const nuevaDisponibilidad = medicoService.bajaDisponibilidad(id, horariosABorrar);
        
        res.status(200).json({message:`Disponibilidad actualizada: ${nuevaDisponibilidad}`});
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export default {getDisponibilidad, addDisponibilidad, deleteDisponibilidad};