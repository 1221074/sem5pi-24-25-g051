describe('AdminComponent Tests', () => {
  const adminToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5NzQwYTcwYjA5NzJkY2NmNzVmYTg4YmM1MjliZDE2YTMwNTczYmQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI1NzQ2NDE1ODQ4MC0xdnZmdnBzc29yOGdxcXBtYjRybjhtM2VsaDBqc3BvZi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjU3NDY0MTU4NDgwLTF2dmZ2cHNzb3I4Z3FxcG1iNHJuOG0zZWxoMGpzcG9mLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA2MDY2ODQzODI0NTQ5MTkxODA5IiwiZW1haWwiOiJzZW01cGkyNDI1ZzA1MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzMyMzY5MDU2LCJuYW1lIjoiTGFwciA1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xPQ0JtQzlRRFdfOWlIM0ZZbEJ6b1RobWZlS0Y2Ukd6WWpyZ0NvWTZFeHJfZGN5UT1zOTYtYyIsImdpdmVuX25hbWUiOiJMYXByIiwiZmFtaWx5X25hbWUiOiI1IiwiaWF0IjoxNzMyMzY5MzU2LCJleHAiOjE3MzIzNzI5NTYsImp0aSI6IjI4ZDQ0NDMwZGM3M2U4N2MzODA5ODRiYjEzYjZjNTE4NzFiYWFlNTUifQ.V_RfP283x_iZMCrkqQu_MAkmRWnWYE3DUw8W6Ru1Jz16-Xc76N5ASspUKfEHEzr_FlVDzR0oT0moXW4p9rcD--_q9YG1ww0r4YCz01Nl4ZkHVSaFGEKYGTEkmfQDzD2Rlm7r67-bVe7FBcsNEgL-wypC9ajTEB57O6rdCGzfqzQIq0ZuUy54mRn68QL24Hkgh00At99ONYYzKzXNP6zvxBM88tQiyZ--GYYrR4MqCfVJCWlrTL4lRxcyyJNTdHsl-aOpio3KeAfF8Deggi_G4nbu3CLFgrKLKVLbgsIQ1_O_Apq91w8YjygH9ynV6jyik8c0ci5rj2yJi8asoITuGQ'; // Replace with your token

  // Helper function to simulate login with admin role
  const loginAsAdmin = () => {
    cy.window().then((window) => {
      window.localStorage.setItem('token', adminToken);
      window.localStorage.setItem('role', '0');
    });
  };

  it('should allow access to the admin page if the correct role is present', () => {
    loginAsAdmin();

    cy.visit('/admin');

    cy.url().should('include', '/admin');
    cy.contains('Admin').should('be.visible');
  });

  it('should redirect to /unauthorized if the role is not admin', () => {
    cy.window().then((window) => {
      window.localStorage.setItem('token', adminToken);
      window.localStorage.setItem('role', '2'); // Role not authorized
    });

    // Attempt to visit the admin route
    cy.visit('/admin');

    // Assert that the user is redirected to /unauthorized
    cy.url().should('include', '/unauthorized');
    cy.contains('You will be redirected to the login page shortly.').should('be.visible'); // Adjust to match the actual UI message
  });

  it('should redirect to /login if no token is present', () => {
    cy.window().then((window) => {
      window.localStorage.clear();
    });

    // Attempt to visit the admin route
    cy.visit('/admin');

    // Assert that the user is redirected to /login
    cy.url().should('include', '/login');
    cy.contains('Click the Button to Sign In').should('be.visible');
  });


  it('should display the menu with the options', () => {

    loginAsAdmin()

    cy.visit('/admin');

    cy.contains('Register User').should('be.visible');
    cy.contains('3D Visualization').should('be.visible');
    //Patient
    cy.contains('Create Patient Profile').should('be.visible');
    cy.contains('Edit Patient Profile').should('be.visible');
    cy.contains('Delete Patient Profile').should('be.visible');
    cy.contains('List/Search Patient Profiles').should('be.visible');
    //Staff
    cy.contains('Create Staff Profile').should('be.visible');
    cy.contains('Edit Staff Profile').should('be.visible');
    cy.contains('Deactivate Staff Profile').should('be.visible');
    cy.contains('List/Search Staff Profiles').should('be.visible');
    //Operation Type
    cy.contains('Add Operation Type').should('be.visible');
    cy.contains('Edit Operation Type').should('be.visible');
    cy.contains('Remove Operation Type').should('be.visible');
    cy.contains('List/Search Operation Types').should('be.visible');
    //Planning Module
    cy.contains('Optimized Planning').should('be.visible');
    cy.contains('Prefered Schedule').should('be.visible');
    cy.contains('Complexity Analysis').should('be.visible');
    //Allergy
    cy.contains('Add Allergy').should('be.visible');
    cy.contains('Edit Allergy').should('be.visible');
    cy.contains('List/Search Allergy').should('be.visible');
    //Medical Condition
    cy.contains('Add Medical Condition').should('be.visible');
    cy.contains('Edit Medical Condition').should('be.visible');
    cy.contains('List/Search Medical Condition').should('be.visible');
    //Specialization
    cy.contains('Create Specialization').should('be.visible');
    cy.contains('Edit Specialization').should('be.visible');
    cy.contains('Delete Specialization').should('be.visible');
    cy.contains('List/Search Specialization').should('be.visible');
});

  it('should navigate to the Register User section and validate the form', () => {
    loginAsAdmin();

    cy.visit('/admin');

    cy.contains('Register User').click();



    // Assert that the section is displayed
    cy.contains('Here you can register a new user.').should('be.visible');


    // Attempt to submit with empty fields
    cy.get('.register-button').click();
    cy.contains('Failed to register user').should('be.visible');
  });


  it('should navigate to the Create Patient section and validate the form', () => {
    loginAsAdmin();
    cy.visit('/admin');

    // Click the Create Patient button
    cy.contains('Create Patient Profile').click();

    // Assert that the section is displayed
    cy.contains('Here you can create a new patient profile.').should('be.visible');

    // Attempt to submit with empty fields
    cy.get('.patientBtn').click();
 });

  it('should navigate to the Add Operation Type and validate the form', () => {
    loginAsAdmin();
    cy.visit('/admin');

    // Click the Edit Patient button
    cy.contains('Add Operation Type').click();

    // Assert that the section is displayed
    cy.contains('Please enter the following data about the new operation type.').should('be.visible');

    // Attempt to submit with empty fields
    cy.get('.button-operation-type-submit').click();
  });


  it('should navigate to the List/Search Staff section and display the list', () => {
    loginAsAdmin();

    cy.visit('/admin');

    // Click the List/Search Staff Profiles button
    cy.contains('List/Search Staff Profiles').click();

    // Assert that the section is displayed
    cy.contains('Here you can list or search for staff profiles.').should('be.visible');
 });

it('should navigate to the Optimized Planning section and validate the form', () => {
  loginAsAdmin();

  cy.visit('/admin');

  // Click on all matching elements that contain 'Optimized Planning'
  cy.contains('Optimized Planning').click();
  // Assert that the form is displayed
  cy.contains('Start Optimized Planning').should('be.visible');

  // Attempt to submit with empty fields
  cy.contains('Start Optimized Planning').click();it('should navigate to the Optimized Planning section and validate the form', () => {
    loginAsAdmin();

    cy.visit('/admin');

    // Click on the 'Optimized Planning' button
    cy.contains('Optimized Planning').click();

    // Wait for the 'Optimized Planning' section to be visible
    cy.contains('Start Optimized Planning', { timeout: 10000 }).should('be.visible');

    // Attempt to submit with empty fields
    cy.get('.planButton').click(); // Target the button using its class
    cy.contains('Please fill in all required fields', { timeout: 10000 }).should('be.visible');
  });

});

it('should navigate to the Edit Patient Profile section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Edit Patient Profile').click();
  cy.contains('Here you can edit an existing patient profile.').should('be.visible');
});

