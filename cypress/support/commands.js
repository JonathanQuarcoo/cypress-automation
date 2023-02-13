// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('masInput', (data, assert = false) => {
    for (const selector in data) {
        if (Object.hasOwnProperty.call(data, selector)) {
            cy.get(selector)
                .as(`mass-[${selector}]`)
                .clear()
                .type(data[selector]);

            if (assert) {
                cy.get(`@mass-[${selector}]`).should("contain.value", data[selector]);
            }
        }
    }
})
