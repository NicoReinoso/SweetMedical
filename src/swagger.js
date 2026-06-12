import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sweet Medical API",
            version: "2.0.0",
            description: "API REST para la gestión de turnos médicos"
        },
        servers: [
            { url: "http://localhost:3000", description: "Servidor local" }
        ]
    },
    // Le indica a swagger-jsdoc dónde buscar los comentarios JSDoc
    apis: ["./src/Routes/*.js", "./src/schemas/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);