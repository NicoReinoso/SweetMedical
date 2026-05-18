# TP Desarrollo de Aplicaciones - Sweet Medical
## Grupo N° 3

### Integrantes:
* **Nahuel Saez**
* **Nicolás Reinoso**
* **Nahuel Darsaut**
* **Lucas Chague**

### Documentación de Referencia:
* 📄 [Enunciado de la 1ra Entrega](https://docs.google.com/document/d/1rWljImX3OHWDQuxLNox3pQCseW1LBoNFpuH7n3U_FWA/edit?tab=t.0#heading=h.tec0qm5u1yah)
* ⚙️ [Decisiones de Diseño y Arquitectura](https://docs.google.com/document/d/1HsDh6Xif1oVRtJetR1GpWO1ds6fdM96yeoybmzscjwE/edit?usp=sharing)

---

## Descripción del Proyecto
Este proyecto consiste en el desarrollo de una solución web moderna y escalable para la gestión de turnos médicos. El sistema permite a los profesionales administrar su disponibilidad y a los pacientes reservar turnos según su cobertura médica.

## Entrega 1: MVP Backend + Configuración
En esta primera iteración, se implementó el núcleo del backend siguiendo una **Arquitectura en Capas** y las convenciones **REST**.

### Funcionalidades Implementadas
* **Health Check**: Endpoint `/health` para verificar el estado del sistema.
* **Gestión de Disponibilidad**: CRUD completo para la disponibilidad horaria de los médicos.
* **Gestión de Turnos**: 
    * Alta de turnos con validación de disponibilidad del médico.
    * Baja de turnos permitida hasta una hora antes del horario del mismo.

### Tecnologías Utilizadas
* **Lenguaje**: JavaScript
* **Entorno**: Node.js
* **Framework**: Express
* **Versionado**: Git / GitHub

---

## Arquitectura de Software
Se utilizó un modelo **Cliente-Servidor** con una arquitectura de backend organizada en las siguientes capas para garantizar alta cohesión y bajo acoplamiento:

1. **Routes**: Definición de los recursos y verbos HTTP (GET, POST, DELETE).
2. **Controllers**: Manejo de peticiones y respuestas HTTP (req, res).
3. **Services**: Lógica de negocio y validaciones de reglas del sistema.
4. **Persistence (Bd/Repositorio)**: Almacenamiento de datos mockeados en memoria.

---

## Git Flow
Para este proyecto definimos un flujo de trabajo basado en ramas para organizar el desarrollo:

* **main**: Rama que contiene el código FInal del proyecto.
* **Entrega_1**: Rama principal de integración para esta primera entrega.
* **Funcionalidades (Features)**: Ramas temporales para tareas específicas.
