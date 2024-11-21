declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Comando personalizado para login com um médico.
     */
    loginWithDoctor(): Chainable<void>;
  }
}
