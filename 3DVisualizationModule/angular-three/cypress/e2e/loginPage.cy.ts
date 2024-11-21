describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.window().then((win) => {
      // Mock the Google object
      win.google = {
        accounts: {
          id: {
            initialize: cy.stub(),
            renderButton: cy.stub(),
            revoke: cy.stub(),
          },
        },
      };

      // Mock the `handleCredentialResponse` function
      win.handleCredentialResponse = cy.stub().as('handleCredentialResponse');
    });
  });

  it('should display the login page correctly', () => {
    // Check if the Google Sign-In button is visible
    cy.get('#g_id_onload').should('be.visible');
  });


  it('should handle Google Sign-In successfully', () => {
    // Simulate Google callback with a mock response
    cy.window().then((win) => {
      const mockResponse = { credential: 'mock_jwt_token' };
      win.handleCredentialResponse(mockResponse);
    });

    // Assert that the handleCredentialResponse function was called
    cy.get('@handleCredentialResponse').should('have.been.calledWith', {
      credential: 'mock_jwt_token',
    });
  });
});
