import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001"
});

export const buscarDisponibles = async (filtros) => {
    const response = await api.get(
        "/turnos/disponibles",
        {
            params: filtros
        }
    );

    return response.data;
};

export default api;