it('should navigate to the Delete Patient Profile section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Delete Patient Profile').click();
  cy.contains('Here you can delete a patient profile.').should('be.visible');
 });

it('should navigate to the Create Staff Profile section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Create Staff Profile').click();
  cy.contains('Here you can create a new staff profile.').should('be.visible');
  cy.contains('Please enter the following data about the new staff member.').should('be.visible');
 });

it('should navigate to the Edit Staff Profile section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Edit Staff Profile').click();
  cy.contains('Here you can edit an existing staff profile.').should('be.visible');
});

it('should navigate to the Deactivate Staff Profile section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Deactivate Staff Profile').click();
  cy.contains('Here you can deactivate a staff profile.').should('be.visible');

});

it('should navigate to the Add Allergy section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Add Allergy').click();
  cy.contains('Here you can add a new allergy to the system .').should('be.visible');
});

it('should navigate to the Edit Allergy section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Edit Allergy').click();
  cy.contains('Here you can edit an existing allergy.').should('be.visible');
});

it('should navigate to the List/Search Allergy section and display the list', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('List/Search Allergy').click();
  cy.contains('Here you can list or search for allergies.').should('be.visible');
});

it('should navigate to the Add Medical Condition section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Add Medical Condition').click();
  cy.contains('Here you can add a new medical condition to the system .').should('be.visible');
});

it('should navigate to the Edit Medical Condition section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Edit Medical Condition').click();
  cy.contains('Here you can edit an existing medical condition.').should('be.visible');
});

it('should navigate to the List/Search Medical Condition section and display the list', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('List/Search Medical Condition').click();
  cy.contains('Here you can list or search for medical conditions.').should('be.visible');
});

it('should navigate to the Create Specialization section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Create Specialization').click();
  cy.contains('Please enter the following data about the new specialization.').should('be.visible');
});

it('should navigate to the Edit Specialization section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Edit Specialization').click();
  cy.contains('Here you can edit an existing specialization.').should('be.visible');
});

it('should navigate to the Delete Specialization section and validate the form', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('Delete Specialization').click();
  cy.contains('Here you can delete a specialization.').should('be.visible');
});

it('should navigate to the List/Search Specialization section and display the list', () => {
  loginAsAdmin();
  cy.visit('/admin');
  cy.contains('List/Search Specialization').click();
  cy.contains('Here you can list or search for specializations.').should('be.visible');
});

  it('should log out and redirect to the login page', () => {
    loginAsAdmin();

    cy.visit('/admin');

    // Click the logout button
    cy.contains('logout').click();

    // Assert that the user is redirected to /login
    cy.url().should('include', '/');
  });
});

