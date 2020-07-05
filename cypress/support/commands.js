// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const logger = console;
Cypress.Commands.add(
  'console',
  {
    prevSubject: true,
  },
  (subject, method = 'log') => {
    logger[method]('The subject is', subject);
    return subject;
  }
);

Cypress.Commands.add('visitStorybook', (route = '') => {
  cy.log('visitStorybook');
  const host = Cypress.env('location') || 'http://localhost:8001';
  return cy
    .clearLocalStorage()
    .visit(`${host}/${route}`)
    .get(`#storybook-preview-iframe`)
    .should('not.be.empty');
});

Cypress.Commands.add('getStoryElement', {}, () => {
  cy.log('getStoryElement');
  return cy
    .get(`#storybook-preview-iframe`, { log: false })
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }))
    .find('#root', { log: false })
    .should('not.be.empty')
    .then((storyRoot) => cy.wrap(storyRoot, { log: false }));
});

Cypress.Commands.add('getDocsElement', {}, () => {
  cy.log('getDocsElement');
  return cy
    .get(`#storybook-preview-iframe`, { log: false })
    .its('0.contentDocument.body', { log: false })
    .should('not.be.empty')
    .then((body) => cy.wrap(body, { log: false }))
    .find('#docs-root', { log: false })
    .should('not.be.empty')
    .then((storyRoot) => cy.wrap(storyRoot, { log: false }));
});

Cypress.Commands.add('navigateToStory', (kind, name) => {
  const kindId = kind.replace(' ', '-').toLowerCase();
  const storyId = name.replace(' ', '-').toLowerCase();

  const storyLinkId = `#${kindId}--${storyId}`;
  cy.log('navigateToStory');

  if (name !== 'page') {
    cy.get(`#${kindId}`, { log: false }).click();
  }
  cy.get(storyLinkId, { log: false }).click();

  // assert url changes
  cy.url().should('include', `path=/story/${kindId}--${storyId}`);
  cy.get(storyLinkId).should('have.class', 'selected');
});

Cypress.Commands.add('viewAddonPanel', (name) => {
  cy.get(`[role=tablist] button[role=tab]`).contains(name).click();
});
