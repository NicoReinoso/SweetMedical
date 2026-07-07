describe("Búsqueda de turnos - Paciente", () => {

  it("permite loguearse, filtrar por especialidad y ver resultados", () => {
    // --- Login ---
    cy.visit("http://localhost:3000/login");

    cy.get('input[placeholder="Ingrese su usuario"]').type("jperez");
    cy.get('input[placeholder="Ingrese su contraseña"]').type("hola");

    cy.contains("button", "Ingresar").click();

    // Debería redirigir a la home del paciente
    cy.url().should("include", "/paciente");

    // --- Ir a Buscar Turnos ---
    cy.visit("http://localhost:3000/paciente/buscar");

    cy.contains("h1", "Buscar Turnos").should("be.visible");

    // --- Completar filtro de especialidad ---
    cy.get('input[name="especialidad"]').type("Cardiología");

    // --- Buscar ---
    cy.contains("button", "Buscar").click();

    // --- Verificar resultados ---
    // Esperamos a que el spinner de carga desaparezca
    cy.contains("Buscando...").should("not.exist");

    // Debería mostrar al menos un resultado, o el mensaje de "no encontrados"
    // (dejamos el assertion fuerte en que la búsqueda se completó sin error)
    cy.get(".alert-danger").should("not.exist");

    cy.contains("h2", "Resultados").should("be.visible");
    cy.get(".row.g-3").find(".col-12, .col-sm-6, .col-lg-4").should("have.length.greaterThan", 0);
  });

});