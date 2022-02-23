/// <reference types="Cypress" />

describe('Transfer feature', () => {
  beforeEach(() => {
    cy.visit('/transfer');
  });

  it('Displays the transfer form', () => {
    cy.findAllByText(/Transfer/i, { timeout: 7000 }).should('exist');
  });
});
