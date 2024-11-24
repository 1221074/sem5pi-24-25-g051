describe('Patient Tests', () => {
  const patientToken =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5NzQwYTcwYjA5NzJkY2NmNzVmYTg4YmM1MjliZDE2YTMwNTczYmQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NzQ2NDE1ODQ4MC0xdnZmdnBzc29yOGdxcXBtYjRybjhtM2VsaDBqc3BvZi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjU3NDY0MTU4NDgwLTF2dmZ2cHNzb3I4Z3FxcG1iNHJuOG0zZWxoMGpzcG9mLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAwNDc1NTYwNTA5MTM5MjEyNTcwIiwiZW1haWwiOiJndWlwaW50bzA0QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MzIyMTA3NDMsIm5hbWUiOiJHdWlsaGVybWUgUGludG8iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTF92dVk4NmFVMm9aOU9FbmZLWklMV1Blb3lGSWV1el9JYW85RC1jZGhtTlp2Q0VLbz1zOTYtYyIsImdpdmVuX25hbWUiOiJHdWlsaGVybWUiLCJmYW1pbHlfbmFtZSI6IlBpbnRvIiwiaWF0IjoxNzMyMjExMDQzLCJleHAiOjE3MzIyMTQ2NDMsImp0aSI6ImYyNWIyNWU1NzYxYTYwMjA5NDA0MTMzZTZjZGQ0ZTZmODYzYTk4Y2IifQ.Z_Mg5svPKanEe5YXrZcVuxogJ4JUZZA3JrN39n00qRmWuaHNqpRr5E_y5DfT09wyxIadarTPZzyZDNiaFdpSKjSfuMwVRaRr0915ZAw-WyERIZ8RY6JaMlU26Mi7ph7GJSn0i0TPM9d7G1RR3Iszyti163NYSLdgZjE0mvfqjs2gPRimWhr5WwahW00YvOun03gsbnfQ7-9oxGZRm_W_fWfW5cjoduuP4kkdwRZhIRdkgkztYwurNpvmU4T0v-XE0qmWLFEhh1CHNEQ9Q-90Niwysi5W_yQb92oZiYyBrrp3HHjtSjUyLYkkdOEPRULN5vaWUuqzQ1uGleucgQYZcw'; // Replace with a valid or test-specific token

  it('should allow access to /patient if the correct role is present', () => {
    // Set token and role in localStorage
    cy.window().then((window) => {
      window.localStorage.setItem('token', patientToken);
      window.localStorage.setItem('role', '4'); // Role 2 represents the patient's role
    });

    // Visit the /patient route
    cy.visit('/patient');

    // Assert that the user stays on the /patient page
    cy.url().should('include', '/patient');
    cy.contains('Welcome').should('be.visible'); // Adjust based on your app's UI
  });

  it('should redirect to /unauthorized if the role does not match', () => {
    // Set token but with an incorrect role
    cy.window().then((window) => {
      window.localStorage.setItem('token', patientToken);
      window.localStorage.setItem('role', '1'); // Role 1 represents an unauthorized role
    });

    // Attempt to visit the /patient route
    cy.visit('/patient');

    // Assert that the user is redirected to /unauthorized
    cy.url().should('include', '/unauthorized');
    cy.contains('You will be redirected to the login page shortly.').should('be.visible'); // Adjust based on your app's UI
  });

  it('should redirect to /login if no token is present', () => {
    // Clear localStorage to simulate no token
    cy.window().then((window) => {
      window.localStorage.clear();
    });

    // Attempt to visit the /patient route
    cy.visit('/patient');

    // Assert that the user is redirected to /login
    cy.url().should('include', '/login');
    cy.contains('Click the Button to Sign In').should('be.visible'); // Adjust based on your app's UI
  });

  it('the menu must be visible', () => {
    // Set token and role in localStorage
    cy.window().then((window) => {
      window.localStorage.setItem('token', patientToken);
      window.localStorage.setItem('role', '4');
    });

    // Visit the /patient route
    cy.visit('/patient');

    // Assert that the user stays on the /patient page
    cy.url().should('include', '/patient');
    cy.contains('Welcome,').should('be.visible'); // Adjust based on your app's UI
    // Check if the menu is visible
    cy.contains('Update Profile').should('be.visible');
    cy.contains('Check Information').should('be.visible');
    cy.contains('Deactivate Account').should('be.visible');
    cy.contains('Delete Account').should('be.visible');
  });

  it('should validate the update profile form', () => {
    // Set token and role in localStorage
    cy.window().then((window) => {
      window.localStorage.setItem('token', patientToken);
      window.localStorage.setItem('role', '4'); // Role 2 represents the patient's role
    });

    cy.visit('/patient');
    // Assert that the user stays on the /patient page
    cy.url().should('include', '/patient');

    // Click the "Update Profile" button
    cy.contains('Update Profile').click();

    // Ensure the Update Profile section is visible
    cy.contains('Here you can update your profile information.').should('be.visible');

    // Submit without filling required fields
    cy.get('button.updateBtn').click();
    cy.contains('Please try again.').should('be.visible');
  });

  it('should validate the check information section', () => {
    // Set token and role in localStorage
    cy.window().then((window) => {
      window.localStorage.setItem('token', patientToken);
      window.localStorage.setItem('role', '4'); // Role 2 represents the patient's role
    });

    cy.visit('/patient');
    // Assert that the user stays on the /patient page
    cy.url().should('include', '/patient');

    // Click the "Check Information" button to show the section
    cy.contains('Check Information').click();

    // Wait for the section to become visible
    cy.get('section.checkInformation').should('be.visible');

    // Assert the labels and fields are visible in the section
    cy.contains('Here you can check your information.').should('exist');
    cy.contains('First Name:').should('exist');
    cy.contains('Last Name:').should('exist');
    cy.contains('Full Name:').should('exist');
    cy.contains('Sex:').should('exist');
    cy.contains('Email:').should('exist');
    cy.contains('Phone:').should('exist');
    cy.contains('Emergency Contact:').should('exist');
  });

});
