describe('Authorization Test', () => {
   it('Login Test', () => {
      cy.visit('/');

      cy.get('#login-btn').click();
      cy.get('#email').click().type('sv048@hdm-stuttgart.de');
      cy.get('#password').click().type('Abc12345');
      cy.get('.submit-btn').click();
      cy.get('#login-btn > .mat-button-wrapper').should('contain', 'Hai Vu');
   });
});
