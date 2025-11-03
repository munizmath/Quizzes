/**
 * Configuração do axe-core para Cypress
 */

import { injectAxe, checkA11y } from 'axe-playwright';

// Comando customizado para testar acessibilidade
Cypress.Commands.add('checkA11y', (context, options) => {
  return cy.window({ log: false }).then((win) => {
    return injectAxe(win).then(() => {
      return checkA11y(win, context, options);
    });
  });
});

