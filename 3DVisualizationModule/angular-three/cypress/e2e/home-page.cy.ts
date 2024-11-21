describe('Home Page', () => {
  it('should load successfully', () => {
    // Visit the home page using the baseUrl
    cy.visit('/');

    // Optional: Add an assertion to verify the page loaded correctly
    cy.contains('Surgical Appointment and Resource Management').should('be.visible');
  });

  it('contains the menu', () => {
    cy.visit('/');

    cy.contains('Go to Login').should('be.visible');
    cy.contains('Privacy Policy').should('be.visible');

  })
});
