describe('Unauthorized Component', () => {
  beforeEach(() => {
    // Visiting the component (assuming it's available at '/unauthorized')
    cy.visit('/unauthorized');
  });

  it('should display the unauthorized message', () => {
    // Check if the unauthorized message is displayed
    cy.contains("You've accessed a page that you don't have access to. Please log in again into the system.").should('be.visible');
  });

  it('should call the logout method after 5 seconds', () => {
    // Spy on the logout method of AuthenticationService
    cy.window().then((win) => {
      const authService = win.ng.getComponent(win.document.querySelector('app-unauthorized')).authService;
      cy.spy(authService, 'logout').as('logoutSpy');
    });

    // Wait for 5 seconds to simulate the delay
    cy.wait(5000);

    // Assert that the logout method was called
    cy.get('@logoutSpy').should('have.been.calledOnce');
  });
});
