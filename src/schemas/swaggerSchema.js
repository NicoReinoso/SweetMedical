/**
 * @swagger
 * components:
 *   schemas:
 *     Disponibilidad:
 *       type: object
 *       required:
 *         - diaSemana
 *         - horaDesde
 *         - horaHasta
 *       properties:
 *         diaSemana:
 *           type: string
 *           example: LUNES
 *         horaDesde:
 *           type: string
 *           example: "08:00"
 *         horaHasta:
 *           type: string
 *           example: "09:00"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notificacion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "684f8e7e5cfdcb8a2e71f123"
 *         remitenteId:
 *           type: string
 *           example: "684f8e7e5cfdcb8a2e71f111"
 *         destinatarioId:
 *           type: string
 *           example: "684f8e7e5cfdcb8a2e71f222"
 *         mensaje:
 *           type: string
 *           example: "Nuevo turno solicitado"
 *         estado:
 *           type: string
 *           enum:
 *             - LEIDA
 *             - NO_LEIDA
 *           example: "NO_LEIDA"
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           example: "2026-07-01T10:30:00Z"
 */