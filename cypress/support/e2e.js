/**
 * Comandos de suporte do Cypress
 */

// Comando customizado para tab
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { key: 'Tab', keyCode: 9, which: 9 });
});

// Comando para limpar dados
Cypress.Commands.add('clearQuizData', () => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
    win.localStorage.clear();
  });
});

// Comando para fazer login
Cypress.Commands.add('login', (email, password) => {
  cy.window().then((win) => {
    win.sessionStorage.setItem('userEmail', email);
    win.sessionStorage.setItem('userName', 'Test User');
  });
});

// Comando para selecionar grupos
Cypress.Commands.add('selectGroups', (groups) => {
  cy.window().then((win) => {
    win.sessionStorage.setItem('selectedGroups', JSON.stringify(groups));
  });
});

// ***********************************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************************

