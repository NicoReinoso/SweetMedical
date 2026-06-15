import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001"
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